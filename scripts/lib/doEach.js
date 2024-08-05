/**
 *
 * jArchi Library to manage Archi visual relationships in views
 *
 * Author: Xavier Mayeur
 * Version: 1.1
 * Date: May 2022
 *
 *
 * Remarks: the code has been written to work with GraalVM, not Nashorn framework.
 * Please update Archi scripting preferences accordingly.
 */

if (typeof relLlibLoaded === 'undefined') {
    engine = ($.process.engine === 'com.oracle.truffle.js.scriptengine.GraalJSScriptEngine') ? 'GraalVM' : 'Nashorn'
    if (engine === 'Nashorn') {
        console.log('ERROR: this library only works with the GraalVM JavaScript Engine\nPlease modify Archi scription settings')
        exit()
    }
    relLibLoaded = true
}

/**
 * decorator function to apply a element-based function to each element of a selection
 *
 * example:   const myFct = doEachElem(fct);
 *            myFct(selection, other_args);
 *
 *            or
 *
 *            doEachElem(fct)(selection, other_args)
 *
 *            where 'selection' is any Archi selection of objects, replacing the first argument of the passed function 'fct'*
 * @param {(function(): void)} fct - a jArchi function handling element
 * @returns {(function(): void)|*}
 */
function doEachElem(fct) {
    return function decorator() {
        let args = arguments
        // if a view is selected, check all objects
        let sel = args[0]
        $(sel).filter("archimate-diagram-model").forEach(function (v) {
            function _do(e) {
                args[0] = e
                fct.apply(this, args);
                // recurse if the element object has children
                $(e).children().filter('element').forEach(function (o) {
                    _do(o);
                });
            }

            // apply recursively the function for each element of the view
            $(v).children().filter('element').forEach(function (o) {
                _do(o);
            });
        });
        // if few objects are selected, managed only them
        $(sel).filter('element').forEach(function (e) {
            args[0] = e
            fct.apply(this, args);
        });
    }
}

/**
 * decorator function to apply a relationship-based function to each connection of a selection
 *
 * Example:
 *              doEachRel(fct)(selection, other_args)
 *
 * @param {(function(): void)} fct - a jArchi function handling visual connection
 * @returns {(function(): void)|*}
 */
function doEachRel(fct) {
    return function decorator() {
        let args = arguments
        // if a view is selected, check all objects
        let sel = args[0]
        $(sel).filter("archimate-diagram-model").forEach(function (v) {
            function _do(e) {
                $(e).outRels().forEach(function (o) {
                    args[0] = o
                    fct.apply(this, args);
                });
                $(e).inRels().forEach(function (o) {
                    args[0] = o

                    fct.apply(this, args);
                });
                $(e).children().filter('element').forEach(function (o) {
                    _do(o);
                });
            }

            $(v).children().filter('element').forEach(function (o) {
                _do(o);
            });
        });
        // if few objects are selected, managed only their relationships
        $(sel).filter('element').forEach(function (e) {
            $(e).outRels().forEach(function (o) {
                args[0] = o
                fct.apply(this, args);
            });
            $(e).inRels().forEach(function (o) {
                args[0] = o
                fct.apply(this, args);
            });
        });

        // if relationships are selected,managed them
        $(sel).filter("relationship").forEach(function (o) {
            args[0] = o
            fct.apply(this, args);
        });

    }
}

/**
 * Add a bendpoint to a visual connection using absolute coordinates
 * @param conn - visual connection object
 * @param x - X-coordinate
 * @param y - y coordinate
 */
function addAbsoluteBendpoint(conn, x, y) {

    let s = getObjXY(conn.source)
    let t = getObjXY(conn.target)

    let bp = {
        startX: x - s.x,
        startY: y - s.y,
        endX: x - t.x,
        endY: y - t.y
    }
    conn.addRelativeBendpoint(bp, conn.getRelativeBendpoints().length)

}

/**
 * Set a bendpoint at index idx to a visual connection using absolute coordinates
 *
 * @param conn - visual connection object
 * @param x - X-coordinate
 * @param y - y coordinate
 * @param idx - bendpoint index in the collection
 */
