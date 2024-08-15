/**
 * @module getUserPrompt
 * @description A module that provides a function to create and show a dialog for getting multi-line user input in JArchi scripts.
 * @version 1.2
 * @author Claude AI Assistant
 * @lastModifiedDate 2024-08-15
 */

const getUserPrompt = (function() {
    const Dialog = Java.extend(Java.type('org.eclipse.jface.dialogs.Dialog'));
    const Shell = Java.type('org.eclipse.swt.widgets.Shell');
    const Text = Java.type('org.eclipse.swt.widgets.Text');
    const Label = Java.type('org.eclipse.swt.widgets.Label');
    const GridData = Java.type('org.eclipse.swt.layout.GridData');
    const GridLayout = Java.type('org.eclipse.swt.layout.GridLayout');
    const SWT = Java.type('org.eclipse.swt.SWT');
    const Point = Java.type('org.eclipse.swt.graphics.Point');
    const IDialogConstants = Java.type('org.eclipse.jface.dialogs.IDialogConstants');

    /**
     * Creates and shows a dialog to get a multi-line user prompt
     * @param {string} title - The title of the dialog
     * @param {string} message - The message or guideline to show above the text area
     * @param {string} [defaultText=""] - The default text to show in the text area
     * @returns {string|null} The user's input, or null if cancelled
     */
    function getUserPrompt(title, message, defaultText = "") {
        let userInput = null;
        let textWidget = null;

        const dialog = new Dialog(shell, {
            createDialogArea: function(parent) {
                const container = Java.super(dialog).createDialogArea(parent);
                const layout = new GridLayout(1, false);
                container.setLayout(layout);

                const label = new Label(container, SWT.WRAP);
                label.setText(message);
                label.setLayoutData(new GridData(GridData.FILL_HORIZONTAL));

                textWidget = new Text(container, SWT.MULTI | SWT.BORDER | SWT.WRAP | SWT.V_SCROLL);
                textWidget.setText(defaultText);
                const gd = new GridData(GridData.FILL_BOTH);
                gd.heightHint = 300;  // Set a minimum height for the text area
                gd.widthHint = 500;   // Set a minimum width for the text area
                textWidget.setLayoutData(gd);

                return container;
            },

            createButtonsForButtonBar: function(parent) {
                Java.super(dialog).createButton(parent, IDialogConstants.OK_ID, "Generate", true);
                Java.super(dialog).createButton(parent, IDialogConstants.CANCEL_ID, IDialogConstants.CANCEL_LABEL, false);
            },

            buttonPressed: function(buttonId) {
                if (buttonId === IDialogConstants.OK_ID) {
                    userInput = textWidget.getText().trim();
                }
                Java.super(dialog).buttonPressed(buttonId);
            },

            configureShell: function(newShell) {
                Java.super(dialog).configureShell(newShell);
                newShell.setText(title);
            },

            getInitialSize: function() {
                const size = Java.super(dialog).getInitialSize();
                return new Point(Math.max(size.x, 450), Math.max(size.y, 250));
            }
        });

        dialog.setBlockOnOpen(true);
        dialog.open();

        return userInput;
    }

    return getUserPrompt;
})();

module.exports = getUserPrompt;