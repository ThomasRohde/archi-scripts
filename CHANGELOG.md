# Changelog

All notable changes to the JArchi Scripts Collection will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2024-08-14

### Added
- New "Generate Capability Model" script for AI-assisted creation of ArchiMate capability models.
- Custom layout function for capability models to improve visual hierarchy and readability.
- Iterative refinement process in capability model generation for more detailed and accurate models.

### Changed
- Updated menuItems.js to include the new Generate Capability Model script in the AI-Assisted Modeling category.

## [1.4.0] - 2024-08-13

### Added
- New `getOrCreateRelationship` function in `modelManipulation.js` to handle relationship creation and updates more efficiently.
- Fallback mechanism to create association-relationships when specific relationship types are invalid.
- Tracking of added relationships in views to prevent duplicate additions.

### Changed
- Simplified relationship search in `modelManipulation.js` to consider only source and target, regardless of relationship type.
- Updated `updateView` function to use the new relationship handling mechanism.
- Improved error handling in relationship creation and type changes.

### Fixed
- Issue where the same relationship was being added multiple times to a view.
- Error propagation in `Expand Model.ajs` when fallback to association-relationship was successful.

## [1.3.0] - 2024-08-13

### Added
- New `modelManipulation.js` module for shared code between Generate Model and Expand Model scripts.
- JSDoc comments for `modelManipulation.js` to improve code documentation.

### Changed
- Refactored Generate Model and Expand Model scripts to use the new `modelManipulation.js` module.
- Updated AnthropicClient to include cost logging for API calls.
- Modified Settings script to accommodate new LLM wrapper configurations.

### Fixed
- Improved error handling in model generation and expansion processes.

## [1.2.0] - 2024-08-12

### Added
- New LLM wrapper library (`llm.js`) for unified interaction with different LLM providers.
- Test script for the LLM wrapper library.

### Changed
- Updated AnthropicClient to include cost logging for API calls.
- Modified Settings script to accommodate new LLM wrapper configurations.

### Fixed
- Resolved issues with different method signatures between Anthropic and Ollama in the LLM wrapper.
- Corrected handling of single messages vs. arrays of messages in LLM wrapper.
- Fixed Ollama model reference from Llama2 to llama3.1 in test scripts.

## [1.1.0] - 2024-08-12

### Added
- Cost logging for Anthropic API calls in the AnthropicClient.
- Pricing constants for different Claude models (Sonnet, Opus, Haiku).
- New AI-assisted modeling scripts:
  - Generate Model: Create complete ArchiMate models from textual descriptions.
  - Expand Model: Expand existing models based on selected elements and descriptions.
- Integration with Anthropic API for AI-powered features.
- Tutorial markdown files for new scripts.
- This CHANGELOG file to track changes and versions.

### Changed
- Updated README.md with information about new AI-assisted modeling features.
- Enhanced Settings script to include Anthropic API configuration.
- Modified AnthropicClient to calculate and log costs for each API call.

### Fixed
- Improved error handling in several scripts.

## [1.0.0] - 2024-08-11

### Added
- Initial release of JArchi Scripts Collection.
- Core scripts:
  - Where Used
  - Dagre Layout
  - Smart Style Sync
  - Model Health Check
  - Settings
  - Publish View to Confluence
  - Documentation Augmenter
  - Export View to Draw.io
- JArchi Logger for advanced logging capabilities.

### Changed
- Refactored several scripts for better performance and maintainability.

### Fixed
- Various bug fixes and improvements across all scripts.

[1.5.0]: https://github.com/yourusername/jarchi-scripts/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/yourusername/jarchi-scripts/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/yourusername/jarchi-scripts/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/yourusername/jarchi-scripts/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/yourusername/jarchi-scripts/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/yourusername/jarchi-scripts/releases/tag/v1.0.0