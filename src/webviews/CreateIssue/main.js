const vscode = acquireVsCodeApi();

function setInfo(data) {
    document.getElementById("field-filename").value = data.filename;
    document.getElementById("field-funcion-name").value = data.functionName;
    document.getElementById("field-position").value = `L${data.line}C${data.column}`;
}

window.addEventListener("load", () => {
    const submitButton = document.getElementById("btn-submit");
    submitButton.addEventListener("click", () => {
        const filename = document.getElementById("field-filename").value;
        const functionName = document.getElementById("field-funcion-name").value;
        const position = document.getElementById("field-position").value;
        vscode.postMessage({
            action: "info",
            data: {
                text: JSON.stringify({
                    "filename": filename,
                    "functionName": functionName,
                    "position": position
                })
            },
        });
    });
});

window.addEventListener('message', event => {
    const message = event.data;
    switch (message.action) {
        case 'setInfo': {
            setInfo(message.data);
            break;
        }
    }
});
