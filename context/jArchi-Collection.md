>Some script snippets assume that you run them on [Archisurance.archimate](https://raw.githubusercontent.com/archimatetool/ArchiModels/a9ea4bdf8b7f2fd853fc63f66a045eddaf0fc9b3/Archisurance/Archisurance.archimate).
>In this documentation, "object" is used for any type  of information (ArchiMate concept or view, but also Canvas, Folders...).


## Table of contents
* [Selectors](#selectors)
* [Methods](#methods)

|  Traversing                 | Navigation                   | Filtering            | Attributes &<br> Properties | Model      | Utils                |
| --------------------------- | ---------------------------- | -------------------- | ---------------------------- | - | ---------------------- |
| [.find()](#find)            | [.rels()](#rels)             | [.filter()](#filter) | [.attr()](#attr)             |   | [.each()](#each)       |
| [.children()](#children)    | [.inRels()](#inrels)         | [.not()](#not)       | [.prop()](#prop)             |   | [.clone()](#clone)     |
| [.parent()](#parent)        | [.outRels()](#outrels)       | [.has()](#has)       | [.removeProp()](#removeprop) |   | [.first()](#first)     |
| [.parents()](#parents)      | [.ends()](#ends)             | [.add()](#add)       |                              |   | [.get()](#get)         |
| [.viewRefs()](#viewrefs)    | [.sourceEnds()](#sourceends) |                      |                              |   | [.size()](#size)       |
| [.objectRefs()](#objectrefs)| [.targetEnds()](#targetends) |                      |                              |   | [.is()](#is)           |

---
# jArchi Collection
## Selectors
#### $(), jArchi()
This is the main selector method for jArchi. It returns an actionable collection of objects.
```js
$(selector) // => collection
$(collection) // => self
````
Note that you can easily wrap an object into a collection, which makes it possible to use collection-only methods on single objects.
```js
$(object) // => collection containing passed object
```

#### Name Selector ("._name_")
Select all objects with the given name.
````js
$(".Phone") // => collection containing all objects having the name 'Phone'
````

#### Object Selector ("_type_")
Select all objects with the given type (see table below).
````js
$("business-object") // => collection containing all Business Objects
````

| Strategy         | Business               | Application               | Technology               | Physical             |
| ---------------- | ---------------------- | ------------------------- | ------------------------ | -------------------- |
| resource         | business-actor         | application-component     | node                     | equipment            |
| capability       | business-role          | application-collaboration | device                   | facility             |
| course-of-action | business-collaboration | application-interface     | system-software          | distribution-network |
| value-stream     | business-interface     | application-function      | technology-collaboration | material             |
|                  | business-process       | application-process       | technology-interface     |                      |
|                  | business-function      | application-interaction   | path                     |                      |
|                  | business-interaction   | application-event         | communication-network    |                      |
|                  | business-event         | application-service       | technology-function      |                      |
|                  | business-service       | data-object               | technology-process       |                      |
|                  | business-object        |                           | technology-interaction   |                      |
|                  | contract               |                           | technology-event         |                      |
|                  | representation         |                           | technology-service       |                      |
|                  | product                |                           | artifact                 |                      |

| Motivation  | Implementation <br>& Migration | Other    | Relationships               | Other Visual Objects     | Views                    |
| ----------- | ------------------------------ | -------- | --------------------------- | ------------------------ | ------------------------ |
| stakeholder | work-package                   | location | composition-relationship    | diagram-model-note       | archimate-diagram-model |
| driver      | deliverable                    | grouping | aggregation-relationship    | diagram-model-group      | sketch-model             |
| assessment  | implementation-even            | junction | assignment-relationship     | diagram-model-connection | canvas-model             |
| goal        | plateau                        |          | realization-relationship    | diagram-model-image      |                          |
| outcome     | gap                            |          | serving-relationship        | diagram-model-reference  |                          |
| principle   |                                |          | access-relationship         | sketch-model-sticky      |                          |
| requirement |                                |          | influence-relationship      | sketch-model-actor       |                          |
| constraint  |                                |          | triggering-relationship     | canvas-model-block       |                          |
| meaning     |                                |          | flow-relationship           | canvas-model-sticky      |                          |
| value       |                                |          | specialization-relationship | canvas-model-image       |                          |
|             |                                |          | association-relationship    |                          |                          |


#### ID Selector ("#_id_")
Select a single element with the given id.
````js
$("#477") // => in Archisurance.archimate, 'Maintaining Customer Relations' Business Function
````

#### All Selector ("*")
Select all objects.
````js
$("*") // => in Archisurance.archimate, collection containing 313 objects
````

#### Concepts Selector ("concept")
Select all ArchiMate concepts.
````js
$("concept") // => collection
````

#### Elements Selector ("element")
Select all ArchiMate elements.
````js
$("element") // => collection
````

#### Relationships Selector ("relationship")
Select all ArchiMate relationships.
````js
$("relationship") // => collection
````

#### Views Selector ("view")
Select all views (ArchiMate, Sketch, Canvas).
````js
$("view") // => collection
````

#### Folders Selector ("folder")
Select all folders.
````js
$("folder") // => collection
````


## Methods
>These methods are available once you create a collection with `$(selector)` or `jArchi(selector)`.

### Traversing
>These methods will 'traverse' the model structure which is made of folders and views. All of them return a new collection and don't mutate the original one.
#### .find()
Get the descendants of each object in the set of matched objects, optionally filtered by a selector.
````js
collection.find() // => collection of all descendants
collection.find(selector) // => collection of descendants that match the selector
````

#### .children()
Get the children of each object in the set of matched objects, optionally filtered by a selector.
````js
collection.children() // => collection of all children
collection.children(selector) // => collection of children that match the selector
````

#### .parent()
Get the parent of each object in the set of matched objects, optionally filtered by a selector.
````js
collection.parent() // => collection of parents
collection.parent(selector) // => collection of parents that match the selector
````

#### .parents()
Get the ancestors of each object in the set of matched objects.
````js
collection.parents() // => collection of ancestors
````

#### .viewRefs()
Get the views in which each object in collection is referenced, optionally filtered by a selector.
````js
collection.viewRefs() // => collection of views
collection.viewRefs(selector) // => collection of views that match the selector
````

#### .objectRefs()
Get the visual objects that reference each object in collection, optionally filtered by a selector.
````js
collection.objectRefs() // => collection of (visual) objects
collection.objectRefs(selector) // => collection of (visual) objects that match the selector
````


### Navigation
>These methods will 'navigate' the model through relationships. All of them return a new collection and don't mutate the original one.
#### .rels()
Get the relationships that start or end at each concept in the set of matched objects, optionally filtered by a selector.
````js
collection.rels() // => collection of relationships
collection.rels(selector) // => collection of relationships that match the selector
````

#### .inRels()
Get the (incoming) relationships that end at each concept in the set of matched objects, optionally filtered by a selector.
````js
collection.inRels() // => collection of relationships
collection.inRels(selector) // => collection of relationships that match the selector
````

#### .outRels()
Get the (outgoing) relationships that start at each concept in the set of matched objects, optionally filtered by a selector.
````js
collection.outRels() // => collection of relationships
collection.outRels(selector) // => collection of relationships that match the selector
````

#### .ends()
Get the concepts that are the targets or the sources of each relationship in the set of matched objects, optionally filtered by a selector.
````js
collection.ends() // => collection of concepts
collection.ends(selector) // => collection of concepts that match the selector
````

#### .sourceEnds()
Get the concepts that are the sources of each relationship in the set of matched objects, optionally filtered by a selector.
````js
collection.sourceEnds() // => collection of concepts
collection.sourceEnds(selector) // => collection of concepts that match the selector
````

#### .targetEnds()
Get the concepts that are the targets of each relationship in the set of matched objects, optionally filtered by a selector.
````js
collection.targetEnds() // => collection of concepts
collection.targetEnds(selector) // => collection of concepts that match the selector
````

### Filtering
>These methods allow to add to, or remove objects from the collection (which is mutated).
#### .filter()
Reduce the set of matched elements to those that match the selector or pass the function's test.
````js
collection.filter(selector) // => collection of objects that match the selector
collection.filter(function(object) {return someBoolean}) // collection of objects that pass the test
````

#### .not()
Remove elements from the set of matched elements. Objects to remove can come from another collection of be determined through a selector.
````js
collection.not(selector) // => collection of concepts that don't match the selector
collection.not(otherCollection) // => collection of concepts that are not in the passed collection
````

#### .has()
Reduce the set of matched elements to those that have a descendant that matches the selector.
````js
collection.has(selector) // => collection of concepts
````

#### .add()
Create a new jArchi Collection with objects added to the set of matched objects. Added objects can come from another collection of be determined through a selector.
````js
collection.add(selector) //=> collection
collection.add(otherCollection) // => collection
````


### Attributes & Properties
#### .attr()
Get the value of an attribute for the first object in the set of matched object or set one or more attributes for every matched object.
````js
collection.attr(attrName) // => AttributeValue
collection.attr(attrName, attrValue) // => updated collection
````

#### .prop()
If no arguments are provided, return the list of properties' key for the first object in the collection.
Return a property value of the first object in the collection when just property is supplied. If multiple properties exist with the same key, then return only the first one (duplicate=false, which is the default) or an array with all values (duplicate=true)
Sets a property for every objects when property and value are supplied. Property is updated if it already exists (duplicate=false, which is the default) or added anyway (duplicate=true).
````js
collection.prop() //=> properties' key for the first object
collection.prop(propName) // => property value (first one if multiple entries)
collection.prop(propName, false) // => property value (first one if multiple entries)
collection.prop(propName, true) // => property value (array if multiple entries)
collection.prop(propName, propValue) // => updated collection with property added (if it did not exist) or updated (if it existed)
collection.prop(propName, propValue, false) // => updated collection with property added (if it not existed) or updated (if it existed)
collection.prop(propName, propValue, true) // => updated collection with property added (even if it existed)
````

#### .removeProp()
Removes property from collection objects.
````js
collection.removeProp(propName) // => all instances of propName are removed
collection.removeProp(propName, propValue) // => properties are removed if value matches propValue
````

### Model

### Utils
#### .each()
Iterate over a collection, executing a function for each object. The function to execute will receive the current object as first argument.
````js
collection.each(function(obj) {console.log(obj.id)}) // => print ids of all objects
````

#### .clone()
Create a copy of the set of matched objects. Objects themselves are not copied, only the collection is.
````js
collection.clone() // => a copy of the collection
````

#### .first()
Reduce the set of matched objects to the first in the set.
````js
collection.first() // => first object
````

#### .get()
Retrieve one of the objects matched by the collection.
````js
collection.get(n) // => return object at index 'n' from the collection
````

#### .size()
Return the number of objects in the collection.
````js
$('business-object').size() // => Return the number of Business Object in the current model
````

#### .is()
Check the current matched set of object against a selector and return true if at least one of these objects matches the given arguments.
````js
$(selection).is('business-object') // => Return true is there is at least one Business Object in the selection, false otherwise
````