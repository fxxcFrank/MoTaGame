/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'
import LeftSilder from "./LeftSilder";
import ReturnMap from "./ReturnMap";
import BaseMap from "./BaseMap";
import MonsterMap from "./MonsterMap";
import ShopMap from "./ShopMap";
import StoryMap from "./StoryMap";

class CreateMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMapList: [],

            nowMap: [],
            nowMapNum: 0,
            middleWidth: 10,
            middleHeight: 10,
            shopList: [],
            monsterList: [],
            storyList: [],
            RightMenu_TabList: ["常用", "基础", "怪物", "商店", "事件",],
            nowShowTab: 0,
            nowClickAddMap: undefined,  //{}

            saveMapName: 0,

            showMiddleFlag: false,
            mouseDownFlag: false,
            onChangeMapFlag:false,
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadMap', function (event, loadMap) {
            console.log('所有地图-----', loadMap);
            _this.setState({ loadMapList: loadMap });
        }) : null;
    }

    componentDidMount = () => {
        const { middleWidth, middleHeight } = this.state;
        this.loadMap();
        let map = [];
        for (let i = 0; i < middleWidth; i++) {
            for (let j = 0; j < middleHeight; j++) {
                map.push("no");
            }
        }
        this.setState({ nowMap: map });
        axios.get('data/shopList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ shopList: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/monsterList.json')
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

    render() {
        const { nowMap, nowMapNum, middleWidth, nowShowTab,onChangeMapFlag } = this.state;
        let num = JSON.parse(JSON.stringify(this.state.middleWidth));
        return (
            <Fragment>
                {this.props.createMapFlag ?
                    <div className="CreateMap_Main" >
                        <LeftSilder nowMap={nowMap} setMap={this.setMap} onChangeMapFlag={onChangeMapFlag} Exit={this.Exit}/>
                        <div className="CreateMap_MiddleContent" onMouseDown={() => this.setState({ mouseDownFlag: true })} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseLeave={() => this.setState({ mouseDownFlag: false })}>
                            {nowMap.map((map, index) => {
                                if (index + 1 == num) {
                                    num += middleWidth;
                                    return (
                                        <div className="MapColumn" key={nowMapNum + "行" + Math.floor(num / middleWidth)}>
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
                        <div className="CreateMap_RightMenu">
                            <div className="CreateMap_RightMenu_Tabs">
                                {this.state.RightMenu_TabList.map((tab, index) => {
                                    return (
                                        <div className={nowShowTab === index ? "CreateMap_RightMenu_Tab_Click" : "CreateMap_RightMenu_Tab"} onClick={() => this.setState({ nowShowTab: index })}>{tab}</div>
                                    )
                                })}
                            </div>
                            <div className="CreateMap_RightMenu_Content">
                                {this.returnRightContent()}
                            </div>
                        </div>
                    </div>
                    : null}
                <ReturnMap changeMiddleMap={this.changeMiddleMap} mouseDownFlag={this.state.mouseDownFlag} returnMapComponentOnRef={this.returnMapComponentOnRef} />
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
        this.setState({ nowMap: nowMap,onChangeMapFlag:true });
    }
    setMap=(map)=>{
        this.setState({ nowMap: map,onChangeMapFlag:false });
    }

    /* 右侧菜单相关 */
    returnRightContent = () => {
        let nowShowTab = this.state.nowShowTab;
        switch (nowShowTab) {
            case 0:
                return <BaseMap clickAddMap={this.clickAddMap} />;
            case 1:
                return <BaseMap clickAddMap={this.clickAddMap} />;
            case 2:
                return <MonsterMap clickAddMap={this.clickAddMap} />;
            case 3:
                return <ShopMap clickAddMap={this.clickAddMap} />;
            case 4:
                return <StoryMap clickAddMap={this.clickAddMap} />;
            default:
                return;
        }
    }
    clickAddMap = (map) => {
        console.log("clickAddMap", map);
        this.setState({ nowClickAddMap: map });
    }
    /**/

    Exit = () => {
        this.props.closeCreateMap();
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