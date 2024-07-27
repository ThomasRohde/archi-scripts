# Smart Style Sync Tutorial

Smart Style Sync is a powerful JArchi script that allows you to automatically style elements in your ArchiMate views based on their property values. This tutorial will guide you through using the script effectively.

## Prerequisites

- Archi with the JArchi plugin installed
- An ArchiMate model with elements that have custom properties

## Step 1: Prepare Your View

1. Open your ArchiMate model in Archi.
2. Select the view you want to style. This view should contain elements with custom properties.

## Step 2: Run the Script

1. In the Archi menu, go to `Scripts > JArchi Scripts Menu`.
2. In the JArchi Scripts Menu, find and select "Smart Style Sync" under the "Appearance" category.
3. Click "Execute" to run the script.

## Step 3: Select a Property

1. In the "Element Appearance Changer" dialog, you'll see a dropdown menu labeled "Select Property".
2. Choose the property you want to use for styling your elements. For example, you might select a property like "Status" or "Department".

## Step 4: Set Colors for Property Values

1. After selecting a property, you'll see a table with all unique values for that property found in your view.
2. For each value, you can set a border color and a fill color:
   - Click on the "Border Color" cell to open a color picker and choose a border color.
   - Click on the "Fill Color" cell to open a color picker and choose a fill color.
3. Repeat this process for all property values listed in the table.

## Step 5: Apply Changes

1. Once you've set colors for all property values, click "OK" to apply the changes.
2. The script will update the appearance of all elements in the view based on their property values and your color selections.

## Tips and Best Practices

- Choose contrasting colors for different property values to make elements easily distinguishable.
- Consider using a consistent color scheme across your models for better readability.
- You can run the script multiple times to adjust colors or switch to a different property.

> **Important Note:**
> Archi has a setting that derives line (border) color from fill colors. If this setting is enabled, changes to line color in this script will not have an effect. To use custom line colors, either:
> 1. Uncheck the "Derive element line colors from fill colors" option in Archi Preferences (Edit > Preferences > Appearance > Colours), or
> 2. Select the elements in your view, go to Properties > Appearance, and uncheck the "Derive from fill colour" option

## Troubleshooting

- If you don't see any properties in the dropdown, make sure your elements have custom properties assigned to them.
- If colors aren't changing, check the note above about Archi's line color derivation setting.
- If the script doesn't run, ensure that you have the latest version of JArchi installed and that your script is up to date.

By using Smart Style Sync, you can quickly create visually consistent and meaningful views that highlight important properties of your ArchiMate elements. Experiment with different properties and color schemes to find what works best for your models!