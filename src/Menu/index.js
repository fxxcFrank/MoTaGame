/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'
import SaveWindow from './SaveWindow'
import LoadWindow from './LoadWindow'
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

            saveFlag: false,
            loadFlag: false,

            spaceFlag: false, //控制键盘事件的占位
        }
        this.props.menuComponentOnRef ? this.props.menuComponentOnRef(this) : null;
        this.props.setPreloadFlag("menuPreloadFlag", true);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { menuButtonList, nowMenuButtonIndex, saveFlag, loadFlag, } = this.state;
        const { allState, closeMenu, setAllState } = this.props;
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
                <SaveWindow saveFlag={saveFlag} closeSave={this.closeSave} allState={allState} />
                <LoadWindow loadFlag={loadFlag} closeLoad={this.closeLoad} allState={allState} closeMenu={closeMenu} setAllState={setAllState} />
            </Fragment>
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        console.log("Menu", e);
        // debugger
        if (this.state.spaceFlag)
            return;
        if (this.props.menuFlag && !this.state.saveFlag && !this.state.loadFlag) {
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
                case 81:        //关闭菜单 键位q
                    this.props.closeMenu();
                    break;
                default:
                    break;
            }
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

    /** 菜单按钮功能函数 **/
    /* 保存相关功能 */
    Save = () => {
        this.setState({ saveFlag: true });
        window.electron ? window.electron.ipcRenderer.send("getAllSaveData") : null;
    }
    closeSave = () => {
        this.setState({ saveFlag: false });
    }
    /* */

    /* 读取 */
    Load = () => {
        this.setState({ loadFlag: true });
        window.electron ? window.electron.ipcRenderer.send("getAllSaveData") : null;
    }
    closeLoad = () => {
        this.setState({ loadFlag: false });
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