
var vscode = require('vscode');
var path = require('path');
var child_process = require('child_process');

var outputChannel;
function getOutputChannel() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel("Tundra2");
    }
    return outputChannel;
}

function activate(context) {
    function didSaveTextDocument(e) {
        if (!((e.languageId === 'c') || (e.languageId === 'cpp'))) {
            return;
        }
        var fn = path.normalize(vscode.workspace.asRelativePath(e.fileName));

        var command = `tundra2 \"${fn}\"`;

        child_process.exec(command, { cwd: vscode.workspace.rootPath }, (err, stdout, stderr) => {
            let ch = getOutputChannel();
            ch.clear();
            ch.appendLine(stdout);
        });
    }

    var subscriptions = [];
    vscode.workspace.onDidSaveTextDocument(didSaveTextDocument, null, subscriptions);
    context.subscriptions.push(...subscriptions);
}
exports.activate = activate;

function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}
exports.deactivate = deactivate;