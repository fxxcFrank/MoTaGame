/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Input, Modal, message, Button } from 'antd'
import './style.css'
import axios from 'axios'
import LeftSilder from "./LeftSilder";
const { TextArea } = Input;
class CreateStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadStoryList: [],
            nowStory: [],
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadStory', function (event, loadStory) {
            console.log('所有故事-----', loadStory);
            _this.setState({ loadStoryList: loadStory });
        }) : null;
    }

    render() {
        const { nowStory } = this.state;
        return (
            <Fragment>
                <div className="CreateStory_Main" >
                    <LeftSilder nowStory={nowStory} setNowStory={this.setNowStory} />
                    <div className="CreateStory_MiddleContent">
                        {nowStory ? nowStory.map((story, index) => {
                            return (
                                <div className="CreateStory_MiddleContent_Column">
                                    <Input className="CreateStory_MiddleContent_Column_Input" value={story.name} onChange={(e) => this.changeInputName(e, index)} maxLength={20} style={{ width: "20%" }} />
                                    <TextArea className="CreateStory_MiddleContent_Column_TextArea" value={story.word} onChange={(e) => this.changeInputWord(e, index)} />
                                    <Button className="CreateStory_MiddleContent_Column_Button" type="primary" onClick={() => this.deleteWord(index)}>删除</Button>
                                </div>
                            )
                        }) : <div className="CreateStory_MiddleContent_Warring">故事数据读取错误！</div>}
                        {nowStory && nowStory.length!==0 ? <Button className="CreateStory_MiddleContent_AddButton" type="primary" onClick={this.addNewWord}>新增</Button> 
                        : <div className="CreateStory_MiddleContent_NoDataTip"></div>}
                    </div>
                </div>
            </Fragment>
        )
    }

    addNewWord = () => {
        const { nowStory } = this.state;
        let word = { name: "", word: "" };
        this.setState({ nowStory: [...(nowStory ? nowStory : []), word] });
    }
    deleteWord = (index) => {
        const { nowStory } = this.state;
        let newNowStory = nowStory.filter((story, index1) => index1 !== index);
        this.setState({ nowStory: [...newNowStory] });
    }
    changeInputName = (e, index) => {
        let nowStory = this.state.nowStory;
        nowStory[index].name = e.target.value;
        this.setState({ nowStory: nowStory });
    }
    changeInputWord = (e, index) => {
        let nowStory = this.state.nowStory;
        nowStory[index].word = e.target.value;
        this.setState({ nowStory: nowStory });
    }

    setNowStory = (story) => {
        this.setState({ nowStory: story, onChangeMapFlag: false });
    }

    Exit = () => {
        this.props.history.push("/");
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(CreateStory);