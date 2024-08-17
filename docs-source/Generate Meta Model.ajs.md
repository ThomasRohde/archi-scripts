The Generate Meta Model script is a powerful tool that uses AI to analyze an image of an ArchiMate model and generate a corresponding meta model in JSON schema format. This tutorial will guide you through using the script effectively.

## Prerequisites

- Archi with the jArchi plugin installed and configured
- An OpenAI API key configured in your jArchi settings
- An image file of an ArchiMate model (.jpg, .png, or .jpeg format)

## Step-by-Step Guide

### 1. Prepare Your ArchiMate Model Image

Ensure you have a clear, high-resolution image of your ArchiMate model. The image should be in .jpg, .png, or .jpeg format.

> **Tip:** For best results, make sure the image is well-lit, in focus, and includes all elements and relationships clearly.

### 2. Run the Script

1. Open Archi and ensure the jArchi plugin is active.
2. Navigate to the Scripts window in Archi.
3. Find and double-click on "Generate Meta Model" to run the script.

### 3. Select Your Image File

When prompted, navigate to and select the image file of your ArchiMate model.

### 4. Wait for AI Analysis

The script will now upload your image to the OpenAI API for analysis. This may take a few moments depending on the complexity of your model and your internet connection speed.

### 5. Review and Edit the Generated Meta Model

Once the analysis is complete, a dialog will open showing the generated meta model in JSON format. You can review and edit this JSON directly in the dialog.

> **Tip:** The generated meta model is automatically copied to your clipboard for easy pasting into other applications.

### 6. Save the Meta Model (Optional)

If you want to save the meta model to a file:

1. Click the "Save" button in the dialog.
2. Choose a location and filename for your JSON file.
3. Click "Save" to store the file.

### 7. Close the Dialog

Once you're satisfied with the meta model, click "Close" to exit the dialog.

## Understanding the Generated Meta Model

The generated meta model is a JSON schema that defines the structure of your ArchiMate model. It typically includes:

- A list of allowed element types
- Definitions for relationships between elements
- Any constraints or rules inferred from your model

## Use Cases

The generated meta model can be used for various purposes, including:

- Model validation: Ensure new models conform to your organization's standards
- Documentation: Provide a clear reference for allowed model structures
- Tool configuration: Use the schema to configure modeling tools or validators
- Analysis: Understand the structure and constraints of existing models

## Troubleshooting

- **Error during image upload:** Ensure your internet connection is stable and your image file is not corrupted.
- **Inaccurate meta model:** Try using a clearer or higher resolution image of your ArchiMate model.
- **API errors:** Check that your OpenAI API key is correctly configured in jArchi settings.

## Conclusion

The Generate Meta Model script provides a powerful way to quickly create meta models from existing ArchiMate diagrams. By leveraging AI analysis, it can save significant time in the meta model creation process. Remember to always review and refine the generated meta model to ensure it accurately represents your intended model structure.