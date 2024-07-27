The "Where Used" JArchi script is a powerful tool for Archimate modelers. It helps you quickly find where selected elements are used across your entire model, including in views and relationships. This can be especially useful when you need to understand the impact of changing or removing an element.

## Features

1. Finds usages of selected elements in views and relationships
2. Displays results in a user-friendly dialog
3. Allows copying of selected result to clipboard

## How to Use

1. **Select Elements**: In your Archi model, select one or more elements you want to find usages for.

2. **Run the Script**: Execute the "Where Used" script from the JArchi script menu.

3. **View Results**: A dialog will appear showing where the selected elements are used:
   - The "Element" column shows the name of the selected element
   - The "is referenced here" column shows where it's used (view name or relationship)
   - The "Type" column shows the type of usage (view type or relationship type)

4. **Interact with Results**: 
   - Click on any row to select it
   - Press OK to copy the selected item's name to the clipboard
   - Press Cancel to close the dialog without selecting anything

5. **Check Console**: The script will log its execution and your selection in the Archi console.

## Understanding the Results

- **Views**: If an element is used in a view, the "is referenced here" column will show the view's name, and the "Type" column will show the view type (e.g., "ArchimateDiagramModel").

- **Relationships**: If an element is part of a relationship, the "is referenced here" column will show the relationship type and the names of the source and target elements, e.g., "AssociationRelationship (Element1 - Element2)".

## Tips

1. You can select multiple elements before running the script to find usages for all of them at once.

2. The dialog is resizable, so you can adjust it if you need to see more results at once.

3. After selecting a result and pressing OK, the name is copied to your clipboard, making it easy to search for it in your model or documentation.

4. If no usages are found, you'll see a message in the console saying "Nothing found!".

## Technical Details

This script uses JArchi's scripting capabilities along with Java's SWT (Standard Widget Toolkit) to create the user interface. It demonstrates how to:

- Query the Archi model using JArchi's scripting API
- Create a custom dialog using SWT
- Handle user interactions in the dialog
- Access the system clipboard

By studying this script, you can learn valuable techniques for creating your own advanced JArchi scripts with graphical user interfaces.

## Conclusion

The "Where Used" script is a valuable addition to any Archimate modeler's toolkit. It saves time and reduces errors by quickly showing all the places an element is used, helping you understand the impact of changes and maintain the integrity of your models.