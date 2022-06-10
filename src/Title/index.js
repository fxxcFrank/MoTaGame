import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'
// import style from './style.css'
import Menu from "../Menu"
import BaseMap from "../BaseMap"
import Shop from "../Shop"
import Monster from "../Monster"
import StoryWord from '../StoryWord'

import CreateMap from "../CreateMap"
import MainWindow from "./MainWindow"

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowMeetMap: {},
            nowStoryId: -1,

            startFlag: false,
            explainFlag: false,
            createMapFlag: false,

            menuPreloadFlag: false,
            storyPreloadFlag: false,
            baseMapPreloadFlag: false,
            shopPreloadFlag: false,
            monsterPreloadFlag: false,
            firstStoryFlag: false,

            menuFlag: false,
            storyWordFlag: false,
            shopFlag: false,
            shopType: "",
        }

    }

    componentDidMount() {
        document.addEventListener("keydown", this.keyOn);
    }

    componentDidUpdate() {
        const { menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag, firstStoryFlag } = this.state;
        if (menuPreloadFlag && storyPreloadFlag && baseMapPreloadFlag && shopPreloadFlag && monsterPreloadFlag && !firstStoryFlag) {
            // debugger
            this.setState({ firstStoryFlag: true });
        }
        // console.log("menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag,", menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag, firstStoryFlag } = this.state;
        return (
            <Fragment>
                {this.state.startFlag ?
                    <MainWindow setStory={this.setStory} setMapList={this.setMapList} setAllState={this.setAllState} setNowMeetMap={this.setNowMeetMap} changeShopType={this.changeShopType} mainWindowComponentOnRef={this.mainWindowComponentOnRef} menuComponent={this.menuComponent} storyWordComponent={this.storyWordComponent} baseMapComponent={this.baseMapComponent} shopComponent={this.shopComponent} monsterComponent={this.monsterComponent} />
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
                <Menu menuFlag={this.state.menuFlag} closeMenu={this.closeMenu} allState={this.mainWindowComponent ? this.mainWindowComponent.state : {}} setAllState={this.setAllState} menuComponentOnRef={this.menuComponentOnRef} setTip_split={this.setTip_split} menuPreloadFlag={menuPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                <StoryWord firstStoryFlag={firstStoryFlag} storyWordFlag={this.state.storyWordFlag} nowStoryId={this.state.nowStoryId} setStory={this.setStory} closeStory={this.closeStory} setYSPos={this.setYSPos} storyWordComponentOnRef={this.storyWordComponentOnRef} nowMeetMap={this.state.nowMeetMap} remove={this.remove} setMapList={this.setMapList} move={this.move} returnTypeImg={this.returnTypeImg} storyPreloadFlag={storyPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                <BaseMap baseMapComponentOnRef={this.baseMapComponentOnRef} baseMapPreloadFlag={baseMapPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                <Shop shopComponentOnRef={this.shopComponentOnRef} shopFlag={this.state.shopFlag} shopType={this.state.shopType} selectGoods={this.selectGoods} exitShop={this.exitShop} setTip={this.setTip} shopPreloadFlag={shopPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                <Monster monsterComponentOnRef={this.monsterComponentOnRef} monsterPreloadFlag={monsterPreloadFlag} setPreloadFlag={this.setPreloadFlag} />

                <CreateMap createMapFlag={this.state.createMapFlag} closeCreateMap={this.closeCreateMap} />
            </Fragment>
        )
    }
    startGame = () => {
        this.setState({ startFlag: true });
        this.setStory(true, "0_00_start");
    }

    setPreloadFlag = (name, value) => {
        if (name && value) {
            let data = {};
            data[name] = value;
            this.setState(data);
        }
    }
    setNowMeetMap = (doc) => {
        this.setState({ nowMeetMap: doc });
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

    setPreloadFlag = (name, value) => {
        if (name && value) {
            let data = {};
            data[name] = value;
            this.setState(data);
        }
    }
    setStory = (flag, storyId) => {
        this.setState({ storyWordFlag: flag, nowStoryId: storyId });
    }
    setYSPos = () => {
        let plugin = document.getElementById("mtYS");
        let list = document.getElementById("start");
        let id = list.attributes["index"].nodeValue;
        let width = this.state.mapList[this.state.nowMapNum].width;
        let height = this.state.mapList[this.state.nowMapNum].map.length / width;
        plugin.style.left = id % width * (100 / width) + "%";
        plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
        plugin.attributes["index"].nodeValue = id;
    }
    createYS = () => {
        let plugin = document.createElement('div');
        plugin.className = "mtYS";
        plugin.id = "mtYS";
        plugin.innerHTML = `<div class="mtYS_Img" style="background-image:URL(img/ys.png)"></div>`;
        return plugin;
    }
    setYSPos_First = () => {
        // debugger
        let plugin = document.createElement('div');
        plugin.className = "mtYS";
        plugin.id = "mtYS";
        plugin.innerHTML = `<div class="mtYS_Img" style="background-image:URL(img/ys.png)"></div>`;
        // let plugin = <div className="mtYS" id="mtYS">
        //     <div className="mtYS_Img" style={{ backgroundImage: "URL(img/ys.png)" }}></div>
        // </div>
        let list = document.getElementById("start");
        console.log("plugin", plugin, list);
        let id = list.attributes["index"].nodeValue;
        list.appendChild(plugin);
        plugin.attributes["index"].nodeValue = id;
        this.setState({ firstFlag: false });
    }
    setMapList = (mapList) => {
        this.mainWindowComponent.setMapList(mapList);
    }
    setAllState = (allState) => {
        this.mainWindowComponent.setAllState(allState);
    }
    openStory = () => {
        this.setState({ storyWordFlag: true })
    }
    closeStory = () => {
        this.setState({ storyWordFlag: false })
    }
    /* 处理有关菜单事件的函数 */
    openMenu = () => {
        this.setState({ menuFlag: true })
    }
    closeMenu = () => {
        this.setState({ menuFlag: false })
    }
    /* */
    /* 操作商店的主要函数 */
    selectGoods = (spend, get) => {
        this.mainWindowComponent.selectGoods(spend, get);
    }
    changeShopType = (doc, lx) => {
        this.setState({
            shopFlag: true,
            shopType: lx,
        })
    }
    /* 显示商店等事件的普遍提示函数 ------之后把它从mainwindow子组件中获取*/
    setTip = (text) => {    //显示效果：从中间向上缓慢移动，然后渐隐消失。可重复叠加
        let root = document.getElementById("MainAll");
        let tempPlugin = document.createElement("div");
        tempPlugin.className = "tipText_main";
        // tempPlugin.id = "tip";
        tempPlugin.innerHTML =
            `<div class="tipText_text">${text}</div>`
        root.appendChild(tempPlugin);
        setTimeout(() => {
            root.removeChild(tempPlugin);
        }, 751);
    }
    setTip_split = (text) => {    //显示效果：从中间向左右两边展开，然后渐隐消失。不可重复叠加
        let root = document.getElementById("MainAll");
        let tempPlugin = document.createElement("div");
        tempPlugin.className = "fightTipText_main";
        // tempPlugin.id = "tip";
        tempPlugin.innerHTML =
            `<div class="fightTipText_text">${text}</div>`
        root.appendChild(tempPlugin);
        setTimeout(() => {
            root.removeChild(tempPlugin);
        }, 751);
    }
    /* */

    move = (doc1) => {
        // debugger
        this.mainWindowComponent.move(doc1);
        // let plugin = document.getElementById("mtYS");
        // let list = document.getElementsByTagName("div");
        // let id = doc1.attributes["index"].nodeValue;    //因为采用了复合图层的原因，会导致部分dom刷新后doc的指向不明确，导致无法正常添加div，所以采用这种麻烦的方式，应该对效率有所影响，但目前看来不大。
        // let doc;
        // for (let i = 0; i < list.length; i++) {
        //     let div = list[i];
        //     if (!div.attributes["index"])
        //         continue;
        //     if (id == div.attributes["index"].nodeValue * 1) {
        //         doc = div;
        //         break;
        //     }
        // }
        // doc.appendChild(plugin);        //因为对dom不是很了解，所以……这个appendchild执行的不只是加入子节点，还把子节点从原先绑定的位置上remove掉了？
        // plugin.attributes["index"].nodeValue = id;
    }
    remove = (doc) => {
        this.mainWindowComponent.remove(doc);
        // let nowMapNum = this.state.nowMapNum;
        // let mapList = [...this.state.mapList];
        // let nowMap = [...this.state.mapList[nowMapNum].map];
        // let id = doc.attributes["index"].nodeValue;
        // doc.attributes["lx"].nodeValue = "no";
        // // doc.innerText = "无";
        // nowMap[id] = "no";
        // mapList[nowMapNum].map = nowMap;
        // this.setState({ mapList: mapList });
    }

    exitShop = () => {
        this.setState({
            shopFlag: false,
        })
    }
    /* */

    /* 控制所有键盘事件的主函数 */
    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (window.electron) {
            // eslint-disable-next-line no-unused-expressions
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
        if (this.state.menuFlag)
            return;
        else if (this.state.storyWordFlag) {
            switch (keyCode) {
                case 13:
                    this.storyWordComponent.nextStoryWord();
                    break;
                default:
                    break;
            }
            return;
        }
        else if (this.state.shopFlag) {
            switch (keyCode) {
                case 38:       //上
                    this.shopComponent.changeShopGoods(-1);
                    break;
                case 40:       //下
                    this.shopComponent.changeShopGoods(1);
                    break;
                case 13:
                    this.shopComponent.getShopGoods();
                    break;
                default:
                    break;
            }
            return;
        }
        else if (this.mainWindowComponent ? this.mainWindowComponent.state.fightFlag : false) {
            return;
        }
        if (keyCode === 81) {         //打开菜单
            this.openMenu();
            return;
        }
        // eslint-disable-next-line no-unused-expressions
        this.mainWindowComponent ? this.mainWindowComponent.keyOn(e) : null;
    }
    /* */



    /********  各类子组件  ********/
    /*1，基础地形 */
    baseMapComponentOnRef = (ref) => {
        this.baseMapComponent = ref;
    }
    /*2，商店 */
    shopComponentOnRef = (ref) => {
        this.shopComponent = ref;
    }
    /*3，怪物 */
    monsterComponentOnRef = (ref) => {
        this.monsterComponent = ref;
    }
    /*4，剧情对话框 */
    storyWordComponentOnRef = (ref) => {
        this.storyWordComponent = ref;
    }
    /*5，菜单 */
    menuComponentOnRef = (ref) => {
        this.menuComponent = ref;
    }
    /*6，主界面 */
    mainWindowComponentOnRef = (ref) => {
        this.mainWindowComponent = ref;
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