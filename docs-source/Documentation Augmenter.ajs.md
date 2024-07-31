# Documentation Augmenter Tutorial

The Documentation Augmenter is a powerful JArchi script that uses AI to automatically generate and enhance documentation for your ArchiMate views and elements. This tutorial will guide you through the setup process and usage of this script.

## Prerequisites

Before using the Documentation Augmenter, ensure you have the following:

1. Archi with the JArchi plugin installed
2. Ollama installed on your local machine
3. A computer that meets Ollama's system requirements

### Ollama System Requirements

- **Operating System**: Linux (Ubuntu 18.04 or later), macOS (11 Big Sur or later), or Windows
- **RAM**: At least 8 GB for running 7B models, 16 GB for 13B models, and 32 GB for 33B models
- **Disk Space**: 12 GB for installing Ollama and base models, plus additional space for storing model data
- **CPU**: Any modern CPU with at least 4 cores is recommended, 8 cores for 13B models
- **GPU (optional)**: A GPU is not required but can improve performance, especially for larger models. Supported GPUs include NVIDIA RTX 40/30 series, AMD Vega 64, RX 6000/7000 series, etc.

## Setup

1. **Install Ollama**:
   - For Linux: Run the following command in your terminal:
     ```
     curl https://ollama.ai/install.sh | sh
     ```
   - For macOS and Windows: Download the installer from the [official Ollama website](https://ollama.ai).

2. **Download the required model**:
   - Open a terminal or command prompt.
   - Run the following command to download the Llama 2 model:
     ```
     ollama run llama2
     ```
   - Wait for the model to download and initialize.

3. **Configure the script settings**:
   - In Archi, go to `Scripts > JArchi Scripts Menu`.
   - Find and select "Integration Settings" under the appropriate category.
   - Click "Execute" to open the settings dialog.
   - In the settings dialog, navigate to the "Documentation Augmenter" tab.
   - Configure the following settings:
     - **Model**: Select the model you want to use (e.g., 'llama2').
     - **Temperature**: Set the temperature value (e.g., 0.7).
     - **Top K**: Set the Top K value (e.g., 40).
     - **Top P**: Set the Top P value (e.g., 0.9).
   - Click "Save" to apply the settings.

## Usage

1. **Open your ArchiMate model** in Archi.

2. **Select the view** you want to document.

3. **Run the Documentation Augmenter script**:
   - Go to `Scripts > JArchi Scripts Menu`.
   - Find and select "Documentation Augmenter" under the "Documentation" category.
   - Click "Execute" to run the script.

4. **Wait for the script to complete**:
   - The script will analyze the selected view and its elements.
   - It will generate documentation for the view and each element.
   - Progress will be displayed in the console.

5. **Review the generated documentation**:
   - Once the script completes, open the properties of the view and its elements.
   - Review the generated documentation in the "Documentation" field.
   - Make any necessary adjustments or refinements to the AI-generated content.

## Customization

You can customize the behavior of the Documentation Augmenter by modifying the settings in the Settings dialog:

- **Model**: Choose from available Ollama models.
- **Temperature**: Adjust to control the AI's creativity (higher values increase randomness).
- **Top K**: Set the number of top tokens to consider for each generation step.
- **Top P**: Adjust the cumulative probability threshold for token selection.

## Troubleshooting

If you encounter any issues:

1. **Ensure Ollama is running**: Open a terminal and run `ollama serve` to start the Ollama server.
2. **Check the console output**: Look for any error messages in the Archi console.
3. **Verify model availability**: Make sure the specified model is downloaded and available in Ollama.
4. **Check settings**: Ensure the settings in the Integration Settings dialog are correct.
5. **Restart Archi**: Sometimes, restarting Archi can resolve connectivity issues with Ollama.

## Best Practices

1. **Review and refine**: Always review the AI-generated documentation and make necessary adjustments.
2. **Iterative approach**: Run the script multiple times on the same view, refining the results each time.
3. **Consistent naming**: Use clear and consistent naming for your ArchiMate elements to improve the quality of generated documentation.
4. **Provide context**: The more complete your model is, the better the AI can understand and document it.
5. **Experiment with settings**: Try different temperature, Top K, and Top P values to find the best output for your needs.

By following this tutorial, you should be able to set up and use the Documentation Augmenter effectively, enhancing your ArchiMate model's documentation with AI-generated insights.