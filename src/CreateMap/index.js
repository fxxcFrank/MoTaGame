import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'
import ReturnMap from "./ReturnMap";
import BaseMap from "./BaseMap";
import MonsterMap from "./MonsterMap";
import ShopMap from "./ShopMap";
import StoryMap from "./StoryMap";

class CreateMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            mouseDownFlag: false
        }
    }

    // componentWillMount = () => {

    // }

    componentDidMount = () => {
        const { middleWidth, middleHeight } = this.state;
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
            this.setState({showMiddleFlag:true});
        }, 1000);
    }

    render() {
        const { nowMap, nowMapNum, middleWidth, nowShowTab } = this.state;
        let num = JSON.parse(JSON.stringify(this.state.middleWidth));
        return (
            <Fragment>
                {this.props.createMapFlag ?
                    <div className="CreateMap_Main" >
                        <div className="CreateMap_LeftMenu">
                            <div className="CreateMap_LeftMenu_TreeDir"></div>
                            <input onChange={(e) => this.setState({ saveMapName: e.target.value })} value={this.state.saveMapName} />
                            <div className="CreateMap_LeftMenu_Buttons">
                                <div className="CreateMap_LeftMenu_Button" onClick={() => this.saveNowMap()}>保存</div>
                                <div className="CreateMap_LeftMenu_Button">读取（暂未实现）</div>
                            </div>
                        </div>
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
                                {/* {this.state.showMiddleFlag ? this.returnRightContent() : null} */}
                                {this.returnRightContent()}
                                {/* <BaseMap clickAddMap={this.clickAddMap} baseMapComponentOnRef={this.baseMapComponentOnRef} /> */}
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
        // let jsonData2 = JSON.stringify(data, null, "\t");
        // let jsonData2 = JSON.stringify(data, (e) => this.open(e, data), "\t");
        // console.log("jsonData2",jsonData,jsonData2);
        let filename = this.state.saveMapName;
        // let fileData = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
        window.electron.ipcRenderer.send("SaveCreateMap", filename, saveData);
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
        // console.log("splitStringData", string, list, saveData);
        return saveData;
    }
    /* */

    /* 返回地图块的主函数 */
    returnMap(map, index) {
        let nowMapNum = this.state.nowMapNum;

        return this.returnMapComponent.returnMap(map, index);
        // /* 返回怪物 */
        // if (map.includes("Monster")) {
        //     return this.returnMapComponent.returnMonsterMap(map, index);
        // }
        // /* 返回商店 */
        // else if (map.includes("Shop")) {
        //     return this.returnMapComponent.returnShopMap(map, index);
        // }
        // /* 返回剧情块 */
        // else if (map.includes("Story")) {
        //     return this.returnMapComponent.returnStoryMap(map, index);
        // }
        // /* 返回基础图元 */
        // else {
        //     // console.log(map, this.returnMapComponent);
        //     if (this.returnMapComponent) {
        //         return this.returnMapComponent.returnBaseMap(map, index);
        //     }
        // }
    }
    changeMiddleMap = (index) => {
        let nowClickAddMap = this.state.nowClickAddMap;
        if (!nowClickAddMap)
            return;
        let nowMap = [...this.state.nowMap];

        nowMap[index] = nowClickAddMap.lx;
        console.log("changeMiddleMap", index, nowClickAddMap, nowMap[index]);
        this.setState({ nowMap: nowMap });
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
                // return <BaseMap clickAddMap={this.clickAddMap} baseMapComponentOnRef={this.baseMapComponentOnRef} />;
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
    // /*2，怪物 */
    // monsterComponentOnRef = (ref) => {
    //     this.monsterComponent = ref;
    // }
    // /*3，剧情 */
    // storyComponentOnRef = (ref) => {
    //     this.storyComponent = ref;
    // }
    // /*4，菜单 */
    // baseMapComponentOnRef = (ref) => {
    //     this.baseMapComponent = ref;
    // }
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