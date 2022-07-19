import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class StoryMode2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nowStoryWordIndex_Mode2: 0,
            nowStoryWordIndex_InWord_Mode2: 0,
            nowStoryWordIndex_InWord_WordIndex_Mode2: 0,
            nowStoryWordList_Mode2: [],
            nowWord_Mode2: "",
            showSpanLastFlag_Mode2: false,
            wordSpan_Mode2: 20,
        }
    }

    componentWillMount = () => {
        // eslint-disable-next-line no-unused-expressions
        this.props.StoryMode2_OnRef ? this.props.StoryMode2_OnRef(this) : null;
        // eslint-disable-next-line no-unused-expressions
        this.props.nowStory ? this.getDataFromModeStory2(this.props.nowStory) : null;
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.nowStory !== this.props.nowStory) {
            this.getDataFromModeStory2(this.props.nowStory)
        }
    }

    render() {
        return (
            <Fragment>
                {this.ModeStory2()}
            </Fragment>
        )
    }

    /**  故事模式2 **/
    /* 分割话语 */
    getDataFromModeStory2 = (story) => {
        let storyContent = story.storyContent;
        let storyWordList = [];
        storyContent.map((data) => {
            let wordList = data.word.split("\n");
            // console.log("wordList", wordList, wordList.length);
            storyWordList.push({ name: data.name, wordList: wordList });
        })
        this.setIntervalWord_Mode2(storyWordList[0].wordList[0]);
        this.setState({
            nowStoryId: story.storyId,
            nowStory: story,
            nowStoryWordIndex_Mode2: 0,
            nowStoryWordIndex_InWord_Mode2: 0,
            nowStoryWordList_Mode2: storyWordList,
            nowWord_Mode2: "",
        })
    }
    /* 返回故事 */
    ModeStory2 = () => {
        const { nowStoryWordList_Mode2, nowStoryWordIndex_Mode2, nowStoryWordIndex_InWord_Mode2,showSpanLastFlag_Mode2 } = this.state;
        let plugin =
            <div className="StoryWord_Main">
                <div className="StoryWord_Title">
                    {nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].name}
                </div>
                <div className="StoryWord_Text">
                    {nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].wordList.map((word, index1) => {
                        if (index1 <= nowStoryWordIndex_InWord_Mode2) {
                            return (
                                <div className="StoryWord_Text_Mode2">
                                    {this.returnWordList_ModeStory2(word, index1).map((w) => {
                                        return <div className="StoryWord_Text_Word_Mode2">{w}</div>
                                    })}
                                    {nowStoryWordIndex_InWord_Mode2 === index1 && showSpanLastFlag_Mode2 ? <div className="StoryWord_Text_Last_Mode2" /> : null}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        return plugin;
    }
    /* 下一句话 */
    nextWord_ModeStory2 = () => {
        const { nowStoryWordList_Mode2, nowStoryWordIndex_Mode2, nowStoryWordIndex_InWord_Mode2,showSpanLastFlag_Mode2 } = this.state;
        if (!showSpanLastFlag_Mode2)
            return;
        let storyWordList_length = nowStoryWordList_Mode2.length;
        let wordList_length = nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].wordList.length;
        this.setState({ showSpanLastFlag_Mode2: false });
        this.setState({ nowStoryWordIndex_InWord_WordIndex_Mode2: 0 })
        if (nowStoryWordIndex_InWord_Mode2 + 1 >= wordList_length && nowStoryWordIndex_Mode2 + 1 < storyWordList_length) {
            this.setIntervalWord_Mode2(nowStoryWordList_Mode2[nowStoryWordIndex_Mode2 + 1].wordList[0]);
            this.setState({
                nowStoryWordIndex_Mode2: nowStoryWordIndex_Mode2 + 1,
                nowStoryWordIndex_InWord_Mode2: 0,
            })
        }
        else if (nowStoryWordIndex_InWord_Mode2 + 1 >= wordList_length && nowStoryWordIndex_Mode2 + 1 >= storyWordList_length) {
            this.props.closeStory(true);
        }
        else {
            this.setIntervalWord_Mode2(nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].wordList[nowStoryWordIndex_InWord_Mode2 + 1]);
            this.setState({ nowStoryWordIndex_InWord_Mode2: nowStoryWordIndex_InWord_Mode2 + 1 })
        }
    }
    /* 使得话语如故事般逐渐出现 */
    returnWordList_ModeStory2 = (word, nowIndex) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode2;
        let index = this.state.nowStoryWordIndex_InWord_Mode2;
        if (nowIndex == index) {
            let list = [];
            for (let i = 0; i <=num; i++) {
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
    setIntervalWord_Mode2 = (word) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode2;
        let max = word.length;
        this.storyWordTimer_Mode2 = setInterval(() => {
            if (num >= max-2) {
                this.setState({ showSpanLastFlag_Mode2: true });
                clearInterval(this.storyWordTimer_Mode2);
                // return;
            }
            num += 1;
            this.setState({ nowStoryWordIndex_InWord_WordIndex_Mode2: num })
        }, this.state.wordSpan_Mode2);
    }
    /** -------------------------------- **/

}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(StoryMode2);