/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import StoryMode0 from './StoryMode0'
import StoryMode2 from './StoryMode2'
import './style.css'
import axios from 'axios'

class StoryWord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storyList: [],
            storyMapList1: [],
            nowStoryId: -1,
            nowStory: {},
            nowStoryWordIndex: 0,
            nowStoryEvent: {},
            nowStoryWordList: [],
            nowWordName: "",
            nowWord: "",
            showStoryMode: -1,
        }
        this.props.storyWordComponentOnRef ? this.props.storyWordComponentOnRef(this) : null;
        axios.get('data/baseMap/storyMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ storyMapList1: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get("data/story/storyList.json")
            .then((res) => {
                let result = res.data;
                this.setState({
                    storyList: result,
                })
                result.map((story) => {
                    if (story.storyId === this.props.nowStoryId) {
                        if (story.storyId !== "0_00_start" && story.storyId !== "0_01") {
                            this.props.move(this.props.nowMeetMap);  //之后可以在此添加判断，判断哪些mode可以在事件开始前move到事件块上，哪些不能
                        }
                        this.setState({
                            nowStoryId: story.storyId,
                            nowStory: story,
                        })
                    }
                })
                this.props.setPreloadFlag("storyPreloadFlag", true);
            }).catch((e) => {
                console.log(e);
            })
    }

    componentDidMount() {

    }

    /* 该时间周期函数中不能使用this */
    static getDerivedStateFromProps(props, state) {
        if (props.nowStoryId !== state.nowStoryId) {
            return {
                nowStoryId: props.nowStoryId
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.nowStoryId !== this.state.nowStoryId) {
            let storyList = this.state.storyList;
            storyList.map((story) => {
                if (story.storyId === this.state.nowStoryId) {
                    if (story.storyId !== "0_00_start" && story.storyId !== "0_01") {
                        this.props.move(this.props.nowMeetMap);  //之后可以在此添加判断，判断哪些mode可以在事件开始前move到事件块上，哪些不能
                    }

                    this.setState({
                        nowStoryId: story.storyId,
                        nowStory: story,
                    })
                }
            })
        }
    }

    render() {
        return (
            <Fragment>
                {
                    this.props.storyWordFlag ?
                        (this.props.firstStoryFlag ?
                            this.returnModeStory() :
                            <div className="PreLoadStory" >
                                <div className="PreLoadStory_Load">
                                    {/* <div className="PreLoadStory_Load_Img" style={{backgroundImage:"URL(img/up_floor.png)"}}/> */}
                                    <img className="PreLoadStory_Load_Img" src="img/up_floor.png"/>
                                    <div className="PreLoadStory_Load_Text">正在加载中……</div>
                                </div>
                            </div>)
                        : null
                }
            </Fragment>
        )
    }
    /* 故事模式分配函数 */
    returnModeStory = () => {
        let mode = this.state.nowStory.storyMode;
        switch (mode) {
            case 0:
                return <StoryMode0 StoryMode0_OnRef={this.StoryMode0_OnRef} nowStory={this.state.nowStory} closeStory={this.closeStory}
                    setYSPos={this.props.setYSPos} setStory={this.props.setStory} />
            case 2:
                return <StoryMode2 StoryMode2_OnRef={this.StoryMode2_OnRef} nowStory={this.state.nowStory} closeStory={this.closeStory}
                    setYSPos={this.props.setYSPos} setStory={this.props.setStory} />
            default:
                return;
        }
    }
    nextStoryWord = () => {
        let mode = this.state.nowStory.storyMode;
        switch (mode) {
            case 0:
                return this.StoryMode0.nextWord_ModeStory0();
            case 2:
                return this.StoryMode2.nextWord_ModeStory2();
            default:
                return;
        }
    }
    /* 返回故事块 */
    returnStoryMap = (map, index, nowMapNum) => {
        //map的格式样例————'no-0_01-Story'或'no-0_01-Monster10-Story'
        let storyMap = map.split("-");
        let baseImg = storyMap[0];
        let storyId = storyMap[1];
        let backgroundSize, backgroundPosition, backgroundImage;
        this.state.storyMapList1.map((storyMap) => {
            if (storyMap.lx == map) {
                backgroundSize = storyMap.width * 100 + "% " + storyMap.height * 100 + "%";
                backgroundPosition = storyMap.pos * -100 + "% " + storyMap.column * -100 + "%";
                backgroundImage = "URL(" + storyMap.url + ")";
            }
        })
        return (
            <div className="NormalMap_StoryMap_base_complex" index={index} storyId={storyId} lx={"Story"} key={nowMapNum + "个" + index}>
                <div className="NormalMap_StoryMap" style={{ backgroundImage: backgroundImage, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} />
                {/* {storyMap.map((img, index) => {
                    if (index === 0 || index === 1 || index === storyMap.length - 1)
                        return;
                    else
                        return <img className="NormalMap" src={this.props.returnTypeImg(img)} />;
                })} */}
            </div>
        )
    }
    /* ----------------------- */

    /* 关闭故事 */
    closeStory = (flag) => {
        if (flag && this.state.nowStoryId !== "0_00_start" && this.state.nowStoryId !== "0_01") {
            //对是否存在返回的故事块进行判断，不存在则不作为，存在则将该触发过的故事块置换为普通的地图块。
            //之后可在此针对复合地图块进行修正，或许需要新建storyMode，也需要在title中新建返回复合地图块的地图块控制元素
            //所谓复合地图块，例子————（底层）地板、（高层）物体块二者的叠加，其实三者、四者、五者、多者都可以（开发中的预想）。
            this.props.remove(this.props.nowMeetMap);
        }
        this.props.closeStory();
    }
    /* ----------------------- */

    /* 故事模式组件 */
    StoryMode0_OnRef = (ref) => {
        this.StoryMode0 = ref;
    }
    StoryMode2_OnRef = (ref) => {
        this.StoryMode2 = ref;
    }
    /* ----------------------- */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(StoryWord);