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

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1.0">
            <script type="module" src="${toolkitUri}"></script>
            <script type="module" src="${mainUri}"></script>
            <link href="https://cdn.jsdelivr.net/npm/@mdi/font@^6.0.0/css/materialdesignicons.min.css" rel="stylesheet"
                type="text/css">
            <link href="https://cdn.jsdelivr.net/npm/quasar@2.8.3/dist/quasar.prod.css" rel="stylesheet" type="text/css">
            <title>Create Issue</title>
        </head>
        
        <body>
            <q-page class="flex row justify-start q-pa-sm">
                <div class="col-grow col-sm-10 col-md-8 col-lg-6 col-xl-4 column q-gutter-y-xs">
                    <div class="column">
                        <div class="text-caption">Issuer Name</div>
                        <vscode-dropdown>
                            <vscode-option>User #1</vscode-option>
                            <vscode-option>User #2</vscode-option>
                            <vscode-option>User #3</vscode-option>
                        </vscode-dropdown>
                    </div>
                    <vscode-text-field id="field-filename">Issue filename</vscode-text-field>
                    <vscode-text-field id="field-funcion-name">Issue function name</vscode-text-field>
                    <vscode-text-field id="field-position">Issue position (Line & Column)</vscode-text-field>
                    <vscode-button id="btn-submit">Submit</vscode-button>
                </div>
            </q-page>
        </body>
        
        </html>
        `;
    }
}