/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import Menu from "../Menu"
import Ability from "../Ability"
import BaseMap from "../MainMap/BaseMap"
import Shop from "../MainMap/Shop"
import Monster from "../MainMap/Monster"
import StoryWord from '../MainMap/StoryWord'
import ItemMap from '../MainMap/Item'

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
            createStoryFlag: false,

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
        const { menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag, itemMapPreloadFlag, firstStoryFlag } = this.state;
        if ((!menuPreloadFlag || !storyPreloadFlag || !baseMapPreloadFlag || !shopPreloadFlag || !monsterPreloadFlag || !itemMapPreloadFlag) && !firstStoryFlag) {
            this.setState({ firstStoryFlag: true });
        }
        else if (menuPreloadFlag && storyPreloadFlag && baseMapPreloadFlag && shopPreloadFlag && monsterPreloadFlag && itemMapPreloadFlag && firstStoryFlag) {
            this.setState({ firstStoryFlag: false });
        }
        // console.log("menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag,", menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { createMapFlag, createStoryFlag, menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag,
            monsterPreloadFlag, itemMapPreloadFlag, firstStoryFlag, abilityFlag } = this.state;
        return (
            <Fragment>
                {/* {!createMapFlag ? */}
                <Fragment>
                    {this.state.startFlag ?
                        <MainWindow setStory={this.setStory} setMapList={this.setMapList} setNowMeetMap={this.setNowMeetMap} changeShopType={this.changeShopType} mainWindowComponentOnRef={this.mainWindowComponentOnRef}
                            menuComponent={this.menuComponent} storyWordComponent={this.storyWordComponent} baseMapComponent={this.baseMapComponent}
                            shopComponent={this.shopComponent} monsterComponent={this.monsterComponent} abilityComponent={this.abilityComponent}
                            itemMapComponent={this.itemMapComponent} />
                        :
                        <div className="MainTitleWindow">
                            {/* <div className="MainTitleWindow_title">魔塔</div> */}
                            <div className="MainTitleWindow_title">测试</div>
                            <div className="MainTitleWindow_Menu">
                                {/* <div className="MainTitleWindow_Menu_start" onClick={() => this.startGame()}>开始游戏</div> */}
                                <div className="MainTitleWindow_Menu_start" onClick={() => this.startGame()}>测试开始</div>
                                {/* <div className="MainTitleWindow_Menu_explain" onClick={() => this.openExplain()}>游戏说明</div> */}
                                <div className="MainTitleWindow_Menu_start" onClick={() => this.openCreateMap()}>创建地图</div>
                                <div className="MainTitleWindow_Menu_start" onClick={() => this.openCreateStory()}>创建故事</div>
                            </div>
                        </div>
                    }
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
                    <Ability abilityFlag={abilityFlag} openAbility={this.openAbility} closeAbility={this.closeAbility} allState={this.mainWindowComponent ? this.mainWindowComponent.state : {}} setAllState={this.setAllState} abilityComponentOnRef={this.abilityComponentOnRef} setTip={this.setTip} setTip_split={this.setTip_split}
                        mainWindowKeyOn={this.mainWindowComponent ? this.mainWindowComponent.keyOn : undefined} moveToFloor={this.mainWindowComponent ? this.mainWindowComponent.moveToFloor : undefined} />
                    <StoryWord firstStoryFlag={firstStoryFlag} storyWordFlag={this.state.storyWordFlag} nowStoryId={this.state.nowStoryId} setStory={this.setStory} closeStory={this.closeStory} setYSPos={this.setYSPos} storyWordComponentOnRef={this.storyWordComponentOnRef}
                        nowMeetMap={this.state.nowMeetMap} remove={this.remove} setMapList={this.setMapList} move={this.move} returnTypeImg={this.returnTypeImg} storyPreloadFlag={storyPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                    <BaseMap baseMapComponentOnRef={this.baseMapComponentOnRef} baseMapPreloadFlag={baseMapPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                    <Shop shopComponentOnRef={this.shopComponentOnRef} shopFlag={this.state.shopFlag} shopType={this.state.shopType} selectGoods={this.selectGoods} exitShop={this.exitShop} setTip={this.setTip} shopPreloadFlag={shopPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                    <Monster monsterComponentOnRef={this.monsterComponentOnRef} monsterPreloadFlag={monsterPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                    <ItemMap itemMapComponentOnRef={this.itemMapComponentOnRef} itemMapPreloadFlag={itemMapPreloadFlag} setPreloadFlag={this.setPreloadFlag} palyVoice={this.palyVoice} setStateForGetAndSpend={this.setStateForGetAndSpend}/>
                </Fragment>
                {/* :
                    <CreateMap createMapFlag={this.state.createMapFlag} closeCreateMap={this.closeCreateMap} />} */}
            </Fragment>
        )
    }
    startGame = () => {
        this.setState({ startFlag: true });
        // this.setStory(true, "0_00_start");
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
        this.props.history.push("/CreateMap");
        this.setState({ createMapFlag: true });
    }
    openCreateStory = () => {
        this.props.history.push("/CreateStory");
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
        let plugin = document.createElement('div');
        plugin.className = "mtYS";
        plugin.id = "mtYS";
        plugin.innerHTML = `<div class="mtYS_Img" style="background-image:URL(img/ys.png)"></div>`;
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
    setStateForGetAndSpend=(data)=>{
        this.mainWindowComponent.setStateForGetAndSpend(data);
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
    /* 处理有关能力的函数 */
    openAbility = () => {
        this.setState({ abilityFlag: true })
    }
    closeAbility = () => {
        this.setState({ abilityFlag: false })
    }
    /* */
    /* 操作商店的主要函数 */
    selectGoods = (spend, get) => {
        this.mainWindowComponent.selectGoods(spend, get);
    }
    changeShopType = (doc, lx) => {
        this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
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
        this.mainWindowComponent.move(doc1);
    }
    remove = (doc) => {
        this.mainWindowComponent.remove(doc);
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
        // if (window.electron) {
        //     switch (keyCode) {
        //         case 116:
        //             window.electron.ipcRenderer.send("f5"); //应用刷新
        //             break;
        //         case 122:
        //             window.electron.ipcRenderer.send("f11");//应用放大或全屏
        //             break;
        //         case 123:
        //             window.electron.ipcRenderer.send("f12");//应用打开调试工具
        //             break;
        //         default:
        //             break;
        //     }
        // }
        if (this.state.menuFlag)
            return;
        if (this.state.abilityFlag)
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
    /*7，所有能力 */
    abilityComponentOnRef = (ref) => {
        this.abilityComponent = ref;
    }
    /*8，道具地图 */
    itemMapComponentOnRef = (ref) => {
        this.itemMapComponent = ref;
    }
    /********    ********/

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
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(Title);