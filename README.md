# Copy Line Reference

A VS Code extension that copies references to selected lines of code with a hotkey.

## Features

- Copy references to code lines in the format `@filename.ext#L15` or `@filename.ext#L15-20`
- Works with single lines or multi-line selections
- Uses relative paths from workspace root
- Available via hotkey or Command Palette

## Usage

### Hotkey
- **Windows/Linux**: `Ctrl+Shift+R`
- **Mac**: `Cmd+Shift+R`

### Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Copy Line Reference"
3. Press Enter

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