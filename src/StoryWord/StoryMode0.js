/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class StoryMode0 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowStoryWordIndex_Mode0: 0,
            nowStoryWordIndex_InWord_Mode0: 0,
            nowStoryWordIndex_InWord_WordIndex_Mode0: 0,
            nowStoryWordList_Mode0: [],
            nowWord_Mode0: "",
            showSpanLastFlag_Mode0: false,
            wordSpan_Mode0: 0,
        }
    }

    componentWillMount = () => {
        this.props.StoryMode0_OnRef ? this.props.StoryMode0_OnRef(this) : null;
        this.props.nowStory ? this.getDataFromModeStory0(this.props.nowStory) : null;
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.nowStory !== this.props.nowStory) {
            this.getDataFromModeStory0(this.props.nowStory)
        }
    }

    render() {
        return (
            <Fragment>
                {this.ModeStory0()}
            </Fragment>
        )
    }

    /**  故事模式0 **/
    /* 分割话语 */
    getDataFromModeStory0 = (story) => {
        let storyContent = story.storyContent;
        let storyWordList = [];
        storyContent.map((data) => {
            let wordList = data.word.split("\n");
            storyWordList.push(wordList);
        })
        this.setIntervalWord_Mode0(storyWordList[0][0]);
        this.setState({
            nowStoryWordIndex_Mode0: 0,
            nowStoryWordIndex_InWord_Mode0: 0,
            nowStoryWordIndex_InWord_WordIndex_Mode0: 0,
            nowStoryWordList_Mode0: storyWordList,
            nowWord_Mode0: "",
        })
    }
    /* 返回故事 */
    ModeStory0 = () => {
        const { nowStoryWordList_Mode0, nowStoryWordIndex_Mode0, nowStoryWordIndex_InWord_Mode0, showSpanLastFlag_Mode0 } = this.state;
        let plugin =
            <div className="StoryWord_Main_Mode0">
                <div className="StoryWord_Text_Colomn_Mode0">
                    {nowStoryWordList_Mode0.map((wordList, index0) => {
                        if (index0 == nowStoryWordIndex_Mode0) {
                            return (
                                wordList.map((word, index1) => {
                                    if (index1 <= nowStoryWordIndex_InWord_Mode0) {
                                        return (
                                            <div className="StoryWord_Text_Mode0">
                                                {this.returnWordList_ModeStory0(word, index1).map((w) => {
                                                    return <div className="StoryWord_Text_Word_Mode0">{w}</div>
                                                })}
                                                {nowStoryWordIndex_InWord_Mode0 === index1 && showSpanLastFlag_Mode0 ? <div className="StoryWord_Text_Last_Mode0" /> : null}
                                            </div>
                                        )
                                    }
                                })
                            )
                        }
                    })}
                </div>
            </div>
        return plugin;
    }
    /* 下一句话 */
    nextWord_ModeStory0 = () => {
        const { nowStoryWordList_Mode0, nowStoryWordIndex_Mode0, nowStoryWordIndex_InWord_Mode0, showSpanLastFlag_Mode0 } = this.state;
        if (!showSpanLastFlag_Mode0)
            return;
        let storyWordList_length = nowStoryWordList_Mode0.length;
        let wordList_length = nowStoryWordList_Mode0[nowStoryWordIndex_Mode0].length;
        this.setState({ showSpanLastFlag_Mode0: false });
        this.setState({ nowStoryWordIndex_InWord_WordIndex_Mode0: 0 })
        if (nowStoryWordIndex_InWord_Mode0 + 1 >= wordList_length && nowStoryWordIndex_Mode0 + 1 < storyWordList_length) {
            this.setIntervalWord_Mode0(nowStoryWordList_Mode0[nowStoryWordIndex_Mode0 + 1][0]);
            this.setState({
                nowStoryWordIndex_Mode0: nowStoryWordIndex_Mode0 + 1,
                nowStoryWordIndex_InWord_Mode0: 0,
                nowStoryWordIndex_InWord_WordIndex_Mode0: 0
            })
        }
        else if (nowStoryWordIndex_InWord_Mode0 + 1 >= wordList_length && nowStoryWordIndex_Mode0 + 1 >= storyWordList_length) {
            if (this.props.nowStory.storyId == "0_00_start") {
                this.props.closeStory(false);
                // this.props.setYSPos();
                this.props.setStory(true, "0_01");
            }
            else {
                this.props.closeStory(true);
            }
        }
        else {
            this.setIntervalWord_Mode0(nowStoryWordList_Mode0[nowStoryWordIndex_Mode0][nowStoryWordIndex_InWord_Mode0 + 1]);
            this.setState({ nowStoryWordIndex_InWord_Mode0: nowStoryWordIndex_InWord_Mode0 + 1 })
        }
    }
    /* 使得话语如故事般逐渐出现 */
    returnWordList_ModeStory0 = (word, nowIndex) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode0;
        let index = this.state.nowStoryWordIndex_InWord_Mode0;
        if (nowIndex == index) {
            let list = [];
            for (let i = 0; i <= num; i++) {
                list.push(word[i]);
            }
            return list;
        }
        else {
            let list = [];
            for (let i in word) {
                list.push(word[i]);
            }
            return list;
        }
    }
    /* 控制逐渐出现的时间函数 */
    setIntervalWord_Mode0 = (word) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode0;
        let max = word.length;
        this.storyWordTimer_Mode0 = setInterval(() => {
            if (num >= max - 2) {
                this.setState({ showSpanLastFlag_Mode0: true });
                clearInterval(this.storyWordTimer_Mode0);
            }
            num += 1;
            this.setState({ nowStoryWordIndex_InWord_WordIndex_Mode0: num })
        }, this.state.wordSpan_Mode0);
    }
    /** -------------------------------- **/

}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(StoryMode0);