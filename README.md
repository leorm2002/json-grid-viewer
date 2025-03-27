# JSON Grid Editor

This extension allows you to get a better overview and edit the content of a JSON file by showing it in a resizable grid.

## Features
- Interactive JSON editing capabilities
- Columns are resizable
- Each object and array is collapsed by default but can be expanded to see all contents
- Arrays of objects show in a table format
- Add new properties to objects and items to arrays
- Modify existing values with inline editing
- Copy JSON content to clipboard with one click

## Demo
![demo](./demo.webp)

## Usage
To open a JSON file in the grid editor, right click the file, select *Open With... > JSON Grid*. 

### Editing Features
- **Edit values**: Double-click on any primitive value (string, number, boolean, null) to edit it inline
- **Add object properties**: Click the + button next to an object or use the "Add property" button when object is expanded
- **Add array items**: Click the + button next to an array or use the "Add item" button when array is expanded
- **Remove properties/items**: Click the × button next to properties or array indices
- **Rename object properties**: Double-click on any property key to rename it
- **Change value types**: When editing null values, you can select a new type from the dropdown
- **Copy to clipboard**: Click the "Copy to Clipboard" button to copy the entire JSON content

All changes are automatically saved to the file.

## To do:
- Take colours from the active theme