function setAbsoluteBendpoint(conn, x, y, idx) {

    // Set the X/Y offset of the embedding objects
    let s = getObjXY(conn.source)
    let t = getObjXY(conn.target)

    let bp = {
        startX: x - s.x,
        startY: y - s.y,
        endX: x - t.x,
        endY: y - t.y
    }
    try {
        conn.setRelativeBendpoint(bp, idx)
    } catch (e) {
    }

}

/**
 * Get all bendpoints of the connection using absolute coordinates
 *
 * @param conn  -    visual conenction
 * @returns {*[]} - an array of bendpoints
 */
function getAbsoluteBendpoints(conn) {
    let abps = []
    conn.getRelativeBendpoints().forEach(bp => {
        let x = bp.startX + conn.source.bounds.x + conn.source.bounds.width / 2
        let y = bp.startY + conn.source.bounds.y + conn.source.bounds.height / 2
        // add x/y offset of the embedding objects
        $(conn.source).parents().forEach(p => {
            try {
                x += p.bounds.x
                y += p.bounds.y
            } catch (e) {
            }
        })

        let abp = {
            x: x,
            y: y
        }

        abps.push(abp)
    })
    return abps
}

/**
 * get absolute XY-coordinates of a visual object
 *
 * @param obj
 * @returns {{x: *, width: *, y: *, height: *}}
 */
function getObjXY(obj) {
    let b = obj.bounds
    let x = b.x + b.width / 2
    let y = b.y + b.height / 2
    $(obj).parents().forEach(p => {
        try {
            x += p.bounds.x
            y += p.bounds.y
        } catch (e) {
        }
    })

    return {
        x: x,
        y: y,
        width: b.width,
        height: b.height
    }
}

/**
 * Check whether a point given by its absolute coordinates is inside an object
 *
 * @param obj   - archi visual object
 * @param x     - X-coordinate
 * @param y     - Y- coordinate
 * @returns {boolean} - true if inside
 */
function isInsideObj(obj, x, y) {
    let b = getObjXY(obj)
    return (x > b.x - b.width / 2 && x < b.x + b.width / 2 && y > b.y - b.height / 2 && y < b.y + b.height / 2)
}

/**
 * small helper to check whether a value is beween two min/max boundaries
 *
 * @param i
 * @param min
 * @param max
 * @returns {boolean}
 */
function isBetween(i, min, max) {
    return (i >= min && i <= max)
}

/**
 * Remove bendpoints
 *
 * @param conn      - visual connection
 *
 */

function removeBendpoints(conn) { 
    conn.deleteAllBendpoints();
}

/**
 * Create a L- orthogonal shape visual connection on an existing connection, resetting all bendpoints
 *
 * @param conn      - visual connection
 * @param dir       - direction of the L-shape : 0 starts the connection horizontally, 1 starts vertically
 * @param weightX   - 0->1 weight to move the connection bendpoints X-coordinate along the adjacent edges of the connected objects
 * @param weightY   - 0->1 weight to move the connection bendpoints Y-coordinate along the adjacent edges of the connected objects
 *
 */
function lRel(conn, dir = 0, weightX = 0.5, weightY = 0.5) {
    conn.deleteAllBendpoints()
    let sXY = getObjXY(conn.source)
    let tXY = getObjXY(conn.target)

    let pos, a
    [pos, a] = getObjPos(sXY, tXY)

    if (dir === 0 && !isInsideObj(conn.source, tXY.x, sXY.y) && !isInsideObj(conn.target, tXY.x, sXY.y))
        addAbsoluteBendpoint(conn,
            tXY.x + conn.target.bounds.width * (0.5 - weightX),
            sXY.y + conn.source.bounds.height * (0.5 - weightY))
    else if (dir === 1 && !isInsideObj(conn.source, sXY.x, tXY.y) && !isInsideObj(conn.target, sXY.x, tXY.y))
        addAbsoluteBendpoint(conn,
            sXY.x - conn.source.bounds.width * (0.5 - weightX),
            tXY.y + conn.target.bounds.height * (0.5 - weightY))
}

/**
 * Create a S-orthogonal shape visual connection on an existing connection, resetting all bendpoints
 *
 * @param conn      - visual connection
 * @param dir       - direction of the s-shape : 0 starts the connection horizontally, 1 starts vertically
 * @param weightX   - 0->1 weight to move the connection bendpoints X-coordinate along the adjacent edges of the connected objects
 * @param weightY   - 0->1 weight to move the connection bendpoints Y-coordinate along the adjacent edges of the source objects
 * @param weight2   - 0->1 weight to move the connection bendpoints X-or Y-coordinate along the adjacent edges of the target objects
 */
