/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class MainWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startFlag: false,
            firstFlag: true,
            explainFlag: false,
            mapList: [{ "name": 1, "map": [], "width": 0 }],
            nowMapNum: 0,
            nowMeetMap: {},

            level: 1,
            life: 1000,
            gong: 3,
            fang: 3,
            baojilv: 5,
            baojishanghai: 50,
            YKey: 3,
            BKey: 3,
            RKey: 3,
            levelNum: 0,
            nextLevelNum: 10,
            nextLevelAllNum: 10,
            gold: 150,
            nowM: {},
            nowShop: {},
            nowShopGoodsNum: 0,
            nowShopGoodsLength: 0,

            baseMapPreloadFlag: false,
            monsterPreloadFlag: false,

            shopPreloadFlag: false,
            shopFlag: false,
            shop1Flag: false,
            shop2Flag: false,
            shopType: "",
            exitShowFlag: false,

            menuPreloadFlag: false,
            menuFlag: false,
            createMapFlag: false,

            storyPreloadFlag: false,
            storyWordFlag: false,
            nowStoryId: -1,
            tipWord: "",

            tipFlag: false,
            fightFlag: false,
            fightStatusShowFlag: false,
            fightTipWord: "",
            fightTipFlag: false,
            finish: false,
            victory: false,
        }
        this.props.mainWindowComponentOnRef ? this.props.mainWindowComponentOnRef(this) : null;
        axios.get('data/map.json')
            .then((res) => {
                const result = res.data;
                console.log('res', result);
                this.setState({ mapList: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const { nowMapNum, mapList, nowM, } = this.state;
        let nowMap = mapList[nowMapNum].map;
        let width = mapList[nowMapNum].width;
        let num = width;
        return (
            <Fragment>
                <div className="MainAll" id="MainAll">
                    <div className="Status">
                        <div className="Status_title">状态栏</div>
                        <div className="Status_num">勇者</div>
                        <div className="Status_num">等级：{this.state.level}</div>
                        <div className="Status_num">生命值：{this.state.life}</div>
                        <div className="Status_num">攻击力：{this.state.gong}</div>
                        <div className="Status_num">防御力：{this.state.fang}</div>
                        <div className="Status_num">暴击率：{this.state.baojilv}%</div>
                        <div className="Status_num">暴击伤害：{this.state.baojishanghai}%</div>
                        <div className="Status_num">黄钥匙：{this.state.YKey}</div>
                        <div className="Status_num">蓝钥匙：{this.state.BKey}</div>
                        <div className="Status_num">红钥匙：{this.state.RKey}</div>
                        <div className="Status_num">金币：{this.state.gold}</div>
                        <div className="Status_num">经验值：{this.state.levelNum}/{this.state.nextLevelAllNum}</div>
                        <div className="Status_num">还需{this.state.nextLevelNum}经验值升级</div>
                        <div className="Status_floorNum">第{nowMapNum}层</div>
                    </div>
                    {this.state.fightTipFlag ?
                        <div className="fightTipText_main" id="fightTip">
                            <div className="fightTipText_Hide1" />
                            <div className="fightTipText_Hide2" />
                            <div className="fightTipText_text">{this.state.fightTipWord}</div>
                        </div>
                        : null}
                    {this.state.fightStatusShowFlag ?
                        <div className="Status_fight_main">
                            <div className="Status_fight_main_left">
                                <div className={"NormalMap_Monster_" + 0 + "_" + 0} style={{ backgroundImage: "URL(" + 'img/ys.png' + ")", width: "15vw", height: "30vh" }} />
                                <div className="Status_fight_main_left_mc">
                                    <div className="Status_fight_main_left_mcText">勇者</div>
                                    <div className="Status_fight_main_left_num">
                                        <div className="Status_fight_main_left_num_fight">生命值：{this.state.life}</div>
                                        <div className="Status_fight_main_left_num_fight">攻击力：{this.state.gong}</div>
                                        <div className="Status_fight_main_left_num_fight">防御力：{this.state.fang}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="Status_fight_main_middle">VS</div>
                            <div className="Status_fight_main_right">
                                <div className="Status_fight_main_right_mc">
                                    <div className="Status_fight_main_right_mcText">{nowM.mc}</div>
                                    <div className="Status_fight_main_right_num">
                                        <div className="Status_fight_main_right_num_fight">生命值：{nowM.life}</div>
                                        <div className="Status_fight_main_right_num_fight">攻击力：{nowM.gong}</div>
                                        <div className="Status_fight_main_right_num_fight">防御力：{nowM.fang}</div>
                                    </div>
                                </div>
                                <div className={"NormalMap_Monster_" + nowM.imgMode + "_" + nowM.imgPos} style={{ backgroundImage: "URL(" + nowM.imgUrl + ")", width: "15vw", height: "30vh" }} />
                            </div>
                        </div>
                        : null}
                    <div className="MainMap">
                        <div className="NowMap" onKeyUp={(e) => this.keyOn(e)}>
                            {nowMap.map((map, index) => {
                                if (index + 1 == num) {
                                    num += width;
                                    return (
                                        <div className="MapColumn" key={nowMapNum + "行" + Math.floor(num / width)}>
                                            {nowMap.map((map2, index2) => {
                                                if (index2 >= index + 1 - width && index2 <= index) {
                                                    return this.returnMap(map2, index2);
                                                }
                                            })}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    {this.state.finish ? <div className="game_over">勇者被打倒了！</div> : null}
                    {this.state.victory ? <div className="victory" lx="Congratulations Victory!">恭喜通关！</div> : null}
                </div>
            </Fragment>
        )
    }

    /* 返回地图块的主函数 */
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;
        /* 返回怪物 */
        if (map.includes("Monster")) {
            return this.props.monsterComponent.returnMonsterMap(map, index, nowMapNum);
        }
        /* 返回商店 */
        else if (map.includes("Shop")) {
            return this.props.shopComponent.returnShopMap(map, index, nowMapNum);
        }
        /* 返回剧情块 */
        else if (map.includes("Story")) {
            return this.props.storyWordComponent.returnStoryMap(map, index, nowMapNum);
        }
        else {
            return this.props.baseMapComponent.returnBaseMap(map, index, nowMapNum);
        }
    }

    /* 控制所有键盘事件的主函数 */
    keyOn = (e) => {
        let keyCode = e.keyCode;
        switch (keyCode) {
            case 38:       //上
                this.up();
                break;
            case 40:       //下
                this.down();
                break;
            case 37:       //左
                this.left();
                break;
            case 39:       //右
                this.right();
                break;
            default:
                break;
        }
    }
    /* 处理有关勇者移动的函数 */
    up = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_up";
        let id = plugin.attributes["index"].nodeValue * 1 - this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    down = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_down";
        let id = plugin.attributes["index"].nodeValue * 1 + this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    left = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_left";
        let id = plugin.attributes["index"].nodeValue * 1 - 1;
        this.handleMove(id);
    }
    right = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_right";
        let id = plugin.attributes["index"].nodeValue * 1 + 1;
        this.handleMove(id);
    }

    handleMove(id) {
        let list = document.getElementsByTagName("div");
        let doc;
        for (let i = 0; i < list.length; i++) {
            let div = list[i];
            if (!div.attributes["index"])
                continue;
            if (id == div.attributes["index"].nodeValue * 1) {
                doc = div;
                break;
            }
        }
        this.whenMeet(doc);
    }

    move = (doc1) => {
        let plugin = document.getElementById("mtYS");
        let list = document.getElementsByTagName("div");
        let id = doc1.attributes["index"].nodeValue;    //因为采用了复合图层的原因，会导致部分dom刷新后doc的指向不明确，导致无法正常添加div，所以采用这种麻烦的方式，应该对效率有所影响，但目前看来不大。
        let doc;
        for (let i = 0; i < list.length; i++) {
            let div = list[i];
            if (!div.attributes["index"])
                continue;
            if (id == div.attributes["index"].nodeValue * 1) {
                doc = div;
                break;
            }
        }
        doc.appendChild(plugin);        //因为对dom不是很了解，所以……这个appendchild执行的不只是加入子节点，还把子节点从原先绑定的位置上remove掉了？
        plugin.attributes["index"].nodeValue = id;
    }
    remove = (doc) => {
        let nowMapNum = this.state.nowMapNum;
        let mapList = [...this.state.mapList];
        let nowMap = [...this.state.mapList[nowMapNum].map];
        let id = doc.attributes["index"].nodeValue;
        doc.attributes["lx"].nodeValue = "no";
        nowMap[id] = "no";
        mapList[nowMapNum].map = nowMap;
        this.setState({ mapList: mapList });
    }
    /* */
    /* 处理战斗事件的主函数 */
    fight = (doc) => {
        /* 勇者状态————生命、攻击、防御、暴击率、暴击伤害、等级、当前经验值、到下级所需经验值、本等级到下一等级总所需经验值、金币 */
        let ysLife = this.state.life;
        let ysGong = this.state.gong;
        let ysFang = this.state.fang;
        let bjl = this.state.baojilv / 100;
        let bjsh = this.state.baojishanghai / 100;
        let ysLevel = this.state.level;
        let ysLevelNum = this.state.levelNum;
        let ysNextLevelNum = this.state.nextLevelNum;
        let ysNextLevelAllNum = this.state.nextLevelAllNum;
        let ysGold = this.state.gold;
        /* 怪物状态————生命、攻击、防御、打败后给予经验值、打败后给予金币 */
        let mLife = parseInt(doc.attributes["life"].nodeValue);
        let mGong = parseInt(doc.attributes["gong"].nodeValue);
        let mFnag = parseInt(doc.attributes["fang"].nodeValue);
        let mLevelNum = parseInt(doc.attributes["levelNum"].nodeValue);
        let mGold = parseInt(doc.attributes["gold"].nodeValue);
        let mImgMode = doc.attributes["imgMode"].nodeValue;
        let mImgPos = doc.attributes["imgPos"].nodeValue;
        let mImgUrl = doc.attributes["imgUrl"].nodeValue;
        /* 战斗处理 */
        let mc = doc.innerText;
        this.setState({ nowM: { life: mLife, gong: mGong, fang: mFnag, mc: mc, imgMode: mImgMode, imgPos: mImgPos, imgUrl: mImgUrl } });
        this.setState({ fightFlag: true, fightStatusShowFlag: true });
        let flag = true;
        this.fightTimer = setInterval(() => {
            if (ysLife <= 0 || mLife <= 0) {
                clearInterval(this.fightTimer);
                if (ysLife <= 0) {
                    this.setState({ finish: true });
                }
                else {
                    this.setState({ fightTipFlag: true, fightTipWord: "战斗胜利！", fightStatusShowFlag: false });
                    this.remove(doc);
                    this.move(doc);
                    if (ysLevelNum + mLevelNum >= ysNextLevelAllNum) {
                        ysLevel += 1;
                        ysLevelNum = ysLevelNum + mLevelNum - ysNextLevelAllNum;
                        ysNextLevelAllNum = ysLevel * 121;  //等级与下一等级之间的跨度差值在此定义
                        ysNextLevelNum = ysNextLevelAllNum - ysLevelNum;
                        ysLife += ysLevel * 500;
                        ysGong += ysLevel * 10;
                        ysFang += ysLevel * 10;
                        bjl = bjl * 100 + 0.5;
                        bjsh = bjsh * 100 + 1;
                        this.setState({
                            level: ysLevel,
                            levelNum: ysLevelNum,
                            nextLevelNum: ysNextLevelNum,
                            nextLevelAllNum: ysNextLevelAllNum,
                            gold: ysGold + mGold,
                            life: ysLife,
                            gong: ysGong,
                            fang: ysFang,
                            baojilv: bjl,
                            baojishanghai: bjsh,
                        })
                    }
                    else {
                        ysLevelNum = ysLevelNum + mLevelNum;
                        ysNextLevelNum = ysNextLevelAllNum - ysLevelNum;
                        this.setState({
                            level: ysLevel,
                            levelNum: ysLevelNum,
                            nextLevelNum: ysNextLevelNum,
                            nextLevelAllNum: ysNextLevelAllNum,
                            gold: ysGold + mGold,
                            life: ysLife,
                        })
                    }
                    setTimeout(() => {
                        this.setState({
                            fightTipFlag: false,
                            fightFlag: false,
                        });
                    }, 501);
                }
            }
            else if (flag) {
                if (ysGong > mFnag) {
                    let sh = (ysGong - mFnag);
                    let a = Math.random();
                    sh = a < bjl ? sh = Math.ceil(sh * (1 + bjsh)) : sh;
                    mLife = mLife - sh;
                }
                else
                    mLife = mLife - 1;
                flag = false;
                if (mLife < 0)
                    mLife = 0
            }
            else {
                if (mGong > ysFang)
                    ysLife = ysLife - (mGong - ysFang);
                else
                    ysLife = ysLife - 1;
                flag = true;
                if (ysLife < 0)
                    ysLife = 0;
            }
            this.setState({ life: ysLife });
            this.setState({ nowM: { life: mLife, gong: mGong, fang: mFnag, mc: mc, imgMode: mImgMode, imgPos: mImgPos, imgUrl: mImgUrl } });
        }, 300);
    }
    /* */
    /* 开门函数 */
    openDoor = (doc) => {
        let lx = doc.attributes["lx"].nodeValue;
        if (lx === "YDoor") {
            let YKey = this.state.YKey;
            if (YKey > 0) {
                YKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ YKey: YKey });
            }
            else {
                this.setTip("您身上没有足够的黄钥匙……");
            }
        }
        else if (lx === "BDoor") {
            let BKey = this.state.BKey;
            if (BKey > 0) {
                BKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ BKey: BKey });
            }
            else {
                this.setTip("您身上没有足够的蓝钥匙……");
            }
        }
        else if (lx === "RDoor") {
            let RKey = this.state.RKey;
            if (RKey > 0) {
                RKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ RKey: RKey });
            }
            else {
                this.setTip("您身上没有足够的红钥匙……");
            }
        }
    }
    /* */
    /* 操作商店的主要函数 */
    selectGoods = (spend, get) => {
        let flag = true;
        for (let i in spend) {
            let have = this.state[i];
            if (have < spend[i]) {
                flag = false;
                let text = this.changeSpendTipText(i);
                this.setTip(text);
                break;
            }
        }
        if (flag) {
            for (let i in spend) {
                let state = {};
                let have = this.state[i];
                have -= spend[i];
                state[i] = have;
                this.setState(state);
            }
            for (let i in get) {
                let state = {};
                let have = this.state[i];
                have += get[i];
                state[i] = have;
                this.setState(state);
            }
        }
    }
    changeSpendTipText = (spendType) => {
        let spendText = spendType;
        switch (spendType) {
            case "gold":
                spendText = "金币";
                break;
            case "levelNum":
                spendText = "经验";
                break;
            default:
                break;
        }
        return "您身上没有足够的" + spendText + "……"
    }
    /* */
    /* 显示商店等事件的普遍提示函数 */
    setTip = (text) => {    //显示效果：从中间向上缓慢移动，然后渐隐消失。可重复叠加
        let root = document.getElementById("MainAll");
        let tempPlugin = document.createElement("div");
        tempPlugin.className = "tipText_main";
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
        tempPlugin.innerHTML =
            `<div class="fightTipText_text">${text}</div>`
        root.appendChild(tempPlugin);
        setTimeout(() => {
            root.removeChild(tempPlugin);
        }, 751);
    }
    /* */
    setMapList = (mapList) => {
        let plugin = document.getElementById("mtYS");
        let id = plugin.attributes["index"].nodeValue;
        this.setState({ mapList: mapList });        //本函数除去这一句之外的其他逻辑，老实说虽然达到了效果，但果然还是很不安，因为逻辑跟react的初衷几乎完全背离了（虽然从操作dom开始就已经是了）。但这个更甚，我甚至把运行代码成功的基础建立在setstate和dom遍历的时间差上，虽然效果达到了，但……之后的确需要进行修改，此处存在很大的问题
        let list = document.getElementsByTagName("div");
        let doc;
        for (let i = 0; i < list.length; i++) {
            let div = list[i];
            if (!div.attributes["index"])
                continue;
            if (id == div.attributes["index"].nodeValue * 1) {
                doc = div;
                break;
            }
        }
        doc.appendChild(plugin);
    }
    createYS = () => {
        let plugin = document.createElement('div');
        plugin.className = "mtYS_Img_down";
        plugin.id = "mtYS";
        plugin.style.backgroundImage = "URL(img/ys.png)";
        return plugin;
    }
    setAllState = (allState) => {
        let data = {
            nowMapNum: allState.nowMapNum,

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
        let id = parseInt(allState.posId);
        let plugin = document.getElementById("mtYS");

        this.setState(data, () => {
            let list = document.getElementsByTagName("div");
            let doc;
            for (let i = 0; i < list.length; i++) {
                let div = list[i];
                if (!div.attributes["index"])
                    continue;
                if (id == div.attributes["index"].nodeValue * 1) {
                    doc = div;
                    break;
                }
            }
            plugin.attributes["index"].nodeValue = id;
            doc.appendChild(plugin);
        });    //已解决


    }
    /* 处理地图之间移动的函数 */
    upMap(doc) {
        let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
        if (nowMapNum > 0) {
            let nowMap = this.state.mapList[nowMapNum - 1].map;
            let id;
            nowMap.map((map, index) => {
                if (map == "end")
                    id = index;
            })
            if (id) {
                this.setState({ nowMapNum: nowMapNum - 1 });
                let plugin = document.getElementById("mtYS");
                let list = document.getElementsByTagName("div");
                let nowDoc;
                for (let i = 0; i < list.length; i++) {
                    let div = list[i];
                    if (!div.attributes["index"])
                        continue;
                    if (id == div.attributes["index"].nodeValue * 1) {
                        nowDoc = div;
                        break;
                    }
                }
                nowDoc.appendChild(plugin);
                plugin.attributes["index"].nodeValue = id;
            }
        }
        else {
            this.move(doc);
        }
    }
    downMap(doc) {
        let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
        let mapNum = this.state.mapList.length;
        if (nowMapNum < mapNum - 1) {
            let nowMap = this.state.mapList[nowMapNum + 1].map;
            let id;
            nowMap.map((map, index) => {
                if (map == "start")
                    id = index;
            })
            if (id) {
                this.setState({ nowMapNum: nowMapNum + 1 });
                let plugin = document.getElementById("mtYS");
                let list = document.getElementsByTagName("div");
                let nowDoc;
                for (let i = 0; i < list.length; i++) {
                    let div = list[i];
                    if (!div.attributes["index"])
                        continue;
                    if (id == div.attributes["index"].nodeValue * 1) {
                        nowDoc = div;
                        break;
                    }
                }
                nowDoc.appendChild(plugin);
                plugin.attributes["index"].nodeValue = id;
            }
        }
        else {
            this.move(doc);
        }
    }
    victory() {
        this.setState({ victory: true })
    }
    /* */

    /* 处理勇者与其他地图块互动的函数 */
    whenMeet = (doc) => {
        if (doc == undefined)
            return;
        this.setState({ nowMeetMap: doc });
        this.props.setNowMeetMap(doc);
        let lx = doc.attributes["lx"].nodeValue;
        /* 与怪物战斗 */
        if (lx.includes("Monster")) {
            this.fight(doc);
            return;
        }
        /* 与商人交易 */
        if (lx.includes("Shop")) {
            this.props.changeShopType(doc, lx);
            return;
        }
        /* 触发剧情 */
        if (lx.includes("Story")) {
            // this.move(doc);
            let storyId = doc.attributes["storyId"].nodeValue;
            this.props.setStory(true, storyId);
            return;
        }

        switch (lx) {
            case "wall":
                break;
            case "no":
                this.move(doc);
                break;
            case "YDoor":
                this.openDoor(doc);
                break;
            case "BDoor":
                this.openDoor(doc);
                break;
            case "RDoor":
                this.openDoor(doc);
                break;
            case "YKey":
                this.setState({ YKey: this.state.YKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "BKey":
                this.setState({ BKey: this.state.BKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "RKey":
                this.setState({ RKey: this.state.RKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "sword":
                this.setState({ gong: this.state.gong + 3 });
                this.remove(doc);
                this.move(doc);
                break;
            case "def":
                this.setState({ fang: this.state.fang + 3 });
                this.remove(doc);
                this.move(doc);
                break;
            case "start":
                this.upMap(doc);
                break;
            case "end":
                this.downMap(doc);
                break;
            case "victory":
                this.victory();
                break;
            default:
                this.move(doc);
                break;
        }
    }
    /* */

}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(MainWindow);