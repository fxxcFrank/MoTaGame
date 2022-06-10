import React, { Fragment, Component } from "react"
import './base.css'
export default class Empty extends Component{
    render() {
        return(
            <Fragment>
                <div className={'baseArea'} id={this.props.id} name={this.props.location}>
                    <div className={'baseImg'} />
                </div>
            </Fragment>
        )
    }
}