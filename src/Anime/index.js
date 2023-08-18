/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import { DashLineFadeInText } from './TextAnime'

class StoryWord extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.props.animeComponentOnRef ? this.props.animeComponentOnRef(this) : null;
    }

    componentDidMount() {

    }

    /* 该时间周期函数中不能使用this */      //！！！！！！！！！！！之后要注意，这里和下边对比的是一个对象，之后可能需要使用专门针对判断对象相同的函数
    static getDerivedStateFromProps(props, state) {
        // if (props.nowAnimeData !== state.nowAnimeData) {
        if (props.nowAnimeData) {
            return {
                nowAnimeData: props.nowAnimeData
            };
        }
        return null;
    }

    render() {
        const { animeFlag, nowAnimeData } = this.props;
        return (
            <Fragment>
                {animeFlag ? this.returnTypeAnime() : null}
            </Fragment>
        )
    }
    /* 动画模式分配函数 */
    returnTypeAnime = () => {
        const { nowAnimeData } = this.state;
        let type = nowAnimeData.type;
        if (type.includes('Text')) return this.returnTextAnime(nowAnimeData);
    }
    /*1，文字动画 */
    returnTextAnime = (nowAnimeData) => {
        switch (nowAnimeData.type) {
            case 'DashLineFadeInText': return <DashLineFadeInText nowAnimeData={nowAnimeData} />
            default:
                break;
        }
    }

    /* 播放音效 */
    palyVoice = (url) => {      //(未测试)效果存疑，之后加入音效再行测试
        const myAudio = new Audio()
        myAudio.preload = true; //
        // myAudio.controls = true;
        myAudio.loop = false;
        myAudio.src = url;
        // 播完时候播放下一首
        // myAudio.addEventListener('ended', this.ChangeMusic.bind(this, myAudio), false);
        myAudio.play();
    }
    /*  */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(StoryWord);