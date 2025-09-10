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

function getSmartInsertionText(editor: vscode.TextEditor, reference: string): { text: string, newPosition?: vscode.Position } {
    const document = editor.document;
    const position = editor.selection.active;
    const line = document.lineAt(position.line);
    const lineText = line.text;
    
    // Case 1: Cursor is on a blank line (empty or only whitespace)
    if (lineText.trim() === '') {
        return { text: reference + ' ' };
    }
    
    const charAtCursor = position.character;
    const charBefore = charAtCursor > 0 ? lineText[charAtCursor - 1] : '';
    const charAfter = charAtCursor < lineText.length ? lineText[charAtCursor] : '';
    
    // Case 2: Cursor is in the middle of a word - move to end of word first
    if (charAfter && charAfter.match(/\w/)) {
        // Find the end of the current word
        let wordEnd = charAtCursor;
        while (wordEnd < lineText.length && lineText[wordEnd].match(/\w/)) {
            wordEnd++;
        }
        
        const newPosition = new vscode.Position(position.line, wordEnd);
        const needsSpaceBefore = wordEnd > 0 && !lineText[wordEnd - 1].match(/\s/);
        const needsSpaceAfter = wordEnd < lineText.length && !lineText[wordEnd].match(/\s/);
        
        let text = '';
        if (needsSpaceBefore) text += ' ';
        text += reference;
        if (needsSpaceAfter) text += ' ';
        else text += ' '; // Always add space after for typing
        
        return { text, newPosition };
    }
    
    // Case 3: Cursor is at end of word or after text
    const needsSpaceBefore = charBefore && !charBefore.match(/\s/);
    const needsSpaceAfter = charAfter && !charAfter.match(/\s/);
    
    let text = '';
    if (needsSpaceBefore) text += ' ';
    text += reference;
    if (needsSpaceAfter) text += ' ';
    else text += ' '; // Always add space after for typing
    
    return { text };
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

        const insertion = getSmartInsertionText(sideEditor, reference);
        
        sideEditor.edit(editBuilder => {
            if (insertion.newPosition) {
                // First move cursor to new position, then insert
                editBuilder.insert(insertion.newPosition, insertion.text);
            } else {
                // Insert at current position
                editBuilder.insert(sideEditor.selection.active, insertion.text);
            }
        }).then(() => {
            // Update cursor position after insertion if needed
            if (insertion.newPosition) {
                const newCursorPos = new vscode.Position(
                    insertion.newPosition.line,
                    insertion.newPosition.character + insertion.text.length
                );
                sideEditor.selection = new vscode.Selection(newCursorPos, newCursorPos);
            }
            vscode.window.showInformationMessage(`Inserted: ${reference}`);
        });
    });

    context.subscriptions.push(copyDisposable, insertDisposable);
}

export function deactivate() {}