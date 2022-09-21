import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('"h3c-dev-helper" activated');

	let disposable = vscode.commands.registerCommand('h3c-dev-helper.helloWorld', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from H3C Dev Helper!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
	console.log('"h3c-dev-helper" deactivated');
}
