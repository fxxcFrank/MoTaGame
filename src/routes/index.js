import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import Title from '../Title';
import CreateMap from '../CreateMap';
import CreateStory from '../CreateStory';

class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        // document.addEventListener("keydown", this.keyOn);
    }
    componentWillUnmount() {
        // document.removeEventListener("keydown", this.keyOn);
    }

    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path='/' exact component={Title} />
                    <Route path='/CreateMap' exact component={CreateMap} />
                    <Route path='/CreateStory' exact component={CreateStory} />
                </Switch>
            </HashRouter>
        )
    }

    keyOn = (e) => {
        let keyCode = e.keyCode;
        if (window.electron) {
            switch (keyCode) {
                case 116:
                    window.electron.ipcRenderer.send("f5"); //应用刷新
                    break;
                // case 122:
                //     window.electron.ipcRenderer.send("f11");//应用放大或全屏
                //     break;
                case 123:
                    window.electron.ipcRenderer.send("f12");//应用打开调试工具
                    break;
                default:
                    break;
            }
        }
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({

});
export default connect(mapState, mapProps)(Routes);