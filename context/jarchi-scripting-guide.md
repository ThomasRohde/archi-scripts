# JArchi Scripting Guide: Creating Custom Dialogs

This guide explains how to create custom dialogs in JArchi using GraalVM JavaScript and Eclipse SWT/JFace libraries.

## Prerequisites

- Archi with JArchi plugin installed
- Basic knowledge of JavaScript and Eclipse SWT/JFace concepts

## Setting Up a JArchi Script

1. Open Archi with the JArchi plugin.
2. Go to the "Scripts" view.
3. Create a new script file (e.g., "CustomDialog.js").
4. Write your script using GraalVM JavaScript syntax.
5. Save the script.
6. Run the script by right-clicking on it and selecting "Run Script".

## Key Concepts

- **GraalVM JavaScript**: The JavaScript engine used by JArchi.
- **Java Interop**: Use `Java.type()` to import Java classes.
- **SWT (Standard Widget Toolkit)**: Used for creating GUI elements.
- **JFace**: A UI toolkit built on top of SWT, providing higher-level constructs.

## Creating a Custom Dialog

Here's a step-by-step guide to create a custom dialog with a table:

1. Import necessary Java types:

```javascript
const SWT = Java.type('org.eclipse.swt.SWT');
const GridDataFactory = Java.type('org.eclipse.jface.layout.GridDataFactory');
const GridLayoutFactory = Java.type('org.eclipse.jface.layout.GridLayoutFactory');
const GridData = Java.type('org.eclipse.swt.layout.GridData');
const CompositeWidget = Java.type('org.eclipse.swt.widgets.Composite');
const TableWidget = Java.type('org.eclipse.swt.widgets.Table');
const TableItemWidget = Java.type('org.eclipse.swt.widgets.TableItem');
const TableColumnWidget = Java.type('org.eclipse.swt.widgets.TableColumn');
const LabelWidget = Java.type('org.eclipse.swt.widgets.Label');
const Dialog = Java.extend(Java.type('org.eclipse.jface.dialogs.Dialog'));
```

2. Create a dialog object:

```javascript
let customDialog = {
    table: {
        columns: ["Name", "Type", "Description"],
        rows: [
            { name: "Element 1", type: "Business", description: "A business element" },
            { name: "Element 2", type: "Application", description: "An application element" },
            { name: "Element 3", type: "Technology", description: "A technology element" }
        ]
    },
    selected: null,
    widgets: {},

    open: function () {
        return (this.dialog.open() == 0);  // OK = 0, Cancel = 1, Closed = -1
    },

    dialog: new Dialog(shell,
        {
            // Dialog implementation goes here
        })
};
```

3. Implement the dialog:

```javascript
dialog: new Dialog(shell,
    {
        tableWidget: null,
        widths: [],

        configureShell: function (newShell) {
            Java.super(customDialog.dialog).configureShell(newShell);
            newShell.setText("Custom JArchi Dialog");
        },

        widgetSelected: function (e) {
            customDialog.selected = customDialog.widgets.table.getSelection()[0].getData();
        },

        isResizable: function () {
            return true;
        },

        createDialogArea: function (parent) {
            let area = Java.super(customDialog.dialog).createDialogArea(parent);
            let container = area;
            GridDataFactory.swtDefaults().align(SWT.FILL, SWT.BEGINNING).applyTo(container);
            GridLayoutFactory.swtDefaults().numColumns(1).margins(10, 10).spacing(10, 5).applyTo(container);
            
            this.tableWidget = new TableWidget(container, SWT.VIRTUAL | SWT.BORDER);
            this.tableWidget.setLinesVisible(true);
            this.tableWidget.setHeaderVisible(true);
            const data = new GridData(SWT.FILL, SWT.FILL, true, true);
            data.heightHint = 300;
            this.tableWidget.setLayoutData(data);
            customDialog.widgets["table"] = this.tableWidget;
            
            // Create columns
            customDialog.table.columns.forEach((column, index) => {
                const columnWidget = new TableColumnWidget(this.tableWidget, SWT.NONE);
                columnWidget.setText(column);
                this.widths[index] = Java.super(customDialog.dialog).convertWidthInCharsToPixels(column.length);
            });
            
            // Populate rows
            customDialog.table.rows.forEach(row => {
                let item = new TableItemWidget(this.tableWidget, SWT.NONE);
                Object.keys(row).forEach((key, index) => {
                    let w = Java.super(customDialog.dialog).convertWidthInCharsToPixels(row[key].length);
                    if (w > this.widths[index]) this.widths[index] = w;
                    item.setText(index, row[key]);
                });
                item.setData(row);
            });
            
            // Set column widths
            customDialog.table.columns.forEach((_, index) => {
                this.tableWidget.getColumn(index).setWidth(this.widths[index]);
            });
            
            this.tableWidget.addSelectionListener(this);
            
            let labelWidget = new LabelWidget(container, SWT.NONE);
            return area;
        },

        okPressed: function () {
            Java.super(customDialog.dialog).okPressed();
        }
    })
```

4. Open the dialog and handle the result:

```javascript
if (customDialog.open() && customDialog.selected) {
    console.log("> Custom dialog executed.");
    console.log(`> Selected: ${JSON.stringify(customDialog.selected)}`);
} else {
    console.log("> Dialog cancelled or nothing selected.");
}
```

## Key Points to Remember

1. Use `Java.type()` to import Java classes.
2. Extend Java classes using `Java.extend()`.
3. Call superclass methods using `Java.super(objectName).methodName()`, where `objectName` is the name of the object that extends the Java class. For example:
   ```javascript
   configureShell: function (newShell) {
       Java.super(customDialog.dialog).configureShell(newShell);
       newShell.setText("Custom JArchi Dialog");
   },
   ```
4. Use the `shell` variable, which is predefined in JArchi, as the parent for your top-level dialogs.
5. Utilize SWT constants (e.g., `SWT.NONE`, `SWT.BORDER`) for widget styles.
6. Use JFace's `GridDataFactory` and `GridLayoutFactory` for easier layout management.

## Correction on Calling Superclass Methods

In GraalVM JavaScript when used in JArchi, to call a superclass method:

- Correct: `Java.super(objectName).methodName()`
- Incorrect: `Java.super(this).methodName()`

The `objectName` should be the name of the object that extends the Java class. In our example, it's `customDialog.dialog`.

## Conclusion

This guide demonstrates how to create a custom dialog with a table in JArchi using GraalVM JavaScript and Eclipse SWT/JFace libraries. You can extend this example to create more complex dialogs and user interfaces as needed for your JArchi scripts.
