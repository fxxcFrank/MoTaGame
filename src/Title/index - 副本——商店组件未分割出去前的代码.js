import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'
// import style from './style.css'
import Shop from "../Shop"

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startFlag: false,
            explainFlag: false,
            mapList: [{ "name": 1, "map": [], "width": 0 }],
            nowMapNum: 0,
            // width: 5,
            moveWidth: 6,
            moveHeight: 6,
            level: 1,
            life: 1000,
            gong: 3,
            fang: 3,
            baojilv: 5,
            baojishanghai: 50,
            YKey: 1,
            BKey: 1,
            RKey: 1,
            levelNum: 0,
            nextLevelNum: 10,
            nextLevelAllNum: 10,
            gold: 0,
            nowM: {},
            nowShop: {},
            nowShopGoodsNum: 0,
            nowShopGoodsLength: 0,
            shopFlag:false,
            shop1Flag: false,
            shop2Flag:false,
            shopType:"",
            exitShowFlag: false,
            tipWord: "",
            tipFlag: false,
            fightFlag: false,
            fightStatusShowFlag: false,
            fightTipWord: "",
            fightTipFlag: false,
            finish: false,
            victory: false,

        }
    }

    componentWillMount() {
        console.log('componentWillMount');
        axios.get('map.json')
            .then((res) => {
                const result = res.data;
                console.log('res', res, result);
                this.setState({ mapList: result });
            })
            .catch((error) => {
                console.log(error)
            })
        document.addEventListener("keydown", this.keyOn);
        // debugger
    }
    componentDidMount() {
        // setTimeout(() => {
        //     let plugin = document.getElementById("mtYS");
        //     let list = document.getElementById("start");
        //     let id = list.attributes["index"].nodeValue;
        //     let width = this.state.mapList[this.state.nowMapNum].width;
        //     let height = this.state.mapList[this.state.nowMapNum].map.length / width;
        //     plugin.style.left = id % width * (100 / width) + "%";
        //     plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
        //     plugin.attributes["index"] = id;
        // }, 100);
    }

    render() {
        // console.log('mapList', this.state.mapList);
        let nowMapNum = this.state.nowMapNum;
        let nowMap = this.state.mapList[nowMapNum].map;
        let width = this.state.mapList[nowMapNum].width;
        let num = width;
        let nowShopGoodsNum = this.state.nowShopGoodsNum;
        return (
            <Fragment>
                {this.state.startFlag ?
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
                        {/* {this.state.tipFlag ?
                            <div className="tipText_main" id="tip">
                                <div className="tipText_Hide1" />
                                <div className="tipText_Hide2" />
                                <div className="tipText_text">{this.state.tipWord}</div>
                            </div>
                            : null} */}
                        {/*{this.state.shopFlag ? <Shop setTip={this.setTip}/> : null}*/}
                        <Shop shopComponentOnRef={this.shopComponentOnRef} shopFlag={this.state.shopFlag} shopType={this.state.shopType} setTip={this.setTip}/>
                        {this.state.shop1Flag ?
                            <div className="Shop_Main">
                                <div className="Shop_Main_Title">能力商店</div>
                                <div className="Shop_Main_Tip">你好，这里是商店，可以把金钱转化成一些勇者你的属性，每一次提升需要25金币，没有手续费。加油啊，勇者！</div>
                                <div className="Shop_Main_Goods" id="Shop_Main_Goods" spendGold={25}>
                                    <div className={nowShopGoodsNum == 0 ? "Shop_Main_Goods_life_focus" : "Shop_Main_Goods_life"} onClick={(e) => this.showAddLife(e, 800)}>提升800生命值</div>
                                    <div className={nowShopGoodsNum == 1 ? "Shop_Main_Goods_gong_focus" : "Shop_Main_Goods_gong"} onClick={(e) => this.showAddGong(e, 3)}>提升3攻击</div>
                                    <div className={nowShopGoodsNum == 2 ? "Shop_Main_Goods_fang_focus" : "Shop_Main_Goods_fang"} onClick={(e) => this.showAddFang(e, 3)}>提升3防御</div>
                                    <div className={nowShopGoodsNum == 3 ? "Shop_Main_Goods_exit_focus" : "Shop_Main_Goods_exit"} onClick={(e) => this.exitShop(e)}>退出</div>
                                </div>
                            </div>
                            : null}
                        {this.state.shop2Flag ?
                            <div className="Shop_Main">
                                <div className="Shop_Main_Title">钥匙商店</div>
                                <div className="Shop_Main_Tip">你好，这里是钥匙商店，可以把金钱转化成一些勇者你的需要的钥匙。1把黄钥匙10金币，1把蓝钥匙30金币，一把红钥匙100金币，没有手续费。加油啊，勇者！</div>
                                <div className="Shop_Main_Goods" id="Shop_Main_Goods" spendGold={10}>
                                    <div className={nowShopGoodsNum == 0 ? "Shop_Main_Goods_life_focus" : "Shop_Main_Goods_life"} onClick={(e) => this.showAddLife(e, 800)}>黄钥匙10/把</div>
                                    <div className={nowShopGoodsNum == 1 ? "Shop_Main_Goods_gong_focus" : "Shop_Main_Goods_gong"} onClick={(e) => this.showAddGong(e, 3)}>蓝钥匙30/把</div>
                                    <div className={nowShopGoodsNum == 2 ? "Shop_Main_Goods_fang_focus" : "Shop_Main_Goods_fang"} onClick={(e) => this.showAddFang(e, 3)}>红钥匙100/把</div>
                                    <div className={nowShopGoodsNum == 3 ? "Shop_Main_Goods_exit_focus" : "Shop_Main_Goods_exit"} onClick={(e) => this.exitShop(e)}>退出</div>
                                </div>
                            </div>
                            : null}
                        {this.state.fightStatusShowFlag ?
                            <div className="Status_fight_main">
                                <div className="Status_fight_main_left">
                                    <img className="Status_fight_main_left_Img" src="img/text.png" />
                                    <div className="Status_fight_main_left_mc">
                                        <div className="Status_fight_main_left_mcText">勇者</div>
                                        <div className="Status_fight_main_left_num">
                                            <div className="Status_fight_main_left_num_fight">生命值：{this.state.life}</div>
                                            <div className="Status_fight_main_left_num_fight">攻击力：{this.state.gong}</div>
                                            <div className="Status_fight_main_left_num_fight">防御力：{this.state.fang}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Status_fight_main_right">
                                    <div className="Status_fight_main_right_mc">
                                        <div className="Status_fight_main_right_mcText">{this.state.nowM.mc}</div>
                                        <div className="Status_fight_main_right_num">
                                            <div className="Status_fight_main_right_num_fight">生命值：{this.state.nowM.life}</div>
                                            <div className="Status_fight_main_right_num_fight">攻击力：{this.state.nowM.gong}</div>
                                            <div className="Status_fight_main_right_num_fight">防御力：{this.state.nowM.fang}</div>
                                        </div>
                                    </div>
                                    <img className="Status_fight_main_right_Img" src="img/text.png" />
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
                                <div className="mtYS" id="mtYS">
                                    勇者
                                    <div className="mtYS_Img"></div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="floorNum">第{nowMapNum}层</div> */}
                        {this.state.finish ? <div className="game_over">勇者被打倒了！</div> : null}
                        {this.state.victory ? <div className="victory" lx="Congratulations Victory!">恭喜通关！</div> : null}
                    </div>
                    :
                    <div className="MainTitleWindow">
                        <div className="MainTitleWindow_title">魔塔</div>
                        <div className="MainTitleWindow_Menu">
                            <div className="MainTitleWindow_Menu_start" onClick={() => this.startGame()}>开始游戏</div>
                            <div className="MainTitleWindow_Menu_explain" onClick={() => this.openExplain()}>游戏说明</div>
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

            </Fragment>
        )
    }
    startGame = () => {
        this.setState({ startFlag: true });
        setTimeout(() => {
            let plugin = document.getElementById("mtYS");
            let list = document.getElementById("start");
            let id = list.attributes["index"].nodeValue;
            let width = this.state.mapList[this.state.nowMapNum].width;
            let height = this.state.mapList[this.state.nowMapNum].map.length / width;
            plugin.style.left = id % width * (100 / width) + "%";
            plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
            plugin.attributes["index"] = id;
        }, 100);
    }
    openExplain = () => {
        this.setState({ explainFlag: true })
    }
    closeExplain = () => {
        this.setState({ explainFlag: false })
    }
    showAddLife = (e, num) => {
        this.setState({ life: this.state.life + num })
    }
    showAddGong = (e, num) => {
        this.setState({ gong: this.state.gong + num })
    }
    showAddFang = (e, num) => {
        this.setState({ fang: this.state.fang + num })
    }
    showAddYKey=(e)=>{
        this.setState({ YKey: this.state.YKey + 1 })
    }
    showAddBKey=(e)=>{
        this.setState({ BKey: this.state.BKey + 1 })
    }
    showAddRKey=(e)=>{
        this.setState({ RKey: this.state.RKey + 1 })
    }
    exitShop = (e) => {
        this.setState({
            shop1Flag: false,
            shop2Flag: false,
            nowShop: {},
            nowShopGoodsNum: 0,
            nowShopGoodsLength: 0,
        })
    }

    keyOn = (e) => {
        if (this.state.shop1Flag || this.state.shop2Flag) {
            let keyCode = e.keyCode;
            switch (keyCode) {
                case 38:       //上
                    this.changeShopGoods(-1);
                    break;
                case 40:       //下
                    this.changeShopGoods(1);
                    break;
                case 13:
                    this.getShopGoods();
                    break;
                default:
                    break;
            }
            return;
        }
        else if (this.state.fightFlag || !this.state.startFlag) {
            return;
        }
        // console.log('e', e, e.keyCode);
        let keyCode = e.keyCode;
        // switch (keyCode) {
        //     case 38 | 87:       //上
        //         this.up();
        //         break;
        //     case 40 | 83:       //下
        //         this.down();
        //         break;
        //     case 37 | 65:       //左
        //         this.left();
        //         break;
        //     case 39 | 68:       //右
        //         this.right();
        //         break;
        //     default:
        //         break;
        // }
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
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;
        switch (map) {
            case "wall":
                return <div className="NormalMap" index={index} lx="wall" key={nowMapNum + "个" + index}>墙</div>;
            case "no":
                return <div className="NormalMap" index={index} lx="no" key={nowMapNum + "个" + index}>无</div>;
            case "YDoor":
                return <div className="NormalMap" index={index} lx="YDoor" key={nowMapNum + "个" + index}>黄门</div>;
            case "BDoor":
                return <div className="NormalMap" index={index} lx="BDoor" key={nowMapNum + "个" + index}>蓝门</div>;
            case "RDoor":
                return <div className="NormalMap" index={index} lx="RDoor" key={nowMapNum + "个" + index}>红门</div>;
            case "YKey":
                return <div className="NormalMap" index={index} lx="YKey" key={nowMapNum + "个" + index}>黄钥匙</div>;
            case "BKey":
                return <div className="NormalMap" index={index} lx="BKey" key={nowMapNum + "个" + index}>蓝钥匙</div>;
            case "RKey":
                return <div className="NormalMap" index={index} lx="RKey" key={nowMapNum + "个" + index}>红钥匙</div>;
            case "M1":
                return <div className="NormalMap" index={index} lx="M1" life={20} gong={1} fang={1} levelNum={1} gold={1} key={nowMapNum + "个" + index}>绿史莱姆</div>;
            case "M2":
                return <div className="NormalMap" index={index} lx="M2" life={50} gong={3} fang={3} levelNum={3} gold={3} key={nowMapNum + "个" + index}>蓝史莱姆</div>;
            case "M3":
                return <div className="NormalMap" index={index} lx="M3" life={100} gong={5} fang={5} levelNum={5} gold={5} key={nowMapNum + "个" + index}>蓝史莱姆</div>;
            case "M4":
                return <div className="NormalMap" index={index} lx="M4" life={300} gong={30} fang={30} levelNum={30} gold={30} key={nowMapNum + "个" + index}>黑史莱姆</div>;
            case "sword":
                return <div className="NormalMap" index={index} lx="sword" key={nowMapNum + "个" + index}>剑</div>;
            case "def":
                return <div className="NormalMap" index={index} lx="def" key={nowMapNum + "个" + index}>盾</div>;
            case "goldShop":
                return <div className="NormalMap" index={index} lx="goldShop" key={nowMapNum + "个" + index}>能力商店</div>;
            case "keyShop":
                return <div className="NormalMap" index={index} lx="keyShop" key={nowMapNum + "个" + index}>钥匙商店</div>;
            case "start":
                return <div className="NormalMap" index={index} lx="start" id="start" key={nowMapNum + "个" + index}>起</div>;
            case "end":
                return <div className="NormalMap" index={index} lx="end" key={nowMapNum + "个" + index}>终</div>;
            case "victory":
                return <div className="NormalMap" index={index} lx="victory" key={nowMapNum + "个" + index}>终</div>;
            default:
                return <div className="NormalMap" index={index} lx="no" key={nowMapNum + "个" + index}>无</div>;
        }
    }

    up = () => {
        let plugin = document.getElementById("mtYS");
        let id = plugin.attributes["index"] * 1 - this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    down = () => {
        let plugin = document.getElementById("mtYS");
        let id = plugin.attributes["index"] * 1 + this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    left = () => {
        let plugin = document.getElementById("mtYS");
        let id = plugin.attributes["index"] * 1 - 1;
        this.handleMove(id);
    }
    right = () => {
        let plugin = document.getElementById("mtYS");
        let id = plugin.attributes["index"] * 1 + 1;
        this.handleMove(id);
    }
    changeShopGoods = (num) => {
        let nowShopGoodsNum = this.state.nowShopGoodsNum;
        let nowShopGoodsLength = this.state.nowShopGoodsLength;
        let nextNum = nowShopGoodsNum + num;
        if (nextNum >= 0 && nextNum < nowShopGoodsLength) {
            this.setState({ nowShopGoodsNum: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowShopGoodsNum: nowShopGoodsLength - 1 })
        }
        else {
            this.setState({ nowShopGoodsNum: 0 })
        }
    }
    handleMove(id) {
        let list = document.getElementsByTagName("div");
        let doc;
        for (let i = 0; i < list.length; i++) {
            let div = list[i];
            // console.log('div',div);
            if (!div.attributes["index"])
                continue;
            // console.log('id',id,div.attributes["index"] * 1,div.attributes["index"]);
            if (id == div.attributes["index"].nodeValue * 1) {
                doc = div;
                break;
            }
        }
        // console.log('doc', doc)
        this.whenMeet(doc);
    }

    move = (doc) => {
        let plugin = document.getElementById("mtYS");
        let id = doc.attributes["index"].nodeValue;
        // plugin.style.left = id % this.state.width * this.state.moveWidth + "vw";
        // plugin.style.top = Math.floor(id / this.state.width) * this.state.moveHeight + "vh";
        // plugin.attributes["index"] = id;
        let width = this.state.mapList[this.state.nowMapNum].width;
        let height = this.state.mapList[this.state.nowMapNum].map.length / width;
        plugin.style.left = id % width * (100 / width) + "%";
        plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
        plugin.attributes["index"] = id;
    }
    remove = (doc) => {
        let nowMapNum = this.state.nowMapNum;
        let mapList = [...this.state.mapList];
        let nowMap = [...this.state.mapList[nowMapNum].map];
        let id = doc.attributes["index"].nodeValue;
        doc.attributes["lx"].nodeValue = "no";
        doc.innerText = "无";
        nowMap[id] = "no";
        mapList[nowMapNum].map = nowMap;
        this.setState({ mapList: mapList });
    }

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
        /* 战斗处理 */
        let mc = doc.innerText;
        this.setState({ nowM: { life: mLife, gong: mGong, fang: mFnag, mc: mc } });
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
                    this.move(doc);
                    this.remove(doc);
                    if (ysLevelNum + mLevelNum >= ysNextLevelAllNum) {
                        // debugger
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
                        // debugger
                        this.setState({
                            fightTipFlag: false,
                            fightFlag: false,
                        });
                    }, 501);
                }
            }
            else if (flag) {
                // debugger
                if (ysGong > mFnag) {
                    let sh = (ysGong - mFnag);
                    let a = Math.random();
                    sh = a < bjl ? sh = Math.ceil(sh * (1 + bjsh)) : sh;
                    // console.log('a', a, bjl, sh)
                    mLife = mLife - sh;
                }
                else
                    mLife = mLife - 1;
                flag = false;
                if (mLife < 0)
                    mLife = 0
            }
            else {
                // debugger
                if (mGong > ysFang)
                    ysLife = ysLife - (mGong - ysFang);
                else
                    ysLife = ysLife - 1;
                flag = true;
                if (ysLife < 0)
                    ysLife = 0;
            }
            // debugger
            this.setState({ life: ysLife });
            this.setState({ nowM: { life: mLife, gong: mGong, fang: mFnag, mc: mc } });
        }, 300);
    }

    openDoor = (doc) => {
        let lx = doc.attributes["lx"].nodeValue;
        if (lx === "YDoor") {
            let YKey = this.state.YKey;
            if (YKey > 0) {
                YKey -= 1;
                this.move(doc);
                this.remove(doc);
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
                this.move(doc);
                this.remove(doc);
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
                this.move(doc);
                this.remove(doc);
                this.setState({ RKey: RKey });
            }
            else {
                this.setTip("您身上没有足够的红钥匙……");
            }
        }

    }

    openShop = (doc) => {
        let plugin = document.getElementById("Shop_Main_Goods");
        this.setState({
            nowShop: plugin,
            nowShopGoodsLength: plugin.childElementCount,
        })
    }
    openShop2 = (doc) => {
        let plugin = document.getElementById("Shop_Main_Goods");
        this.setState({
            nowShop: plugin,
            nowShopGoodsLength: plugin.childElementCount,
        })
    }
    changeShopType=(doc,lx)=>{
        this.setState({
            shopType:lx,
        })
    }
    getShopGoods = () => {
        let plugin = this.state.nowShop;
        let nowShopGoodsNum = this.state.nowShopGoodsNum;
        if (nowShopGoodsNum === plugin.childElementCount - 1) {
            plugin.childNodes[nowShopGoodsNum].click();
            return;
        }
        let ysGold = this.state.gold;
        let spendGold = parseInt(plugin.attributes["spendGold"].nodeValue);
        if (ysGold >= spendGold) {
            ysGold -= spendGold;
            plugin.childNodes[nowShopGoodsNum].click();
            this.setState({ gold: ysGold });
        }
        else {
            this.setTip("您身上没有足够的金币……");
        }
    }

    setTip = (text) => {
        let root = document.getElementById("MainAll");
        let tempPlugin = document.createElement("div");
        tempPlugin.className = "tipText_main";
        tempPlugin.id = "tip";
        tempPlugin.innerHTML =
            `<div class="tipText_text">${text}</div>`
        root.appendChild(tempPlugin);
        setTimeout(() => {
            root.removeChild(tempPlugin);
        }, 751);
    }

    upMap(doc) {
        let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
        if (nowMapNum > 0) {
            let nowMap = this.state.mapList[nowMapNum - 1].map;
            let plugin = document.getElementById("mtYS");
            let id;
            nowMap.map((map, index) => {
                if (map == "end")
                    id = index;
            })
            if (id) {
                let width = this.state.mapList[this.state.nowMapNum - 1].width;
                let height = this.state.mapList[this.state.nowMapNum - 1].map.length / width;
                plugin.style.left = id % width * (100 / width) + "%";
                plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
                plugin.attributes["index"] = id;
                this.setState({ nowMapNum: nowMapNum - 1 });
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
            let plugin = document.getElementById("mtYS");
            let id;
            nowMap.map((map, index) => {
                if (map == "start")
                    id = index;
            })
            if (id) {
                let width = this.state.mapList[this.state.nowMapNum + 1].width;
                let height = this.state.mapList[this.state.nowMapNum + 1].map.length / width;
                plugin.style.left = id % width * (100 / width) + "%";
                plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
                plugin.attributes["index"] = id;
                this.setState({ nowMapNum: nowMapNum + 1 });
            }
        }
        else {
            this.move(doc);
        }
    }
    victory() {
        this.setState({ victory: true })
    }

    whenMeet = (doc) => {
        if (doc == undefined)
            return;
        let lx = doc.attributes["lx"].nodeValue;
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
                this.move(doc);
                this.remove(doc);
                break;
            case "BKey":
                this.setState({ BKey: this.state.BKey + 1 });
                this.move(doc);
                this.remove(doc);
                break;
            case "RKey":
                this.setState({ RKey: this.state.RKey + 1 });
                this.move(doc);
                this.remove(doc);
                break;
            case "M1":
                this.fight(doc);
                break;
            case "M2":
                this.fight(doc);
                break;
            case "M3":
                this.fight(doc);
                break;
            case "M4":
                this.fight(doc);
                break;
            case "sword":
                this.setState({ gong: this.state.gong + 3 });
                this.move(doc);
                this.remove(doc);
                break;
            case "def":
                this.setState({ fang: this.state.fang + 3 });
                this.move(doc);
                this.remove(doc);
                break;
            case "goldShop":
                this.setState({ shop1Flag: true });
                this.openShop(doc);
                this.changeShopType(doc,lx);
                break;
            case "keyShop":
                this.setState({ shop2Flag: true });
                this.openShop2(doc);
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

    /********  各类子组件  ********/
    /*1，商店 */
    shopComponentOnRef=(ref)=>{
        this.shopComponent=ref;
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