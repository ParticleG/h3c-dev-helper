import * as vscode from "vscode";

export class CreateIssue implements vscode.WebviewViewProvider {
    public static readonly viewId = 'h3c-dev-helper.webview.create-issue';
    private readonly _extensionUri: vscode.Uri;
    private _webviewView?: vscode.WebviewView;

    public constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._generateHtml(webviewView.webview);

        webviewView.webview.onDidReceiveMessage((message: any) => {
            console.log(message);
            switch (message.action) {
                case "info":
                    vscode.window.showInformationMessage(message.data.text);
                    return;
            }
        });

        this._webviewView = webviewView;
    }

    public setInfo(filename: string, functionName: string, line: number, column: number): void {
        if (this._webviewView) {
            this._webviewView.show(true);
            this._webviewView.webview.postMessage(
                {
                    action: 'setInfo',
                    data: {
                        filename: filename,
                        functionName: functionName,
                        line: line,
                        column: column
                    }
                }
            );
        }
    }

    private _generateHtml(webview: vscode.Webview) {
        const toolkitUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri,
            "node_modules",
            "@vscode",
            "webview-ui-toolkit",
            "dist",
            "toolkit.min.js"
        ));

        const mainUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri,
            "src",
            "webviews",
            "CreateIssue",
            "main.js"
        ));

        const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
            this._extensionUri,
            "src",
            "webviews",
            "CreateIssue",
            "style.css"
        ));

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <script type="module" src="${toolkitUri}"></script>
            <script type="module" src="${mainUri}"></script>
            <link rel="stylesheet" href="${styleUri}">
            <title>Create Issue</title>
        </head>
        
        <body>
            <div>
                <section>
                    <vscode-dropdown>
                        <vscode-option>User #1</vscode-option>
                        <vscode-option>User #2</vscode-option>
                        <vscode-option>User #3</vscode-option>
                    </vscode-dropdown>
                </section>
                <section>
                    <vscode-text-field id="field-filename">Issue filename</vscode-text-field>
                </section>
                <section>
                    <vscode-text-field id="field-funcion-name">Issue function name</vscode-text-field>
                </section>
                <section>
                    <vscode-text-field id="field-position">Issue position (Line & Column)</vscode-text-field>
                </section>
                <section>
                    <vscode-button id="btn-submit">Submit</vscode-button>
                </section>
            </div>
        </body>
        
        </html>
        `;
    }
}