/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuButtonList: [
                {
                    text: "保存",
                    type: "Save",
                },
                {
                    text: "载入",
                    type: "Load",
                },
                {
                    text: "返回",
                    type: "return",
                },
                {
                    text: "退出",
                    type: "Exit",
                },
            ],
            nowMenuButtonIndex: 0,
            saveDataList: [],
            saveList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            nowMenuSaveIndex: 0,
            saveFlag: false,
            loadList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            nowMenuLoadIndex: 0,
            loadFlag: false,
            nowGameTime: '00:00:00',

            spaceFlag: false, //控制键盘事件的占位
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('saveData', function (event, saveData) {
            console.log('所有存档-----', saveData);
            _this.setState({ saveDataList: saveData });
        }) : null;
        document.addEventListener("keydown", this.keyOn);
        setInterval(() => {
            let nowGameTime = _this.state.nowGameTime;
            let nowGameTimeList = nowGameTime.split(":");
            let time = '00:00:00';
            let hour = parseInt(nowGameTimeList[0]);
            let minute = parseInt(nowGameTimeList[1]);
            let second = parseInt(nowGameTimeList[2]);
            second += 1;
            if (second >= 60) {
                second -= 60;
                minute += 1;
            }
            if (minute >= 60) {
                minute -= 60;
                hour += 1;
            }
            time = this.addTime(hour) + ":" + this.addTime(minute) + ":" + this.addTime(second);
            this.setState({ nowGameTime: time });
        }, 1000);
        this.props.setPreloadFlag("menuPreloadFlag", true);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { menuButtonList, nowMenuButtonIndex, saveDataList, saveFlag, saveList, nowMenuSaveIndex, loadFlag, loadList, nowMenuLoadIndex } = this.state;
        return (
            <Fragment>
                {this.props.menuFlag ?
                    <div className="Menu_Main">
                        <div className="Menu_title">菜单</div>
                        <div className="Menu_Button_List" id="Menu_Button_List">
                            {menuButtonList.map((menuButton, index) => {
                                return (
                                    <div className={nowMenuButtonIndex === index ? "Menu_Button_focus" : "Menu_Button"} onClick={() => this.clickMenuButton(index)}>{menuButton.text}</div>
                                )
                            })}
                        </div>
                    </div>
                    : null
                }
                {saveFlag ?
                    <div className="Menu_Save">
                        <div className="Menu_Save_title">保存</div>
                        <div className="Menu_Save_Button_List" id="Menu_Save_Button_List">
                            {saveList.map((save, index) => {
                                return (
                                    <div className={nowMenuSaveIndex === index ? "Menu_Save_Button_focus" : "Menu_Save_Button"} onClick={() => this.clickMenuSaveButton(index)}>
                                        <div className="Menu_Save_Button_Title">{"存档" + save}</div>
                                        {saveDataList[index] ?
                                            <Fragment>
                                                <div className="Menu_Save_Button_level">{"lv." + saveDataList[index].level}</div>
                                                <img className="Menu_Save_Button_img" />
                                                <div className="Menu_Save_Button_floorNum">{"第" + saveDataList[index].nowMapNum + "层"}</div>
                                                <div className="Menu_Save_Button_Time">{"时间：" + saveDataList[index].nowGameTime}</div>
                                            </Fragment>
                                            : <div className="Menu_Save_Button_Time">{"尚未保存"}</div>}
                                    </div>
                                )
                            })}
                            <div className={nowMenuSaveIndex === saveList.length ? "Menu_Save_ExitButton_focus" : "Menu_Save_ExitButton"} onClick={() => this.clickMenuSaveButton(saveList.length)}>退出</div>
                        </div>
                    </div>
                    : null
                }

                {loadFlag ?
                    <div className="Menu_Save">
                        <div className="Menu_Save_title">读取</div>
                        <div className="Menu_Save_Button_List" id="Menu_Save_Button_List">
                            {loadList.map((save, index) => {
                                return (
                                    <div className={nowMenuLoadIndex === index ? "Menu_Save_Button_focus" : "Menu_Save_Button"} onClick={() => this.clickMenuLoadButton(index)}>
                                        <div className="Menu_Save_Button_Title">{"存档" + save}</div>
                                        {saveDataList[index] ?
                                            <Fragment>
                                                <div className="Menu_Save_Button_level">{"lv." + saveDataList[index].level}</div>
                                                <img className="Menu_Save_Button_img" />
                                                <div className="Menu_Save_Button_floorNum">{"第" + saveDataList[index].nowMapNum + "层"}</div>
                                                <div className="Menu_Save_Button_Time">{"时间：" + saveDataList[index].nowGameTime}</div>
                                            </Fragment>
                                            : <div className="Menu_Save_Button_Time">{"尚未保存"}</div>}
                                    </div>
                                )
                            })}
                            <div className={nowMenuLoadIndex === loadList.length ? "Menu_Save_ExitButton_focus" : "Menu_Save_ExitButton"} onClick={() => this.clickMenuLoadButton(loadList.length)}>退出</div>
                        </div>
                    </div>
                    : null
                }
            </Fragment>
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (this.state.spaceFlag)
            return;
        if (this.state.saveFlag) {
            switch (keyCode) {
                case 38:       //方向键上
                    this.changeMenuSaveButton(-1);
                    break;
                case 40:       //方向键下
                    this.changeMenuSaveButton(1);
                    break;
                case 13:        //enter
                    this.clickMenuSaveButton(this.state.nowMenuSaveIndex);
                    break;
                default:
                    break;
            }
            return;
        }
        if (this.state.loadFlag) {
            switch (keyCode) {
                case 38:       //方向键上
                    this.changeMenuLoadButton(-1);
                    break;
                case 40:       //方向键下
                    this.changeMenuLoadButton(1);
                    break;
                case 13:        //enter
                    this.clickMenuLoadButton(this.state.nowMenuLoadIndex);
                    break;
                default:
                    break;
            }
            return;
        }
        if (!this.props.menuFlag)
            return;
        switch (keyCode) {
            case 38:       //方向键上
                this.changeMenuButton(-1);
                break;
            case 40:       //方向键下
                this.changeMenuButton(1);
                break;
            case 13:        //enter
                this.clickMenuButton(this.state.nowMenuButtonIndex);
                break;
            default:
                break;
        }
    }

    changeMenuButton = (num) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        let nowMenuButtonIndex = this.state.nowMenuButtonIndex;
        let nowMenuButtonListLength = this.state.menuButtonList.length;
        let nextNum = nowMenuButtonIndex + num;
        if (nextNum >= 0 && nextNum <= nowMenuButtonListLength - 1) {
            this.setState({ nowMenuButtonIndex: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowMenuButtonIndex: nowMenuButtonListLength - 1 })
        }
        else {
            this.setState({ nowMenuButtonIndex: 0 })
        }
    }

    clickMenuButton = (nowMenuButtonIndex) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        let menuButtonList = this.state.menuButtonList;
        let nowMenuButton = menuButtonList[nowMenuButtonIndex];
        switch (nowMenuButton.text) {
            case "保存":
                this.Save();
                break;
            case "载入":
                this.Load();
                break;
            case "返回":
                this.Return();
                break;
            case "退出":
                this.Exit();
                break;
            default:
                break;
        }
    }

    addTime = (time) => {
        return time > 10 ? time : '0' + time;
    }

    /** 菜单按钮功能函数 **/
    /* 保存相关功能 */
    Save = () => {
        this.setState({ saveFlag: true });
        window.electron ? window.electron.ipcRenderer.send("getAllSaveData") : null;
    }
    SaveDataToLocal = (index) => {
        let plugin = document.getElementById("mtYS");
        let posId = plugin.attributes["index"].nodeValue * 1;
        let allState = this.props.allState;
        let data = {
            nowGameTime: this.state.nowGameTime,

            nowMapNum: allState.nowMapNum,
            posId: posId,

            level: allState.level,
            life: allState.life,
            gong: allState.gong,
            fang: allState.fang,
            baojilv: allState.baojilv,
            baojishanghai: allState.baojishanghai,
            YKey: allState.YKey,
            BKey: allState.BKey,
            RKey: allState.RKey,
            levelNum: allState.levelNum,
            nextLevelNum: allState.nextLevelNum,
            nextLevelAllNum: allState.nextLevelAllNum,
            gold: allState.gold,
            mapList: allState.mapList,
        }
        let jsonData = JSON.stringify(data);
        let jsonData2 = JSON.stringify(data, null, "\t");
        // let index = 1;
        let filename = "save" + index;
        let fileData = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

        window.electron.ipcRenderer.send("Save", filename, jsonData2);
    }
    changeMenuSaveButton = (num) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        let nowMenuSaveIndex = this.state.nowMenuSaveIndex;
        let nowSaveListLength = this.state.saveList.length;
        let nextNum = nowMenuSaveIndex + num;
        if (nextNum >= 0 && nextNum <= nowSaveListLength) {    //因为退出键不隶属于列表之内，所以总长度需加一
            this.setState({ nowMenuSaveIndex: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowMenuSaveIndex: nowSaveListLength })
        }
        else {
            this.setState({ nowMenuSaveIndex: 0 })
        }
    }
    clickMenuSaveButton = (nowMenuSaveIndex) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        let saveListLength = this.state.saveList.length;
        if (nowMenuSaveIndex < saveListLength) {
            this.SaveDataToLocal(nowMenuSaveIndex);
        }
        else {
            this.setState({
                saveFlag: false,
                nowMenuSaveIndex: 0
            })
        }
    }
    /* */

    /* 读取 */
    Load = () => {
        this.setState({ loadFlag: true });
        window.electron.ipcRenderer.send("getAllSaveData");
    }
    LoadDataToLocal = (index) => {
        let loadData = this.state.saveDataList[index];
        console.log("loadData", loadData);
        this.setState({
            loadFlag: false,
            nowGameTime: loadData.nowGameTime,
        })
        this.props.closeMenu();
        this.props.setAllState(loadData);
        // this.palyVoice('voice/save.mp4');
        // this.props.setTip_split("读取成功！");
    }

    changeMenuLoadButton = (num) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        let nowMenuLoadIndex = this.state.nowMenuLoadIndex;
        let nowLoadListLength = this.state.loadList.length;
        let nextNum = nowMenuLoadIndex + num;
        if (nextNum >= 0 && nextNum <= nowLoadListLength) {    //因为退出键不隶属于列表之内，所以总长度需加一
            this.setState({ nowMenuLoadIndex: nextNum });
        }
        else if (nextNum < 0) {
            this.setState({ nowMenuLoadIndex: nowLoadListLength });
        }
        else {
            this.setState({ nowMenuLoadIndex: 0 });
        }
    }
    clickMenuLoadButton = (nowMenuLoadIndex) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        let loadListLength = this.state.loadList.length;
        if (nowMenuLoadIndex < loadListLength) {
            this.LoadDataToLocal(nowMenuLoadIndex);
        }
        else {
            this.setState({
                loadFlag: false,
                nowMenuLoadIndex: 0
            })
        }
    }
    /* */

    Return = () => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/取消.mp3');
        this.props.closeMenu();
        this.setState({
            nowMenuButtonIndex: 0,
        })
    }

    Exit = () => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/取消.mp3');
        this.props.closeMenu();
        this.setState({
            nowMenuButtonIndex: 0,
        })
    }
    /*  */

    /* 播放音效 */
    palyVoice = (url) => {      //(未测试)效果存疑，之后加入音效再行测试
        const myAudio = new Audio()
        myAudio.preload = true; //
        // myAudio.controls = true;
        myAudio.loop = false;
        myAudio.src = url;
        // 播完时候播放下一首
        // myAudio.addEventListener('ended', this.ChangeMusic.bind(this, myAudio), false);
        myAudio.play();
    }
    /*  */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Menu);