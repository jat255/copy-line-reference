import * as vscode from 'vscode';
import * as path from 'path';

function generateReference(editor: vscode.TextEditor): string | null {
    const document = editor.document;
    const selection = editor.selection;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    
    if (!workspaceFolder) {
        return null;
    }

    const relativePath = path.relative(workspaceFolder.uri.fsPath, document.fileName);
    
    // Only include line numbers if there's actual text selected
    if (!selection.isEmpty) {
        let startLine = selection.start.line + 1;
        let endLine = selection.end.line + 1;
        
        if (startLine === endLine) {
            return `@${relativePath}#L${startLine}`;
        } else {
            return `@${relativePath}#L${startLine}-${endLine}`;
        }
    }
    
    // No text selected - return file path only
    return `@${relativePath}`;
}

function findSideEditor(): vscode.TextEditor | null {
    const visibleEditors = vscode.window.visibleTextEditors;
    const activeEditor = vscode.window.activeTextEditor;
    
    if (!activeEditor || visibleEditors.length < 2) {
        return null;
    }
    
    // Find the first editor that's not the active one
    return visibleEditors.find(editor => editor !== activeEditor) || null;
}

export function activate(context: vscode.ExtensionContext) {
    const copyDisposable = vscode.commands.registerCommand('copyLineReference.copyReference', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }

        const reference = generateReference(editor);
        if (!reference) {
            vscode.window.showWarningMessage('File is not in a workspace');
            return;
        }

        vscode.env.clipboard.writeText(reference);
        vscode.window.showInformationMessage(`Copied: ${reference}`);
    });

    const insertDisposable = vscode.commands.registerCommand('copyLineReference.insertReferenceToSide', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor found');
            return;
        }

        const reference = generateReference(editor);
        if (!reference) {
            vscode.window.showWarningMessage('File is not in a workspace');
            return;
        }

        const sideEditor = findSideEditor();
        if (!sideEditor) {
            vscode.window.showWarningMessage('No side editor found. Split the editor first.');
            return;
        }

        const position = sideEditor.selection.active;
        sideEditor.edit(editBuilder => {
            editBuilder.insert(position, reference + '\n');
        }).then(() => {
            vscode.window.showInformationMessage(`Inserted: ${reference}`);
        });
    });

    context.subscriptions.push(copyDisposable, insertDisposable);
}

export function deactivate() {}