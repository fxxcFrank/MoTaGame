const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const url = require('url');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { dialog } = require('electron');
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
// window.addEventListener('keyup', (e) => handleKeyCode(e), true)
// function handleKeyCode(e) {
//     let keyCode = e.keyCode;
//     console.log("handleKeyCode", e, keyCode);
//     switch (keyCode) {
//         case 116:
//             mainWindow.reload(); //应用刷新
//             break;
//         case 122:
//             if (sizeFlag)
//                 mainWindow.restore();
//             else
//                 mainWindow.maximize();//应用放大或全屏
//             break;
//         case 123:
//             mainWindow.openDevTools();//应用打开调试工具
//             break;
//         default:
//             break;
//     }
// }
ipcMain.on("f5", function () {  //应用刷新
    mainWindow.reload();
})
ipcMain.on("f11", function () {//应用放大、复原
    if (sizeFlag)
        mainWindow.restore();
    else
        mainWindow.maximize();
    sizeFlag = !sizeFlag;
})
ipcMain.on("f12", function () {//应用打开调试工具
    mainWindow.openDevTools();
})
ipcMain.on("Save", function (e, name, data) {
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
ipcMain.on("SaveAs", function (e, name, data) {
    dialog.showSaveDialog({
        title: "请选择要保存的文件名",
        buttonLabel: "保存",
        defaultPath: name,
        filters: [
            { name: '地图格式类型', extensions: ['json'] },
        ]
    }).then(result => {
        fs.writeFileSync(result.filePath, data);
        console.log("SaveAs------SaveAs success!");
        mainWindow.webContents.send('Refresh');
    }).catch(err => {
        console.log(err)
    })
})
ipcMain.on("LoadMap", function (e,) {       //读取地图文件，json
    dialog.showOpenDialog({
        title: "请选择要读取的地图文件",
        defaultPath: path.join(__dirname, 'public/data/createMap'),
        buttonLabel: "读取",
        filters: [
            { name: '地图格式类型', extensions: ['json'] },
        ]
    }).then(result => {
        console.log("LoadMap------LoadMap success!");
        let path = result.filePaths[0];
        let fileName = path.split("\\").pop();
        let filePromise = fetchFile(path);
        filePromise.then((data) => {
            mainWindow.webContents.send('addLoadMap', { fileName: fileName, data: JSON.parse(data) });
        })
    }).catch(err => {
        console.log(err)
    })
})
ipcMain.on("LoadNewBaseMap", function (e,) {       //读取准备加入的地图图片，因为只有png格式拥有透明背景，暂且只允许png格式的图片
    dialog.showOpenDialog({
        title: "请选择要读取的地图文件",
        defaultPath: path.join(__dirname, 'public/img'),
        buttonLabel: "读取",
        filters: [
            { name: '地图格式类型', extensions: ['png',] },
        ]
    }).then(result => {
        console.log("LoadNewBaseMap------LoadNewBaseMap success!");
        let path = result.filePaths[0];
        let fileName = path.split("\\").pop();
        mainWindow.webContents.send('addNewLoadMap', { fileName: fileName, imgURL: path, });
    }).catch(err => {
        console.log(err)
    })
})
ipcMain.on("DeleteMapJson", function (e, mode, url) {       //应该可用，但是想了想，还是不用了，需要删除手动删，页面上提供从列表删除就行了
    console.log("DeleteMapJson");
    // var file = path.join(__dirname, 'public/data/createMap/' + url);
    // if (mode === "absolutePath") {
    //     file = url;
    // }
    // if (fs.existsSync(file)) {
    //     fs.unlink(file, function (err) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     })
    // }
})

ipcMain.on("SaveCreateMap", function (e, name, data) {
    fs.writeFile(path.join(__dirname, 'public/data/createMap/' + name), data, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("SaveCreateMap------save success!");
            mainWindow.webContents.send('Refresh');
        }
    })
})
ipcMain.on("SaveCreateMap_new", function (e, data, url) {
    // let path0 = path.join(__dirname, url).replace(/\\/g, "\\\\");
    // let path0 = path.join(__dirname, url);
    // console.log("data, url", data, url);
    // console.log("path", path.join(__dirname));
    // console.log("path0", path0);
    let filePromise = fetchFile(path.join(__dirname, url));
    filePromise.then((data1) => {
        let data2 = JSON.parse(data1);
        data2.push(data);
        fs.writeFile(path.join(__dirname, url), JSON.stringify(data2), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("SaveCreateMap_new------save success!");
                mainWindow.webContents.send('Refresh');
                // getAllSaveData();
            }
        })
        // mainWindow.webContents.send('addLoadStory', { fileName: fileName, data: JSON.parse(data) });
    })
})
ipcMain.on("getAllSaveData", function () {
    getAllSaveData();
})

