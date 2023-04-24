/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal, Slider } from 'antd'
import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import './itemsStyle.css'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMapFlag: false,//打开手册
            firstFlag: true,
            scaleCount: 1.0,  //缩放倍数
        }
        document.addEventListener("keydown", this.keyOn);
    }
    componentDidUpdate() {
        const { showMapFlag, firstFlag } = this.state;
        if (showMapFlag) {
            this.mapDarg();
            this.returnYSPosCenter();
            this.stopScrollFromKeyCode();
            // this.setState({ firstFlag: false });
        }
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { showMapFlag, scaleCount } = this.state;
        const { allState } = this.props;
        if (!allState.mapList) {
            return null;
        }

        const nowMap = allState.mapList ? allState.mapList[allState.nowMapNum] : [];
        const nowMapWidth = nowMap.width;
        const nowMapHeight = nowMap.map.length > 0 ? nowMap.map.length / nowMap.width : 0;
        const nowMinWidthHeight = nowMapWidth < nowMapHeight ? nowMapWidth : nowMapHeight;
        const mapItemWidth = 7.5 * scaleCount + 'vmin';
        const plugin = document.getElementById("mtYS");
        const YSPos = plugin ? parseInt(plugin.attributes["index"].nodeValue) : 0;
        //'--nowMapWidth:10,--nowMapLength:10'
        return (
            <Fragment>
                {showMapFlag ?
                    <div className="Map_Mask">
                        <div className="Map_Main" id="Map_Main">
                            <div className="Map_Content" id="Map_Content" style={{
                                '--nowMapWidth': nowMapWidth, '--nowMapHeight': nowMapHeight, '--mapItemWidth': mapItemWidth,
                                ...this.returnNowMap_bigStyle(nowMapWidth, nowMapHeight)
                            }}>
                                {nowMap.map.map((map, index) => {
                                    return this.returnMap(map, index, YSPos);
                                })}
                            </div>
                        </div>
                        <div className="Map_Scale">
                            <PlusSquareOutlined onClick={() => this.changeScaleCount(0.1)} />
                            <Slider vertical value={scaleCount} min={0.1} max={2} onChange={this.scaleCountChange} tooltip={false} />
                            <MinusSquareOutlined onClick={() => this.changeScaleCount(-0.1)} />
                            <div>{scaleCount.toFixed(1)}</div>
                        </div>
                    </div>
                    : null}
            </Fragment>
        )
    }

    keyOn = (e) => {
        const { showMapFlag, limitFloorNum } = this.state;
        let keyCode = e.keyCode;
        if (keyCode === 77) {       //地图快捷键————M
            if (showMapFlag) {
                this.closeShowMap();
                return;
            }
            if (!this.props.allState.mapList || (showMapFlag))
                return;
            // this.props.openAbility();   //打开能力监听覆盖
            this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
            this.openShowMap();
        }
        else if (keyCode === 88) {    //关闭快捷键————X
            this.closeAllThingFirst();
        }
        if (!showMapFlag)  //为了防止和其他能力的调用重复，每个能力都在本地控制一下按键应用范围
            return;
    }
    //根据地图块返回地图
    returnMap = (map, index,) => {
        // console.log("returnMap", map, index, YSPos, map.includes("end"),);
        let plugin = document.getElementById("mtYS");
        let YSPos = parseInt(plugin.attributes["index"].nodeValue);
        if (map.includes("no") || map.includes("Item") || map.includes("Monster") || map.includes("Door")) {
            if (index === YSPos) {
                return (
                    <div className="Map_ContentRoad">
                        <div className="Map_ContentYSPos" id="Map_ContentYSPos" />
                    </div>
                )
            }
            return <div className="Map_ContentRoad" />
        }
        else if (map.includes("start")) {
            if (index === YSPos) {
                return (
                    <div className="Map_ContentStart">
                        <div className="Map_ContentYSPos" id="Map_ContentYSPos" />
                    </div>
                )
            }
            return <div className="Map_ContentStart" />
        }
        else if (map.includes("end")) {
            if (index === YSPos) {
                return (
                    <div className="Map_ContentEnd">
                        <div className="Map_ContentYSPos" id="Map_ContentYSPos" />
                    </div>
                )
            }
            return <div className="Map_ContentEnd" />
        }
        else {
            return <div className="Map_ContentWall" />
        }
    }

    //鼠标拖拽实现地图拖拽
    mapDarg = () => {
        let scrollContainer = document.getElementById("Map_Main");
        let dragContainer = document.getElementById("Map_Content");
        dragContainer.onmousedown = e => {
            //鼠标按下那一刻，滚动条的位置
            let mouseDownScrollPosition = {
                scrollLeft: scrollContainer.scrollLeft,
                scrollTop: scrollContainer.scrollTop
            };
            //鼠标按下的位置坐标
            let mouseDownPoint = {
                x: e.clientX,
                y: e.clientY
            };
            dragContainer.onmousemove = e => {
                //鼠标滑动的实时距离
                let dragMoveDiff = {
                    x: mouseDownPoint.x - e.clientX,
                    y: mouseDownPoint.y - e.clientY
                };
                scrollContainer.scrollLeft = mouseDownScrollPosition.scrollLeft + dragMoveDiff.x;
                scrollContainer.scrollTop = mouseDownScrollPosition.scrollTop + dragMoveDiff.y;
            };
            document.onmouseup = e => {
                dragContainer.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }
    //希望阻止方向键移动scroll，并且使用方向键正常变化地图（目前已实现前半句）
    stopScrollFromKeyCode = () => {
        document.onkeydown = function (e) {
            e = e || event;
            if (e.keyCode == 37) {
                //你自己的代码
                return false;
            }
            if (e.keyCode == 38) {
                //你自己的代码
                return false;
            }
            if (e.keyCode == 39) {
                //你自己的代码
                return false;
            }
            if (e.keyCode == 40) {
                //你自己的代码
                return false;
            }
        }
    }
    /* 当当前地图大于一定大小时（目前为10*10），跟随移动让画面进行卷轴移动 */
    returnNowMap_bigStyle = (nowMapWidth, nowMapHeight) => {
        let width = nowMapWidth;
        let height = nowMapHeight;

        let style = { left: 0, top: 0 } //目前一格大小为宽8vw、高10vh，目前地图位置为从左上角对齐
        let plugin = document.getElementById("mtYS");
        let id = parseInt(plugin.attributes["index"].nodeValue);
        let nowPosLeft = (id) % width;
        let nowPosTop = Math.ceil((id) / height);
        // console.log("returnNowMap_bigStyle", id + 1,width, height, nowPosLeft, nowPosTop)
        let widthLimitCount = 5;       //视口宽度，实际会*2，目前也就是10（格）
        let heightLimitCount = 5;      //视口高度，实际会*2，目前也就是10（格）
        let widthLimit = 0.5;
        let heightLimit = 0.5;
        let oneLeft = -7.5;   //一个格子的宽
        let oneTop = -7.5;   //一个格子的高
        let nowShouldLeft = nowPosLeft - widthLimitCount;
        let nowShouldTop = nowPosTop - heightLimitCount;
        style.left = nowShouldLeft * oneLeft + "vmin";
        style.top = nowShouldTop * oneTop + "vmin";
        if (nowShouldLeft <= 0) style.left = 0;
        if (nowShouldTop <= 0) style.top = 0;
        if (nowShouldLeft + widthLimitCount * 2 >= width) style.left = (width - widthLimitCount * 2) * oneLeft + "vmin";
        if (nowShouldTop + heightLimitCount * 2 >= height) style.top = (height - heightLimitCount * 2) * oneTop + "vmin";
        return style;
    }
    /* */
    //勇者位置复位
    returnYSPosCenter = () => {
        let plugin = document.getElementById(`Map_ContentYSPos`);
        if (!plugin) return;
        plugin.scrollIntoView({
            behavior: "auto",
            // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
            block: "center",
            // 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"
            inline: "center"
            // 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"
        })
    }
    returnYSPosCenterForAnime = () => {
        let plugin = document.getElementById(`Map_ContentYSPos`);
        if (!plugin) return;
        plugin.scrollIntoView({
            behavior: "smooth",
            // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
            block: "center",
            // 定义垂直方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "start"
            inline: "center"
            // 定义水平方向的对齐， "start", "center", "end", 或 "nearest"之一。默认为 "nearest"
        })
    }
    //当前地图缩放倍数
    scaleCountChange = (num) => {
        this.setState({ scaleCount: num });
    }
    //修改地图缩放
    changeScaleCount = (num) => {
        const { scaleCount } = this.state;
        if (scaleCount + num > 0 && scaleCount + num < 2) this.setState({ scaleCount: scaleCount + num })
    }
    //打开、关闭地图
    openShowMap = () => {
        console.log("openShowMap", this.props.allState);
        this.setState({ showMapFlag: true })
    }
    closeShowMap = () => {
        console.log("closeShowMap", this.props.allState);
        // this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ showMapFlag: false, })
    }

    //关闭当前最上层展示的提示框或界面（仅限于当前能力）
    closeAllThingFirst = () => {
        const { showMapFlag, } = this.state;
        if (showMapFlag) {
            this.closeShowMap();
        }
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Map);