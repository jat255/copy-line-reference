# Copy Line Reference

A VS Code extension that copies references to selected lines of code with a hotkey.

## Features

- Copy references to code lines in the format `@filename.ext#L15` or `@filename.ext#L15-20`
- Works with single lines or multi-line selections
- Uses relative paths from workspace root
- Available via hotkey or Command Palette

## Usage

### Copy Line Reference
**Hotkey**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
**Command Palette**: "Copy Line Reference"

### Insert Reference to Side Editor
**Hotkey**: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Shift+I` (Mac)
**Command Palette**: "Insert Line Reference to Side Editor"

This feature requires:
1. Split editor view (View > Editor Layout > Split Editor)
2. Two files open side-by-side
3. Select code in one editor, hit the hotkey, and the reference gets inserted into the other editor

## Examples

- Single line: `@src/extension.ts#L15`
- Line range: `@docs/readme.md#L22-26`
- Current cursor position: `@package.json#L5`

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