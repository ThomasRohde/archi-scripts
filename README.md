# JArchi Scripts Collection

## Overview

This repository contains a collection of JArchi scripts designed to enhance and extend the functionality of Archi, an open source modelling toolkit for creating ArchiMate models. These scripts provide various utilities and automation capabilities to streamline your ArchiMate modelling process.

## Features

- **Diverse Functionality**: Scripts for various tasks such as model analysis, bulk operations, reporting, and more.
- **Easy Integration**: All scripts are designed to work seamlessly within the Archi environment.
- **Customizable**: Many scripts can be easily customized to fit specific modeling needs.
- **Time-Saving**: Automate repetitive tasks and complex operations with a single click.

## Prerequisites

- Archi (latest version recommended)
- jArchi plugin installed and activated in Archi
- Node.js and npm (for managing dependencies)

## Installation

### Installing Node.js Dependencies

1. Navigate to the `scripts` directory in the cloned repository.
2. Run the following command to install the required Node.js modules:
   ```
   npm install
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
- **Settings**: Configure various settings.
- **Publish View to Confluence**: Publish the currently selected view to a Confluence page.
- **Documentation Augmenter**: Automatically create or augment the documentation of a view using a locally installed Ollama LLM.

## Documentation

Each script comes with its own documentation and tutorial. You can access these by selecting a script in the JArchi Scripts Menu and clicking the "View Tutorial" button.

## Contributing

Contributions to improve existing scripts or add new ones are welcome. Please feel free to submit pull requests or open issues to discuss proposed changes or report bugs.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The Archi team for creating an excellent ArchiMate modelling tool.
- The jArchi plugin developers for enabling scripting capabilities in Archi.
- All contributors and users of these scripts.