function sRel(conn, dir = 0, weightX = 0.5, weightY = 0.5, weight2 = 0.5) {

    conn.deleteAllBendpoints()
    let sXY = getObjXY(conn.source)
    let tXY = getObjXY(conn.target)
    let pos, a
    [pos, a] = getObjPos(sXY, tXY)

    let dx = tXY.x - sXY.x
    let dy = tXY.y - sXY.y
    let bp1X, bp1Y, bp2X, bp2Y

    if (dir === 0) {
        bp1X = sXY.x + dx * weightX
        bp1Y = sXY.y - conn.source.bounds.height * (0.5 - weightY)
        bp2X = bp1X
        bp2Y = tXY.y - conn.target.bounds.height * (0.5 - weight2)
    } else {
        bp1X = sXY.x - conn.source.bounds.width * (0.5 - weightX)
        bp1Y = sXY.y + dy / 2 - conn.source.bounds.height * (0.5 - weightY) / 2
        bp2X = tXY.x - conn.target.bounds.width * (0.5 - weight2)
        bp2Y = bp1Y
    }

    if (!isInsideObj(conn.source, bp1X, bp1Y)
        && !isInsideObj(conn.target, bp1X, bp1Y)
        && !isInsideObj(conn.source, bp2X, bp2Y)
        && !isInsideObj(conn.target, bp2X, bp2Y)) {

        addAbsoluteBendpoint(conn, bp1X, bp1Y)
        addAbsoluteBendpoint(conn, bp2X, bp2Y)
    }
}

/**
 * Get the position of object 2 with respect to object 1
 *
 * @param obj1  -   visual object 1
 * @param obj2  -   visual object 2
 * @returns {(string|number)[]} - return an array of two items
 *                                  - the first item is a string with the relative position (T,B,L,R)
 *                                      (Top, Bottom, Left, Right) followed by an option '!' if adjacent edges are overlapping
 *                                  - the second is a float number indicating the angle in degrees between the center of object 1 and object 2
 *
 */
function getObjPos(obj1, obj2) {
    let b1 = ('x' in obj1) ? obj1 : getObjXY(obj1)
    let b2 = ('x' in obj2) ? obj2 : getObjXY(obj2)
    let dx = b2.x - b1.x
    let dy = b2.y - b1.y
    let pos
    let dist = { dx: dx, dy: dy, gapX: 0, gapY: 0 }

    let angle = Math.atan2(dy, dx) * 180 / Math.PI
    // normalize angle wrt obj1
    if (angle < 0)
        angle += 360
    angle = (360 - angle) % 360

    if (angle < 45 || angle > 315) {
        pos = 'R'
    } else if (angle >= 45 && angle < 135) {
        pos = 'T'
    } else if (angle >= 135 && angle < 225) {
        pos = 'L'
    } else {
        pos = 'B'
    }

    if (b2.x - b2.width / 2 > b1.x + b1.width / 2 && b2.x + b2.width / 2 > b1.x + b1.width / 2)
        dist.gapX = b2.x - b2.width / 2 - b1.x - b1.width / 2
    else if (b2.x - b2.width / 2 < b1.x - b1.width / 2 && b2.x + b2.width / 2 < b1.x - b1.width / 2)
        dist.gapX = b2.x + b2.width / 2 - b1.x + b1.width / 2

    if (b2.y - b2.height / 2 > b1.y + b1.height / 2 && b2.y + b2.height / 2 > b1.y + b1.height / 2)
        dist.gapY = b2.y - b2.height / 2 - b1.y - b1.height / 2
    else if (b2.y - b2.height / 2 < b1.y - b1.height / 2 && b2.y + b2.height / 2 < b1.y - b1.height / 2)
        dist.gapY = b2.y + b2.height / 2 - b1.y + b1.height / 2


    if (dist.gapX === 0 && dist.gapY < 0)
        pos = "T!"
    else if (dist.gapX === 0 && dist.gapY > 0)
        pos = "B!"
    else if (dist.gapX < 0 && dist.gapY === 0)
        pos = "L!"
    else if (dist.gapX > 0 && dist.gapY === 0)
        pos = "R!"
    // console.log('getObjPos', b1, b2, pos, angle, dist)
    return [pos, angle, dist]
}

