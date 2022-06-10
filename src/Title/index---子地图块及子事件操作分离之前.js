import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
// import '../Monster/style.css'
import axios from 'axios'
// import style from './style.css'
// import Menu from "../Menu"
// import Shop from "../Shop"
// import Monster from "../Monster"
// import StoryWord from '../StoryWord'
import CreateMap from "../CreateMap"
import MainWindow from "./MainWindow"

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startFlag: false,
            explainFlag: false,
            createMapFlag: false,
        }

    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyOn);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        return (
            <Fragment>
                {this.state.startFlag ?
                    <MainWindow />
                    :
                    <div className="MainTitleWindow">
                        {/* <div className="MainTitleWindow_title">魔塔</div> */}
                        <div className="MainTitleWindow_title">测试</div>
                        <div className="MainTitleWindow_Menu">
                            {/* <div className="MainTitleWindow_Menu_start" onClick={() => this.startGame()}>开始游戏</div> */}
                            <div className="MainTitleWindow_Menu_start" onClick={() => this.startGame()}>测试开始</div>
                            {/* <div className="MainTitleWindow_Menu_explain" onClick={() => this.openExplain()}>游戏说明</div> */}
                            <div className="MainTitleWindow_Menu_start" onClick={() => this.openCreateMap()}>创建地图</div>
                        </div>
                    </div>}
                {this.state.explainFlag ?
                    <div className="MainExplainWindow">
                        <div className="MainExplainWindow_title">操作说明</div>
                        <div className="MainExplainWindow_Content">
                            ↑↓←→控制人物（勇者）移动，在魔塔中获取不断变强，打倒怪物，登上塔顶，实现愿望。
                        </div>
                        <div className="MainExplainWindow_Buttons">
                            <div className="MainExplainWindow_Button_Close" onClick={() => this.closeExplain()}>关闭</div>
                        </div>
                    </div>
                    : null}
                <CreateMap createMapFlag={this.state.createMapFlag} closeCreateMap={this.closeCreateMap} />
            </Fragment>
        )
    }
    startGame = () => {
        this.setState({ startFlag: true });
    }
    
    openCreateMap = () => {
        this.setState({ createMapFlag: true });
    }
    closeCreateMap = () => {
        this.setState({ createMapFlag: false });
    }
    openExplain = () => {
        this.setState({ explainFlag: true })
    }
    closeExplain = () => {
        this.setState({ explainFlag: false })
    }
   
    /* 控制所有键盘事件的主函数 */
    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (window.electron) {
            // eslint-disable-next-line no-unused-expressions
            // window.electron ? window.electron.ipcRenderer.send("f12") : null;
            switch (keyCode) {
                case 116:
                    window.electron.ipcRenderer.send("f5"); //应用刷新
                    break;
                case 122:
                    window.electron.ipcRenderer.send("f11");//应用放大或全屏
                    break;
                case 123:
                    window.electron.ipcRenderer.send("f12");//应用打开调试工具
                    break;
                default:
                    break;
            }
        }
    }
    /* */
    
    
    
    /********  各类子组件  ********/
    /*1，商店 */
    shopComponentOnRef = (ref) => {
        this.shopComponent = ref;
    }
    /*2，怪物 */
    monsterComponentOnRef = (ref) => {
        this.monsterComponent = ref;
    }
    /*3，剧情对话框 */
    storyWordComponentOnRef = (ref) => {
        this.storyWordComponent = ref;
    }
    /*4，菜单 */
    menuComponentOnRef = (ref) => {
        this.menuComponent = ref;
    }
    /********    ********/
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(Title);