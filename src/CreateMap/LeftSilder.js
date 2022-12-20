/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Tree, Modal, message, Button, InputNumber } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import AddNewMap from './AddNewMap'
import './style.css'

class LeftSilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultMap: [],

            loadMapList: [],
            selectedMap: [],
            selectedInfo: {},

            loadNewBaseMap: {},

            saveModelFlag: false,
            saveFileName: "",
            saveMode: 1,

            sortModelFlag: false,

            createNewMapModelFlag: false,
            isChangedMapModalFlag: false,//当当前地图修改过，会进行判断是否保留

            deleteFileName: "",
            deleteFlag: false,
            deleteMode: "",
            deleteWord: "",

            exitModelFlag: false,
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadMap', function (event, loadMap) {
            console.log('所有地图-----', loadMap);
            _this.setState({ loadMapList: loadMap });
        }) : null;
        window.electron ? window.electron.ipcRenderer.on('addLoadMap', function (event, loadMap) {
            console.log('读取地图-----', loadMap);
            const { loadMapList } = _this.state;
            let flag = true;
            loadMapList.map((map) => {
                if (map.fileName === loadMap.fileName) {
                    flag = false;
                    message.error("读取的地图文件已存在或重名！");
                }
            })
            flag ? _this.setState({ loadMapList: [...loadMapList, loadMap] }) : null;
        }) : null;
        window.electron ? window.electron.ipcRenderer.on('addNewLoadMap', function (event, loadMap) {
            console.log('导入地图图片-----', loadMap);
            _this.setState({ loadNewBaseMap: loadMap }, () => {
                _this.setCreateNewMapModelFlag(true);
            })
        }) : null;
        this.loadMap();
    }

    componentDidMount = () => {
        const { middleWidth, middleHeight } = this.props;
        let map = [];
        for (let i = 0; i < middleWidth; i++) {
            for (let j = 0; j < middleHeight; j++) {
                map.push("no");
            }
        }
        this.setState({ defaultMap: map })
    }

    render() {
        const { selectedMap, saveFileName, saveModelFlag, sortModelFlag, createNewMapModelFlag, isChangedMapModalFlag, tempSelectedInfo, loadNewBaseMap,
            deleteFlag, deleteWord, exitModelFlag } = this.state;
        const { RightMenu_TabList, nowShowTab, middleWidth, middleHeight } = this.props;
        return (
            <Fragment>
                <div className="CreateMap_LeftMenu">
                    <div className="CreateMap_LeftMenu_TreeDir">
                        <Tree       //记得解决一下点击地图文件抬头会崩的问题，因为它没有地图文件
                            showLine
                            switcherIcon={<DownOutlined />}
                            onSelect={this.onSelect}
                            selectedKeys={selectedMap}
                            treeData={this.returnMapData()}
                            draggable
                            onDrop={this.onMapDrop}
                        />
                    </div>
                    {/* <input className="CreateMap_LeftMenu_fileNameInput" onChange={(e) => this.setState({ saveMapName: e.target.value })} value={this.state.saveMapName} /> */}
                    <div className="CreateMap_LeftMenu_Buttons">
                        <div>
                            <div>宽度：</div>
                            <InputNumber value={middleWidth} onChange={this.changeMiddleWidth} />
                        </div>
                        <div>
                            <div>高度：</div>
                            <InputNumber value={middleHeight} onChange={this.changeMiddleHeight} />
                        </div>
                        <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.openSave()}>保存</Button>
                        <Button className="CreateMap_LeftMenu_Button" onClick={() => this.loadMap_json()}>读取</Button>
                        <Button className="CreateMap_LeftMenu_Button" onClick={() => this.createNewMapJson("2.json")}>创建地图文件</Button>
                        <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.createNewMap()}>新增地图</Button>
                        <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.openSort()}>地图排序</Button>
                        <Button className="CreateMap_LeftMenu_Button" onClick={() => this.openLoadNewMap()}>导入地图块</Button>
                        {/* <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.openSort()}>删除地图块</Button> */}

                        <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.openDelete("all")}>删除地图文件</Button>
                        <Button disabled={selectedMap.length === 0 ? true : false} className="CreateMap_LeftMenu_Button" onClick={() => this.openDelete("one")}>删除地图</Button>
                        <Button className="CreateMap_LeftMenu_Button" onClick={() => this.openExit()}>退出编辑</Button>
                    </div>
                </div>
                <Modal className="CreateMap_LeftMenu_SaveModel" visible={saveModelFlag} onOk={() => this.saveNowMap()} onCancel={() => this.closeSave()}
                    footer={this.returnSaveModelFooter()}
                >
                    当前选择保存的文件名为：{saveFileName},请选择保存类型————
                </Modal>

                <Modal className="CreateMap_LeftMenu_SaveModel" visible={isChangedMapModalFlag} onOk={() => this.noSaveChangeAndSelect()} onCancel={() => this.closeIsChanged()} okText="不保留" cancelText="取消">
                    当前地图{tempSelectedInfo ? tempSelectedInfo.title : null}已被修改，确定不保留当前修改？
                </Modal>

                <Modal className="CreateMap_LeftMenu_SaveModel" visible={sortModelFlag} onOk={() => this.clickSortMap()} onCancel={() => this.closeSort()} okText="排序" cancelText="取消">
                    是否以当前顺序对地图{saveFileName}进行排序？
                </Modal>

                <Modal className="CreateMap_LeftMenu_SaveModel" visible={deleteFlag} onOk={() => this.selectModeDeleteMap()} onCancel={() => this.closeDelete()} okText="删除" cancelText="取消">
                    {deleteWord}
                </Modal>

                <Modal className="CreateMap_LeftMenu_SaveModel" visible={exitModelFlag} onOk={() => this.clickExitOk()} onCancel={() => this.closeExit()} okText="确认退出" cancelText="取消">
                    是否退出编辑
                </Modal>

                <AddNewMap createNewMapModelFlag={createNewMapModelFlag} setCreateNewMapModelFlag={this.setCreateNewMapModelFlag} addNewMap={this.addNewMap} loadNewBaseMap={loadNewBaseMap}
                    lxMap={RightMenu_TabList[nowShowTab].name} lxMapURL={RightMenu_TabList[nowShowTab].url} returnRightContent={this.props.returnRightContent} nowClickAddMap={this.props.nowClickAddMap} />
            </Fragment>
        )
    }

    changeMiddleWidth = (num) => {
        const { nowMap, middleWidth, middleHeight } = this.props;

        let nowIndex = middleWidth;
        let nextMap = [];
        let allLength = num * middleHeight;
        let flag = num > middleWidth ? false : true;
        let absNumber = Math.abs(num - middleWidth);
        if (!flag) {
            // nowIndex = middleWidth;
        }
        console.log("middleWidth, middleHeight,allLength,absNumber", middleWidth, middleHeight, num, allLength, absNumber);

        // let countNum = 0;
        nowMap.map((map2, index) => {
            if (flag) {
                let nowCount = Math.floor((index + 1) / middleWidth);
                nowCount = (index + 1) % middleWidth === 0 ? nowCount - 1 : nowCount;
                let nextCount = nowCount * middleWidth + num;
                if (((index + 1) % middleWidth !== 0) && (index < nextCount) && (index >= nowCount * middleWidth)) {
                    console.log("nextCount", nowCount, index, nextCount, num);
                    nextMap.push(map2);
                }
                // let nowCount = Math.floor(index / middleWidth);
                // let nextCount = Math.floor(index / num);
                // if (!(nextCount < nowCount)) {
                //     nextMap.push(map2);
                // }
            }
            else {
                nextMap.push(map2);
                if ((index + 1) % middleWidth === 0) {
                    for (let i = 0; i < absNumber; i++) {
                        nextMap.push("no");
                    }
                }
            }
        });
        // for (let i = 0; i <= allLength; i++) {
        //     if (flag) {
        //         if (i + 1 == nowIndex) {
        //             console.log("i-----", i);
        //             nowMap.map((map2, index2) => {
        //                 if (index2 >= i + 1 - num && index2 <= i - absNumber) {
        //                     console.log("nowIndex,i-----", i + 1 - num, index2, i, i - absNumber, absNumber);
        //                     nextMap.push(map2);
        //                 }
        //             });
        //             nowIndex += num;
        //         }
        //     }
        //     else {
        //         if (i + 1 == nowIndex && i + 1 !== allLength) {
        //             nowMap.map((map2, index2) => {
        //                 if (index2 >= i + 1 - middleWidth && index2 <= i) {
        //                     console.log("nowIndex,i", i + 1 - middleWidth, index2, i);
        //                     nextMap.push(map2);
        //                 }
        //             });
        //             let absNumberIndex = nowIndex + absNumber;
        //             for (let j = nowIndex; j < absNumberIndex; j++) {
        //                 console.log("j", j);
        //                 nextMap.push("no");
        //             }
        //             nowIndex += middleWidth;
        //         }
        //     }
        // }
        console.log("nextMap", nextMap);
        this.props.changeMiddleWidth(num);
        this.props.setMap(nextMap);
    }
    changeMiddleHeight = (num) => {
        const { nowMap, middleWidth, middleHeight } = this.props;
        let nextMap = [];
        let allLength = num * middleWidth;
        let nowLength = nowMap.length;
        let flag = num > middleHeight ? false : true;
        let absNumber = Math.abs(num - middleHeight);
        if (!flag) {
            // nowIndex = middleWidth;
        }
        console.log("middleWidth, middleHeight,allLength,absNumber", middleWidth, middleHeight, num, allLength, absNumber);

        // let countNum = absNumber;
        nowMap.map((map2, index) => {
            if (flag) {
                if ((index + 1) <= allLength) {
                    console.log("changeMiddleHeight", index, index + 1, allLength);
                    nextMap.push(map2);
                }
            }
            else {
                nextMap.push(map2);
                if ((index + 1) === nowLength) {
                    let count = absNumber * middleWidth;
                    for (let i = 0; i < count; i++) {
                        nextMap.push("no");
                    }
                }
            }
        });
        this.props.changeMiddleHeight(num);
        this.props.setMap(nextMap);
    }

    onSelect = (selectedKeysValue, info) => {
        // console.log('onSelect', selectedKeysValue, info);
        if (!this.isSameMap()) {
            this.setState({ tempSelectedMap: selectedKeysValue, tempSelectedInfo: info, isChangedMapModalFlag: true })
            return;
        }
        this.setState({ selectedMap: selectedKeysValue, selectedInfo: info });
        this.props.changeMiddleWidth(info.node.width);
        this.props.changeMiddleHeight(Math.ceil(info.node.map.length / info.node.width));
        this.props.setMap(info.node.map);
    };
    returnMapData = () => {
        const { loadMapList } = this.state;
        let treeList = [];
        loadMapList.map((map, index) => {
            let children = [];
            if (map.data[0] && map.data[0].name) {
                // debugger
                map.data.map((data, index1) => {
                    let middleMap = {
                        title: data.name,
                        key: 'tree-' + index + "-" + index1,
                        map: data.map,
                        parentFileName: map.fileName,
                        mapIndex: index1,
                        parentIndex: index,
                        width: data.width,
                    }
                    children.push(middleMap);
                })
                let data = {
                    title: map.fileName,
                    key: 'tree-' + index,
                    selectable: false,      //之后或者把它改成根据选择的是父节点还是子节点进行相应的地图数据处理
                    children: [...children]
                }
                treeList.push(data);
            }
        })
        return treeList;
    }

    onMapDrop = (event) => {        //拖拽树节点改变，改变树节点地图位置。
        console.log("onMapDrop-----event", event);
        const { loadMapList } = this.state;
        let dragNode = event.dragNode;
        let node = event.node;
        if (dragNode.parentIndex) {
            let nowLoadMapList = [...loadMapList];
            let sendLoadMapList = [...nowLoadMapList[dragNode.parentIndex].data];
            if (node.mapIndex) {
                let dragMap = JSON.parse(JSON.stringify(sendLoadMapList[dragNode.mapIndex]));
                sendLoadMapList[dragNode.mapIndex] = sendLoadMapList[node.mapIndex];
                sendLoadMapList[node.mapIndex] = dragMap;
            }
            else {
                let dragMap = JSON.parse(JSON.stringify(sendLoadMapList[dragNode.mapIndex]));
                sendLoadMapList[dragNode.mapIndex] = sendLoadMapList[0];
                sendLoadMapList[0] = dragMap;
            }
            nowLoadMapList[dragNode.parentIndex].data = sendLoadMapList;
            this.setState({ loadMapList: [...nowLoadMapList] })
        }
    }

    /* 左侧菜单 */
    saveNowMap = () => {    //保存创建的地图
        const { selectedInfo, loadMapList, } = this.state;
        if (selectedInfo && selectedInfo != {}) {
            let data = this.props.nowMap;
            let sendLoadMapList = [...loadMapList[selectedInfo.node.parentIndex].data];
            sendLoadMapList[selectedInfo.node.mapIndex].width = this.props.middleWidth;
            sendLoadMapList[selectedInfo.node.mapIndex].map = data;
            let jsonData = JSON.stringify(sendLoadMapList);
            // let saveData = this.splitStringData(jsonData);
            let filename = selectedInfo.node.parentFileName;
            // let filename = "112.json";
            window.electron ? window.electron.ipcRenderer.send("SaveCreateMap", filename, jsonData) : null;
            this.props.setMap(data);
            message.success('保存成功！');
            this.setState({ saveModelFlag: false });
        }
        else {
            message.error('保存失败！');
        }
    }
    loadMap = () => {           //读取地图（主要）
        let url = "public/data/createMap";
        window.electron ? window.electron.ipcRenderer.send("getAllMapData", url) : null;
    }
    loadMap_json = () => {           //读取地图
        console.log("loadMap_json",);
        window.electron ? window.electron.ipcRenderer.send("LoadMap") : null;
    }
    open = (e, data) => {       //原用以测试‘JSON.stringify()’函数的功能，现暂未测试成功
        console.log("e", e, data);
        return "data";
    }
    splitStringData = (string) => { //将json字符串中每固定数值的点之间，加入\n。
        let list = string.split(",");
        let saveData = "";
        let widthNum = this.props.middleWidth;
        for (let i = 0; i < list.length; i++) {
            if (i === list.length - 1) {
                saveData += list[i];
                break;
            }
            saveData += list[i] + ",";
            if ((i + 1) % widthNum === 0)
                saveData += "\n"
        }
        return saveData;
    }
    /* */

    /* 保存的对话框 */
    openSave = () => {
        const { selectedInfo, loadMapList } = this.state;
        let fileName = loadMapList[selectedInfo.node.parentIndex].fileName;
        this.setState({ saveFileName: fileName, saveModelFlag: true });
    }
    closeSave = () => {
        this.setState({ saveModelFlag: false });
    }
    saveAs = () => {  //另存为  
        const { selectedInfo, loadMapList } = this.state;
        if (selectedInfo && selectedInfo != {}) {
            let data = this.props.nowMap;
            let sendLoadMapList = [...loadMapList[selectedInfo.node.parentIndex].data];
            sendLoadMapList[selectedInfo.node.mapIndex].map = data;
            let jsonData = JSON.stringify(sendLoadMapList);
            let filename = selectedInfo.node.parentFileName;
            window.electron ? window.electron.ipcRenderer.send("SaveAs", filename, jsonData) : null;
            this.setState({ saveModelFlag: false });
        }
        else {
            message.error('保存失败！');
        }

    }
    returnSaveModelFooter = () => {
        const { saveMode } = this.state;
        return (
            <Fragment>
                <Button onClick={this.closeSave}>取消</Button>
                <Button type="primary" onClick={this.saveAs}>另存为</Button>
                {saveMode === 1 ? <Button type="primary" onClick={this.saveNowMap}>保存</Button> : null}
            </Fragment>
        )
    }
    /* ------------------- */

    /*导入新的地图块*/
    openLoadNewMap = () => {
        console.log("LoadNewBaseMap",);
        window.electron ? window.electron.ipcRenderer.send("LoadNewBaseMap") : null;
    }
    setCreateNewMapModelFlag = (flag) => {
        this.setState({ createNewMapModelFlag: flag })
    }
    addNewMap = (form) => {
        console.log("addNewMap", form);
        const { RightMenu_TabList, nowShowTab } = this.props;
        let data = {
            name: form.name,
            lx: form.lx,
            url: this.returnFormUrl(form.url),
            column: form.column,
            pos: form.pos,
            width: form.width,
            height: form.height,
            baseMap: [...form.baseMap],
        }
        window.electron ? window.electron.ipcRenderer.send("SaveCreateMap_new", data, "public/" + RightMenu_TabList[nowShowTab].url) : null;
    }
    returnFormUrl = (url) => {
        let uesUrl = "";
        let uesUrlList = url.split("\\");
        let flag = false;
        uesUrlList.map((data, index) => {
            if (data === "public" && uesUrlList[index + 1] === "img") {
                flag = true;
            }
            if (flag && index !== uesUrlList.length - 1) {
                uesUrl += data + "/";
            }
            else if (flag) {
                uesUrl += data;
            }
        })
        return uesUrl;
    }
    /* -------------- */

    /* 判断当前地图是否被修改过 */
    noSaveChangeAndSelect = () => {
        const { tempSelectedMap, tempSelectedInfo } = this.state;
        this.setState({ selectedMap: tempSelectedMap, selectedInfo: tempSelectedInfo, isChangedMapModalFlag: false });
        this.props.setMap(tempSelectedInfo.node.map);
    }
    closeIsChanged = () => {
        this.setState({ isChangedMapModalFlag: false });
    }
    isSameMap = () => {
        const { nowMap, nowDefaultMap } = this.props;
        let flag = true;
        console.log("isSameMap", nowDefaultMap, nowMap);
        nowDefaultMap.map((map, index) => {
            let base = nowMap[index];
            if (map !== base)
                flag = false
        })
        console.log("isSameMap", nowDefaultMap, nowMap, flag);
        return flag;
    }
    /* -------------- */

    /* 删除的对话框*/
    openDelete = (deleteMode) => {
        const { selectedInfo, loadMapList } = this.state;
        let fileName = loadMapList[selectedInfo.node.parentIndex].fileName;
        let deleteWord = "";
        switch (deleteMode) {
            case "all":
                deleteWord = "当前选择地图文件名为：" + fileName + ",是否删除该地图文件？";
                break;
            case "one":
                let mapLevel = loadMapList[selectedInfo.node.parentIndex].data[selectedInfo.node.mapIndex].name;
                deleteWord = "当前选择地图为：" + fileName + "文件中的第" + mapLevel + "层,是否删除该地图？";
                break;
            default:
                break;
        }
        this.setState({
            deleteFileName: fileName,
            deleteFlag: true,
            deleteMode: deleteMode,
            deleteWord: deleteWord,
        });
    }
    closeDelete = () => {
        this.setState({ deleteFlag: false });
    }
    selectModeDeleteMap = () => {
        const { deleteMode } = this.state;
        switch (deleteMode) {
            case "all":
                this.deleteMapJson();
                break;
            case "one":
                this.deleteMap();
                break;
            default:
                break;
        }
        this.setState({ deleteFlag: false });
    }
    /* ------------------- */

    /* 排序的对话框*/
    openSort = () => {
        const { selectedInfo, loadMapList } = this.state;
        let fileName = loadMapList[selectedInfo.node.parentIndex].fileName;
        this.setState({ saveFileName: fileName, sortModelFlag: true });
    }
    closeSort = () => {
        this.setState({ sortModelFlag: false });
    }
    clickSortMap = () => {
        const { selectedInfo, loadMapList } = this.state;
        if (selectedInfo && selectedInfo !== {}) {
            let nowLoadMapList = [...loadMapList];
            let sendLoadMapList = [...nowLoadMapList[selectedInfo.node.parentIndex].data];
            sendLoadMapList.map((data, index) => {
                data.name = index + 1;
            });
            nowLoadMapList[selectedInfo.node.parentIndex].data = sendLoadMapList;
            this.setState({ loadMapList: nowLoadMapList, sortModelFlag: false });
        }
    }
    /* ------------------- */

    /* 新建地图文件和在已有地图文件中新增地图 */
    createNewMapJson = (fileName) => {
        const { selectedInfo, loadMapList, defaultMap } = this.state;
        const { middleWidth } = this.props;
        let changeLoadMapList = [...loadMapList];
        let sendLoadMapList = [];
        let newMap = {
            name: sendLoadMapList.length + 1 + "",
            map: defaultMap,
            width: middleWidth,
        }
        sendLoadMapList.push(newMap);
        let newMapJson = {
            fileName: fileName,
            data: sendLoadMapList,
        }
        changeLoadMapList.push(newMapJson);
        this.setState({ loadMapList: changeLoadMapList });
    }
    createNewMap = () => {
        const { selectedInfo, loadMapList, defaultMap } = this.state;
        const { middleWidth } = this.props;
        if (selectedInfo && selectedInfo != {}) {
            let changeLoadMapList = [...loadMapList]
            let sendLoadMapList = [...changeLoadMapList[selectedInfo.node.parentIndex].data];
            let newMap = {
                name: sendLoadMapList.length + 1 + "",
                map: defaultMap,
                width: middleWidth,
            }
            sendLoadMapList.push(newMap);
            changeLoadMapList[selectedInfo.node.parentIndex].data = sendLoadMapList;
            this.setState({ loadMapList: changeLoadMapList });
        }
    }
    /*------------*/


    deleteMapJson = () => {         //目前的删除仅针对缓存，未正真删除实际的文件
        const { selectedInfo, loadMapList, } = this.state;
        if (selectedInfo && selectedInfo != {}) {
            let changeLoadMapList = loadMapList.filter((data, index) => index !== selectedInfo.node.parentIndex);
            this.setState({
                loadMapList: changeLoadMapList,
                selectedMap: [],
                selectedInfo: {},
            });
            // let filename = selectedInfo.node.parentFileName;
            // let url = "public/data/saveData/";
            // window.electron ? window.electron.ipcRenderer.send("DeleteMapJson", filename, url) : null;
        }
    }
    deleteMap = () => {             //目前的删除仅针对缓存，未正真删除实际的文件
        const { selectedInfo, loadMapList, } = this.state;
        if (selectedInfo && selectedInfo != {}) {
            console.log("deleteMap", selectedInfo);
            let changeLoadMapList = [...loadMapList]
            let sendLoadMapList = [...changeLoadMapList[selectedInfo.node.parentIndex].data];
            sendLoadMapList = sendLoadMapList.filter((data, index) => index !== selectedInfo.node.mapIndex);
            changeLoadMapList[selectedInfo.node.parentIndex].data = sendLoadMapList;
            this.setState({
                loadMapList: changeLoadMapList,
                selectedMap: [],
                selectedInfo: {},
            });

        }
    }
    /* ------------------- */

    /* 退出编辑 */
    openExit = () => {
        this.setState({ exitModelFlag: true });
    }
    closeExit = () => {
        this.setState({ exitModelFlag: false });
    }
    clickExitOk = () => {
        this.props.Exit();
        // this.props.history.push("/");
    }
    /* ------------------- */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(LeftSilder);