/**
 * Get the position of XY-point with respect to object 1
 *
 * @param obj1
 * @param XY
 * @returns {(string|number)[]}     - return an array of two items
 *                                  - the first item is a string with the relative position (T,B,L,R)
 *                                  - the second is a float number indicating the angle in degrees between the center of object 1 and XY
 *
 */
function getPointPos(obj1, XY) {
    let b = ('x' in obj1) ? obj1 : getObjXY(obj1)
    let dx = XY.x - b.x
    let dy = XY.y - b.y
    let pos = '*'

    let angle = Math.atan2(dy, dx) * 180 / Math.PI
    // normalize angle wrt obj1
    if (angle < 0)
        angle += 360
    angle = (360 - angle) % 360

    if (!isBetween(XY.y, b.y - b.height / 2, b.y + b.height / 2) && !isBetween(XY.x, b.x - b.width / 2, b.x + b.width / 2)) {
        if (angle >= 135 && angle < 225) {
            pos = 'R'
        } else if (angle >= 225 && angle < 315) {
            pos = 'B'
        } else if (angle >= 315 || angle < 45) {
            pos = 'L'
        } else {
            pos = 'T'
        }
    }

    if ((angle > 270 || angle < 90) && isBetween(XY.y, b.y - b.height / 2, b.y + b.height / 2))
        pos = 'L!'
    else if (angle > 180 && isBetween(XY.x, b.x - b.width / 2, b.x + b.width / 2))
        pos = 'B!'
    else if (angle < 180 && isBetween(XY.x, b.x - b.width / 2, b.x + b.width / 2))
        pos = 'T!'
    else if (isBetween(XY.y, b.y - b.height / 2, b.y + b.height / 2))
        pos = 'R!'
    return [pos, angle]
}

/**
 * Function to equally distribute multiple connections along each edge of the selected object(s)
 *
 * @param obj
 */
function distributeConnections(obj) {
    let top = []
    let bottom = []
    let left = []
    let right = []
    let bp, bo1, bo2, obj1, obj2, i, angle

    $(obj).rels().forEach(r => {
        let bps = r.getRelativeBendpoints()
        r.deleteAllBendpoints()
        i = 0
        bps.forEach(_bp => {
            r.addRelativeBendpoint(_bp, i++)
        })

        if (r.target.id === obj.id) {
            obj2 = r.source
            obj1 = r.target
        } else {
            obj1 = r.source
            obj2 = r.target
        }
        bo1 = getObjXY(obj1)
        bo2 = getObjXY(obj2)
        const [p, a, dist] = getObjPos(obj1, obj2)
        angle = a

        bps = getAbsoluteBendpoints(r)

        // only manage connections that are relating non-embedded objects
        if (!isInsideObj(obj1, bo2.x, bo2.y)) {
            // if a connection does not have any bendpoint, add one in the middle of connection, so we can reposition it
            if (bps.length === 0) {
                let _x, _y
                if (p === 'L!') {
                    _x = bo1.x - bo1.width / 2 + dist.gapX / 2
                    _y = bo1.y
                } else if (p === 'R!') {
                    _x = bo1.x + bo1.width / 2 + dist.gapX / 2
                    _y = bo1.y
                } else if (p === 'B!') {
                    _y = bo1.y + bo1.height / 2 + dist.gapY / 2
                    _x = bo1.x
                } else if (p === 'T!') {
                    _y = bo2.y + bo2.height / 2 - dist.gapY / 2
                    _x = bo1.x
                } else {
                    _x = (bo2.x + bo1.x) / 2
                    _y = (bo2.y + bo1.y) / 2
                }
                addAbsoluteBendpoint(r, _x, _y)
                bps = getAbsoluteBendpoints(r)
                // console.log('mid point', p, a, dist, obj1.name, bo1, obj2.name, bo2, _x, _y)
            }

            if (r.target.id === obj.id) {
                bp = bps[bps.length - 1]
                bp.idx = bps.length - 1
            } else {
                bp = bps[0]
                bp.idx = 0
            }

            let [pos] = getPointPos(bo1, bp)
            // console.log('BP pos', pos, bp)


            if (pos[0] === 'R') {
                // angle = (angle + 180) % 360
                right.push({ order: angle, bp: bp, r: r })
            }
            if (pos[0] === 'L') {
                angle = (angle + 180) % 360
                left.push({ order: angle, bp: bp, r: r })
            }
            if (pos[0] === 'T') {
                top.push({ order: -angle, bp: bp, r: r })
            }
            if (pos[0] === 'B') {
                // angle = (angle + 180) % 360
                bottom.push({ order: angle, bp: bp, r: r })
            }
        }
    })

    i = 1
    right.sort(dynamicSort('order')).forEach(r => {
        r.bp.y = bo1.y - bo1.height * (0.5 - (i++ / (right.length + 1)))
        // r.bp.x = r.bp.x + 5*i * ((r.order > 180)? 1:-1)
        setAbsoluteBendpoint(r.r, r.bp.x, r.bp.y, r.bp.idx)
    })
    i = 1
    left.sort(dynamicSort('order')).forEach(r => {
        r.bp.y = bo1.y - bo1.height * (0.5 - (i++ / (left.length + 1)))
        // r.bp.x = r.bp.x + 5*i * ((r.order > 180)? 1:-1)
        setAbsoluteBendpoint(r.r, r.bp.x, r.bp.y, r.bp.idx)
    })
    i = 1
    top.sort(dynamicSort('order')).forEach(r => {
        r.bp.x = bo1.x - bo1.width * (0.5 - (i++ / (top.length + 1)))
        setAbsoluteBendpoint(r.r, r.bp.x, r.bp.y, r.bp.idx)
    })
    i = 1
    bottom.sort(dynamicSort('order')).forEach(r => {
        r.bp.x = bo1.x - bo1.width * (0.5 - (i++ / (bottom.length + 1)))
        setAbsoluteBendpoint(r.r, r.bp.x, r.bp.y, r.bp.idx)
    })


}

