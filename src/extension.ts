import * as vscode from 'vscode';
import * as vscodelc from 'vscode-languageclient';

/**
 * Method to get workspace configuration option
 * @param option name of the option (e.g. for lualsp.path should be path)
 * @param defaultValue default value to return if option is not set
 */
function getConfig<T>(option: string, defaultValue?: any) : T {
    const config = vscode.workspace.getConfiguration('lua');
    return config.get<T>(option, defaultValue);
}

/**
 *  this method is called when your extension is activate
 *  your extension is activated the very first time the command is executed
 */
export function activate(context: vscode.ExtensionContext) {
    const lualspPath = getConfig<string>('lsp.path');
    const lualspArgs = getConfig<string[]>('lsp.arguments');

    const serverOptions: vscodelc.ServerOptions = { command: lualspPath, args: lualspArgs };

    const clientOptions: vscodelc.LanguageClientOptions = {
        // Register the server for Lua / TypedLua files
        documentSelector: ['lua', 'tl'],
        // This will be transfered via a workspace/didChangeConfiguration notification
        synchronize: {
            configurationSection: "lua.lsp",
        },
    };

    const lualspClient = new vscodelc.LanguageClient('Lua Language Server', serverOptions, clientOptions);

    console.log('Lua Language Server is now active!');

    const disposable = lualspClient.start();

}
