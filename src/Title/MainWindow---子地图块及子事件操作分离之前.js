import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
// import '../Monster/style.css'
import axios from 'axios'
// import style from './style.css'
import Menu from "../Menu"
import BaseMap from "../BaseMap"
import Shop from "../Shop"
import Monster from "../Monster"
import StoryWord from '../StoryWord'
// import CreateMap from "../CreateMap"

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
            // width: 5,
            // moveWidth: 6,
            // moveHeight: 6,

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

            baseMapPreloadFlag:false,
            monsterPreloadFlag:false,

            shopPreloadFlag:false,
            shopFlag: false,
            shop1Flag: false,
            shop2Flag: false,
            shopType: "",
            exitShowFlag: false,

            menuPreloadFlag:false,
            menuFlag: false,
            createMapFlag: false,

            storyPreloadFlag:false,
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
        axios.get('data/map.json')
            .then((res) => {
                const result = res.data;
                console.log('res', result);
                this.setState({ mapList: result });
            })
            .catch((error) => {
                console.log(error)
            })
        document.addEventListener("keydown", this.keyOn);
        // const fetchFile = async () => {
        //     let p = await axios.get('data/map.json')
        //         .then((res) => {
        //             const result = res.data;
        //             return result;
        //         })
        //         .catch((error) => {
        //             console.log(error)
        //         })
        //     console.log("p", p);
        //     return p;
        // }
        // let textData = [];
        // textData.push(fetchFile());
        // console.log("textData", textData);
        // console.log("textData[0]", textData[0]);
        // // textData.forEach((json) => { console.log("json-----", json);});
        // Promise.all(textData).then((data) => {
        //     console.log("data-----", data);

        // })


        // console.log("jsonData", jsonData);
        // Promise.all(result_begin).then((saveData) => {
        //     console.log("saveData-----", saveData);
        //     let dataList = [];
        //     saveData.forEach((json) => { dataList.push(JSON.parse(json)) });
        //     console.log("dataList", dataList);

        // }).catch(e => console.log(e));
    }

    componentDidMount() {
        // debugger
        this.setStory(true, "0_00_start");
        // setTimeout(() => {
        //     this.setStory(true, "0_00_start");
        // }, 2000);

        // axios.get('data/map.json')
        //     .then((res) => {
        //         const result = res.data;
        //         console.log('res', result);
        //         this.setState({ mapList: result });
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        // document.addEventListener("keydown", this.keyOn);
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        // console.log('mapList', this.state.mapList);
        // console.log("render");
        const { nowMapNum, mapList, nowM, menuPreloadFlag, storyPreloadFlag, baseMapPreloadFlag, shopPreloadFlag, monsterPreloadFlag,} = this.state;
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
                                {/* <img className="Status_fight_main_left_Img" src="img/text.png" /> */}
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
                                {/* <img className="Status_fight_main_right_Img" src="img/text.png" /> */}
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
                            {/* <div className="mtYS" id="mtYS" style={{}}>
                                    勇者
                                    <div className="mtYS_Img" style={{ backgroundImage: "URL(img/ys.png)" }}></div>
                                </div> */}
                        </div>
                    </div>
                    {/* <div className="floorNum">第{nowMapNum}层</div> */}
                    {this.state.finish ? <div className="game_over">勇者被打倒了！</div> : null}
                    {this.state.victory ? <div className="victory" lx="Congratulations Victory!">恭喜通关！</div> : null}
                </div>
                <Menu menuFlag={this.state.menuFlag} closeMenu={this.closeMenu} allState={this.state} setAllState={this.setAllState} menuComponentOnRef={this.menuComponentOnRef} setTip_split={this.setTip_split} menuPreloadFlag={menuPreloadFlag} setPreloadFlag={this.setPreloadFlag}/>
                <StoryWord storyWordFlag={this.state.storyWordFlag} nowStoryId={this.state.nowStoryId} setStory={this.setStory} closeStory={this.closeStory} setYSPos={this.setYSPos} storyWordComponentOnRef={this.storyWordComponentOnRef} nowMeetMap={this.state.nowMeetMap} nowMapNum={nowMapNum} mapList={mapList} setMapList={this.setMapList} move={this.move} returnTypeImg={this.returnTypeImg} storyPreloadFlag={storyPreloadFlag} setPreloadFlag={this.setPreloadFlag} />
                <BaseMap baseMapComponentOnRef={this.baseMapComponentOnRef} baseMapPreloadFlag={baseMapPreloadFlag} setPreloadFlag={this.setPreloadFlag}/>
                <Shop shopComponentOnRef={this.shopComponentOnRef} shopFlag={this.state.shopFlag} shopType={this.state.shopType} selectGoods={this.selectGoods} exitShop={this.exitShop} setTip={this.setTip} shopPreloadFlag={shopPreloadFlag} setPreloadFlag={this.setPreloadFlag}/>
                <Monster monsterComponentOnRef={this.monsterComponentOnRef} monsterPreloadFlag={monsterPreloadFlag} setPreloadFlag={this.setPreloadFlag}/>
                {/* {this.state.firstFlag ? this.setYSPos_First() : null} */}
            </Fragment>
        )
    }
    startGame = () => {
        this.setState({ startFlag: true });
        // this.setStory(true, "0_00_start");
        // setTimeout(() => {
        //     this.setYSPos();
        // }, 200);
    }
    setPreloadFlag=(name, value)=>{
        if(name && value){
            let data = {};
            data[name]=value;
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
        let plugin = document.getElementById("mtYS");
        // let plugin = this.createYS();
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
        // let plugin = document.getElementById("mtYS");
        // plugin = null;
        // plugin = this.createYS();
        // let plugin = document.getElementById("mtYS");
        // let width = this.state.mapList[this.state.nowMapNum].width;
        // let height = this.state.mapList[this.state.nowMapNum].map.length / width;
        // plugin.style.left = id % width * (100 / width) + "%";
        // plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
        this.setState(data);
        let plugin = document.getElementById("mtYS");
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
        // console.log("setAllState", doc, id);
        doc.appendChild(plugin);
        plugin.attributes["index"].nodeValue = id;
        // setTimeout(() => {
        //     debugger
        //     let plugin = document.getElementById("mtYS");
        //     let list = document.getElementsByTagName("div");
        //     let doc;
        //     for (let i = 0; i < list.length; i++) {
        //         let div = list[i];
        //         if (!div.attributes["index"])
        //             continue;
        //         if (id == div.attributes["index"].nodeValue * 1) {
        //             doc = div;
        //             break;
        //         }
        //     }
        //     // console.log("setAllState", doc, id);
        //     doc.appendChild(plugin);
        //     plugin.attributes["index"].nodeValue = id;
        // }, 2000);
    }
    openStory = () => {
        this.setState({ storyWordFlag: true })
    }
    closeStory = () => {
        this.setState({ storyWordFlag: false })
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
    /* 操作商店的主要函数 */
    selectGoods = (spend, get) => {
        let flag = true;
        for (let i in spend) {
            // eslint-disable-next-line no-unused-expressions
            let have = this.state[i];
            if (have < spend[i]) {
                flag = false;
                let text = this.changeSpendTipText(i);
                this.setTip(text);
                break;
            }
        }
        if (flag) {
            // debugger
            for (let i in spend) {
                let state = {};
                // eslint-disable-next-line no-unused-expressions
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
    changeShopType = (doc, lx) => {
        this.setState({
            shopFlag: true,
            shopType: lx,
        })
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
        //     // eslint-disable-next-line no-unused-expressions
        //     // window.electron ? window.electron.ipcRenderer.send("f12") : null;
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
        else if (this.state.fightFlag) {
            return;
        }
        // console.log('e', e, e.keyCode);

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
            case 81:         //打开菜单
                this.openMenu();
                break;
            default:
                break;
        }
    }
    /* */
    /* 返回地图块的主函数 */
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;
        /* 返回怪物 */
        if (map.includes("Monster")) {
            return this.monsterComponent.returnMonsterMap(map, index, nowMapNum);
        }
        /* 返回商店 */
        else if (map.includes("Shop")) {
            return this.shopComponent.returnShopMap(map, index, nowMapNum);
        }
        /* 返回剧情块 */
        else if (map.includes("Story")) {
            return this.storyWordComponent.returnStoryMap(map, index, nowMapNum);
        }
        else{
            return this.baseMapComponent.returnBaseMap(map, index, nowMapNum);
        }
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
            case "sword":
                return <div className="NormalMap" index={index} lx="sword" key={nowMapNum + "个" + index}>剑</div>;
            case "def":
                return <div className="NormalMap" index={index} lx="def" key={nowMapNum + "个" + index}>盾</div>;
            case "start":
                return (
                    <div className="NormalMap" index={index} lx="start" id="start" key={nowMapNum + "个" + index}>
                        起
                        {/* {this.state.firstFlag ?
                            <div className="mtYS" id="mtYS" index={index}>
                                <div className="mtYS_Img" style={{ backgroundImage: "URL(img/ys.png)" }}></div>
                            </div>
                            : null} */}
                        <div className="mtYS" id="mtYS" index={index}>
                            <div className="mtYS_Img" style={{ backgroundImage: "URL(img/ys.png)" }}></div>
                        </div>
                    </div>
                )
            case "end":
                return <div className="NormalMap" index={index} lx="end" key={nowMapNum + "个" + index}>终</div>;
            case "victory":
                return <div className="NormalMap" index={index} lx="victory" key={nowMapNum + "个" + index}>终</div>;
            default:
                return <div className="NormalMap" index={index} lx="no" key={nowMapNum + "个" + index}>无</div>;
        }
    }

    /* 处理有关勇者移动的函数 */
    up = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className="mtYS_Img_up";
        let id = plugin.attributes["index"].nodeValue * 1 - this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    down = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className="mtYS_Img_down";
        let id = plugin.attributes["index"].nodeValue * 1 + this.state.mapList[this.state.nowMapNum].width;
        this.handleMove(id);
    }
    left = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className="mtYS_Img_left";
        let id = plugin.attributes["index"].nodeValue * 1 - 1;
        this.handleMove(id);
    }
    right = () => {
        let plugin = document.getElementById("mtYS");
        plugin.className="mtYS_Img_right";
        let id = plugin.attributes["index"].nodeValue * 1 + 1;
        this.handleMove(id);
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
        this.whenMeet(doc);
    }

    move = (doc1) => {
        // debugger
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
        // doc.innerText = "无";
        nowMap[id] = "no";
        mapList[nowMapNum].map = nowMap;
        this.setState({ mapList: mapList });
    }
    /* */
    /* 处理有关菜单事件的函数 */
    openMenu = () => {
        this.setState({ menuFlag: true })
    }
    closeMenu = () => {
        this.setState({ menuFlag: false })
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
        // debugger
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
                    console.log("nowM", this.state.nowM);
                    // debugger
                    this.setState({ fightTipFlag: true, fightTipWord: "战斗胜利！", fightStatusShowFlag: false });
                    this.remove(doc);
                    this.move(doc);
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
    /* 显示商店等事件的普遍提示函数 */
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
    /* 处理地图之间移动的函数 */
    upMap(doc) {
        let nowMapNum = JSON.parse(JSON.stringify(this.state.nowMapNum));
        if (nowMapNum > 0) {
            let nowMap = this.state.mapList[nowMapNum - 1].map;
            // let plugin = document.getElementById("mtYS");
            // let plugin = document.getElementById("mtYS");
            // plugin = null;
            // plugin = this.createYS();
            let id;
            nowMap.map((map, index) => {
                if (map == "end")
                    id = index;
            })
            if (id) {
                // let width = this.state.mapList[this.state.nowMapNum - 1].width;
                // let height = this.state.mapList[this.state.nowMapNum - 1].map.length / width;
                // plugin.style.left = id % width * (100 / width) + "%";
                // plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
                // plugin.attributes["index"].nodeValue = id;
                this.setState({ nowMapNum: nowMapNum - 1 });
                let plugin = document.getElementById("mtYS");
                // plugin = null;
                // plugin = this.createYS();
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
            // let plugin = document.getElementById("mtYS");

            let id;
            nowMap.map((map, index) => {
                if (map == "start")
                    id = index;
            })
            if (id) {
                // let width = this.state.mapList[this.state.nowMapNum + 1].width;
                // let height = this.state.mapList[this.state.nowMapNum + 1].map.length / width;
                // plugin.style.left = id % width * (100 / width) + "%";
                // plugin.style.top = Math.floor(id / width) * (100 / height) + "%";
                // plugin.attributes["index"].nodeValue = id;
                this.setState({ nowMapNum: nowMapNum + 1 });
                let plugin = document.getElementById("mtYS");
                // plugin = null;
                // plugin = this.createYS();
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
        let lx = doc.attributes["lx"].nodeValue;
        /* 与怪物战斗 */
        if (lx.includes("Monster")) {
            this.fight(doc);
            return;
        }
        /* 与商人交易 */
        if (lx.includes("Shop")) {
            this.changeShopType(doc, lx);
            return;
        }
        /* 触发剧情 */
        if (lx.includes("Story")) {
            // this.move(doc);
            let storyId = doc.attributes["storyId"].nodeValue;
            this.setStory(true, storyId);
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

    /* 返回类型对应的图片地址 */
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
    /********    ********/
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(MainWindow);