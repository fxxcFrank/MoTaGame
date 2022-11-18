/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import './skillsStyle.css'

class Handbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowSelectTarget: {},
            nowSelectTargetIndex: 0,

            showFloorTargetInfoFlag: false,//打开手册
            showExplorationFlag: false,//打开详细信息
        }
        document.addEventListener("keydown", this.keyOn);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { nowSelectTarget, nowSelectTargetIndex, showFloorTargetInfoFlag, showExplorationFlag } = this.state;
        const { allState } = this.props;
        if (!allState.floorMonster) {
            return null;
        }
        // const allLength = allState.floorMonster ? allState.floorMonster.length : -1;
        return (
            <Fragment>
                {showFloorTargetInfoFlag ?
                    <div className="ExplorationContent_Main">
                        {allState.floorMonster.map((target, index) => {
                            return (
                                <div className={nowSelectTargetIndex === index ? "ExplorationContent_Main_Content_focus" : "ExplorationContent_Main_Content"}
                                    onClick={() => this.selectTarget(index)}>
                                    <div className="HandbookContent_Main_Left">
                                        <div className={"NormalMap_Monster_" + target.imgMode + "_" + target.imgPos} style={{ backgroundImage: "URL(" + target.imgUrl + ")", width: "15vw", height: "30vh" }} />
                                    </div>
                                    <div className="HandbookContent_Main_Right">
                                        <div className="HandbookContent_Main_Right_Name">
                                            <div >{target.monsterName}</div>
                                            <div className="HandbookContent_Main_Right_NameText2">名称：</div>
                                        </div>
                                        <div className="HandbookContent_Main_Right_Info">
                                            <div className="HandbookContent_Main_Right_InfoContent">
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">等级：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.level}</div>
                                                </div>
                                            </div>
                                            <div className="HandbookContent_Main_Right_InfoContent">
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">生命值：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.life}</div>
                                                </div>
                                            </div>
                                            <div className="HandbookContent_Main_Right_InfoContent">
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">攻击力：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.gong}</div>
                                                </div>
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">防御力：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.fang}</div>
                                                </div>
                                            </div>
                                            <div className="HandbookContent_Main_Right_InfoContent">
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">经验：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.levelNum}</div>
                                                </div>
                                                <div className="ExplorationContent_Main_Column">
                                                    <div className="ExplorationContent_Main_InfoTitle">金币：</div>
                                                    <div className="ExplorationContent_Main_InfoText">{target.gold}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    : null}
                {showExplorationFlag ?
                    <div className="ExplorationContent_Main">
                        <div className="ExplorationContent_Main_Close" onClick={this.closeExploration}>
                            <CloseOutlined />
                        </div>
                        <div className="ExplorationContent_Main_Title">
                            <div className={"NormalMap_Monster_" + nowSelectTarget.imgMode + "_" + nowSelectTarget.imgPos} style={{ backgroundImage: "URL(" + nowSelectTarget.imgUrl + ")", width: "15vw", height: "30vh" }} />
                        </div>
                        <div className="ExplorationContent_Main_Info">
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">等级：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.level}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">生命值：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.life}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">攻击力：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.gong}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">防御力：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.fang}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">暴击率：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.baojilv}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">暴击伤害：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.baojishanghai}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">打败后获得经验：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.levelNum}</div>
                            </div>
                            <div className="ExplorationContent_Main_Column">
                                <div className="ExplorationContent_Main_InfoTitle">打败后获得金币：</div>
                                <div className="ExplorationContent_Main_InfoText">{nowSelectTarget.gold}</div>
                            </div>
                        </div>
                        <div className="ExplorationContent_Main_Describe">
                            <div className="ExplorationContent_Main_DescribeTitle">描述：</div>
                            <div className="ExplorationContent_Main_DescribeText">{nowSelectTarget.describe}</div>
                        </div>
                    </div>
                    : null}
            </Fragment>
        )
    }

    keyOn = (e) => {
        const { showFloorTargetInfoFlag, showExplorationFlag } = this.state;
        let keyCode = e.keyCode;
        if (keyCode === 76) {       //手册快捷键————L
            if (!this.props.allState.floorMonster || (showFloorTargetInfoFlag || showExplorationFlag))
                return;
            this.props.openAbility();   //打开能力监听覆盖
            this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
            this.openShowFloorTargetInfo();
        }
        else if (keyCode === 88) {    //关闭快捷键————X
            this.closeAllThingFirst();
        }
        if (!showFloorTargetInfoFlag && !showExplorationFlag)  //为了防止和其他能力的调用重复，每个能力都在本地控制一下按键应用范围
            return;
        if (showFloorTargetInfoFlag) {
            switch (keyCode) {
                case 38:       //方向键上
                    this.changeSelectTarget(-1);
                    break;
                case 40:       //方向键下
                    this.changeSelectTarget(1);
                    break;
                case 13:        //enter
                    this.selectTarget(this.state.nowSelectTargetIndex);
                    break;
                default:
                    break;
            }
        }
    }
    //所选对象是否探查选择 取消/确认 （因为探查失败会自动开始战斗，嘛，虽然没有提示，但是失败几次就明白了，前期难度预期不算难）
    changeSelectTarget = (num) => {
        const { nowSelectTargetIndex } = this.state;
        const { allState } = this.props;
        let lastIndex = allState.floorMonster.length - 1;
        let nextNum = nowSelectTargetIndex + num;
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        if (nextNum >= 0 && nextNum <= lastIndex) {
            this.setState({ nowSelectTarget: allState.floorMonster[nextNum], nowSelectTargetIndex: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowSelectTarget: allState.floorMonster[lastIndex], nowSelectTargetIndex: lastIndex })
        }
        else {
            this.setState({ nowSelectTarget: allState.floorMonster[0], nowSelectTargetIndex: 0 })
        }
    }
    selectTarget = (index) => {
        const { allState } = this.props;
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        if (allState.floorMonster[index]) {
            this.setState({ nowSelectTarget: allState.floorMonster[index], nowSelectTargetIndex: 0, }, () => {
                this.openExploration();
            })
        }
    }
    //打开、关闭手册
    openShowFloorTargetInfo = () => {
        this.setState({ showFloorTargetInfoFlag: true })
    }
    closeShowFloorTargetInfo = () => {
        this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ showFloorTargetInfoFlag: false })
    }
    //打开关闭
    openExploration = () => {
        this.setState({ showExplorationFlag: true })
    }
    //关闭对象信息
    closeExploration = () => {
        this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ showExplorationFlag: false })
    }

    //关闭当前最上层展示的提示框或界面（仅限于当前能力）
    closeAllThingFirst = () => {
        const { showFloorTargetInfoFlag, showExplorationFlag } = this.state;
        if (showExplorationFlag) {
            this.closeExploration();
        }
        else if (showFloorTargetInfoFlag) {
            this.closeShowFloorTargetInfo();
        }
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Handbook);