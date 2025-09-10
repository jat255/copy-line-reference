# Copy Line Reference

A VS Code extension that copies references to selected lines of code with a hotkey.

## Features

- Copy references to code lines in the format `@filename.ext#L15` or `@filename.ext#L15-20`
- Copy file-only references `@filename.ext` when no specific line is focused
- Works with single lines or multi-line selections
- Uses relative paths from workspace root
- Available via hotkey or Command Palette

## Usage

### Copy Line Reference
**Hotkey**: `Ctrl+Alt+R` (Windows/Linux) or `Cmd+Alt+R` (Mac)
**Command Palette**: "Copy Line Reference"

### Insert Reference to Side Editor
**Hotkey**: `Ctrl+Alt+I` (Windows/Linux) or `Cmd+Alt+I` (Mac)
**Command Palette**: "Insert Line Reference to Side Editor"

This feature requires:
1. Split editor view (View > Editor Layout > Split Editor)
2. Two files open side-by-side
3. Select code in one editor, hit the hotkey, and the reference gets inserted into the other editor

## Examples

- File only (cursor positioned but no text selected): `@src/extension.ts`
- Single line selected: `@src/extension.ts#L15`
- Line range selected: `@docs/readme.md#L22-26`

## Installation

1. Download the `.vsix` file
2. In VS Code, go to Extensions view (`Ctrl+Shift+X`)
3. Click the "..." menu and select "Install from VSIX..."
4. Select the downloaded file

## Requirements

- VS Code 1.74.0 or higher
- File must be in a workspace (not standalone files)

## Extension Settings

This extension contributes no additional settings.

## Release Notes

### 0.0.1

Initial release with basic line reference copying functionality.