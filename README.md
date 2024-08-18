# JArchi Scripts Collection

## Overview

This repository contains a collection of JArchi scripts designed to enhance and extend the functionality of Archi, an open source modelling toolkit for creating ArchiMate models. These scripts provide various utilities and automation capabilities to streamline your ArchiMate modelling process.

## Features

- **Diverse Functionality**: Scripts for various tasks such as model analysis, bulk operations, reporting, and AI-assisted modeling.
- **Easy Integration**: All scripts are designed to work seamlessly within the Archi environment.
- **Customizable**: Many scripts can be easily customized to fit specific modeling needs.
- **Time-Saving**: Automate repetitive tasks and complex operations with a single click.
- **AI-Powered**: Leverage artificial intelligence for model generation and expansion.

## Prerequisites

- Archi (latest version recommended)
- jArchi plugin installed and activated in Archi
- Node.js and npm (for managing dependencies and building the logger)
- Ollama (for AI-powered scripts)
- Anthropic API key (for AI-assisted modeling scripts)
- OpenAI API key (for certain AI-assisted modeling scripts)

## Installation

### Installing Node.js Dependencies

1. Navigate to the `scripts` directory in the cloned repository.
2. Run the following command to install the required Node.js modules:
   ```
   npm install
   ```

### Setting Up Ollama

For scripts that use AI capabilities:

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the required model:
   ```
   ollama pull llama3.1
   ```

### Installing Scripts

You have two options for installing the scripts:

#### Option 1: Cloning the Repository and Setting Scripts Preference

1. Clone this repository to your local machine.
2. Open Archi and go to Edit > Preferences > JArchi.
3. Set the "Scripts folder" preference to point to the `scripts` directory in the cloned repository.

#### Option 2: Copying Scripts to Existing Scripts Directory

1. Clone this repository or download the script files.
2. Copy everything from the `scripts` directory in the cloned repository to your Archi scripts directory:
   - On Windows: `%APPDATA%\Archi4\scripts`
   - On macOS: `~/Library/Application Support/Archi4/scripts`
   - On Linux: `~/.archi4/scripts`

## Usage

1. Open Archi and ensure the jArchi plugin is active.
2. Navigate to the Scripts window in Archi.
3. You should see the newly added scripts in the list.
4. Double-click on a script to run it, or right-click for more options.

## Available Scripts

- **Where Used**: Find where selected elements are used within your Archimate model.
- **Dagre Layout**: Automatically arrange elements in your Archi view using the Dagre graph layout algorithm.
- **Smart Style Sync**: Change the appearance of elements in an ArchiMate view based on their property values.
- **Model Health Check**: Perform a comprehensive health check on your ArchiMate model, providing insights and recommendations for improvement.
- **Settings**: Configure various settings for jArchi integrations and features.
- **Publish View to Confluence**: Publish the currently selected view to a Confluence page.
- **Documentation Augmenter**: Automatically generate and enhance documentation for ArchiMate views and elements using AI.
- **Export View to Draw.io**: Export the currently selected ArchiMate view to a draw.io diagram file.
- **Generate Model**: Create a complete ArchiMate model from a textual description using AI.
- **Expand Model**: Expand an existing ArchiMate model based on a selected element and a textual description using AI.
- **Generate Capability Model**: Create a hierarchical capability model based on a user-provided description, using an iterative AI-assisted approach.
- **Generate Model from Schema**: Produce an ArchiMate model adhering to a selected meta-model schema, with support for custom schemas.
- **Generate Meta Model**: Analyze an uploaded image of an ArchiMate model and generate a corresponding meta-model schema.
- **Generate Strategy Model**: Create strategy and motivation elements focused models aligned with organizational goals.

## AI-Assisted Modeling

The AI-assisted modeling scripts now include:

- **Generate Model**: Creates a full ArchiMate model based on a textual description of a system or organization.
- **Expand Model**: Allows you to select an existing element in your model and expand the architecture around it based on a description.
- **Generate Capability Model**: Creates a hierarchical capability model through multiple iterations of AI-assisted generation.
- **Generate Model from Schema**: Produces an ArchiMate model that conforms to a selected meta-model schema.
- **Generate Meta Model**: Analyzes an image of an ArchiMate model to create a meta-model schema.
- **Generate Strategy Model**: Focuses on creating strategy and motivation elements for strategic modeling.

These scripts require a valid Anthropic or OpenAI API key to be configured in the Settings script.

## JArchi Logger

The project includes a logging server for advanced logging capabilities.

### Building the Logger

To build the logger as an executable:

1. Navigate to the `jarchi-logger` directory.
2. Run:
   ```
   npm run build
   ```
   This will create executables for both macOS and Windows.

### Running the Logger

- Start the logger manually:
  ```
  npm start
  ```
- Or use the built executable (platform-dependent).

## Documentation

Each script comes with its own documentation and tutorial. You can access these by selecting a script in the JArchi Scripts Menu and clicking the "View Tutorial" button.

## Contributing

Contributions to improve existing scripts or add new ones are welcome. Please feel free to submit pull requests or open issues to discuss proposed changes or report bugs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The Archi team for creating an excellent ArchiMate modelling tool.
- The jArchi plugin developers for enabling scripting capabilities in Archi.
- The creators of Ollama
- Anthropic for providing the AI capabilities used in the Generate Model and Expand Model scripts.
- All contributors and users of these scripts.