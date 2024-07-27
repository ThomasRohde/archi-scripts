> [!NOTE]
> Attributes and methods described in this section are available on all jArchi Object instances

## Contents
[.delete()](#delete)  
[.documentation](#documentation)  
[.id](#id)  
[.model](#model)  
[.name](#name)  
[.type](#type)  
[.prop()](#prop)  
[.removeProp()](#removeprop)  

---

### .delete()
Deletes an object.
```js
customer.delete() // => A Business Actor with variable name, `customer`, is removed from the model
folder.delete() // => A folder, with variable name, `folder`, is removed from the model, as well as its contents
```

Note - a model cannot be deleted in this way.
Note - an object that is a diagram connection cannot be deleted from the model in this way (it will just remove it from the diagram). To remove a diagram selected `object` you need to use .concept like this:
```
obj.concept.delete();
```

### .documentation
Get/set object's documentation.
```js
object.documentation // => AttributeValue
object.documentation = 'New documentation content'
```

### .id 
Get object's id. This attribute is read-only.
```js
object.id // => AttributeValue
```

Example:
```js
var conceptID = businessActor.id;  // id of a concept
var objectID = diagramObject.id; // id of a visual diagram object
var conceptID = diagramObject.concept.id; // id of the concept referenced by a visual diagram object
```

### .model
Returns the container model for an object.
```js
var model = customer.model // => Returns the container model for `customer` object.
var model = folder.model // => Returns the container model for `folder` object.
```

### .name
Get/set object's name.
```js
object.name // => AttributeValue
object.name = 'New name'
```

### .type
Get object's type (see [[jArchi Collection]] for a list of types). This attribute is writeable for ArchiMate concepts: changing its value will replace the concept itself and update all references. If setting the concept type would result in an illegal relationship, an exception is thrown.
```js
object.type // => Object's type
object.type = 'business-process' // => change the nature of the ArchiMate concept to 'Business Process'
```

### .prop()
If no arguments are provided, return the list of properties' key for the object.
Return a property value from the object when just property is supplied. If multiple properties exist with the same key, then return only the first one (duplicate=false, which is the default) or an array with all values (duplicate=true)
Sets a property on the object when property and value are supplied. Property is updated if it already exists (duplicate=false, which is the default) or added anyway (duplicate=true).
```js
object.prop() //=> properties' key for the first object
object.prop(propName) // => property value (first one if multiple entries)
object.prop(propName, false) // => property value (first one if multiple entries)
object.prop(propName, true) // => property value (array if multiple entries)
object.prop(propName, propValue) // => updated object with property added (if it did not exist) or updated (if it existed)
object.prop(propName, propValue, false) // => updated object with property added (if it not existed) or updated (if it existed)
object.prop(propName, propValue, true) // => updated object with property added (even if it existed)
```

### .removeProp()
Removes property from an objects.
```js
object.removeProp(propName) // => all instances of propName are removed
object.removeProp(propName, propValue) // => properties are removed if value matches propValue
```