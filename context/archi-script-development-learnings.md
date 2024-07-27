# Learnings from Archi Script Development

This document summarizes the key learnings and insights gained during the development of Archi scripts, including the Archi View Elements Treeview script and the Script Menu Dialog. These lessons are valuable for future JArchi script development and for understanding the intricacies of working with Archi's data model and UI components.

## 1. Selecting the Current View

- Use `$(selection).filter("archimate-diagram-model").first()` to get the currently selected view in Archi.
- This approach is more reliable than using `$views.getSelectedViews()[0]`.

## 2. Accessing View Elements

- Use `$(view).children()` to iterate over the direct children of a view.
- Each child represents an element or relationship in the view.
- Access the underlying Archimate concept using `child.concept`.

## 3. Element and Relationship Handling

- Elements and relationships are both represented as children of the view.
- Distinguish between elements and relationships using `element.type`:
  - `element.type === "relationship"` for relationships.
  - All other types are considered elements.
- Group elements by their type for organized display.

## 4. Naming Conventions

- Element and relationship names can be empty or contain only whitespace.
- Always use `element.name.trim() || "-- no name --"` to handle unnamed elements gracefully.

## 5. Tree Structure Organization

- Display element types at the root level of the tree.
- Group individual elements under their respective type nodes.
- Show relationships as child nodes of their source elements.
- This structure provides a logical and easy-to-navigate representation of the Archimate model.

## 6. Relationship Display

- For each relationship, show both the relationship name and the target element name.
- Use the format: `relName + " -> " + targetName`.
- This provides clear information about the relationship's direction and purpose.

## 7. SWT and JFace Usage

- Use `SWT.VIRTUAL | SWT.BORDER` for creating the main tree widget.
- Utilize `GridDataFactory` and `GridLayoutFactory` for efficient layout management.
- Set tree items as expanded by default: `typeItem.setExpanded(true)`.

## 8. Error Handling and Validation

- Always check if a view is selected before proceeding with the script.
- Use appropriate error messages to guide the user, e.g., "No view selected. Please select a view and run the script again."

## 9. Performance Considerations

- Group elements and relationships during the initial loop through view children.
- This approach minimizes the number of iterations needed to build the tree structure.

## 10. Dialog Creation

- Use `TitleAreaDialog` for creating resizable dialogs with a title area.
- Import necessary Java types using `Java.type()`, including SWT, JFace, and Archi-specific classes.
- Set the dialog title, message, and title image in the `create` method.

## 11. SashForm Usage

- Use `SashFormWidget` from `org.eclipse.swt.custom.SashForm` to create adjustable split panes.
- Set initial weights for the sash: `sashForm.setWeights([1, 1])` for a 50/50 split.

## 12. Button Creation and Handling

- Create buttons using `Java.super(dialogObject).createButton()` instead of `this.createButton()`.
- Handle button presses in a `buttonPressed` method, checking the `buttonId` against `IDialogConstants` values.

## 13. 'this' Context in GraalVM JavaScript

- The `this` keyword doesn't work as expected in GraalVM JavaScript when used inside object methods.
- Always use the dialog object name (e.g., `menuDialog`) to reference properties and methods instead of `this`.

## 14. Dialog Result Handling

- Store the dialog result in a property of the dialog object (e.g., `dialogResult`).
- Check this property after the dialog closes to determine the user's selection or action.

## 15. Widget Enable/Disable Logic

- Implement enable/disable logic for buttons based on user selections.
- Update button states in selection listeners of other widgets (e.g., tree selection listener).

## 16. Iterative Development and Testing

- Regular testing with different Archimate models and UI scenarios is crucial.
- Be prepared to refine scripts based on edge cases, user feedback, and discovered limitations of the JArchi environment.

By keeping these learnings in mind, future development of JArchi scripts can be more efficient and robust, leading to better tools for Archimate modeling, analysis, and user interaction.
