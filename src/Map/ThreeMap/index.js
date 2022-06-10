import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

class ThreeMap extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentWillMount(){

    }

    render(){
        return(
            <Fragment>
                <div>
                </div>
            </Fragment>
        )
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({

});
export default connect(mapState, mapProps)(ThreeMap);