ipcMain.on("getAllMapData", function (e, url) {
    getAllMapData(url);
})
ipcMain.on("getMapData_json", function (e, url) {
    getMapData_json(url);
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
    const urlLocation = isDev ? 'http://localhost:3000' : path.join(__dirname, './build/index.html');
    mainWindow.loadURL(urlLocation);
    // 打开开发工具
    mainWindow.openDevTools();



    // 当 window 被关闭,这个事件会被触发
    mainWindow.on('closed', function () {
        // 取消引用 window 对象,如果你的应用支持多窗口的话,
        // 通常会把多个 window 对象存放在一个数组里面,
        // 但这次不是。
        mainWindow = null;
    });
})


const fetchFile = async (url) => {
    console.log("url", url);
    return new Promise((resolve, reject) => {
        try {
            const data = fsPromises.readFile(url); // make sure path is correct
            resolve(data);
        } catch (e) {
            reject(e)
        }
    });
}

/* 读取保存文件 */
function getAllSaveData() {
    fs.readdir(path.join(__dirname, 'public/data/saveData'), (err, data) => {
        if (err) {
            console.log('读取目录出错!', err);
        } else {
            const fsPromises = require('fs').promises,
                files = data,
                response = [];
            const fetchFile = async (filename) => {
                return new Promise((resolve, reject) => {
                    const path1 = path.join(__dirname, 'public/data/saveData/' + filename);
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
                let dataList = [];
                saveData.forEach((json) => { dataList.push(JSON.parse(json)) });
                mainWindow.webContents.send('saveData', dataList);
            }).catch(e => console.log(e));
        }
    })
}
/* ---------------- */

/* 创建地图————读取地图文件 */
function getAllMapData(url) {
    fs.readdir(path.join(__dirname, url), (err, data) => {
        if (err) {
            console.log('读取目录出错!', err);
        } else {
            const fsPromises = require('fs').promises,
                files = data,
                response = [];

            // console.log("data", data);
            let fileNameList = [];
            const fetchFile = async (filename) => {
                return new Promise((resolve, reject) => {
                    const path1 = path.join(__dirname, url + "/" + filename);
                    try {
                        const data = fsPromises.readFile(path1); // make sure path is correct
                        fileNameList.push(filename);
                        resolve(data);
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            files.forEach((fileName) => response.push(fetchFile(fileName)));
            Promise.all(response).then((saveData) => {
                let dataList = [];
                saveData.forEach((json, index) => { dataList.push({ fileName: fileNameList[index], data: JSON.parse(json) }) });
                mainWindow.webContents.send('loadMap', dataList);
            }).catch(e => console.log(e));
        }
    })
}
/* ---------------- */


function getMapData_json(url) {     //暂时未用到
    fs.readdir(path.join(__dirname, url), (err, data) => {
        if (err) {
            console.log('读取目录出错!', err);
        } else {
            const fsPromises = require('fs').promises,
                files = data,
                response = [];

            const fetchFile = async (filename) => {
                return new Promise((resolve, reject) => {
                    const path1 = path.join(__dirname, url + "/" + filename);
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
                let dataList = [];
                saveData.forEach((json) => { dataList.push(JSON.parse(json)) });
                mainWindow.webContents.send('loadMap', dataList);
            }).catch(e => console.log(e));
        }
    })
}



/* 创建地图————读取故事文件 */
ipcMain.on("getAllStoryData", function (e, url) {
    getAllStoryData(url);
})
function getAllStoryData(url) {
    fs.readdir(path.join(__dirname, url), (err, data) => {
        if (err) {
            console.log('读取目录出错!', err);
        } else {
            const fsPromises = require('fs').promises,
                files = data,
                response = [];

            // console.log("data", data);
            let fileNameList = [];
            const fetchFile = async (filename) => {
                return new Promise((resolve, reject) => {
                    const path1 = path.join(__dirname, url + "/" + filename);
                    try {
                        const data = fsPromises.readFile(path1); // make sure path is correct
                        fileNameList.push(filename);
                        resolve(data);
                    } catch (e) {
                        reject(e)
                    }
                });
            }
            files.forEach((fileName) => response.push(fetchFile(fileName)));
            Promise.all(response).then((saveData) => {
                let dataList = [];
                saveData.forEach((json, index) => { dataList.push({ fileName: fileNameList[index], data: JSON.parse(json) }) });
                mainWindow.webContents.send('loadStory', dataList);
            }).catch(e => console.log(e));
        }
    })
}

ipcMain.on("SaveCreateStory", function (e, name, data) {
    fs.writeFile(path.join(__dirname, 'public/data/createStory/' + name), data, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("SaveCreateStory------save success!");
            mainWindow.webContents.send('Refresh');
        }
    })
})

ipcMain.on("LoadStory", function (e,) {
    dialog.showOpenDialog({
        title: "请选择要读取的故事文件",
        defaultPath: path.join(__dirname, 'public/data/createStory'),
        buttonLabel: "读取",
        filters: [
            { name: '故事格式类型', extensions: ['json'] },
        ]
    }).then(result => {
        console.log("LoadStory------LoadStory success!");
        let path = result.filePaths[0];
        let fileName = path.split("\\").pop();
        let filePromise = fetchFile(path);
        filePromise.then((data) => {
            mainWindow.webContents.send('addLoadStory', { fileName: fileName, data: JSON.parse(data) });
        })
    }).catch(err => {
        console.log(err)
    })
})
/* ---------------- */

