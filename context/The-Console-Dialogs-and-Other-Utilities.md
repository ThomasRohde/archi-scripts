## Table of contents
* [The Console](#the-console)
* [Prompt, Alert and File Dialogs](#prompt-alert-and-file-dialogs)
* [Including Other Script Files](#including-other-script-files)
* [Other Features](#other-features)

---
# The Console
The Console displays various messages and errors. Open the Console from the Scripts Manager sub-menu ("Show Console").

There are various options in the Console sub-menus:

- Clear Console
- Scroll Lock
- Word Wrap

The Console's font can be set in Preferences - > Scripting -> Console Font.

Output can be sent to jArchi's Console window using the following functions:

```js
console.show();
console.hide();
console.setText("Clear previous text and display this text");
console.log("Hello World");
console.log(object);
console.log("One thing: ", object, another, ...);
console.error(error); // will show the console and display the error in red
console.clear();
console.setTextColor(redValue, greenValue, blueValue);
console.setDefaultTextColor();
```

# Prompt, Alert and File Dialogs

## Alert
```js
window.alert("Hello World");
```

## Confirm
```js
var response = window.confirm("Are you sure?");
```

## Prompt
```js
var name = window.prompt("Please enter your name", "Default Name");
```

## Prompt to open a file
```js
var filePath = window.promptOpenFile({ title: "Open Model", filterExtensions: ["*.archimate", "default.archimate"] });
```

## Prompt to open a directory
```js
var dirPath = window.promptOpenDirectory({ title: "Open Folder", filterPath: "/defaultPath" });
```

## Prompt to save a file
```js
var filePath = window.promptSaveFile({ title: "Save Model", filterExtensions: [ "*.archimate", "*.xml" ] });
```

## Prompt for a selection
(Since jArchi 1.4)
```js
var selection = window.promptSelection("Choose selection", ["Option 1", "Option 2"] );
```

# Including Other Script Files

You can include other Archi script or JavaScript files:

```js
load(absolute_path)
load(url)
```

There is no support for relative locations, so the following format is used:

```js
load(__DIR__ + "path/file.js")
```

```
__DIR__ contains the absolute path of the directory containing the current script.
__FILE__ contains the absolute path of current script.
__LINE__ contains the line number in which __LINE__ is used.
__SCRIPTS_DIR__ contains the absolute path of the user's scripts directory as set in preferences.
```


# Other Features

## $.fs.writeFile

 

Write data into a file.

 

```js

$.fs.writeFile("path/to/some/file", text, "UTF8");    // Store content of 'text' into 'file' using the character encoding specified ('UTF8' in this example)

$.fs.writeFile("path/to/some/file", bytes, "BASE64"); // Store binary content (must be first base64 encoded) into file

```

## $.process.argv (was getArgs())

If you are running a jArchi script from the Archi Command Line Interface (ACLI) you may wish to provide additional command line arguments and retrieve these from jArchi. For example you can run a jArchi script like this:

```
Archi -application com.archimatetool.commandline.app -consoleLog -nosplash --script.runScript "MyScript.ajs" --myArg "HelloWord"
```

Note that you can use a single hyphen or double hyphen. `-myArg "HelloWord"` or `--myArg "HelloWord"`

Then you can retrieve the user arguments in a jArchi script like this:

```js
var arguments = $.process.argv;

for(i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
}
```

## $.child_process.exec() (was exec())

Execute a system command or program. Function arguments can be multiple.

Examples:

```js
$.child_process.exec("notepad.exe", "newfile.txt");
$.child_process.exec("notepad.exe");
```

## $.process.engine

Returns the class name of the current Script Engine. Can be useful in scripts to determine with engine is being used in case of API differences.

```js
var engineName = $.process.engine;
```

## $.process.platform

Returns the short name  of the current operating system.

```js
var platform = $.process.platform;
```

## $.process.release.archiName

Returns the app name - `Archi`

```js
var name = $.process.release.archiName;
```

## $.process.release.archiVersion

Returns the app version, for example `4.9.0.202109160630`

```js
var version = $.process.release.archiVersion;
```

## $.process.release.jArchiName 

Returns the jArchi name - `Archi Scripting (jArchi)`

```js
var name = $.process.release.jArchiName;
```

## $.process.release.jArchiVersion

Returns the jArchi version, for example `1.2.0.202109160630`

```js
var version = $.process.release.jArchiVersion;
```


## shell variable

The current SWT Shell is available thru the `shell` variable

```js
const TitleAreaDialog = Java.type("org.eclipse.jface.dialogs.TitleAreaDialog")
const MyNewDialog= Java.extend(TitleAreaDialog)
// Nashorn syntax
var dlg = new MyNewDialog(shell) {... override methods here ...}
```