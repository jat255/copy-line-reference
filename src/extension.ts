import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('copyLineReference.copyReference', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }

        const document = editor.document;
        const selection = editor.selection;
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        
        if (!workspaceFolder) {
            vscode.window.showWarningMessage('File is not in a workspace');
            return;
        }

        const relativePath = path.relative(workspaceFolder.uri.fsPath, document.fileName);
        
        let startLine = selection.start.line + 1;
        let endLine = selection.end.line + 1;
        
        if (selection.isEmpty) {
            const currentLine = selection.active.line + 1;
            const reference = `@${relativePath}#L${currentLine}`;
            vscode.env.clipboard.writeText(reference);
            vscode.window.showInformationMessage(`Copied: ${reference}`);
        } else {
            if (startLine === endLine) {
                const reference = `@${relativePath}#L${startLine}`;
                vscode.env.clipboard.writeText(reference);
                vscode.window.showInformationMessage(`Copied: ${reference}`);
            } else {
                const reference = `@${relativePath}#L${startLine}-${endLine}`;
                vscode.env.clipboard.writeText(reference);
                vscode.window.showInformationMessage(`Copied: ${reference}`);
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}