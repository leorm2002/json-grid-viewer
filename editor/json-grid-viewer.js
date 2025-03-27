const vscode = require( 'vscode' )
const path = require( 'path' )
const getNonce  = require( './util' ).getNonce

class JsonGridViewer {
  constructor( document, webviewPanel, context ) {
    this.document = document
    this.webviewPanel = webviewPanel
    this.context = context

    // Setup initial content for the webview
		this.webviewPanel.webview.options = {
			enableScripts: true,
		}

		this.webviewPanel.webview.html = this.getHtmlForWebview()

    // Create document change listener to update the webview
		this.changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === this.document.uri.toString()) {
				this.updateWebview()
			}
		});

    // Create listener to process messages from the webview
		this.webviewPanel.webview.onDidReceiveMessage( msg => {
			switch (msg.type) {
				case 'ready':
					this.updateWebview()
					break;
				case 'update':
					const jsonData = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;

					this.updateDocument(jsonData);
					break;
				case 'copyToClipboard':
					try {
						// data is already stringified JSON, so we need to parse and then format it
						const jsonData = typeof msg.data === 'string' ? JSON.parse(msg.data) : msg.data;
						vscode.env.clipboard.writeText(JSON.stringify(jsonData, null, 2));
						vscode.window.showInformationMessage('JSON copied to clipboard');
					} catch (error) {
						vscode.window.showErrorMessage(`Failed to copy to clipboard: ${error.message}`);
					}
					break;
			}
    })
  }

	getHtmlForWebview() {
		// Local path to script and css for the webview
		const appUri = this.webviewPanel.webview.asWebviewUri( vscode.Uri.file(
			path.join( this.context.extensionPath, 'webview', 'js', 'app.js' )
		))
		const chunkVendorsUri = this.webviewPanel.webview.asWebviewUri( vscode.Uri.file(
			path.join( this.context.extensionPath, 'webview', 'js', 'chunk-vendors.js' )
		))
		const appCssUri = this.webviewPanel.webview.asWebviewUri( vscode.Uri.file(
			path.join( this.context.extensionPath, 'webview', 'css', 'app.css' )
		))

		const nonce = getNonce()

		return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy"
					content="default-src 'none';
					style-src ${this.webviewPanel.webview.cspSource};
					script-src 'nonce-${nonce}';
					"
				/>
				<title>JSON Grid viewer</title>
				<link href="${appCssUri}" rel="stylesheet">
			</head>
			<body>
				<div id="app"></div>
				<script nonce="${nonce}" src="${chunkVendorsUri}"></script>
				<script nonce="${nonce}" src="${appUri}"></script>
			</body>
		</html>
		`
	}

	// Hook up event handlers so that we can synchronize the webview with the text document.
	updateWebview() {
		let doc
		try {
			doc = JSON.parse( this.document.getText() )
		} catch (error) {
			return
		}
		this.webviewPanel.webview.postMessage({
			type: 'update',
			doc
		})
  }
  
  // Update the document with new JSON data from the webview
  updateDocument(jsonData) {
    const edit = new vscode.WorkspaceEdit();
    
    // Create a JSON string with the updated data

    const formatted = JSON.stringify(jsonData, null, 2);
    
    // Replace the entire document content
    edit.replace(
      this.document.uri,
      new vscode.Range(0, 0, this.document.lineCount, 0),
      formatted
    );
    
    // Apply the edit
    return vscode.workspace.applyEdit(edit);
  }
  
  // remove any listeners
  cleanup() {
    this.changeDocumentSubscription.dispose()
  }
}

exports.JsonGridViewer = JsonGridViewer
