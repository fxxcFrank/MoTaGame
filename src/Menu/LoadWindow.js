/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'

class LoadWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveDataList: [],
            loadList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            nowMenuLoadIndex: 0,
            nowGameTime: '00:00:00',
        }
    }

    componentDidMount = () => {
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('saveData', function (event, saveData) {
            console.log('所有存档-----', saveData);
            _this.setState({ saveDataList: saveData }, () => {
                console.log("LoadWindow-----saveData---this.state", _this.state);
            });
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
        const { loadList, nowMenuLoadIndex, saveDataList, } = this.state;
        const { loadFlag, loadDataFlag } = this.props;
        return (
            loadFlag || loadDataFlag ? <div className="Menu_Save">
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
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (this.props.loadFlag || this.props.loadDataFlag) {
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
    }

    LoadDataToLocal = (index) => {
        console.log("LoadWindow----this.state", this.state);
        const { saveDataList } = this.state;
        let _this = this;
        console.log("LoadWindow----saveDataList", saveDataList);
        let waitTime = 0;
        if (this.props.loadDataFlag) {
            this.props.setGameStart('continue');
            waitTime = 0;             //当从主界面进入时，需要等待MainWindow加载完成，之后不能使用这种固定时间，记得调整逻辑或者完善时间周期回调
        }
        setTimeout(() => {
            let loadData = saveDataList[index];
            console.log("loadData", loadData);
            if (_this.props.colseContinueGame) _this.props.colseContinueGame();
            if (_this.props.closeLoad) _this.props.closeLoad();
            _this.setState({
                nowGameTime: loadData.nowGameTime,
            })
            if (_this.props.closeMenu) _this.props.closeMenu();
            _this.props.setAllState(loadData);
        }, waitTime);
        // this.palyVoice('voice/save.mp4');
        // this.props.setTip_split("读取成功！");
    }

    changeMenuLoadButton = (num) => {
        console.log("changeMenuLoadButton----this.state", this.state);
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
        console.log("clickMenuLoadButton----", this.state);
        let loadListLength = this.state.loadList.length;
        if (nowMenuLoadIndex < loadListLength) {
            this.LoadDataToLocal(nowMenuLoadIndex);
        }
        else {
            if (this.props.colseContinueGame) this.props.colseContinueGame();
            if (this.props.closeLoad) this.props.closeLoad();
            this.setState({
                nowMenuLoadIndex: 0
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
export default connect(mapState, mapProps)(LoadWindow);