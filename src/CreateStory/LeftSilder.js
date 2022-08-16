/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Tree, Modal, message, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import CreateNewStoryFile from './CreateNewStoryFile'
import CreateNewStory from './CreateNewStory'
import ChangeSelectStoryFile from './ChangeSelectStoryFile'
import ChangeSelectStory from './ChangeSelectStory'
import './style.css'
import axios from "axios";

class LeftSilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            middleWidth: 10,
            middleHeight: 10,
            defaultStory: [],

            loadStoryList: [],
            baseMapList: [],

            selectedStory: [],
            selectedInfo: {},

            createFileModelFlag: false,
            createStoryModelFlag: false,

            saveModelFlag: false,
            saveStoryMapModelFlag: false,
            saveFileName: "",
            saveMode: 1,

            sortModelFlag: false,

            deleteFileName: "",
            deleteFlag: false,
            deleteMode: "",
            deleteWord: "",

            exitModelFlag: false,
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadStory', function (event, loadStory) {
            console.log('所有故事-----', loadStory);
            _this.setState({ loadStoryList: loadStory });
        }) : null;
        // window.electron ? window.electron.ipcRenderer.on('Refresh', function (event) {
        //     _this.loadStory();
        // }) : null;
        window.electron ? window.electron.ipcRenderer.on('addLoadStory', function (event, loadStory) {
            console.log('读取故事-----', loadStory);
            const { loadStoryList } = _this.state;
            let flag = true;
            loadStoryList.map((map) => {
                if (map.fileName === loadStory.fileName) {
                    flag = false;
                    message.error("读取的故事文件已存在或重名！");
                }
            })
            flag ? _this.setState({ loadStoryList: [...loadStoryList, loadStory] }) : null;
        }) : null;
        this.loadStory();
        this.loadBaseMap();
    }

    render() {
        const { selectedStory, selectedInfo, saveFileName, createFileModelFlag, createStoryModelFlag, changeFileModelFlag, changeStoryModelFlag, baseMapList,
            saveModelFlag, saveStoryMapModelFlag, sortModelFlag, deleteFlag, deleteWord, exitModelFlag } = this.state;
        return (
            <Fragment>
                <div className="CreateStory_LeftMenu">
                    <div className="CreateStory_LeftMenu_TreeDir">
                        <Tree       //记得解决一下点击故事文件抬头会崩的问题，因为它没有故事文件
                            showLine
                            switcherIcon={<DownOutlined />}
                            onSelect={this.onSelect}
                            selectedKeys={selectedStory}
                            treeData={this.returnStoryData()}
                            draggable
                            onDrop={this.onStoryDrop}
                        />
                    </div>

                    <div className="CreateStory_LeftMenu_Buttons">
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.openSave()}>保存</Button>
                        <Button className="CreateStory_LeftMenu_Button" onClick={() => this.loadStory_json()}>读取</Button>
                        <Button className="CreateStory_LeftMenu_Button" onClick={() => this.setCreateFileModelFlag(true)}>创建故事文件</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.setCreateStoryModelFlag(true)}>新增故事</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.setChangeFileModelFlag(true)}>修改故事文件</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.setChangeStoryModelFlag(true)}>修改故事</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.openSort()}>故事排序</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.openSaveStoryMap()}>生成故事地图块文件</Button>

                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.openDelete("all")}>删除故事文件</Button>
                        <Button disabled={selectedStory.length === 0 ? true : false} className="CreateStory_LeftMenu_Button" onClick={() => this.openDelete("one")}>删除故事</Button>
                        <Button className="CreateStory_LeftMenu_Button" onClick={() => this.openExit()}>退出编辑</Button>
                    </div>
                </div>
                <Modal className="CreateStory_LeftMenu_SaveModel" visible={saveModelFlag} onOk={() => this.saveNowStory()} onCancel={() => this.closeSave()}
                    footer={this.returnSaveModelFooter()}
                >
                    当前选择保存的文件名为：{saveFileName},请选择保存类型————
                </Modal>

                <Modal className="CreateStory_LeftMenu_SaveModel" visible={saveStoryMapModelFlag} onOk={() => this.storyMapSaveAs()} onCancel={() => this.closeSaveStoryMap()}
                    footer={this.returnSaveStoryMapModelFooter()}
                >
                    当前选择保存的故事地图文件名为：{saveFileName},请选择保存类型————
                </Modal>

                <Modal className="CreateStory_LeftMenu_SaveModel" visible={sortModelFlag} onOk={() => this.clickSortStory()} onCancel={() => this.closeSort()} okText="排序" cancelText="取消">
                    是否以当前顺序对故事{saveFileName}进行排序？
                </Modal>

                <Modal className="CreateStory_LeftMenu_SaveModel" visible={deleteFlag} onOk={() => this.selectModeDeleteStory()} onCancel={() => this.closeDelete()} okText="删除" cancelText="取消">
                    {deleteWord}
                </Modal>

                <Modal className="CreateStory_LeftMenu_SaveModel" visible={exitModelFlag} onOk={() => this.clickExitOk()} onCancel={() => this.closeExit()} okText="确认退出" cancelText="取消">
                    是否退出编辑
                </Modal>

                <CreateNewStoryFile createFileModelFlag={createFileModelFlag} setCreateFileModelFlag={this.setCreateFileModelFlag} createNewStoryJson={this.createNewStoryJson} baseMapList={baseMapList} />
                <CreateNewStory createStoryModelFlag={createStoryModelFlag} setCreateStoryModelFlag={this.setCreateStoryModelFlag} createNewStory={this.createNewStory} baseMapList={baseMapList} />
                <ChangeSelectStoryFile changeFileModelFlag={changeFileModelFlag} setChangeFileModelFlag={this.setChangeFileModelFlag} changeFile={this.changeFile} selectedInfo={selectedInfo} />
                <ChangeSelectStory changeStoryModelFlag={changeStoryModelFlag} setChangeStoryModelFlag={this.setChangeStoryModelFlag} changeStory={this.changeStory} selectedInfo={selectedInfo} baseMapList={baseMapList} />
            </Fragment>
        )
    }

    onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', selectedKeysValue, info);
        this.changeThenSave();
        this.setState({ selectedStory: selectedKeysValue, selectedInfo: info });
        this.props.setNowStory(info.node.story);
    };
    returnStoryData = () => {
        const { loadStoryList } = this.state;
        let treeList = [];
        loadStoryList.map((story, index) => {
            let children = [];
            if (story.data[0] && story.data[0].storyId) {
                story.data.map((data, index1) => {
                    let middleStory = {
                        title: data.storyId,
                        key: 'tree-' + index + "-" + index1,
                        story: data.storyContent,
                        parentFileName: story.fileName,
                        storyIndex: index1,
                        parentIndex: index,
                        chapter: parseInt(data.storyId.split("_")[0]),
                        storyMode: data.storyMode,
                        storyMap: data.storyMap,
                    }
                    children.push(middleStory);
                })
                let data = {
                    title: story.fileName,
                    key: 'tree-' + index,
                    selectable: false,      //之后或者把它改成根据选择的是父节点还是子节点进行相应的故事数据处理
                    children: [...children],
                }
                treeList.push(data);
            }
        })
        return treeList;
    }

    onStoryDrop = (event) => {        //拖拽树节点改变，改变树节点故事位置。
        console.log("onStoryDrop-----event", event);
        const { loadStoryList } = this.state;
        let dragNode = event.dragNode;
        let node = event.node;
        if (dragNode.parentIndex) {
            let nowLoadStoryList = [...loadStoryList];
            let sendLoadStoryList = [...nowLoadStoryList[dragNode.parentIndex].data];
            if (node.storyIndex) {
                this.setState({ selectedStory: [node.key] }, () => {
                    let dragStory = JSON.parse(JSON.stringify(sendLoadStoryList[dragNode.storyIndex]));
                    sendLoadStoryList[dragNode.storyIndex] = sendLoadStoryList[node.storyIndex];
                    sendLoadStoryList[node.storyIndex] = dragStory;
                    nowLoadStoryList[dragNode.parentIndex].data = sendLoadStoryList;
                    this.setState({ loadStoryList: [...nowLoadStoryList] })
                })
            }
            else {
                this.setState({ selectedStory: ["tree-" + dragNode.parentIndex + "-0"] }, () => {
                    let dragStory = JSON.parse(JSON.stringify(sendLoadStoryList[dragNode.storyIndex]));
                    sendLoadStoryList[dragNode.storyIndex] = sendLoadStoryList[0];
                    sendLoadStoryList[0] = dragStory;
                    nowLoadStoryList[dragNode.parentIndex].data = sendLoadStoryList;
                    this.setState({ loadStoryList: [...nowLoadStoryList] })
                })
            }
        }
    }

    setCreateStoryModelFlag = (flag) => {
        this.setState({ createStoryModelFlag: flag })
    }
    setCreateFileModelFlag = (flag) => {
        this.setState({ createFileModelFlag: flag })
    }
    setChangeStoryModelFlag = (flag) => {
        this.setState({ changeStoryModelFlag: flag })
    }
    setChangeFileModelFlag = (flag) => {
        this.setState({ changeFileModelFlag: flag })
    }
    /* 左侧菜单 */
    changeThenSave = () => {
        const { selectedInfo, loadStoryList } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let data = this.props.nowStory;
            let nowLoadStoryList = [...loadStoryList];
            let sendLoadStoryList = [...nowLoadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList[selectedInfo.node.storyIndex].storyContent = data;
            nowLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({ loadStoryList: [...nowLoadStoryList] })
        }
    }
    saveNowStory = () => {    //保存创建的故事
        const { selectedInfo, loadStoryList } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let data = this.props.nowStory;
            let sendLoadStoryList = [...loadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList[selectedInfo.node.storyIndex].storyContent = data;
            let jsonData = JSON.stringify(sendLoadStoryList);
            let filename = selectedInfo.node.parentFileName;
            window.electron ? window.electron.ipcRenderer.send("SaveCreateStory", filename, jsonData) : null;
            message.success('保存成功！');
            this.setState({ saveModelFlag: false });
        }
        else {
            message.error('保存失败！');
        }
    }
    loadStory = () => {           //读取故事
        let url = "public/data/createStory";
        window.electron ? window.electron.ipcRenderer.send("getAllStoryData", url) : null;
    }
    loadStory_json = () => {           //读取地图
        console.log("loadMap_json",);
        window.electron ? window.electron.ipcRenderer.send("LoadStory") : null;
    }
    loadBaseMap = () => {           //读取基础地图
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                let result = res.data;
                this.setState({ baseMapList: result });
            }).catch((e) => {
                console.log(e);
            })
    }

    open = (e, data) => {       //原用以测试‘JSON.stringify()’函数的功能，现暂未测试成功
        console.log("e", e, data);
        return "data";
    }
    splitStringData = (string) => { //将json字符串中每固定数值的点之间，加入\n。
        let list = string.split(",");
        let saveData = "";
        let widthNum = this.state.middleWidth;
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
        const { selectedInfo, loadStoryList } = this.state;
        let fileName = loadStoryList[selectedInfo.node.parentIndex].fileName;
        this.setState({ saveFileName: fileName, saveModelFlag: true });
    }
    closeSave = () => {
        this.setState({ saveModelFlag: false });
    }
    saveAs = () => {  //另存为  
        const { selectedInfo, loadStoryList } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let data = this.props.nowStory;
            let sendLoadStoryList = [...loadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList[selectedInfo.node.storyIndex].storyContent = data;
            let jsonData = JSON.stringify(sendLoadStoryList);
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
                {saveMode === 1 ? <Button type="primary" onClick={this.saveNowStory}>保存</Button> : null}
            </Fragment>
        )
    }
    /* ------------------- */

    /* 生成任务地图块对话框 */
    openSaveStoryMap = () => {
        const { selectedInfo, loadStoryList } = this.state;
        let fileName = loadStoryList[selectedInfo.node.parentIndex].fileName.replace(".json", "Map.json");
        this.setState({ saveFileName: fileName, saveStoryMapModelFlag: true });
    }
    closeSaveStoryMap = () => {
        this.setState({ saveStoryMapModelFlag: false });
    }
    storyMapSaveAs = () => {  //另存为  
        const { selectedInfo, loadStoryList, baseMapList } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let data = this.props.nowStory;
            let sendLoadStoryList = [...loadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList[selectedInfo.node.storyIndex].storyContent = data;
            let sendData = [];
            sendLoadStoryList.map((story) => {
                baseMapList.map((map) => {
                    if (map.lx === story.storyMap) {
                        let tempData = {
                            name: story.storyId + "-Story",
                            lx: map.lx + "-" + story.storyId + "-Story",
                            url: map.url,
                            column: map.column,
                            pos: map.pos,
                            width: map.width,
                            height: map.height
                        };
                        sendData.push(tempData);
                    }
                })
            })
            let jsonData = JSON.stringify(sendData);
            let filename = selectedInfo.node.parentFileName.replace(".json", "Map.json");
            window.electron ? window.electron.ipcRenderer.send("SaveAs", filename, jsonData) : null;
            this.setState({ saveStoryMapModelFlag: false });
        }
        else {
            message.error('保存失败！');
        }

    }
    returnSaveStoryMapModelFooter = () => {
        const { saveMode } = this.state;
        return (
            <Fragment>
                <Button onClick={this.closeSave}>取消</Button>
                <Button type="primary" onClick={this.storyMapSaveAs}>另存为</Button>
                {/* {saveMode === 1 ? <Button type="primary" onClick={this.saveNowStory}>保存</Button> : null} */}
            </Fragment>
        )
    }
    /* ------------------- */

    /* 删除的对话框*/
    openDelete = (deleteMode) => {
        const { selectedInfo, loadStoryList } = this.state;
        let fileName = loadStoryList[selectedInfo.node.parentIndex].fileName;
        let deleteWord = "";
        switch (deleteMode) {
            case "all":
                deleteWord = "当前选择故事文件名为：" + fileName + ",是否删除该故事文件？";
                break;
            case "one":
                let storyId = loadStoryList[selectedInfo.node.parentIndex].data[selectedInfo.node.storyIndex].storyId;
                deleteWord = "当前选择故事为：" + fileName + "文件中的故事ID：" + storyId + ",是否删除该故事？";
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
    selectModeDeleteStory = () => {
        const { deleteMode } = this.state;
        switch (deleteMode) {
            case "all":
                this.deleteStoryJson();
                break;
            case "one":
                this.deleteStory();
                break;
            default:
                break;
        }
        this.setState({ deleteFlag: false });
    }
    /* ------------------- */

    /* 排序的对话框*/
    openSort = () => {
        const { selectedInfo, loadStoryList } = this.state;
        let fileName = loadStoryList[selectedInfo.node.parentIndex].fileName;
        this.setState({ saveFileName: fileName, sortModelFlag: true });
    }
    closeSort = () => {
        this.setState({ sortModelFlag: false });
    }
    clickSortStory = () => {
        const { selectedInfo, loadStoryList } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let nowLoadStoryList = [...loadStoryList];
            let sendLoadStoryList = [...nowLoadStoryList[selectedInfo.node.parentIndex].data];
            let chapter = sendLoadStoryList[0].storyId.split("_")[0];
            sendLoadStoryList.map((data, index) => {
                data.storyId = chapter + "_" + this.add0(index);
            });
            nowLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({ loadStoryList: nowLoadStoryList, sortModelFlag: false });
        }
    }
    /* ------------------- */

    /* 新建故事文件和在已有故事文件中新增故事 */
    createNewStoryJson = (formData) => {
        console.log("createNewStoryJson---------formData", formData);
        const { selectedInfo, loadStoryList, } = this.state;
        let changeLoadStoryList = [...loadStoryList];
        let sendLoadStoryList = [];
        let newStory = {
            storyId: formData.storyContentChapter + "_00",
            storyContent: [{ name: "", word: "" }],
            storyMode: formData.storyMode,
            storyMap: formData.storyMap,
        }
        sendLoadStoryList.push(newStory);
        let newStoryJson = {
            fileName: formData.storyFileName,
            data: sendLoadStoryList,
        }
        changeLoadStoryList.push(newStoryJson);
        this.setState({ loadStoryList: changeLoadStoryList });
    }
    createNewStory = (formData) => {
        console.log("createNewStory----------formData", formData);
        const { selectedInfo, loadStoryList, } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let changeLoadStoryList = [...loadStoryList]
            let sendLoadStoryList = [...changeLoadStoryList[selectedInfo.node.parentIndex].data];
            let chapter = sendLoadStoryList[0].storyId.split("_")[0];
            let newStory = {
                storyId: chapter + "_" + this.add0(sendLoadStoryList.length),
                storyContent: [{ name: "", word: "" }],
                storyMode: formData.storyMode,
                storyMap: formData.storyMap,
            }
            sendLoadStoryList.push(newStory);
            changeLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({ loadStoryList: changeLoadStoryList });
        }
    }
    /*------------*/

    /* 修改故事文件和修改增故事 */
    changeFile = (form) => {
        console.log("changeFile", form);
        const { selectedInfo, loadStoryList, } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let changeLoadStoryList = [...loadStoryList];
            changeLoadStoryList[selectedInfo.node.parentIndex].fileName = form.storyFileName;
            // let dataList = [];
            let sendLoadStoryList = [...changeLoadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList.map((story, index) => {
                let lastWord = "";
                let storyWordIndex = "";
                story.storyId.split("_").map((word, index) => {
                    if (index !== 0)
                        lastWord += word;
                    if (index === 1)
                        storyWordIndex = word;
                });
                story.storyId = form.storyContentChapter + "_" + this.add0(parseInt(storyWordIndex));
            })
            changeLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({ loadStoryList: changeLoadStoryList });
        }
    }
    changeStory = (form) => {
        console.log("changeStory", form);
        const { selectedInfo, loadStoryList, } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let changeLoadStoryList = [...loadStoryList]
            let sendLoadStoryList = [...changeLoadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList[selectedInfo.node.storyIndex].storyMode = form.storyMode;
            sendLoadStoryList[selectedInfo.node.storyIndex].storyMap = form.storyMap;
            changeLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({ loadStoryList: changeLoadStoryList });
        }
    }
    /*------------*/

    deleteStoryJson = () => {         //目前的删除仅针对缓存，未正真删除实际的文件
        const { selectedInfo, loadStoryList, } = this.state;
        if (selectedInfo && selectedInfo.node) {
            let changeLoadStoryList = loadStoryList.filter((data, index) => index !== selectedInfo.node.parentIndex);
            this.setState({
                loadStoryList: changeLoadStoryList,
                selectedStory: [],
                selectedInfo: {},
            });
            // let filename = selectedInfo.node.parentFileName;
            // let url = "public/data/saveData/";
            // window.electron ? window.electron.ipcRenderer.send("DeleteStoryJson", filename, url) : null;
        }
    }
    deleteStory = () => {             //目前的删除仅针对缓存，未正真删除实际的文件
        const { selectedInfo, loadStoryList, } = this.state;
        if (selectedInfo && selectedInfo.node) {
            console.log("deleteStory", selectedInfo);
            let changeLoadStoryList = [...loadStoryList]
            let sendLoadStoryList = [...changeLoadStoryList[selectedInfo.node.parentIndex].data];
            sendLoadStoryList = sendLoadStoryList.filter((data, index) => index !== selectedInfo.node.storyIndex);
            changeLoadStoryList[selectedInfo.node.parentIndex].data = sendLoadStoryList;
            this.setState({
                loadStoryList: changeLoadStoryList,
                selectedStory: [],
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
    }
    /* ------------------- */

    add0 = (num) => {
        return num < 10 ? "0" + num : num;
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(LeftSilder);