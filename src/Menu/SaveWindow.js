/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'

class SaveWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveDataList: [],
            saveList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            nowMenuSaveIndex: 0,
            nowGameTime: '00:00:00',
        }
    }

    componentDidMount = () => {
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
            time = _this.addTime(hour) + ":" + _this.addTime(minute) + ":" + _this.addTime(second);
            _this.setState({ nowGameTime: time });
        }, 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { saveDataList, saveList, nowMenuSaveIndex } = this.state;
        const { saveFlag, } = this.props;
        return (
            saveFlag ? <div className="Menu_Save">
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
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (this.props.saveFlag) {
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
        // let jsonData = JSON.stringify(data);
        let jsonData2 = JSON.stringify(data, null, "\n");
        let filename = "save" + index;
        // let fileData = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

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
            this.props.closeSave();
            this.setState({
                nowMenuSaveIndex: 0
            })
        }
    }

    addTime = (time) => {
        return time > 10 ? time : '0' + time;
    }

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
export default connect(mapState, mapProps)(SaveWindow);