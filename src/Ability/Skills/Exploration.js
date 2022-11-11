/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import './skillsStyle.css'

class Exploration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowSelectTarget: {},
            nowSelectTargetIndex: 0,
            nowSelectConfirmIndex: 1,
            nowSelectTargetSuccessRate: 0,

            IsShowAroundTargetFlag: false,
            IsShowExplorationFlag: false,
            showExplorationFlag: false,
        }
        document.addEventListener("keydown", this.keyOn);
        this.nowSelectTargetSuccessRate = 0;
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { nowSelectTarget, nowSelectTargetIndex, nowSelectConfirmIndex,
            IsShowAroundTargetFlag, IsShowExplorationFlag, showExplorationFlag } = this.state;
        const { allState } = this.props;
        if (!allState.aroundMonster) {
            return null;
        }
        const allLength = allState.aroundMonster ? allState.aroundMonster.length : -1;
        // console.log("allState.aroundMonster", allState.aroundMonster);
        return (
            <Fragment>
                {IsShowAroundTargetFlag ?
                    <div className="Exploration_Main">
                        {allState.aroundMonster.map((target, index) => {
                            return (
                                <div className={nowSelectTargetIndex === index ? "Exploration_Target_focus" : "Exploration_Target"}
                                    onClick={() => this.selectTarget(index)}
                                >
                                    {`${target.direction} ${target.monsterName} ${this.returnMonsterInfoSuccessRate(allState, target)}`}
                                </div>
                            )
                        })}
                        {/* {allState.aroundMonster ? allState.aroundMonster[0] ? allState.aroundMonster[0].monsterName : null : null} */}
                        <div className={nowSelectTargetIndex === allLength ? "Exploration_Target_focus" : "Exploration_Target"}
                            onClick={this.closeIsShowAroundTarget}
                        >
                            {`退出`}
                        </div>
                    </div>
                    : null}
                {IsShowExplorationFlag ?
                    <div className="Exploration_Main">
                        <div className="Exploration_Title">{`是否探查${nowSelectTarget.monsterName}的情报？成功率为${this.returnMonsterInfoSuccessRate(allState, nowSelectTarget)}。`}</div>
                        <div className="Exploration_ButtonList">
                            <div className={nowSelectConfirmIndex === 0 ? "Exploration_Target_focus" : "Exploration_Target"} onClick={this.closeIsShowExploration}>取消</div>
                            <div className={nowSelectConfirmIndex === 1 ? "Exploration_Target_focus" : "Exploration_Target"} onClick={this.openIsShowExploration}>确定</div>
                        </div>
                    </div> : null}
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
        const { IsShowAroundTargetFlag, IsShowExplorationFlag, showExplorationFlag } = this.state;
        let keyCode = e.keyCode;
        if (keyCode === 69) {       //探查快捷键————E
            // console.log("Exploration-----keyOn-----this.props.allState", this.props.allState, this.props.allState.aroundMonster);
            if (!this.props.allState.aroundMonster || (IsShowAroundTargetFlag || IsShowExplorationFlag || showExplorationFlag))
                return;
            if (this.props.allState.aroundMonster.length > 0) {
                // console.log("this.props.allState.aroundMonster", this.props.allState.aroundMonster);
                this.props.openAbility();   //打开能力监听覆盖
                this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
                this.setState({ IsShowAroundTargetFlag: true })
            }
            else {
                this.props.setTip("探查信息失败，附近没有周围四格没有合适的探查对象……");
            }
        }
        else if (keyCode === 88) {    //关闭快捷键————X
            this.closeAllThingFirst();
        }
        if (!IsShowAroundTargetFlag && !IsShowExplorationFlag && !showExplorationFlag)  //为了防止和其他能力的调用重复，每个能力都在本地控制一下按键应用范围
            return;
        // console.log("IsShowAroundTargetFlag,IsShowExplorationFlag,showExplorationFlag", IsShowAroundTargetFlag, IsShowExplorationFlag, showExplorationFlag, (!IsShowExplorationFlag || !showExplorationFlag));
        if (IsShowAroundTargetFlag && (!IsShowExplorationFlag && !showExplorationFlag)) {
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
        else if (IsShowExplorationFlag) {
            switch (keyCode) {
                case 37:       //方向键左
                    this.changeSelectConfirm(-1);
                    break;
                case 39:       //方向键右
                    this.changeSelectConfirm(1);
                    break;
                case 13:        //enter
                    this.selectConfirm(this.state.nowSelectConfirmIndex);
                    break;
                default:
                    break;
            }
        }
        else if (showExplorationFlag) {

        }
        // this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        // this.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
    }

    /* 展示所有周围对象的操作函数 */
    //选择需要探查的周围对象
    changeSelectTarget = (num) => {
        const { allState } = this.props;
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
        let index = this.state.nowSelectTargetIndex;
        let aroundMonsterCount = allState.aroundMonster.length;
        let nextNum = index + num;
        if (nextNum >= 0 && nextNum <= aroundMonsterCount - 1) {
            this.setState({ nowSelectTarget: allState.aroundMonster[index], nowSelectTargetIndex: nextNum })
        }
        else if (nextNum === aroundMonsterCount) {
            this.setState({ nowSelectTarget: {}, nowSelectTargetIndex: aroundMonsterCount })
        }
        else if (nextNum < 0) {
            this.setState({ nowSelectTarget: {}, nowSelectTargetIndex: aroundMonsterCount })
        }
        else {
            this.setState({ nowSelectTarget: allState.aroundMonster[0], nowSelectTargetIndex: 0 })
        }
    }
    selectTarget = (index) => {
        const { allState } = this.props;
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        if (allState.aroundMonster[index]) {
            this.setState({ nowSelectTarget: allState.aroundMonster[index], nowSelectTargetIndex: 0, }, () => {
                this.openIsShowAroundTarget();
            })
        }
        else {
            this.setState({ nowSelectTarget: {}, nowSelectTargetIndex: 0, });
            this.closeIsShowAroundTarget();
        }
    }

    //所选对象是否探查选择 取消/确认 （因为探查失败会自动开始战斗，嘛，虽然没有提示，但是失败几次就明白了，前期难度预期不算难）
    changeSelectConfirm = (num) => {
        const { nowSelectConfirmIndex } = this.state;
        let nextNum = nowSelectConfirmIndex + num;
        if (nextNum >= 0 && nextNum <= 1) {
            this.setState({ nowSelectConfirmIndex: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowSelectConfirmIndex: 1 })
        }
        else {
            this.setState({ nowSelectConfirmIndex: 0 })
        }
    }
    selectConfirm = (index) => {
        this.props.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        if (index === 1) {
            this.setState({ nowSelectTargetIndex: 1, }, () => {
                this.closeIsShowAroundTarget();
                this.closeIsShowExploration();
                this.openIsShowExploration();
            })
        }
        else {
            this.setState({ nowSelectTargetIndex: 1, });
            this.closeIsShowExploration();
        }
    }
    /* ----------------- */

    //返回当前调查对象的名称
    returnMonsterName = (allState) => {
        try {
            let aroundMonster = allState.aroundMonster;
            let targetMonster = allState.aroundMonster;
            return targetMonster.name;
        } catch (error) {
            console.log("returnMonsterName", error);
            // debugger
            this.props.closeAbility();  //关闭能力监听覆盖
            this.setState({ IsShowExplorationFlag: false });
            this.props.setTip("探查信息失败，附近没有周围四格没有合适的探查对象……");
        }
    }

    //返回当前调查对象的成功率
    returnMonsterInfoSuccessRate = (allState, target) => {
        try {
            let targetMonster = target;
            /* 勇者状态————生命、攻击、防御、暴击率、暴击伤害、等级*/
            let ysLife = allState.life;
            let ysGong = allState.gong;
            let ysFang = allState.fang;
            let bjl = allState.baojilv / 100;
            let bjsh = allState.baojishanghai / 100;
            let ysLevel = allState.level;
            /* 怪物状态————生命、攻击、防御、暴击率、暴击伤害、等级 */
            let mLife = targetMonster.life > 0 ? targetMonster.life : 1;
            let mGong = targetMonster.gong > 0 ? targetMonster.gong : 1;
            let mFang = targetMonster.fang > 0 ? targetMonster.fang : 1;
            let mBjl = targetMonster.baojilv > 0 ? targetMonster.baojilv : 1;
            let mBjsh = targetMonster.baojishanghai > 0 ? targetMonster.baojishanghai : 1;
            let mLevel = targetMonster.level > 0 ? targetMonster.level : 1;

            let successRate = 1;
            successRate = (ysLife / mLife + ysGong / mGong + ysFang / mFang + bjl / mBjl + bjsh / mBjsh + ysLevel / mLevel) / 6;
            console.log("first-----successRate", targetMonster.monsterName, successRate);
            if (successRate > 1)
                successRate = 1;
            // this.setState({ nowSelectTargetSuccessRate: successRate })
            this.nowSelectTargetSuccessRate = successRate;
            return successRate * 100 + "%";
        } catch (error) {
            console.log("returnMonsterInfoSuccessRate", error);
            // debugger
            this.props.closeAbility();  //关闭能力监听覆盖
            this.setState({ IsShowExplorationFlag: false });
            this.props.setTip("探查信息失败，附近没有周围四格没有合适的探查对象……");
        }
    }
    // //返回当前探查对象的信息——————突然想起来i对应的属性名全都是英文……还不如一个个对应写出来
    returnNowSelectTargetInfo = (nowSelectTarget) => {
        let list = [];
        for (let i in nowSelectTarget) {
            let plugin = <div>
                <div>{i}</div>
                <div>{nowSelectTarget[i]}</div>
            </div>;
            list.push(plugin);
        }
        return list;
    }


    /*每一个提示框的确定都对应下一个框，取消对应自己*/
    //展示所有周围对象的确定、取消
    openIsShowAroundTarget = () => {
        this.setState({ IsShowExplorationFlag: true })
    }
    closeIsShowAroundTarget = () => {
        this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ IsShowAroundTargetFlag: false })
    }
    //选定对象的确定、取消
    openIsShowExploration = () => {
        const { nowSelectTarget, } = this.state;
        let nowSelectTargetSuccessRate = this.nowSelectTargetSuccessRate;
        let destiny = Math.random() * 1;
        if (destiny <= nowSelectTargetSuccessRate) {     
            this.setState({ showExplorationFlag: true })
        }
        else {
            // debugger
            this.props.setTip(`探查${nowSelectTarget.monsterName}信息失败，进入战斗！`);
            this.props.closeAbility();  //关闭能力监听覆盖
            this.setState({ IsShowAroundTargetFlag: false, IsShowExplorationFlag: false }, () => {
                if (nowSelectTarget.direction === "左侧") {
                    this.props.mainWindowKeyOn({ keyCode: 37 });
                }
                else if (nowSelectTarget.direction === "上侧") {
                    this.props.mainWindowKeyOn({ keyCode: 38 });
                }
                else if (nowSelectTarget.direction === "右侧") {
                    this.props.mainWindowKeyOn({ keyCode: 39 });
                }
                else if (nowSelectTarget.direction === "下侧") {
                    this.props.mainWindowKeyOn({ keyCode: 40 });
                }
                else {
                    this.props.setTip(`探查失败，但${nowSelectTarget.monsterName}处于未知次元，战斗不成立！`);
                }
                // setTimeout(() => {       //暂时没有起到预想中模拟键盘事件的功能
                //     debugger
                //     let e = document.createEvent("KeyboardEvents");
                //     if (nowSelectTarget.direction === "左侧") {
                //         e.initKeyboardEvent("keydown", true, true, window, "U+0037"); // 左
                //     }
                //     else if (nowSelectTarget.direction === "上侧") {
                //         e.initKeyboardEvent("keydown", true, true, window, "U+0038"); // 上
                //     }
                //     else if (nowSelectTarget.direction === "右侧") {
                //         e.initKeyboardEvent("keydown", true, true, window, "U+0039"); // 右
                //     }
                //     else if (nowSelectTarget.direction === "下侧") {
                //         e.initKeyboardEvent("keydown", true, true, window, "U+0040"); // 下
                //     }
                //     else {
                //         this.props.setTip(`探查失败，但${nowSelectTarget.monsterName}处于未知次元，战斗不成立！`);
                //     }
                // }, 100);
            });
        }
    }
    closeIsShowExploration = () => {
        // this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ IsShowExplorationFlag: false })
    }
    //展示对象信息的确定、取消
    openExploration = () => {

    }
    closeExploration = () => {
        this.props.closeAbility();  //关闭能力监听覆盖
        this.setState({ showExplorationFlag: false })
    }

    //关闭当前最上层展示的提示框或界面（仅限于当前能力）
    closeAllThingFirst = () => {
        const { IsShowAroundTargetFlag, IsShowExplorationFlag, showExplorationFlag } = this.state;
        if (showExplorationFlag) {
            this.closeExploration();
        }
        else if (IsShowExplorationFlag) {
            this.closeExploration();
        }
        else if (IsShowAroundTargetFlag) {
            this.closeIsShowAroundTarget();
        }
    }
}

const mapState = (state) => ({
    allState: state.getIn(['MainWindow', 'allState']),
});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Exploration);