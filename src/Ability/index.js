/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import Exploration from './Skills/Exploration'
import Handbook from './Skills/Handbook'

import './style.css'
import axios from 'axios'

class Ability extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.props.abilityComponentOnRef ? this.props.abilityComponentOnRef(this) : null;
    }

    render() {
        const { } = this.state;
        const { allState, openAbility, closeAbility, setTip, setTip_split, mainWindowKeyOn } = this.props;
        const props = { openAbility, closeAbility, setTip, setTip_split, mainWindowKeyOn };
        return (
            <Fragment>
                <Exploration palyVoice={this.palyVoice} {...props} />  {/* 能力————探测（快捷键E） */}
                <Handbook palyVoice={this.palyVoice} {...props} />  {/* 能力————手册（快捷键L） */}

            </Fragment>
        )
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
export default connect(mapState, mapProps)(Ability);