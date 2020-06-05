

const {app, BrowserWindow} = require('electron')
const url = require('url');
const path = require('path');
var os = require('os');

let win
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
function createWindow() {
   // win = new BrowserWindow({width: 800, height: 1200})
    win = new BrowserWindow({ width: 800, height: 1200,icon: __dirname + "/showLogo.png", webPreferences: { nodeIntegration: true, enableRemoteModule:true} });
    win.loadURL(url.format ({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    const Menu = require('electron').Menu;
    const menu = Menu.buildFromTemplate(menuTemplate);
  //  Menu.setApplicationMenu(menu);
}
app.commandLine.appendSwitch('remote-debugging-port', '9222')
app.on('ready', createWindow)



const menuTemplate = [ // crreate replacement menu here
    {
        label: 'Electron',
        submenu: [
            {
                label: 'About ...',
                click: () => {
                    console.log('About Clicked');
                }
            }, {
                type: 'separator'
            }, {
                label: 'Quit',
                click: () => {
                    app.quit();
                }
            }
        ]

    },
    {
        label: 'second',
        submenu: [
            {
                label: 'what ...',
                click: () => {
                    console.log('what Clicked');
                }
            }]
    }
];