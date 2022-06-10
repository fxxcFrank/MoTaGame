import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as actionCreators from './store/actionCreators'

class Action extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentWillMount(){
        document.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.onKeyDown);
    }

    render(){
        return(
            <Fragment>
            </Fragment>
        )
    }

    onKeyDown = (e) => {
        switch (e.keyCode) {
            case 38:
                this.up();
                break;
            case 40:
                this.down();
                break;
            case 39:
                this.right();
                break;
            case 37:
                this.left();
                break;
        }
    }

    up(){
        console.log('up');
        let location = document.getElementById('me');
        let length = Math.sqrt(this.props.CurrentMap.length);
        let id = location.parentElement.parentElement.id - length;
        console.log(location.parentElement.parentElement.id, location.parentElement.parentElement.id);
        document.getElementsByName(id).appendChild(location);
    }

    down(){
        console.log('down');
    }

    right(){
        console.log('right');
    }

    left(){
        console.log('left');
    }

}

const mapState = (state) => ({
    Location: state.getIn(['Action', 'location']),
    CurrentMap: state.getIn(['Action', 'currentMap']),
    HP: state.getIn(['Action', 'hp']),
    Attack: state.getIn(['Action', 'attack']),
    Defense: state.getIn(['Action', 'defense']),
});

const mapProps = (dispatch) => ({
    changeHP(data){
        dispatch(actionCreators.changeHP(data))
    },
    changeAttack(data){
        dispatch(actionCreators.changeAttack(data))
    },
    changeDefense(data){
        dispatch(actionCreators.changeDefense(data))
    },
});
export default connect(mapState, mapProps)(Action);