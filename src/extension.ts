import * as vscode from 'vscode';
import { CreateIssue } from './webviews/CreateIssue/provider';

export function activate(context: vscode.ExtensionContext) {
	console.log('"h3c-dev-helper" activated');

	const createIssue = new CreateIssue(context.extensionUri);

	context.subscriptions.push(vscode.window.registerWebviewViewProvider(
		CreateIssue.viewId,
		createIssue
	));

	context.subscriptions.push(vscode.commands.registerCommand(
		'h3c-dev-helper.new-issue',
		() => createIssue.setInfo(
			"Test.c",
			"testFunc",
			114514,
			1919810
		)
	));
}

export function deactivate() {
	console.log('"h3c-dev-helper" deactivated');
}