/**
 * Helper function as argument of the array.sort() function to sort an array of objects by property
 * @param property              - the property to sort on
 * @returns {function(*, *)}    - sorting array
 */
function dynamicSort(property) {
    let sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

// ----------------STILL USING RELATIVE COORDINATE METHODS ---------------------------------

/**
 * Helper function to add a bendpoint for ortho()
 *
 * @param s     - source object bounds
 * @param t     - target object bounds
 * @param dx    - actual X-distance between the two objects
 * @param dy    - actual Y-distance between the two objects
 * @returns {{}} - bendpoint object
 */
function addFirstBendpoint(s, t, dx, dy) {

    let sxm = s.x + s.width;
    let sym = s.y + s.height;
    let txm = t.x + t.width;
    let tym = t.y + t.height;
    let _b = {};

    if (txm < s.x) {
        _b.startX = -dx / 2;
        _b.endX = dx / 2;
    } else if (t.x > sxm) {
        _b.startX = dx / 2;
        _b.endX = -dx / 2;
    }

    if (tym < s.y) {
        _b.startY = -dy / 2;
        _b.endY = dy / 2;
    } else if (t.y > sym) {
        _b.startY = dy / 2;
        _b.endY = -dy / 2;
    }

    return _b;
}

/**
 * Helper function for ortho()
 *
 * @param bnd
 * @param x
 * @param y
 * @returns {{x: number, y: number, dir: number}|{x, y, dir: number}|{x: number, y, dir: number}|{x, y: number, dir: number}}
 */
function setXY(bnd, x, y) {
    let xa = Math.abs(x);
    let ya = Math.abs(y);
    let w = bnd.width / 2;
    let h = bnd.height / 2;
    let xm = (x / xa) * Math.max(xa, w + 30);
    let ym = (y / ya) * Math.max(ya, h + 30);
    let hw = bnd.height / bnd.width;

    if ((xa > w && ya > h)) {
        if (ya / xa > hw) {
            return { x: (x / xa) * (w - 10), y: ym, dir: 0 };
        } else {
            return { x: xm, y: (y / ya) * (h - 10), dir: 1 };

        }
    } else if (xa < w && ya < h) {
        if (ya / xa > hw) {
            return { x: x, y: ym, dir: 0 };

        } else {
            return { x: xm, y: y, dir: 1 };
        }
    } else if (xa > w && ya < h) {
        return { x: xm, y: y, dir: 1 };
    } else if (xa < w && ya > h) {
        return { x: x, y: ym, dir: 0 };
    } else {
        return { x: x, y: y, dir: 0 }
    }

}

/**
 * Function to make an existing connection fully orthogonal
 *
 * @param o
 */
function ortho(o) {


    let source = o.source;
    let target = o.target;
    let sb = source.bounds;
    let tb = target.bounds;

    $(source).parents().forEach(function (p) {
        try {
            sb.x += p.bounds.x;
            sb.y += p.bounds.y;
        } catch (e) {
        }
    });

    $(target).parents().forEach(function (p) {
        try {
            tb.x += p.bounds.x;
            tb.y += p.bounds.y;
        } catch (e) {
        }
    });

    sb.cpx = sb.x + (sb.width / 2);
    sb.cpy = sb.y + (sb.height / 2);
    tb.cpx = tb.x + (tb.width / 2);
    tb.cpy = tb.y + (tb.height / 2);

    let dx = tb.cpx - sb.cpx;
    let dy = tb.cpy - sb.cpy;

    let bps = o.getRelativeBendpoints();

    let b = addFirstBendpoint(sb, tb, dx, dy);
    let bn = Object.keys(b).length;
    // there is no bendpoint
    if (bps.length === 0) {
        // source & destination objects are not aligned, so create a bendpoint
        if (bn > 2) {
            o.addRelativeBendpoint(b, 0);
            bps = o.getRelativeBendpoints();
        } else {
            // or leave as is
            return;
        }

    } else if (bps.length === 1) {
        // if objects are aligned and there is only one bendpoint, remove it to make a straight line
        if (bn < 3) {
            o.deleteAllBendpoints();
            return;
        }
    }

    // force the first bendpoint position to overcome some flaw after the source have been moved
    let bp0 = bps[0];

    let xy = setXY(sb, bp0.startX, bp0.startY);
    bp0.startX = xy.x;
    bp0.endX = bp0.startX - dx;
    bp0.startY = xy.y;
    bp0.endY = bp0.startY - dy;
    o.setRelativeBendpoint(bp0, 0);
    let dir = xy.dir;

    let idx = bps.length;
    if (idx > 1) {
        let t_xy = setXY(tb, bps[idx - 1].endX, bps[idx - 1].endY);
        if (dir === t_xy.dir && idx % 2 === 1) {
            o.deleteBendpoint(idx - 2);
            bps = o.getRelativeBendpoints();
        }
    }
    b = { startX: 0, startY: 0, endX: 0, endY: 0 };
    let prev = bp0;
    idx = 0;
    bps.forEach(function (bp) {

        if (idx === 0) {
            b = bp;
        }
        if (idx !== bps.length - 1) {
            // all bendpoints which are the not first and the last ones
            if (idx !== 0) {
                b.startX = bp.startX * dir + prev.startX * (1 - dir);
                b.endX = b.startX - dx;
                b.startY = prev.startY * dir + bp.startY * (1 - dir);
                b.endY = b.startY - dy;
            }
        } else {
            // special handling for the last bendpoint
            let xy = setXY(tb, bp.endX, bp.endY);

            b.startX = (dx - xy.x) * dir + prev.startX * (1 - dir);
            b.endX = (1 - 2 * dir) * (b.startX - dx);
            b.startY = dir * prev.startY + (dy - xy.y) * (1 - dir);
            b.endY = (-1 + 2 * dir) * (b.startY - dy);
        }

        try {
            o.setRelativeBendpoint(b, idx);
        } catch (e) {
            console.log(b, idx, e)
        }

        dir = (++dir) % 2;
        prev = b;
        idx++;
    });

}

// Export the functions
module.exports = {
    doEachElem,
    doEachRel,
    addAbsoluteBendpoint,
    setAbsoluteBendpoint,
    getAbsoluteBendpoints,
    getObjXY,
    isInsideObj,
    isBetween,
    lRel,
    sRel,
    getObjPos,
    getPointPos,
    distributeConnections,
    dynamicSort,
    ortho,
    removeBendpoints
};