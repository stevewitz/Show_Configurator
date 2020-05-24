const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow() {
   // win = new BrowserWindow({width: 800, height: 1200})
    win = new BrowserWindow({ width: 800, height: 1200, webPreferences: { nodeIntegration: true} });
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}
app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.on('ready', createWindow)