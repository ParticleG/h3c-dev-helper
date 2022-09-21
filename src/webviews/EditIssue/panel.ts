import * as vscode from "vscode";

export class EditIssue {
    public static currentPanel: EditIssue | undefined;
    private readonly _panel: vscode.WebviewPanel;
    private _disposables: vscode.Disposable[] = [];

    public static render(extensionUri: vscode.Uri) {
        if (EditIssue.currentPanel) {
            EditIssue.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
        } else {
            const panel = vscode.window.createWebviewPanel("hello-world", "Hello World", vscode.ViewColumn.Beside, {
                enableScripts: true,
                localResourceRoots: [extensionUri]
            });

            EditIssue.currentPanel = new EditIssue(panel, extensionUri);
        }
    }

    public dispose() {
        EditIssue.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);
        this._panel.onDidDispose(this.dispose, null, this._disposables);

        this._setWebviewMessageListener(this._panel.webview);
    }

    private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
        const toolkitUri = webview.asWebviewUri(vscode.Uri.joinPath(
            extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.min.js"
        ));

        const mainUri = webview.asWebviewUri(vscode.Uri.joinPath(
            extensionUri,
            "src",
            "webviews",
            "EditIssue",
            "main.js"
        ));

        return /*html*/ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width,initial-scale=1.0">
                <script type="module" src="${toolkitUri}"></script>
                <script type="module" src="${mainUri}"></script>
                <title>Hello World!</title>
            </head>
            <body>
                <h1>Hello World!</h1>
                <vscode-button id="howdy">Howdy!</vscode-button>
            </body>
            </html>
        `;
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;
                const text = message.text;

                switch (command) {
                    case "hello":
                        vscode.window.showInformationMessage(text);
                        return;
                }
            },
            undefined,
            this._disposables
        );
    }
}

