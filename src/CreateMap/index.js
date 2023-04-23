/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Pagination } from 'antd';
// import '../../public/css/antd.css'
import './style.css'
import axios from 'axios'
import LeftSilder from "./LeftSilder";
import ReturnMap from "./ReturnMap";
import BaseMap from "./BaseMap";
import MonsterMap from "./MonsterMap";
import ShopMap from "./ShopMap";
import StoryMap from "./StoryMap";
import ItemMap from "./ItemMap";

class CreateMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMapList: [],

            nowMap: [],//当前展示地图
            nowDefaultMap: [],//当前地图原始数据
            nowMapNum: 0,
            middleWidth: 10,
            middleHeight: 10,
            shopList: [],
            monsterList: [],
            storyList: [],
            RightMenu_TabList: [
                { name: "基础", url: "data/baseMap/baseMap1.json" },
                { name: "道具", url: "data/baseMap/itemMap1.json" },
                { name: "怪物", url: "data/baseMap/monsterMap1.json" },
                { name: "商店", url: "data/baseMap/shopMap1.json" },
                { name: "事件", url: "data/baseMap/storyMap1.json" },
            ],
            nowShowTab: 0,
            nowClickAddMap: undefined,  //{}

            saveMapName: 0,

            showMiddleFlag: false,
            mouseDownFlag: false,
            onChangeMapFlag: false,

            pageSizeCount: 27,  //每行3个，一共可展示9行
            nowClassAllCount: 0,    //当前的地图类型列表数量
            nowAllList: [],          //当前的地图类型列表
            nowCurrentPage: 1,

            hoverShowInfoFlag: false,
            nowHoverMapInfo: undefined,
            hoverMapPos: { left: 0, top: 0 },

            rightMenuRefreshFlag: false,
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadMap', function (event, loadMap) {
            console.log('所有地图-----', loadMap);
            _this.setState({ loadMapList: loadMap });
        }) : null;
        window.electron ? window.electron.ipcRenderer.on('Refresh', function (event) {
            // const { nowMap } = _this.state;
            _this.initValues();
            _this.setState({ rightMenuRefreshFlag: true }, () => {
                _this.setState({ rightMenuRefreshFlag: false, })
                // setTimeout(() => {
                //     _this.setState({ nowMap: nowMap })
                // }, 1000);
            })
        }) : null;
    }

    componentDidMount = () => {
        const { middleWidth, middleHeight } = this.state;
        let map = [];
        for (let i = 0; i < middleWidth; i++) {
            for (let j = 0; j < middleHeight; j++) {
                map.push("no");
            }
        }
        this.setState({ nowMap: map });
        this.initValues();
    }

    render() {
        const { nowMap, nowDefaultMap, nowMapNum, middleWidth, middleHeight, RightMenu_TabList, nowShowTab, onChangeMapFlag, rightMenuRefreshFlag, nowClickAddMap,
            pageSizeCount, nowClassAllCount, nowCurrentPage, nowAllList, hoverShowInfoFlag, nowHoverMapInfo } = this.state;
        let num = JSON.parse(JSON.stringify(this.state.middleWidth));
        return (
            <Fragment>
                {/* {this.props.createMapFlag ? */}
                <div className="CreateMap_Main" >
                    <LeftSilder nowMap={nowMap} nowDefaultMap={nowDefaultMap} setMap={this.setMap} RightMenu_TabList={RightMenu_TabList} nowShowTab={nowShowTab} onChangeMapFlag={onChangeMapFlag} Exit={this.Exit} returnRightContent={this.returnRightContent} nowClickAddMap={nowClickAddMap}
                        middleWidth={middleWidth} middleHeight={middleHeight} changeMiddleWidth={this.changeMiddleWidth} changeMiddleHeight={this.changeMiddleHeight} nowAllList={nowAllList} />
                    <div className="CreateMap_MiddleContent">
                        <div className={middleWidth > 10 ? "CreateMap_MiddleContent_Main_big" : "CreateMap_MiddleContent_Main"} onMouseDown={() => this.setState({ mouseDownFlag: true })} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseLeave={() => this.setState({ mouseDownFlag: false })}>
                            {nowMap.map((map, index) => {
                                if (index + 1 == num) {
                                    num += middleWidth;
                                    return (
                                        <div className={middleWidth > 10 ? "MapColumn_big" : "MapColumn"} key={nowMapNum + "行" + Math.floor(num / middleWidth)}>
                                            {nowMap.map((map2, index2) => {
                                                if (index2 >= index + 1 - middleWidth && index2 <= index) {
                                                    return this.returnMap(map2, index2);
                                                }
                                            })}
                                        </div>
                                    )
                                }
                            })}
                        </div>
                    </div>
                    <div className="CreateMap_RightMenu">
                        <div className="CreateMap_RightMenu_Tabs">
                            {RightMenu_TabList.map((tab, index) => {
                                return (
                                    <div className={nowShowTab === index ? "CreateMap_RightMenu_Tab_Click" : "CreateMap_RightMenu_Tab"} onClick={() => this.setState({ nowShowTab: index })}>{tab.name}</div>
                                )
                            })}
                        </div>
                        <div className="CreateMap_RightMenu_Content">
                            <div className="CreateMap_RightMenu_Content_Main">
                                {!rightMenuRefreshFlag ? this.returnRightContent() : null}
                                {hoverShowInfoFlag ?
                                    this.returnNowHoverMapInfo()
                                    : null}
                            </div>
                        </div>
                        <div className="CreateMap_RightMenu_Pagination">
                            <Pagination size='small' defaultPageSize={pageSizeCount} current={nowCurrentPage} total={nowClassAllCount} showSizeChanger={false} onChange={this.changeNowPage} />
                        </div>
                    </div>
                </div>
                {/* : null} */}
                {!rightMenuRefreshFlag ?
                    <ReturnMap changeMiddleMap={this.changeMiddleMap} mouseDownFlag={this.state.mouseDownFlag} returnMapComponentOnRef={this.returnMapComponentOnRef}
                        middleWidth={middleWidth} middleHeight={middleHeight} />
                    : null}
            </Fragment>
        )
    }

    /* 左侧菜单 */
    saveNowMap = () => {    //之后给保存成功做界面显示反馈
        let data = this.state.nowMap;
        let jsonData = JSON.stringify(data);
        let saveData = this.splitStringData(jsonData);
        let filename = this.state.saveMapName;
        window.electron ? window.electron.ipcRenderer.send("SaveCreateMap", filename, saveData) : null;
    }
    loadMap = () => {           //读取地图
        let url = "public/data/createMap";
        window.electron ? window.electron.ipcRenderer.send("getAllMapData", url) : null;
    }
    loadMap_json = () => {           //读取地图
        let url = "public/data/createMap";
        window.electron ? window.electron.ipcRenderer.send("getMapData_json", url) : null;
    }
    open = (e, data) => {       //原用以测试‘JSON.stringify()’函数的功能，现暂未测试成功
        console.log("e", e, data);
        return "data";
    }
    splitStringData = (string) => { //将json字符串中每固定数值的点之间，加入\n。
        let list = string.split(",");
        let saveData = "";
        let widthNum = this.state.middleWidth;
        for (let i = 0; i < list.length; i++) {
            if (i === list.length - 1) {
                saveData += list[i];
                break;
            }
            saveData += list[i] + ",";
            if ((i + 1) % widthNum === 0)
                saveData += "\n"
        }
        return saveData;
    }
    changeMiddleWidth = (num) => {     //改变地图宽度
        this.setState({ middleWidth: num });
    }
    changeMiddleHeight = (num) => {     //改变地图高度
        this.setState({ middleHeight: num });
    }
    /* */

    /* 返回地图块的主函数 */
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;
        return this.returnMapComponent.returnMap(map, index);
    }
    changeMiddleMap = (index) => {
        let nowClickAddMap = this.state.nowClickAddMap;
        if (!nowClickAddMap)
            return;
        let nowMap = [...this.state.nowMap];
        nowMap[index] = nowClickAddMap.lx;
        this.setState({ nowMap: nowMap, onChangeMapFlag: true });
    }
    setMap = (map) => {
        this.setState({ nowMap: map, nowDefaultMap: map, onChangeMapFlag: false });
    }

    /* 右侧菜单相关 */
    returnRightContent = (flag = false) => {
        const { nowShowTab, nowCurrentPage, pageSizeCount } = this.state;
        const { clickAddMap, setAllCount, setNowAllList, showHoverMapInfo, outOfHoverMapInfo } = this;
        let sendToMap = { nowCurrentPage, pageSizeCount };
        let sendToFunciton = { clickAddMap, setAllCount, setNowAllList, showHoverMapInfo, outOfHoverMapInfo };
        if (flag) return <BaseMap {...sendToFunciton} {...sendToMap} limitCount={"unlimited"} />;
        switch (nowShowTab) {
            case 0:
                return <BaseMap {...sendToFunciton} {...sendToMap} />;
            case 1:
                return <ItemMap {...sendToFunciton} {...sendToMap} />;
            case 2:
                return <MonsterMap {...sendToFunciton} {...sendToMap} />;
            case 3:
                return <ShopMap {...sendToFunciton} {...sendToMap} />;
            case 4:
                return <StoryMap {...sendToFunciton} {...sendToMap} />;
            default:
                return;
        }
    }
    //设置当前类型的所有数量，使分页器能获取到total
    setAllCount = (num) => {
        this.setState({ nowClassAllCount: num });
    }
    //设置当前引用的类型列表，目前写这个函数的时候，主要是为了方便导入新地图块时，能够识别lx是否重复，并能自动生成不重复的默认名
    setNowAllList = (list) => {
        this.setState({ nowAllList: list });
    }
    changeNowPage = (page) => {
        this.setState({ nowCurrentPage: page });
    }
    clickAddMap = (map) => {
        console.log("clickAddMap", map);
        this.setState({ nowClickAddMap: map });
    }

    //展示hover的信息
    returnNowHoverMapInfo = () => {
        const { nowHoverMapInfo, hoverMapPos } = this.state;
        let list = [];
        for (let i in nowHoverMapInfo) {
            if (i === "describe") break;
            if (i === "play") continue;
            if (i === "get" || i === "spend") {
                let beforeName = i === "get" ? "获得" : "花费";
                let getOrSpendThings = [];
                for (let j in nowHoverMapInfo[i]) getOrSpendThings.push({ name: j, value: nowHoverMapInfo[i][j] })
                getOrSpendThings.map((thing) => {
                    let div = <div className="CreateMap_RightMenu_Content_MapInfo">{`${beforeName}：${this.returnAttributeToWord(thing.name)}——${thing.value}`}</div>
                    list.push(div);
                })
                continue;
            }
            let div = <div className="CreateMap_RightMenu_Content_MapInfo">{`${this.returnAttributeToWord(i)}：${nowHoverMapInfo[i]}`}</div>
            list.push(div);
        }
        let map = <div className="CreateMap_RightMenu_Content_MapInfoColumn" style={{ left: 0, top: hoverMapPos.top + "vh" }}>
            {list.map((data) => {
                return data;
            })}
        </div>
        return map;
    }
    returnAttributeToWord = (attribute) => {
        switch (attribute) {
            case "monsterID": return "序号";
            case "monsterName": return "名称";
            case "life": return "生命值";
            case "gong": return "攻击力";
            case "fang": return "防御力";
            case "baojilv": return "暴击率";
            case "baojishanghai": return "暴击伤害";
            case "level": return "等级";
            case "levelNum": return "经验";
            case "gold": return "金币";
            case "YKey": return "黄钥匙";
            case "BKey": return "蓝钥匙";
            case "RKey": return "红钥匙";
            default: return attribute;
        }
    }
    showHoverMapInfo = (info, index1, e) => {
        let limitCount = 3;
        let pageLimitCount = 27;
        let heigtNum = 10;
        let index = index1 % pageLimitCount;
        let columnNum = Math.ceil((index + 1) / limitCount);
        if (columnNum >= 6) columnNum -= 5;
        let hoverMapPos = { left: e.pageX, top: e.pageY };
        let hoverMapPos1 = { left: e.pageX, top: columnNum * heigtNum };
        // console.log("showHoverMapInfo", info, e, e.pageX, e.clientX, e.screenX);
        this.setState({ nowHoverMapInfo: info, hoverShowInfoFlag: true, hoverMapPos: hoverMapPos1 });
    }
    outOfHoverMapInfo = () => {
        this.setState({ nowHoverMapInfo: undefined, hoverShowInfoFlag: false });
    }
    /**/

    Exit = () => {
        this.props.history.push("/");
        // this.props.closeCreateMap();
    }

    initValues = () => {
        // const { middleWidth, middleHeight } = this.state;
        this.loadMap();
        // let map = [];
        // for (let i = 0; i < middleWidth; i++) {
        //     for (let j = 0; j < middleHeight; j++) {
        //         map.push("no");
        //     }
        // }
        // this.setState({ nowMap: map });
        axios.get('data/gameData/shopList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ shopList: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/gameData/monsterList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ monsterList: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get("data/story/storyList.json")
            .then((res) => {
                const result = res.data;
                this.setState({ storyList: result })
            }).catch((e) => {
                console.log(e);
            })
        setTimeout(() => {      //权宜之计
            this.setState({ showMiddleFlag: true });
        }, 1000);
    }

    /********  各类子组件  ********/
    /*1，返回地图块函数群 */
    returnMapComponentOnRef = (ref) => {
        this.returnMapComponent = ref;
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
export default connect(mapState, mapProps)(CreateMap);