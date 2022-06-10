import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import Title from '../Title';
import Test from '../Title/test'
import * as text1 from '../Title/test1'
import test2 from '../Test/text2'
import FirstMap from '../Map/FirstMap';
import TwoMap from '../Map/TwoMap';
import ThreeMap from '../Map/ThreeMap';

class Routes extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
            <HashRouter>
                <Switch>
                    <Route path='/' exact component={Title} />
                    <Route path='/test' exact component={Test} />
                    <Route path='/test1' exact component={text1.Demo} />
                    <Route path='/test2' exact component={test2} />
                    
                    <Route path='/FirstMap' exact component={FirstMap} />
                    <Route path='/TwoMap' exact component={TwoMap} />
                    <Route path='/ThreeMap' exact component={ThreeMap} />
                </Switch>
            </HashRouter>
        )
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({

});
export default connect(mapState, mapProps)(Routes);