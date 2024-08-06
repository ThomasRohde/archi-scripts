# Java Interoperability in GraalVM: A Comprehensive Guide

GraalVM provides powerful features for interoperability between JavaScript and Java. This guide covers the key concepts and techniques for accessing Java from JavaScript in GraalVM.

## Table of Contents
1. [Class Access](#class-access)
2. [Constructing Java Objects](#constructing-java-objects)
3. [Field and Method Access](#field-and-method-access)
4. [Method Argument Conversion](#method-argument-conversion)
5. [Method Overload Selection](#method-overload-selection)
6. [Package Access](#package-access)
7. [Array Access](#array-access)
8. [Map and List Access](#map-and-list-access)
9. [String Access](#string-access)
10. [Iterating Properties](#iterating-properties)
11. [Accessing JavaScript Objects from Java](#accessing-javascript-objects-from-java)
12. [Exception Handling](#exception-handling)
13. [Promises and Asynchronous Operations](#promises-and-asynchronous-operations)
14. [Multithreading](#multithreading)
15. [Extending Java Classes](#extending-java-classes)

## Class Access

To access a Java class in GraalVM JavaScript, use the `Java.type()` function:

```javascript
const FileClass = Java.type('java.io.File');
```

This is the preferred method over using global properties like `java.io.File` for better performance and error handling.

## Constructing Java Objects

Once you have a reference to a Java class, you can create instances using the `new` keyword:

```javascript
const FileClass = Java.type('java.io.File');
const file = new FileClass("example.txt");
```

## Field and Method Access

Access static fields and methods of a Java class, or instance fields and methods, like JavaScript properties:

```javascript
// Static field access
const JavaPI = Java.type('java.lang.Math').PI;

// Instance method call
const file = new (Java.type('java.io.File'))("example.txt");
const fileName = file.getName();
```

## Method Argument Conversion

GraalVM JavaScript automatically converts JavaScript values to appropriate Java types when calling methods. However, it throws a `TypeError` for lossy conversions:

```javascript
// Assuming a Java object with these methods:
// void longArg(long arg1);
// void doubleArg(double arg2);
// void intArg(int arg3);

javaObject.longArg(1);     // OK: widening conversion
javaObject.doubleArg(1);   // OK: widening conversion
javaObject.intArg(1);      // OK: exact match

javaObject.longArg(1.1);   // TypeError: lossy conversion
javaObject.doubleArg(1.1); // OK: exact match
javaObject.intArg(1.1);    // TypeError: lossy conversion
```

## Method Overload Selection

When calling overloaded Java methods, GraalVM JavaScript selects the method with the narrowest type that fits the provided arguments:

```javascript
// Assuming these Java method overloads:
// void foo(int arg);
// void foo(short arg);
// void foo(double arg);
// void foo(long arg);

javaObject.foo(1);              // Calls foo(short)
javaObject.foo(Math.pow(2,16)); // Calls foo(int)
javaObject.foo(1.1);            // Calls foo(double)
javaObject.foo(Math.pow(2,32)); // Calls foo(long)
```

To explicitly select an overload, use the `javaObject['methodName(paramTypes)']` syntax:

```javascript
javaObject['foo(int)'](1);
javaObject['foo(long)'](1);
javaObject['foo(double)'](1);
```

## Package Access

GraalVM JavaScript provides a `Packages` global property for accessing Java packages:

```javascript
const FileClass = Packages.java.io.File;
```

However, using `Java.type()` is generally preferred.

## Array Access

Create Java arrays using either the Rhino or Nashorn patterns:

```javascript
// Rhino pattern
const JArray = Java.type('java.lang.reflect.Array');
const JString = Java.type('java.lang.String');
const stringArray = JArray.newInstance(JString, 5);

// Nashorn pattern
const IntArray = Java.type("int[]");
const intArray = new IntArray(5);

// Use the array
intArray[0] = 42;
console.log(intArray[0]); // 42
```

## Map and List Access

Work with Java Maps and Lists seamlessly:

```javascript
// Map example
const HashMap = Java.type('java.util.HashMap');
const map = new HashMap();
map.put(1, "a");
console.log(map.get(1)); // "a"

// List example
const ArrayList = Java.type('java.util.ArrayList');
const list = new ArrayList();
list.add(42);
list.add("hello");
console.log(list.get(0)); // 42
```

## String Access

Java strings can be created and manipulated in GraalVM JavaScript:

```javascript
const javaString = new (Java.type('java.lang.String'))("Hello, Java!");
console.log(javaString.length); // 12
```

## Iterating Properties

Use a `for...in` loop to iterate over properties of Java classes and objects:

```javascript
const Math = Java.type('java.lang.Math');
for (const prop in Math) {
    console.log(prop);
}
// Output: E, PI, abs, sin, cos, ...
```

## Accessing JavaScript Objects from Java

JavaScript objects are exposed to Java code as instances of `com.oracle.truffle.api.interop.java.TruffleMap`, which implements Java's `Map` interface.

## Exception Handling

Java exceptions can be caught in JavaScript code:

```javascript
try {
    Java.type('java.lang.Class').forName("nonexistent");
} catch (e) {
    console.error(e.getMessage());
}
```

## Promises and Asynchronous Operations

GraalVM JavaScript supports interoperability between JavaScript Promises and Java:

```javascript
// Create a Promise that can be resolved from Java
const javaExecutor = /* Java object implementing PromiseExecutor */;
const myPromise = new Promise(javaExecutor).then(result => console.log(result));

// Use await with Java objects
const javaThenable = /* Java object with then(onResolve, onReject) method */;
const result = await javaThenable;

// Use JavaScript Promises from Java
const jsPromise = Promise.resolve(42);
jsPromise.then(value => {
    // This callback can be a Java lambda or method reference
    System.out.println("Resolved: " + value);
});
```

## Multithreading

GraalVM JavaScript supports multithreading when used with Java. Refer to the GraalVM documentation for detailed information on the multithreading model.

Multithreading is supported when running JavaScript in the context of Java interoperability. The basic model of multi-threaded execution supported by GraalVM is a “share-nothing” model that should be familiar to any JavaScript developer:

- An arbitrary number of JavaScript Contexts can be created, but they should be used by one thread at a time.
- Concurrent access to JavaScript objects is not allowed: any JavaScript object cannot be accessed by more than one thread at a time.
- Concurrent access to Java objects is allowed: any Java object can be accessed by any Java or JavaScript thread, concurrently.

A JavaScript Context cannot be accessed by two or more threads, concurrently, but it is possible to access the same Context from multiple threads using proper syncronization, to ensure that concurrent access never happens.

## Extending Java Classes

Use `Java.extend()` to create JavaScript objects that extend Java classes or implement Java interfaces:

```javascript
const Runnable = Java.type('java.lang.Runnable');
const MyRunnable = Java.extend(Runnable, {
    run: function() {
        console.log("Running from JavaScript!");
    }
});

const thread = new (Java.type('java.lang.Thread'))(new MyRunnable());
thread.start();
```

This comprehensive guide covers the essential aspects of Java interoperability in GraalVM JavaScript. By leveraging these features, developers can create powerful applications that seamlessly blend JavaScript and Java capabilities.
