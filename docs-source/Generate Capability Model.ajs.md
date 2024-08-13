The Generate Capability Model script is an advanced tool that leverages AI to create comprehensive ArchiMate capability models. This tutorial will guide you through using the script effectively.

## Prerequisites

- Archi with the jArchi plugin installed
- Anthropic API key configured (for Claude integration) or Ollama installed locally
- Basic understanding of ArchiMate and capability modeling

## Step-by-Step Guide

### 1. Prepare Your Environment

Ensure your Archi environment is set up correctly:

- Verify that jArchi is installed and activated
- Check that the necessary API keys are configured in the Settings script

### 2. Run the Script

1. In Archi, navigate to the Scripts window
2. Locate "Generate Capability Model" under the "AI-Assisted Modeling" category
3. Double-click to run the script

### 3. Provide Organization Description

When prompted, enter a detailed description of the organization for which you want to create a capability model. Be as specific as possible, including:

- Core business areas
- Key functions and processes
- Strategic objectives
- Industry-specific capabilities

Example:
```
Our company is a global e-commerce platform specializing in electronics and tech gadgets. We handle everything from product sourcing and inventory management to customer service and delivery logistics. Key areas include web platform development, mobile app services, data analytics for personalized recommendations, secure payment processing, and an efficient returns system.
```

### 4. Wait for Model Generation

The script will go through multiple iterations (default is 3) to generate and refine the capability model:

1. Initial high-level capabilities are created
2. Each capability is expanded with more detailed sub-capabilities
3. Further refinement and detailing of the model

This process may take a few minutes depending on the complexity of your description and the AI service being used.

### 5. Review the Generated Model

Once the script completes:

1. A new view titled "Generated Capability Model" will be created (or an existing selected view will be used)
2. The view will contain a hierarchical representation of capabilities
3. Root capabilities will be arranged horizontally
4. Sub-capabilities will be nested within their parent capabilities

### 6. Customize the Model

After generation, you can further customize the model:

- Rename capabilities for clarity
- Add or remove capabilities as needed
- Adjust the layout manually if desired
- Add documentation to capabilities for additional context

## Understanding the Output

- Root Capabilities: Top-level capabilities representing major business areas
- Sub-Capabilities: Nested capabilities that break down root capabilities into more specific functions
- Relationships: All connections between capabilities are composition relationships, representing the hierarchical structure

## Tips for Best Results

1. Provide detailed and specific descriptions of your organization
2. Include information about different business units, core processes, and strategic goals
3. Mention any industry-specific capabilities or functions
4. Review and iterate on the model, using it as a starting point for further refinement

## Troubleshooting

- If the model seems incomplete, try running the script again with a more detailed description
- Ensure your API keys are correctly configured if using Claude
- For Ollama users, verify that the Ollama service is running and the required model is installed

## Conclusion

The Generate Capability Model script provides a powerful starting point for creating comprehensive capability models. Use it as a foundation for your enterprise architecture work, and don't hesitate to manually refine and expand upon the AI-generated model to perfectly fit your organization's needs.