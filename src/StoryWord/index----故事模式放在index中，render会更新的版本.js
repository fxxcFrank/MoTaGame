import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import StoryMode0 from './StoryMode0'
import './style.css'
import axios from 'axios'

class StoryWord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storyList: [],
            nowStoryId: -1,
            nowStory: {},
            nowStoryWordIndex: 0,
            nowStoryEvent: {},
            nowStoryWordList: [],
            nowWordName: "",
            nowWord: "",
            showStoryMode:-1,

            nowStoryWordIndex_Mode0: 0,
            nowStoryWordIndex_InWord_Mode0: 0,
            nowStoryWordIndex_InWord_WordIndex_Mode0: 0,
            nowStoryWordList_Mode0: [],
            nowWord_Mode0: "",
            showSpanLastFlag_Mode0: false,
            wordSpan_Mode0: 50,

            nowStoryWordIndex_Mode2: 0,
            nowStoryWordIndex_InWord_Mode2: 0,
            nowStoryWordList_Mode2: [],
            nowWord_Mode2: "",
        }
    }

    componentWillMount() {
        console.log("StoryWord-----componentWillMount");
        // eslint-disable-next-line no-unused-expressions
        this.props.storyWordComponentOnRef ? this.props.storyWordComponentOnRef(this) : null;
        axios.get("data/storyList2.json")
            .then((res) => {
                let result = res.data;
                this.setState({
                    storyList: result,
                })
            }).catch((e) => {
                console.log(e);
            })

    }
    componentDidMount() {
        // debugger
        console.log("StoryWord-----componentDidMount");
        // eslint-disable-next-line no-unused-expressions
        this.props.storyWordComponentOnRef ? this.props.storyWordComponentOnRef(this) : null;
        axios.get("data/storyList2.json")
            .then((res) => {
                // debugger
                let result = res.data;
                this.setState({
                    storyList: result,
                })
            }).catch((e) => {
                console.log(e);
            })
    }

    /* 该时间周期函数中不能使用this */
    static getDerivedStateFromProps(props, state) {
        // console.log("getDerivedStateFromProps", props, state);
        // debugger
        if (props.nowStoryId !== state.nowStoryId) {
            return {
                nowStoryId: props.nowStoryId
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        // debugger
        // console.log("componentDidUpdate", prevProps, prevState, this.props, this.state);
        if (prevState.nowStoryId !== this.state.nowStoryId) {
            let storyList = this.state.storyList;
            storyList.map((story) => {
                if (story.storyId === this.state.nowStoryId) {
                    let mode = story.storyMode;
                    this.setState({
                        nowStoryId: story.storyId,
                        nowStory: story,
                    })
                    switch (mode) {
                        case 0:
                            return this.getDataFromModeStory0(story);
                            // return this.StoryMode0.getDataFromModeStory0(story);
                        case 2:
                            return this.getDataFromModeStory2(story);
                        default:
                            return;
                    }

                }
            })
        }
    }

    render() {
        return (
            <Fragment>
                {this.props.storyWordFlag ?
                    this.returnModeStory()
                    : null}
                {/* <StoryMode0 StoryMode0_OnRef={this.StoryMode0_OnRef} /> */}
            </Fragment>
        )
    }
    /* 组件内连通函数 */
    returnModeStory = () => {
        let mode = this.state.nowStory.storyMode;
        switch (mode) {
            case 0:
                return this.ModeStory0();
                // return this.StoryMode0.ModeStory0();
                // this.setState({showStoryMode:0})
                // break;
            case 2:
                return this.ModeStory2();
            default:
                return;
        }
    }
    nextStoryWord = () => {
        let mode = this.state.nowStory.storyMode;
        switch (mode) {
            case 0:
                return this.nextWord_ModeStory0();
                // return this.StoryMode0.nextWord_ModeStory0();
            case 2:
                return this.nextWord_ModeStory2();
            default:
                return;
        }
    }
    /* ----------------------- */


    /* modeStory0 */
    getDataFromModeStory0 = (story) => {
        let storyContent = story.storyContent;
        let storyWordList = [];
        storyContent.map((data) => {
            let wordList = data.word.split("\n");
            storyWordList.push(wordList);
        })
        this.setIntervalWord_Mode0(storyWordList[0][0]);
        this.setState({
            nowStoryId: story.storyId,
            nowStory: story,
            nowStoryWordIndex_Mode0: 0,
            nowStoryWordIndex_InWord_Mode0: 0,
            nowStoryWordIndex_InWord_WordIndex_Mode0: 0,
            nowStoryWordList_Mode0: storyWordList,
            nowWord_Mode0: "",
        })
    }
    ModeStory0 = () => {
        const { nowStoryWordList_Mode0, nowStoryWordIndex_Mode0, nowStoryWordIndex_InWord_Mode0, showSpanLastFlag_Mode0 } = this.state;
        let plugin =
            <div className="StoryWord_Main_Mode0">
                <div className="StoryWord_Text_Colomn_Mode0">
                    {nowStoryWordList_Mode0.map((wordList, index0) => {
                        if (index0 == nowStoryWordIndex_Mode0) {
                            return (
                                wordList.map((word, index1) => {
                                    // console.log("word, index1", word, index1);
                                    // debugger
                                    if (index1 <= nowStoryWordIndex_InWord_Mode0) {
                                        return (
                                            <div className="StoryWord_Text_Mode0">
                                                {/* {word} */}
                                                {this.returnWordList_ModeStory0(word, index1).map((w) => {
                                                    return <div className="StoryWord_Text_Word_Mode0">{w}</div>
                                                })}
                                                {/* {nowStoryWordIndex_InWord_Mode0 === index1 ? <div className="StoryWord_Text_Last_Mode0" /> : null} */}
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
        console.log("plugin", plugin);
        return plugin;
    }
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
            this.props.closeStory();
            if (this.state.nowStory.storyId == "0_00_start") {
                this.props.setYSPos();
                this.props.setStory(true, "0_01");
            }
        }
        else {
            this.setIntervalWord_Mode0(nowStoryWordList_Mode0[nowStoryWordIndex_Mode0][nowStoryWordIndex_InWord_Mode0 + 1]);
            this.setState({ nowStoryWordIndex_InWord_Mode0: nowStoryWordIndex_InWord_Mode0 + 1 })
        }
    }
    returnWordList_ModeStory0 = (word, nowIndex) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode0;
        let index = this.state.nowStoryWordIndex_InWord_Mode0;
        if (nowIndex == index) {
            let list = [];
            for (let i = 0; i < num; i++) {
                list.push(word[i]);
            }
            // console.log("list", num, list);
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
    setIntervalWord_Mode0 = (word) => {
        let num = this.state.nowStoryWordIndex_InWord_WordIndex_Mode0;
        let max = word.length;
        this.storyWordTimer_Mode0 = setInterval(() => {
            if (num >= max) {
                this.setState({ showSpanLastFlag_Mode0: true });
                clearInterval(this.storyWordTimer_Mode0);
                return;
            }
            num += 1;
            this.setState({ nowStoryWordIndex_InWord_WordIndex_Mode0: num })
        }, this.state.wordSpan_Mode0);
    }

    /* -------------------------------- */

    /* modeStory2 */
    getDataFromModeStory2 = (story) => {
        let storyContent = story.storyContent;
        let storyWordList = [];
        storyContent.map((data) => {
            let wordList = data.word.split("\n");
            console.log("wordList", wordList, wordList.length);
            storyWordList.push({ name: data.name, wordList: wordList });
        })
        this.setState({
            nowStoryId: story.storyId,
            nowStory: story,
            nowStoryWordIndex_Mode2: 0,
            nowStoryWordIndex_InWord_Mode2: 0,
            nowStoryWordList_Mode2: storyWordList,
            nowWord_Mode2: "",
        })
    }
    ModeStory2 = () => {
        const { nowStoryWordList_Mode2, nowStoryWordIndex_Mode2, nowStoryWordIndex_InWord_Mode2 } = this.state;
        // debugger
        let plugin =
            <div className="StoryWord_Main">
                <div className="StoryWord_Title">
                    {nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].name}
                </div>
                <div className="StoryWord_Text">
                    {nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].wordList.map((word, index1) => {
                        // console.log("word, index1", word, index1);
                        // debugger
                        if (index1 <= nowStoryWordIndex_InWord_Mode2) {
                            return (
                                <div className="StoryWord_Text_Mode2">
                                    {word}
                                    {/* {nowStoryWordIndex_InWord_Mode2 === index1 ? <div className="StoryWord_Text_Last_Mode2" /> : null} */}
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
        return plugin
    }
    nextWord_ModeStory2 = () => {
        // debugger
        const { nowStoryWordList_Mode2, nowStoryWordIndex_Mode2, nowStoryWordIndex_InWord_Mode2 } = this.state;
        let storyWordList_length = nowStoryWordList_Mode2.length;
        let wordList_length = nowStoryWordList_Mode2[nowStoryWordIndex_Mode2].wordList.length;
        if (nowStoryWordIndex_InWord_Mode2 + 1 >= wordList_length && nowStoryWordIndex_Mode2 + 1 < storyWordList_length) {
            this.setState({
                nowStoryWordIndex_Mode2: nowStoryWordIndex_Mode2 + 1,
                nowStoryWordIndex_InWord_Mode2: 0,
            })
        }
        else if (nowStoryWordIndex_InWord_Mode2 + 1 >= wordList_length && nowStoryWordIndex_Mode2 + 1 >= storyWordList_length) {
            this.props.closeStory();
        }
        else {
            this.setState({ nowStoryWordIndex_InWord_Mode2: nowStoryWordIndex_InWord_Mode2 + 1 })
        }
    }
    /* ----------------------- */

    /* 故事模式组件 */
    StoryMode0_OnRef = (ref) => {
        this.StoryMode0 = ref;
    }
    /* ----------------------- */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(StoryWord);