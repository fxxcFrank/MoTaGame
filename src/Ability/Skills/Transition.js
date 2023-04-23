/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import './skillsStyle.css'

class Transition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowSelectFloor: {},
            nowSelectFloorIndex: 0,
            limitFloorNum: 5,

            showFloorInfoFlag: false,//打开手册
        }
        document.addEventListener("keydown", this.keyOn);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { nowSelectFloor, nowSelectFloorIndex, showFloorInfoFlag, limitFloorNum } = this.state;
        const { allState } = this.props;
        if (!allState.mapList) {
            return null;
        }
        const allLength = allState.mapList ? allState.mapList.length : -1;
        return (
            <Fragment>
                {showFloorInfoFlag ?
                    <div className="ExplorationContent_Main">
                        {allState.mapList.map((mapInfo, index) => {
                            if ((index + 1) % limitFloorNum === 0) {
                                return (
                                    <div className="TransitionContent_Column">
                                        {allState.mapList.map((mapInfo2, index2) => {
                                            if (index2 >= index - limitFloorNum + 1 && index2 <= index) {
                                                return (
                                                    <div className={nowSelectFloorIndex === index2 ? "TransitionContent_Column_Text_focus" : "TransitionContent_Column_Text"}
                                                        key={`${mapInfo.name}-${index2}`}>
                                                        {mapInfo2.name}
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                )
                            }
                            else if ((index + 1) === allLength) {
                                return (
                                    <div className="TransitionContent_Column">
                                        {allState.mapList.map((mapInfo2, index2) => {
                                            if (index2 >= index - (allLength % limitFloorNum) + 1 && index2 <= index) {
                                                return (
                                                    <div className={nowSelectFloorIndex === index2 ? "TransitionContent_Column_Text_focus" : "TransitionContent_Column_Text"}
                                                        key={`${mapInfo.name}-${index2}`}>
                                                        {mapInfo2.name}
                                                    </div>
                                                )
                                            }
                                        })}
                                        {this.returnOtherMap(index, allLength).map((plugin) => {
                                            return plugin;
                                        })}
                                    </div>
                                )
                            }
                        })}
                    </div>
                    : null}
            </Fragment>
        )
    }

    keyOn = (e) => {
        const { showFloorInfoFlag, limitFloorNum } = this.state;
        let keyCode = e.keyCode;
        if (keyCode === 75) {       //迁跃快捷键————K
            if (showFloorInfoFlag) {
                this.openShowFloorInfo();
                return;
            }
            if (!this.props.allState.mapList || (showFloorInfoFlag))
                return;
            this.props.openAbility();   //打开能力监听覆盖
            this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
            this.openShowFloorInfo();
        }
        else if (keyCode === 88) {    //关闭快捷键————X
            this.closeAllThingFirst();
        }
        if (!showFloorInfoFlag)  //为了防止和其他能力的调用重复，每个能力都在本地控制一下按键应用范围
            return;
        if (showFloorInfoFlag) {
            switch (keyCode) {
                case 37:       //方向键左
                    this.changeSelectFloor(-1);
                    break;
                case 38:       //方向键上
                    this.changeSelectFloor(-limitFloorNum);
                    break;
                case 39:       //方向键右
                    this.changeSelectFloor(1);
                    break;
                case 40:       //方向键下
                    this.changeSelectFloor(limitFloorNum);
                    break;
                case 13:        //enter
                    this.selectFloor(this.state.nowSelectFloorIndex);
                    break;
                default:
                    break;
            }
        }
    }
    //所选对象是否探查选择 取消/确认 （因为探查失败会自动开始战斗，嘛，虽然没有提示，但是失败几次就明白了，前期难度预期不算难）
    changeSelectFloor = (num) => {
        const { nowSelectFloorIndex } = this.state;
        const { allState } = this.props;
        let lastIndex = allState.mapList.length - 1;
        let nextNum = nowSelectFloorIndex + num;
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        if (nextNum >= 0 && nextNum <= lastIndex) {
            this.setState({ nowSelectFloor: allState.mapList[nextNum], nowSelectFloorIndex: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowSelectFloor: allState.mapList[lastIndex], nowSelectFloorIndex: lastIndex })
        }
        else {
            this.setState({ nowSelectFloor: allState.mapList[0], nowSelectFloorIndex: 0 })
        }
    }
    selectFloor = (index) => {
        const { allState } = this.props;
        if (allState.mapList[index]) {
            this.transitionToSelectFloor(index);
            this.setState({ nowSelectFloor: allState.mapList[index], nowSelectFloorIndex: 0, })
        }
    }
    //返回多余的空白填充
    returnOtherMap = (index, allLength) => {
        const { limitFloorNum } = this.state;
        let start = index + 1;
        let end = start + (limitFloorNum - allLength % limitFloorNum);
        let list = [];
        for (let i = start; i < end; i++) {
            let plugin = <div className={"TransitionContent_Column_Text"} key={`${"other"}-${i}`} />;
            list.push(plugin);
        }
        return list;
    }
    //打开、关闭迁跃
    openShowFloorInfo = () => {
        this.setState({ showFloorInfoFlag: true })
    }
    closeShowFloorInfo = () => {
        this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ showFloorInfoFlag: false })
    }

    //能力————迁跃，迁跃至指定楼层（前提是已经去过该楼层）
    transitionToSelectFloor = (floorIndex) => {
        this.props.moveToFloor(floorIndex);
        this.closeShowFloorInfo();
    }

    //关闭当前最上层展示的提示框或界面（仅限于当前能力）
    closeAllThingFirst = () => {
        const { showFloorInfoFlag, } = this.state;
        if (showFloorInfoFlag) {
            this.closeShowFloorInfo();
        }
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Transition);