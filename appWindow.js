const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const url = require('url');
const fs = require('fs')
const isDev = require('electron-is-dev');
let mainWindow;
let sizeFlag = false;
// ipcMain.on('min', function () {
//     mainWindow.minimize()
// })
// ipcMain.on('max', function () {
//     mainWindow.maximize()
// })
// ipcMain.on("login", function () {
//     mainWindow.maximize()
// })
ipcMain.on("f5", function () {  //应用刷新
    mainWindow.reload();
})
ipcMain.on("f11", function () {//应用放大、复原
    if(sizeFlag)
        mainWindow.restore();
    else
        mainWindow.maximize();
    sizeFlag=!sizeFlag;
})
ipcMain.on("f12", function () {//应用打开调试工具
    mainWindow.openDevTools();
})
ipcMain.on("Save", function (e, name, data) {
    // console.log("data", name);
    fs.writeFile(path.join(__dirname, 'public/data/saveData/' + name + '.json'), data, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Save------save success!");
            getAllSaveData();
        }
    })
})
ipcMain.on("SaveCreateMap", function (e, name, data) {
    // console.log("data", name);
    fs.writeFile(path.join(__dirname, 'public/data/createMap/' + name + '.json'), data, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("SaveCreateMap------save success!");
            // getAllSaveData();
        }
    })
})
ipcMain.on("getAllSaveData", function () {
    getAllSaveData();
})

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 680,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false  //Electron 12.0以上版本需要的额外设置此项
        }
    })
    // const urlLocation = isDev ? 'http://localhost:3000' : 'dummyurl';
    const urlLocation = isDev ? 'http://localhost:3000' : path.join(__dirname, './build/index.html');
    // const urlLocation = 'http://localhost:3000';
    // const urlLocation = './webpackBuild/index.html';
    mainWindow.loadURL(urlLocation);
    // 打开开发工具
    // mainWindow.openDevTools();



    // 当 window 被关闭,这个事件会被触发
    mainWindow.on('closed', function () {
        // 取消引用 window 对象,如果你的应用支持多窗口的话,
        // 通常会把多个 window 对象存放在一个数组里面,
        // 但这次不是。
        mainWindow = null;
    });
})

function getAllSaveData() {
    /* 读取存档目录下所有的存档 */
    // fs.readdir(path.join(__dirname, 'public/data/saveData'), (err, data) => {
    //     if (err) {
    //         console.log('读取目录出错!', err);
    //     } else {
    //         console.log("读取目录成功！");
    //         console.log(data);
    //         let dataList = [];
    //         for (let i = 0; i < data.length; i++) {
    //             fs.readFile(path.join(__dirname, 'public/data/saveData/' + data[i]), (err2, fileData) => {
    //                 if (err2) {
    //                     console.log('读取文件出错!', err2);
    //                 } else {
    //                     let jsonData = JSON.parse(fileData);
    //                     console.log("读取文件成功！");
    //                     console.log(jsonData);
    //                     dataList.push(jsonData);
    //                 }
    //             })
    //         }
    //         mainWindow.webContents.send('saveData', dataList);
    //     }
    // })

    fs.readdir(path.join(__dirname, 'public/data/saveData'), (err, data) => {
        if (err) {
            console.log('读取目录出错!', err);
        } else {
            // console.log("读取目录成功！");
            // console.log(data);

            const fsPromises = require('fs').promises,
                // files = ['public/data/saveData/save0.json', 'public/data/saveData/save1.json'],
                files = data,
                response = [];

            const fetchFile = async (filename) => {
                return new Promise((resolve, reject) => {
                    const path1 = path.join(__dirname, 'public/data/saveData/' + filename);
                    // console.log(filename, '------', 'public/data/saveData/' + filename);
                    try {
                        const data = fsPromises.readFile(path1); // make sure path is correct
                        resolve(data);
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            files.forEach((fileName) => response.push(fetchFile(fileName)));
            Promise.all(response).then((saveData) => {
                // console.log("saveData-----", saveData);
                let dataList = [];
                saveData.forEach((json) => { dataList.push(JSON.parse(json)) });
                // console.log("dataList-----", dataList);
                mainWindow.webContents.send('saveData', dataList);
            }).catch(e => console.log(e));
        }
    })


    // const fsPromises = require('fs').promises,
    //     files = ['public/data/saveData/save0.json', 'public/data/saveData/save1.json'],
    //     response = [];

    // const fetchFile = async (filename) => {
    //     return new Promise((resolve, reject) => {
    //         const path1 = path.join(__dirname, filename);
    //         try {
    //             const data = fsPromises.readFile(path1); // make sure path is correct
    //             resolve(data);
    //         } catch (e) {
    //             reject(e)
    //         }
    //     });
    // }
    // files.forEach((fileName) => response.push(fetchFile(fileName)));
    // Promise.all(response).then((data) =>{
    //     // let jsonData= JSON.parse(data);
    //     console.log("data-----", data)
    // }).catch(e => console.log(e));
}

