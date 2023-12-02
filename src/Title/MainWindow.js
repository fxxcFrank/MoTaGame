/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as actionCreators from './store/actionCreators'
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
            aroundMonster: [],//周围四格的对象信息
            floorMonster: [],//当前楼层所有对象信息

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

            ysPosFirstFlag: true,    //开始游戏第一次加载勇者位置（不包括读取游戏）

            freshenFlag: false    //单纯只是为了让操作dom后能刷新render而已
        }
        let _this = this;
        this.props.mainWindowComponentOnRef ? this.props.mainWindowComponentOnRef(this) : null;
        axios.get('data/gameData/map.json')
            .then((res) => {
                const result = res.data;
                // console.log('res', result);
                this.setState({ mapList: result }, () => {
                    let timer = setInterval(() => {
                        let plugin = document.getElementById("mtYS");
                        if (plugin) {
                            clearInterval(timer);
                            _this.getNowFloorTarget();
                        }
                    }, 100);
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.getNowFloorTarget();
    }

    componentDidUpdate() {
        this.props.setAllState(this.state);
        this.props.onFreshenFlag();
        if (this.state.ysPosFirstFlag && this.props.startMode === 'start') this.setYSPos_First();
    }

    render() {
        const { nowMapNum, mapList, nowM, } = this.state;
        let nowMap = mapList[nowMapNum].map;
        let width = mapList[nowMapNum].width;
        let height = mapList[nowMapNum].map.length / width;
        let num = width;
        // console.log("nowMap---------", nowMap);
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
                                    <div className="Status_fight_main_right_mcText">{nowM.monsterName + ""}</div>
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
                        <div
                            // className={this.returnMainMapClass(width, height)}
                            // style={{ ...this.returnNowMap_bigStyle(width, height), "--nowMapWidth": width, "--nowMapHeight": height }}
                            onKeyUp={(e) => this.keyOn(e)}
                            className="NowMap_text"
                            id="NowMap"
                            style={{ "--nowMapWidth": 10, "--nowMapHeight": 10 }}
                        >
                            {nowMap.map((map, index) => {
                                return this.dynamicLoadingMap(map, index, width, height);
                                // return this.returnMap(map, index);
                            })}
                        </div>
                        <div className="mtYS_Img_down" id="mtYS" index={0} style={{ backgroundImage: "URL(img/ys.png)" }}></div>
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
        /* 返回道具 */
        else if (map.includes("Item")) {
            return this.props.itemMapComponent.returnItemMap(map, index, nowMapNum);
        }
        else {
            return this.props.baseMapComponent.returnBaseMap(map, index, nowMapNum);
        }
    }

    /* 控制所有键盘事件的主函数 */
    keyOn = (e) => {
        // console.log("MainWindow", e);
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
        const { nowMapNum, mapList, } = this.state;
        let nowAllCount = mapList[nowMapNum].map.length;
        let width = mapList[nowMapNum].width;
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_left";
        let id = plugin.attributes["index"].nodeValue * 1 - 1;
        if ((id + 1) % width === 0) {
            return;
        }
        this.handleMove(id);
    }
    right = () => {
        const { nowMapNum, mapList, } = this.state;
        let nowAllCount = mapList[nowMapNum].map.length;
        let width = mapList[nowMapNum].width;
        let plugin = document.getElementById("mtYS");
        plugin.className = "mtYS_Img_right";
        let id = plugin.attributes["index"].nodeValue * 1 + 1;
        if ((id + 1) % width === 1) {
            return;
        }
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

    move = (doc) => {
        let id = parseInt(doc.attributes["index"].nodeValue);    //因为采用了复合图层的原因，会导致部分dom刷新后doc的指向不明确，导致无法正常添加div，所以采用这种麻烦的方式，应该对效率有所影响，但目前看来不大。
        this.getAllRoundTarget(id);
        this.setYSPos(id);
        this.setState({ freshenFlag: !this.state.freshenFlag });   //为了刷新render，目前的目的是为了让卷轴视口移动能够对齐
        this.props.onFreshenFlag();
    }
    remove = (doc) => {
        let nowMapNum = this.state.nowMapNum;
        let mapList = [...this.state.mapList];
        let nowMap = [...this.state.mapList[nowMapNum].map];
        let id = parseInt(doc.attributes["index"].nodeValue);
        doc.attributes["lx"].nodeValue = "no";
        nowMap[id] = "no";
        mapList[nowMapNum].map = nowMap;
        this.setState({ mapList: mapList });
    }
    /* */
    //动态加载地图块（仅加载视口范围内的，可能需要去掉下面的卷轴移动）2023.08.18尚未完成
    dynamicLoadingMap = (map, index, allWidth_true, allHeight_true) => {
        let allWidth = allWidth_true - 1;       //因为从0开始计数，这是x，y的实际最大值
        let allHeight = allHeight_true - 1;     //因为从0开始计数，这是x，y的实际最大值
        // let allWidth = allWidth_true;       //因为从0开始计数，这是x，y的实际最大值
        // let allHeight = allHeight_true;     //因为从0开始计数，这是x，y的实际最大值
        let plugin = document.getElementById("mtYS");
        if (!plugin) return;
        if (allWidth_true > 10 || allHeight_true > 10) {
            let id = parseInt(plugin.attributes["index"].nodeValue);    //从0开始计数
            let nowPosLeft = (id) % allWidth_true;                           //从0开始计数
            let nowPosTop = Math.floor((id) / allWidth_true);
            let maxWidth = 10;              //视口最大宽度
            let maxHeight = 10;             //视口最大高度
            let widthLimitCount = 5;       //视口宽度，实际会*2，目前也就是10（格）
            let heightLimitCount = 5;      //视口高度，实际会*2，目前也就是10（格）

            let mapLeft = (index) % allWidth_true;
            let mapTop = Math.floor((index) / allWidth_true);
            //2023.11.01 打算先拆分为八个方向以及存在内部的情况（一共九种）分开进行处理，之后再考虑逻辑合并
            //左上角
            if (nowPosLeft <= widthLimitCount && nowPosTop <= heightLimitCount) {
                if (!(mapLeft < maxWidth && mapTop < maxHeight)) return;
            }
            //右上角
            if (allWidth - nowPosLeft <= widthLimitCount && nowPosTop <= heightLimitCount) {
                if (!(allWidth - mapLeft < maxWidth && mapTop < maxHeight)) return;
            }
            //左下角
            if (nowPosLeft <= widthLimitCount && allHeight - nowPosTop <= heightLimitCount) {
                if (!(mapLeft < maxWidth && allHeight - mapTop < maxHeight)) return;
            }
            //右下角
            if (allWidth - nowPosLeft <= widthLimitCount && allHeight - nowPosTop <= heightLimitCount) {
                if (!(allWidth - mapLeft < maxWidth && allHeight - mapTop < maxHeight)) return;
            }
            //上侧
            if (nowPosLeft > widthLimitCount && allWidth - mapLeft > widthLimitCount && nowPosTop <= 5) {
                if (!((mapLeft - nowPosLeft < maxWidth || nowPosLeft - mapLeft <= maxWidth) && (mapTop < maxHeight))) return;
            }
            //下侧
            if (nowPosLeft > widthLimitCount && allWidth - mapLeft > widthLimitCount && allHeight - nowPosTop <= 5) {
                if (!((mapLeft - nowPosLeft < maxWidth || nowPosLeft - mapLeft <= maxWidth) && (allHeight - mapTop < maxHeight))) return;
            }
            //左侧
            if (nowPosLeft <= 5 && nowPosTop > 5 && allHeight - nowPosTop > 5) {
                // if (!((mapLeft < 10) && (mapTop - nowPosTop < 5 || nowPosTop - mapTop <= 5))) return;
                if (mapLeft >= 10) return;
                if (mapTop - nowPosTop > 5) return;
                if (nowPosTop - mapTop >= 5) return;
            }
            //右侧
            if (allWidth - nowPosLeft <= 5 && nowPosTop > 5 && allHeight - nowPosTop > 5) {
                // if (!((allWidth - mapLeft < 10) && (mapTop - nowPosTop < 5 || nowPosTop - mapTop <= 5))) return;
                if (allWidth - mapLeft >= 10) return;
                if (mapTop - nowPosTop > 5) return;
                if (nowPosTop - mapTop >= 5) return;
            }

            //-------------

            // //位置靠近左侧边界时
            // if (nowPosLeft <= widthLimitCount && mapLeft >= maxWidth) return;
            // //位置靠近右侧边界时
            // if (allWidth - nowPosLeft <= widthLimitCount && allWidth - mapLeft >= maxWidth) return;
            // //位置靠近上侧边界时
            // if (nowPosTop <= heightLimitCount && mapTop >= maxHeight) return;
            // //位置靠近下侧边界时
            // if (allHeight - nowPosTop <= heightLimitCount && allHeight - mapTop >= maxHeight) return;
            // //位置靠近左上边界时
            // if (nowPosLeft <= widthLimitCount && mapLeft >= maxWidth) return;
            //位置在地图内侧时（根据下面判断可以控制在动态加载时，勇者始终处于中央正方的哪个位置（目前为中央右上角），除非之后将默认地图长度改为11*11类型的奇数块）
            //且，目前似乎加载地图块得和setYSPos中的位置逻辑对应上，不然会出现index正确，但图像位置不对的情况。
            // let flag = (nowPosLeft > widthLimitCount) && ((allWidth_true) - nowPosLeft > widthLimitCount) && (nowPosTop > heightLimitCount) && ((allHeight_true) - nowPosTop > heightLimitCount)
            let flag = nowPosLeft > widthLimitCount && allWidth_true - nowPosLeft > widthLimitCount && nowPosTop > heightLimitCount && allHeight_true - nowPosTop > heightLimitCount
            if (flag) {
                // if (nowPosLeft - mapLeft > widthLimitCount && nowPosLeft > widthLimitCount) return;
                // if (nowPosTop - mapTop > heightLimitCount && nowPosTop > heightLimitCount) return;
                // if (mapLeft - nowPosLeft > widthLimitCount - 1 && allWidth - nowPosLeft > widthLimitCount - 1) return;
                // if (mapTop - nowPosTop > heightLimitCount - 1 && allHeight - nowPosTop > heightLimitCount - 1) return;
                if (nowPosLeft - mapLeft > widthLimitCount) return;
                if (nowPosTop - mapTop > heightLimitCount - 1) return;
                if (mapLeft - nowPosLeft > widthLimitCount - 1) return;
                if (mapTop - nowPosTop > heightLimitCount) return;
            }
        }
        return this.returnMap(map, index);
    }

    //返回主地图的class，方便移动
    returnMainMapClass = (width, height) => {
        if (width > 10 || height > 10) return 'NowMap_textBig';
        else return 'NowMap_text';
    }
    /* 当当前地图大于一定大小时（目前为10*10），跟随移动让画面进行卷轴移动 */
    returnNowMap_bigStyle = (allWidth, allHeight) => {
        let width = allWidth;
        let height = allHeight;

        let style = { left: 0, top: 0 } //目前一格大小为宽8vw、高10vh，目前地图位置为从左上角对齐
        let plugin = document.getElementById("mtYS");
        if (!plugin) return;
        let id = parseInt(plugin.attributes["index"].nodeValue);
        let nowPosLeft = (id) % width;
        let nowPosTop = Math.floor((id) / width);
        let widthLimitCount = 5;       //视口宽度，实际会*2，目前也就是10（格）
        let heightLimitCount = 5;      //视口高度，实际会*2，目前也就是10（格）
        let oneLeft = -8;   //一个格子的宽
        let oneTop = -10;   //一个格子的高
        let nowShouldLeft = nowPosLeft - widthLimitCount;
        let nowShouldTop = nowPosTop - heightLimitCount;
        style.left = nowShouldLeft * oneLeft + "vw";
        style.top = nowShouldTop * oneTop + "vh";
        if (nowShouldLeft <= 0) style.left = 0 + 'vw';
        if (nowShouldTop <= 0) style.top = 0 + 'vh';
        if (nowShouldLeft + widthLimitCount * 2 >= width) style.left = (width - widthLimitCount * 2) * oneLeft + "vw";
        if (nowShouldTop + heightLimitCount * 2 >= height) style.top = (height - heightLimitCount * 2) * oneTop + "vh";
        if (allWidth <= 10) style.left = 0 + 'vw';
        if (allHeight <= 10) style.top = 0 + 'vh';
        if (allWidth < 10 && allHeight > 10) style.left = (10 - width) / 2 * 8 + 'vw';
        if (allHeight < 10 && allWidth > 10) style.top = (10 - height) / 2 * 10 + 'vh';
        return style;
    }
    /* */
    /* 获取周围对象的信息 */
    getAllRoundTarget = (id) => {   //可能逻辑有点赘余了，之后再调整吧
        try {
            let arountList = [];
            let list = document.getElementsByTagName("div");
            for (let i = 0; i < list.length; i++) {
                let div = list[i];
                if (!div.attributes["index"])
                    continue;
                if (!div.attributes["lx"])
                    continue;
                let lx = div.attributes["lx"].nodeValue;
                if (lx.includes("Monster")) {
                    let divIndex = div.attributes["index"].nodeValue * 1;
                    let width = this.state.mapList[this.state.nowMapNum].width;
                    //左、右、上、下
                    if (((id == divIndex - 1) && !((id + 1) % width == 0)) || ((id == divIndex + 1) && !((id + 1) % width == 0)) || id == divIndex + width || id == divIndex - width) {
                        let info = {
                            monsterName: div.attributes["monsterName"].nodeValue,
                            life: parseInt(div.attributes["life"].nodeValue),
                            gong: parseInt(div.attributes["gong"].nodeValue),
                            fang: parseInt(div.attributes["fang"].nodeValue),
                            baojilv: parseInt(div.attributes["baojilv"].nodeValue),
                            baojishanghai: parseInt(div.attributes["baojishanghai"].nodeValue),
                            level: parseInt(div.attributes["level"].nodeValue),
                            levelNum: parseInt(div.attributes["levelNum"].nodeValue),
                            gold: parseInt(div.attributes["gold"].nodeValue),
                            describe: div.attributes["describe"].nodeValue,
                            imgMode: div.attributes["imgMode"].nodeValue,
                            imgPos: div.attributes["imgPos"].nodeValue,
                            imgUrl: div.attributes["imgUrl"].nodeValue,
                            direction: this.returnTargetDirection(id, divIndex, width),
                        }
                        arountList.push(info);
                    }
                }
            }
            this.setState({ aroundMonster: [...arountList] });
        } catch (error) {
            console.log("getAllRoundTarget", error);
            this.setTip("获取周围对象的信息错误……");
        }
    }
    returnTargetDirection = (id, divIndex, width) => {
        if ((id == divIndex - 1) && !((id + 1) % width == 0)) {
            return "左侧";
        }
        else if ((id == divIndex + 1) && !((id + 1) % width == 0)) {
            return "右侧";
        }
        else if (id == divIndex + width) {
            return "上侧";
        }
        else if (id == divIndex - width) {
            return "下侧";
        }
    }
    /* ------------- */
    /* 获取本楼层中所有对象的信息 */
    getNowFloorTarget = () => {
        try {
            let arountList = [];
            let list = document.getElementsByTagName("div");
            for (let i = 0; i < list.length; i++) {
                let div = list[i];
                if (!div.attributes["index"])
                    continue;
                if (!div.attributes["lx"])
                    continue;
                let lx = div.attributes["lx"].nodeValue;
                if (lx.includes("Monster")) {
                    let monsterName = div.attributes["monsterName"].nodeValue;
                    let flag = arountList.find((e) => e.monsterName === monsterName);
                    if (flag)
                        continue;
                    //之后这里或者再Handbook能力里面，加入针对战斗过或是探查过的对象进行信息完全显示
                    let info = {
                        monsterName: div.attributes["monsterName"].nodeValue,
                        life: parseInt(div.attributes["life"].nodeValue),
                        gong: parseInt(div.attributes["gong"].nodeValue),
                        fang: parseInt(div.attributes["fang"].nodeValue),
                        baojilv: parseInt(div.attributes["baojilv"].nodeValue),
                        baojishanghai: parseInt(div.attributes["baojishanghai"].nodeValue),
                        level: parseInt(div.attributes["level"].nodeValue),
                        levelNum: parseInt(div.attributes["levelNum"].nodeValue),
                        gold: parseInt(div.attributes["gold"].nodeValue),
                        describe: div.attributes["describe"].nodeValue,
                        imgMode: div.attributes["imgMode"].nodeValue,
                        imgPos: div.attributes["imgPos"].nodeValue,
                        imgUrl: div.attributes["imgUrl"].nodeValue,
                    }
                    arountList.push(info);
                }
            }
            this.setState({ floorMonster: [...arountList] });
        } catch (error) {
            console.log("getNowFloorTarget----", error);
            this.setTip("获取周围对象的信息错误……");
        }
    }
    /* ------------- */
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
        let mFang = parseInt(doc.attributes["fang"].nodeValue);
        let mLevelNum = parseInt(doc.attributes["levelNum"].nodeValue);
        let mGold = parseInt(doc.attributes["gold"].nodeValue);
        let mImgMode = doc.attributes["imgMode"].nodeValue;
        let mImgPos = doc.attributes["imgPos"].nodeValue;
        let mImgUrl = doc.attributes["imgUrl"].nodeValue;
        /* 战斗处理 */
        let monsterName = doc.attributes["monsterName"].nodeValue;
        this.setState({ nowM: { life: mLife, gong: mGong, fang: mFang, monsterName: monsterName, imgMode: mImgMode, imgPos: mImgPos, imgUrl: mImgUrl } });
        this.setState({ fightFlag: true, fightStatusShowFlag: true });
        let flag = true;
        this.fightTimer = setInterval(() => {
            if (ysLife <= 0 || mLife <= 0) {
                clearInterval(this.fightTimer);
                if (ysLife <= 0) {
                    this.setState({ finish: true });
                }
                else {
                    this.palyVoice('Audio/RPG魔塔音效素材/SE/战斗胜利.mp3');
                    this.setState({ fightTipFlag: true, fightTipWord: "战斗胜利！", fightStatusShowFlag: false });
                    this.remove(doc);
                    this.move(doc);
                    if (ysLevelNum + mLevelNum >= ysNextLevelAllNum) {
                        this.palyVoice('Audio/RPG魔塔音效素材/SE/升级.mp3');
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
                        }, () => {
                            setTimeout(() => { //2022.11.07可能需要单独做几个类型的消息提示框
                                this.setState({ fightTipFlag: true, fightTipWord: `勇者已升级至Lv.${ysLevel}` });
                                setTimeout(() => {
                                    this.setState({ fightTipFlag: false, });
                                }, 3503);
                            }, 602);
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
                if (ysGong > mFang) {
                    let sh = (ysGong - mFang);
                    let a = Math.random();
                    if (a < bjl) {
                        sh = Math.ceil(sh * (1 + bjsh));
                        this.palyVoice('Audio/RPG魔塔音效素材/SE/剑击（暴击）.mp3');
                    }
                    else {
                        this.palyVoice('Audio/RPG魔塔音效素材/SE/剑击.mp3');
                    }
                    // sh = ? sh = Math.ceil(sh * (1 + bjsh)) : sh;
                    mLife = mLife - sh;
                }
                else {
                    this.palyVoice('Audio/RPG魔塔音效素材/SE/空手.mp3');
                    mLife = mLife - 1;
                }
                flag = false;
                if (mLife < 0)
                    mLife = 0
            }
            else {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/空手.mp3');
                if (mGong > ysFang)
                    ysLife = ysLife - (mGong - ysFang);
                else {
                    ysLife = ysLife - 1;
                }
                flag = true;
                if (ysLife < 0)
                    ysLife = 0;
            }
            this.setState({ life: ysLife });
            this.setState({ nowM: { life: mLife, gong: mGong, fang: mFang, monsterName: monsterName, imgMode: mImgMode, imgPos: mImgPos, imgUrl: mImgUrl } });
        }, 300);
    }
    /* */
    /* 开门函数 */
    openDoor = (doc) => {
        let lx = doc.attributes["lx"].nodeValue;
        if (lx === "YDoor") {
            let YKey = this.state.YKey;
            if (YKey > 0) {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/开门.mp3');
                YKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ YKey: YKey });
            }
            else {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/错误.mp3');
                this.setTip("您身上没有足够的黄钥匙……");
            }
        }
        else if (lx === "BDoor") {
            let BKey = this.state.BKey;
            if (BKey > 0) {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/开门.mp3');
                BKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ BKey: BKey });
            }
            else {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/错误.mp3');
                this.setTip("您身上没有足够的蓝钥匙……");
            }
        }
        else if (lx === "RDoor") {
            let RKey = this.state.RKey;
            if (RKey > 0) {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/开门.mp3');
                RKey -= 1;
                this.remove(doc);
                this.move(doc);
                this.setState({ RKey: RKey });
            }
            else {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/错误.mp3');
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
            this.palyVoice('Audio/RPG魔塔音效素材/SE/商店.mp3');
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
        else {
            this.palyVoice('Audio/RPG魔塔音效素材/SE/错误.mp3');
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
    changeSpendTipTextForItem = (spendType) => {    //因为道具消耗是强制的，之后应当考虑关于cost不足以及cost为life（生命值）的情况。
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
    //第一次设置勇者位置
    setYSPos_First = () => {
        const { nowMapNum, mapList, } = this.state;
        let width = mapList[nowMapNum].width;
        let plugin = document.getElementById('mtYS');
        let list = document.getElementById("start");
        if (!plugin || !list) return;
        try {
            let id = list.attributes["index"].nodeValue;
            plugin.attributes["index"].nodeValue = id;
            let nowLeft = (id % width) * 8 + 'vw';
            let nowTop = (Math.floor(id / width)) * 10 + 'vh';
            plugin.style.left = nowLeft;
            plugin.style.top = nowTop;
            this.setState({ ysPosFirstFlag: false });
        } catch (error) {
            console.log(error);
        }
    }
    //返回动态加载地图下，勇者当前应该所处的位置(因保留之前卷轴滚动的逻辑，所以此处返回的是以左上角index=0为起点，计算的style的left和top的vw、vh相对值)
    retnruYSPos = (width, height, preId, ysId) => {
        let firstMap = document.getElementById('NowMap').getElementsByTagName('div')[0];
        // if (!firstMap || ) return;
        let firstMapId = parseInt(firstMap.attributes["index"].nodeValue);
        console.log("firstMapId", firstMapId, width, height);
        this.setState({ beforeFirstMapIdId: firstMapId });
        //当地图为小地图（固定）模式时
        if (width <= 10 || height <= 10) {      //2023.11.02 暂时不知单向大地图（即长、宽中仅有一项超过视口限制）是否能够满足
            // ysId = preId;
        }
        //当横向移动时（x轴）
        else if (Math.abs(ysId - preId) === 1) {
            let leftTopWidth = firstMapId % width;
            let ysWidth = ysId % width;
            if (firstMapId % width !== 0 && (firstMapId + 10) % width !== 0 || Math.abs(ysWidth - leftTopWidth > 5)) {
                if (ysId - preId === 1) firstMapId += 1;
                else if (ysId - preId === -1) firstMapId -= 1;
                else if (ysId - preId === width) firstMapId += width;
                else firstMapId -= width;
            }
        }
        //当纵向移动时（y轴）
        else if (Math.abs(ysId - preId) === width) {
            let leftTopHeight = Math.floor(firstMapId / width);
            let ysHeight = Math.floor(ysId / width);
            if (Math.floor(firstMapId / width) !== 0 && (firstMapId + 10) % height !== 0 || Math.abs(ysHeight - leftTopHeight > 5)) {
                if (ysId - preId === 1) firstMapId += 1;
                else if (ysId - preId === -1) firstMapId -= 1;
                else if (ysId - preId === width) firstMapId += width;
                else firstMapId -= width;
            }
        }
        // debugger
        let id = Math.abs(firstMapId - ysId);
        let nowWidth = id % width;
        let nowHeight = Math.floor(id / width);

        let style = { left: 0, top: 0 };
        style.left = nowWidth * 8 + 'vw';
        style.top = nowHeight * 10 + 'vh';
        console.log("retnruYSPos", width, preId, ysId, firstMapId, style);
        return style;
    }
    //设置勇者位置
    setYSPos = (id) => {
        const { nowMapNum, mapList, } = this.state;
        let width = mapList[nowMapNum].width;
        let height = mapList[nowMapNum].map.length / width;
        let nowWidth = id % width;
        let nowHeight = Math.floor(id / width);
        // let nowHeight = id !== 0 ? Math.ceil(id / width) : 1;
        let plugin = document.getElementById('mtYS');
        let preId = plugin.attributes["index"].nodeValue;
        plugin.attributes["index"].nodeValue = id;
        // console.log("setYSPos", height, mapList[nowMapNum].map.length, width);
        // let style = this.returnNowMap_bigStyle(width, height);

        let style = this.retnruYSPos(width, height, preId, id);
        plugin.style.left = style.left;
        plugin.style.top = style.top;

        // if (width > 10) {
        //     let lessLeft = parseInt(style.left.split("vw")[0]);
        //     plugin.style.left = (nowWidth) * 8 + lessLeft + 'vw';
        // }
        // if (height > 10) {
        //     let lessTop = parseInt(style.top.split("vh")[0]);
        //     plugin.style.top = (nowHeight) * 10 + lessTop + 'vh';
        // }
        // if (width < 10) {
        //     plugin.style.left = (nowWidth + (10 - width) / 2) * 8 + 'vw';
        // }
        // if (height < 10) {
        //     plugin.style.top = (nowHeight + (10 - height) / 2) * 10 + 'vh';
        // }
        // if (width === 10) {
        //     let nowLeft = (nowWidth) * 8 + 'vw';
        //     plugin.style.left = nowLeft;
        // }
        // if (height === 10) {
        //     let nowTop = (nowHeight) * 10 + 'vh';
        //     plugin.style.top = nowTop;
        // }
        //修改勇者移动逻辑后，为了刷新同方向的移动动画(2023.08.23设置延时似乎不太好，之后想到更好的话，切记记得修改此处)
        let name = plugin.className;
        // plugin.className = "";
        // setTimeout(() => {
        //     plugin.className = name;
        // }, 1);
        let _this = this;
        plugin.style.animation = "";
        setTimeout(() => {
            plugin.style.animation = _this.setAnimationFromClassName(name);
        }, 1);
    }

    //设置对应className的移动动画数据（为了应对修改勇者移动逻辑后，刷新同方向的移动动画）
    setAnimationFromClassName = (className) => {
        let direction = className.split("_")[2];
        return `Animation_mtYS_${direction} 0.5s linear 0s normal none 1`;
    }

    //设置单个属性()
    setStateForGetAndSpend = (data) => {
        let flag = true;
        let spend = data.spend;
        let get = data.get;
        // for (let i in spend) {
        //     let have = this.state[i];
        //     if (have < spend[i]) {
        //         flag = false;
        //         let text = this.changeSpendTipTextForItem(i);
        //         this.setTip(text);
        //         break;
        //     }
        // }
        for (let i in spend) {
            let state = {};
            let have = this.state[i];
            have -= spend[i];
            if (have < 0) have = 0;
            if (have === 0 && i === "life") {
                this.setState({ finish: true });
                return;
            }
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
    //设置所有属性
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
        this.setState(data, () => {
            this.getAllRoundTarget(id);
            this.setYSPos(id);
            // this.props.setAllState(this.state);
        });    //已解决
    }
    /* 处理地图之间移动的函数 */
    upMap(doc) {
        try {
            let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
            if (nowMapNum > 0) {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/上下楼.mp3');
                let nowMap = this.state.mapList[nowMapNum - 1].map;
                let id = undefined;
                nowMap.map((map, index) => {
                    if (map == "end")
                        id = index;
                })
                if (id !== undefined) {
                    this.setState({ nowMapNum: nowMapNum - 1 }, () => {
                        this.getNowFloorTarget();
                        this.setYSPos(id);
                    });
                }
            }
            else {
                this.move(doc);
            }
        } catch (error) {
            console.log(error);
            alert("上楼时出现错误！");
        }
    }
    downMap(doc) {
        try {
            let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
            let mapNum = this.state.mapList.length;
            if (nowMapNum < mapNum - 1) {
                this.palyVoice('Audio/RPG魔塔音效素材/SE/上下楼.mp3');
                let nowMap = this.state.mapList[nowMapNum + 1].map;
                let id = undefined; //index可能为0，index为0时，判断会被过滤掉，展现出来的问题就是无法正常上下楼梯
                nowMap.map((map, index) => {
                    if (map == "start")
                        id = index;
                })
                if (id !== undefined) {
                    this.setState({ nowMapNum: nowMapNum + 1 }, () => {
                        this.getNowFloorTarget();
                        this.setYSPos(id);
                    });
                }
            }
            else {
                this.move(doc);
            }
        } catch (error) {
            console.log(error);
            alert("下楼时出现错误！");
        }
    }
    moveToFloor = (floorIndex) => {
        try {
            this.palyVoice('Audio/RPG魔塔音效素材/SE/上下楼.mp3');
            // console.log("moveToFloor-----this.state.mapList", this.state.mapList, floorIndex);
            let nowMap = this.state.mapList[floorIndex].map;
            let id;
            nowMap.map((map, index) => {
                if (map == "start")   //之后有需要的话，可以进行修改，修改成为上楼的位置
                    id = index;
            })
            if (id) {
                this.setState({ nowMapNum: floorIndex }, () => {
                    this.getNowFloorTarget();
                    this.setYSPos(id);
                    this.props.onFreshenFlag();
                });
                this.setTip(`迁跃成功！`);
            }
            else {
                this.setTip(`无法直接迁跃至第${floorIndex}层！`);
            }
        } catch (error) {
            console.log(error);
            alert("上楼时出现错误！");
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
            this.remove(doc);
            return;
        }
        /* 获取道具 */
        if (lx.includes("Item")) {
            // console.log("获取道具",doc)
            this.props.itemMapComponent.getItemEffect(lx);
            this.remove(doc);
            this.move(doc);
            return;
        }
        let state = this.state;
        let lxList = lx.split("_");
        let flag = false;
        if (lxList.length >= 2) {
            for (let i in state) {
                if (i === lxList[0]) {
                    state[i] += parseInt(lxList[1]);
                    flag = true;
                    this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
                    this.setState(state)
                    this.remove(doc);
                    this.move(doc);
                    break;
                }
            }
        }
        if (flag) return;

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
                this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
                this.setState({ YKey: this.state.YKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "BKey":
                this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
                this.setState({ BKey: this.state.BKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "RKey":
                this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
                this.setState({ RKey: this.state.RKey + 1 });
                this.remove(doc);
                this.move(doc);
                break;
            case "sword":
                this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
                this.setState({ gong: this.state.gong + 3 });
                this.remove(doc);
                this.move(doc);
                break;
            case "def":
                this.palyVoice('Audio/RPG魔塔音效素材/SE/获取物品.mp3');
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
    setAllState(data) {
        dispatch(actionCreators.setAllState(data))
    },
});
export default connect(mapState, mapProps)(MainWindow);