/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal } from 'antd'
import './skillsStyle.css'

class Handbook extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        // window.electron ? window.electron.ipcRenderer.on('saveData', function (event, saveData) {
        //     console.log('所有存档-----', saveData);
        //     _this.setState({ saveDataList: saveData });
        // }) : null;
        document.addEventListener("keydown", this.keyOn);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        const { } = this.state;
        const { allState } = this.props;
        return (
            <Fragment>
                
            </Fragment>
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        // this.palyVoice('Audio/RPG魔塔音效素材/SE/确定.mp3');
        // this.palyVoice('Audio/RPG魔塔音效素材/SE/选择.mp3');
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Handbook);