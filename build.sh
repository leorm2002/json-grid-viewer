npm run build
npm run vscode:prepublish
vsce package
code --uninstall-extension improved-json-viewer-0.0.1.vsix
code --install-extension improved-json-viewer-0.0.1.vsix
