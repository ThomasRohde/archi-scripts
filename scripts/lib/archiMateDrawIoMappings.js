function mapArchiMateTypeToDrawIo(type) {
    const typeMap = {
        // Strategy elements
        "resource": "shape=mxgraph.archimate3.application;appType=resource;archiType=square;",
        "capability": "shape=mxgraph.archimate3.application;appType=capability;archiType=rounded;",
        "course-of-action": "shape=mxgraph.archimate3.application;appType=course;archiType=rounded;",
        "value-stream": "shape=mxgraph.archimate3.application;appType=valueStream;archiType=rounded;",

        // Business layer
        "business-actor": "shape=mxgraph.archimate3.application;appType=actor;archiType=square;",
        "business-role": "shape=mxgraph.archimate3.application;appType=role;archiType=square;",
        "business-collaboration": "shape=mxgraph.archimate3.application;appType=collab;archiType=square;",
        "business-interface": "shape=mxgraph.archimate3.application;appType=interface;archiType=square;",
        "business-process": "shape=mxgraph.archimate3.application;appType=proc;archiType=rounded;",
        "business-function": "shape=mxgraph.archimate3.application;appType=func;archiType=rounded;",
        "business-interaction": "shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded;",
        "business-event": "shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
        "business-service": "shape=mxgraph.archimate3.application;appType=serv;archiType=rounded;",
        "business-object": "shape=mxgraph.archimate3.application;appType=passive;archiType=square;",
        "contract": "shape=mxgraph.archimate3.application;appType=contract;archiType=square;",
        "representation": "shape=mxgraph.archimate3.application;appType=representation;archiType=square;",
        "product": "shape=mxgraph.archimate3.application;appType=product;archiType=square;",

        // Application layer
        "application-component": "shape=mxgraph.archimate3.application;appType=comp;archiType=square;",
        "application-collaboration": "shape=mxgraph.archimate3.application;appType=collab;archiType=square;",
        "application-interface": "shape=mxgraph.archimate3.application;appType=interface;archiType=square;",
        "application-function": "shape=mxgraph.archimate3.application;appType=func;archiType=rounded;",
        "application-interaction": "shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded;",
        "application-process": "shape=mxgraph.archimate3.application;appType=proc;archiType=rounded;",
        "application-event": "shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
        "application-service": "shape=mxgraph.archimate3.application;appType=serv;archiType=rounded;",
        "data-object": "shape=mxgraph.archimate3.application;appType=passive;archiType=square;",

        // Technology layer
        "node": "shape=mxgraph.archimate3.application;appType=node;archiType=square;",
        "device": "shape=mxgraph.archimate3.device;",
        "system-software": "shape=mxgraph.archimate3.application;appType=sysSw;archiType=square;",
        "technology-collaboration": "shape=mxgraph.archimate3.application;appType=collab;archiType=square;",
        "technology-interface": "shape=mxgraph.archimate3.application;appType=interface;archiType=square;",
        "path": "shape=mxgraph.archimate3.application;appType=path;archiType=square;",
        "communication-network": "shape=mxgraph.archimate3.application;appType=netw;archiType=square;",
        "technology-function": "shape=mxgraph.archimate3.application;appType=func;archiType=rounded;",
        "technology-process": "shape=mxgraph.archimate3.application;appType=proc;archiType=rounded;",
        "technology-interaction": "shape=mxgraph.archimate3.application;appType=interaction;archiType=rounded;",
        "technology-event": "shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
        "technology-service": "shape=mxgraph.archimate3.application;appType=serv;archiType=rounded;",
        "artifact": "shape=mxgraph.archimate3.application;appType=artifact;archiType=square;",

        // Physical elements
        "equipment": "shape=mxgraph.archimate3.application;appType=equipment;archiType=square;",
        "facility": "shape=mxgraph.archimate3.application;appType=facility;archiType=square;",
        "distribution-network": "shape=mxgraph.archimate3.application;appType=distribution;archiType=square;",
        "material": "shape=mxgraph.archimate3.application;appType=material;archiType=square;",

        // Motivation elements
        "stakeholder": "shape=mxgraph.archimate3.application;appType=role;archiType=oct;",
        "driver": "shape=mxgraph.archimate3.application;appType=driver;archiType=oct;",
        "assessment": "shape=mxgraph.archimate3.application;appType=assess;archiType=oct;",
        "goal": "shape=mxgraph.archimate3.application;appType=goal;archiType=oct;",
        "outcome": "shape=mxgraph.archimate3.application;appType=outcome;archiType=oct;",
        "principle": "shape=mxgraph.archimate3.application;appType=principle;archiType=oct;",
        "requirement": "shape=mxgraph.archimate3.application;appType=requirement;archiType=oct;",
        "constraint": "shape=mxgraph.archimate3.application;appType=constraint;archiType=oct;",
        "meaning": "shape=mxgraph.archimate3.application;appType=meaning;archiType=oct;",
        "value": "shape=mxgraph.archimate3.application;appType=amValue;archiType=oct;",

        // Implementation & Migration elements
        "work-package": "shape=mxgraph.archimate3.application;appType=workPackage;archiType=rounded;",
        "deliverable": "shape=mxgraph.archimate3.application;appType=deliverable;archiType=rounded;",
        "implementation-event": "shape=mxgraph.archimate3.application;appType=event;archiType=rounded;",
        "plateau": "shape=mxgraph.archimate3.application;appType=plateau;",
        "gap": "shape=mxgraph.archimate3.application;appType=gap;",

        // Other elements
        "location": "shape=mxgraph.archimate3.location;",
        "grouping": "shape=mxgraph.archimate3.grouping;",
        "junction": "shape=mxgraph.archimate3.or_junction;",

        // Other Visual Objects
        "diagram-model-note": "shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;darkOpacity=0.05;",
        "diagram-model-group": "swimlane;startSize=23;",
        "diagram-model-connection": "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;",
        "diagram-model-image": "shape=image;imageAspect=0;",
        "diagram-model-reference": "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
        "sketch-model-sticky": "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
        "sketch-model-actor": "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;",
        "canvas-model-block": "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
        "canvas-model-sticky": "shape=process;whiteSpace=wrap;html=1;backgroundOutline=1;",
        "canvas-model-image": "shape=image;imageAspect=0;"
    };

    return typeMap[type]  + ";whiteSpace=wrap;";
}

function mapArchiMateRelationshipToDrawIo(type) {
    const styleMap = {
        "composition-relationship": "endArrow=diamondThin;endFill=1;endSize=24;html=1;",
        "aggregation-relationship": "endArrow=diamondThin;endFill=0;endSize=24;html=1;",
        "assignment-relationship": "endArrow=block;endFill=0;endSize=12;html=1;",
        "realization-relationship": "endArrow=block;dashed=1;endFill=0;endSize=12;html=1;",
        "serving-relationship": "endArrow=open;endSize=12;dashed=1;html=1;",
        "access-relationship": "endArrow=open;endSize=12;dashed=1;html=1;",
        "influence-relationship": "endArrow=open;endSize=12;dashed=1;html=1;dashPattern=6 4;",
        "triggering-relationship": "endArrow=open;endSize=12;html=1;",
        "flow-relationship": "endArrow=open;endSize=12;html=1;",
        "specialization-relationship": "endArrow=block;endFill=0;endSize=12;html=1;",
        "association-relationship": "endArrow=none;html=1;"
    };
    return styleMap[type] || "endArrow=none;html=1;";
}

module.exports = { 
    mapArchiMateTypeToDrawIo,
    mapArchiMateRelationshipToDrawIo
}