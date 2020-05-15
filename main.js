const {app, BrowserWindow} = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
    win = new BrowserWindow({width: 800, height: 700})
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
}
app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.on('ready', createWindow)