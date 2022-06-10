import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as actionCreators from './store/actionCreators'
import './style.css'

class StatusPanel extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }
    
    componentDidUpdate(){
        console.log('componentDidMount');
        if(this.props.statusPanel){
            let location = document.getElementsByName('first');
            let me = document.createElement('div');
            me.innerHTML = "<div class='me' id='me'>我</div>";
            location.appendChild(me)
        }
    }

    render(){
        if(!this.props.statusPanel){
            return null;
        }
        return(
            <Fragment>
                <div className='statusPanel'>
                    <div>{'生命值：' + this.props.HP}</div>
                    <div>{'攻击：' + this.props.Attack}</div>
                    <div>{'防御：' + this.props.Defense}</div>
                </div>
            </Fragment>
        )
    }
}

const mapState = (state) => ({
    statusPanel: state.getIn(['Action', 'statusPanel']),
    HP: state.getIn(['Action', 'hp']),
    Attack: state.getIn(['Action', 'attack']),
    Defense: state.getIn(['Action', 'defense']),
});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(StatusPanel);

