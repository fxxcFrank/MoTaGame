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
                        <div className="Status_title">?????????</div>
                        <div className="Status_num">??????</div>
                        <div className="Status_num">?????????{this.state.level}</div>
                        <div className="Status_num">????????????{this.state.life}</div>
                        <div className="Status_num">????????????{this.state.gong}</div>
                        <div className="Status_num">????????????{this.state.fang}</div>
                        <div className="Status_num">????????????{this.state.baojilv}%</div>
                        <div className="Status_num">???????????????{this.state.baojishanghai}%</div>
                        <div className="Status_num">????????????{this.state.YKey}</div>
                        <div className="Status_num">????????????{this.state.BKey}</div>
                        <div className="Status_num">????????????{this.state.RKey}</div>
                        <div className="Status_num">?????????{this.state.gold}</div>
                        <div className="Status_num">????????????{this.state.levelNum}/{this.state.nextLevelAllNum}</div>
                        <div className="Status_num">??????{this.state.nextLevelNum}???????????????</div>
                        <div className="Status_floorNum">???{nowMapNum}???</div>
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
                                    <div className="Status_fight_main_left_mcText">??????</div>
                                    <div className="Status_fight_main_left_num">
                                        <div className="Status_fight_main_left_num_fight">????????????{this.state.life}</div>
                                        <div className="Status_fight_main_left_num_fight">????????????{this.state.gong}</div>
                                        <div className="Status_fight_main_left_num_fight">????????????{this.state.fang}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="Status_fight_main_middle">VS</div>
                            <div className="Status_fight_main_right">
                                <div className="Status_fight_main_right_mc">
                                    <div className="Status_fight_main_right_mcText">{nowM.mc}</div>
                                    <div className="Status_fight_main_right_num">
                                        <div className="Status_fight_main_right_num_fight">????????????{nowM.life}</div>
                                        <div className="Status_fight_main_right_num_fight">????????????{nowM.gong}</div>
                                        <div className="Status_fight_main_right_num_fight">????????????{nowM.fang}</div>
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
                                        <div className="MapColumn" key={nowMapNum + "???" + Math.floor(num / width)}>
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
                    {this.state.finish ? <div className="game_over">?????????????????????</div> : null}
                    {this.state.victory ? <div className="victory" lx="Congratulations Victory!">???????????????</div> : null}
                </div>
            </Fragment>
        )
    }

    /* ??????????????????????????? */
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;
        /* ???????????? */
        if (map.includes("Monster")) {
            return this.props.monsterComponent.returnMonsterMap(map, index, nowMapNum);
        }
        /* ???????????? */
        else if (map.includes("Shop")) {
            return this.props.shopComponent.returnShopMap(map, index, nowMapNum);
        }
        /* ??????????????? */
        else if (map.includes("Story")) {
            return this.props.storyWordComponent.returnStoryMap(map, index, nowMapNum);
        }
        else {
            return this.props.baseMapComponent.returnBaseMap(map, index, nowMapNum);
        }
    }

    /* ???????????????????????????????????? */
    keyOn = (e) => {
        let keyCode = e.keyCode;
        switch (keyCode) {
            case 38:       //???
                this.up();
                break;
            case 40:       //???
                this.down();
                break;
            case 37:       //???
                this.left();
                break;
            case 39:       //???
                this.right();
                break;
            default:
                break;
        }
    }
    /* ????????????????????????????????? */
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
        let id = doc1.attributes["index"].nodeValue;    //??????????????????????????????????????????????????????dom?????????doc?????????????????????????????????????????????div?????????????????????????????????????????????????????????????????????????????????????????????
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
        doc.appendChild(plugin);        //?????????dom????????????????????????????????????appendchild??????????????????????????????????????????????????????????????????????????????remove?????????
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
    /* ?????????????????????????????? */
    fight = (doc) => {
        /* ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? */
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
        /* ??????????????????????????????????????????????????????????????????????????????????????????????????? */
        let mLife = parseInt(doc.attributes["life"].nodeValue);
        let mGong = parseInt(doc.attributes["gong"].nodeValue);
        let mFnag = parseInt(doc.attributes["fang"].nodeValue);
        let mLevelNum = parseInt(doc.attributes["levelNum"].nodeValue);
        let mGold = parseInt(doc.attributes["gold"].nodeValue);
        let mImgMode = doc.attributes["imgMode"].nodeValue;
        let mImgPos = doc.attributes["imgPos"].nodeValue;
        let mImgUrl = doc.attributes["imgUrl"].nodeValue;
        /* ???????????? */
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
                    this.setState({ fightTipFlag: true, fightTipWord: "???????????????", fightStatusShowFlag: false });
                    this.remove(doc);
                    this.move(doc);
                    if (ysLevelNum + mLevelNum >= ysNextLevelAllNum) {
                        ysLevel += 1;
                        ysLevelNum = ysLevelNum + mLevelNum - ysNextLevelAllNum;
                        ysNextLevelAllNum = ysLevel * 121;  //??????????????????????????????????????????????????????
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
    /* ???????????? */
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
                this.setTip("???????????????????????????????????????");
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
                this.setTip("???????????????????????????????????????");
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
                this.setTip("???????????????????????????????????????");
            }
        }
    }
    /* */
    /* ??????????????????????????? */
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
                spendText = "??????";
                break;
            case "levelNum":
                spendText = "??????";
                break;
            default:
                break;
        }
        return "????????????????????????" + spendText + "??????"
    }
    /* */
    /* ?????????????????????????????????????????? */
    setTip = (text) => {    //?????????????????????????????????????????????????????????????????????????????????
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
    setTip_split = (text) => {    //???????????????????????????????????????????????????????????????????????????????????????
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
        this.setState({ mapList: mapList });        //???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????react????????????????????????????????????????????????dom?????????????????????????????????????????????????????????????????????????????????????????????setstate???dom?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
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
        });    //?????????


    }
    /* ????????????????????????????????? */
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

    /* ????????????????????????????????????????????? */
    whenMeet = (doc) => {
        if (doc == undefined)
            return;
        this.setState({ nowMeetMap: doc });
        this.props.setNowMeetMap(doc);
        let lx = doc.attributes["lx"].nodeValue;
        /* ??????????????? */
        if (lx.includes("Monster")) {
            this.fight(doc);
            return;
        }
        /* ??????????????? */
        if (lx.includes("Shop")) {
            this.props.changeShopType(doc, lx);
            return;
        }
        /* ???????????? */
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

    /* ????????????????????????????????? */
    returnTypeImg = (img) => {
        switch (img) {
            case "wall":
                return "img/no.png";
            case "no":
                return "img/no.png";
            case "YDoor":
                return "img/no.png";
            case "BDoor":
                return "img/no.png";
            case "RDoor":
                return "img/no.png";
            case "YKey":
                return "img/no.png";
            case "BKey":
                return "img/no.png";
            case "RKey":
                return "img/no.png";
            case "sword":
                return "img/no.png";
            case "def":
                return "img/no.png";
            case "start":
                return "img/no.png";
            case "end":
                return "img/no.png";
            case "victory":
                return "img/no.png";
            default:
                return "img/no.png";
        }
    }

}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(MainWindow);