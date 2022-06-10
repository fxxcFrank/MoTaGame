import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'

class ShopMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storyMap1List: [],
        }
    }

    componentWillMount = () => {
        // eslint-disable-next-line no-unused-expressions
        // this.props.monsterMapComponentOnRef ? this.props.monsterMapComponentOnRef(this) : null;
        axios.get('data/baseMap/storyMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ storyMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <Fragment>
                {this.state.storyMap1List.map((baseMap) => {
                    let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                    let backgroundPosition = baseMap.pos * 100 + "% " + baseMap.column * 100 + "%";
                    return (
                        <img className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")",backgroundSize: backgroundSize, backgroundPosition: backgroundPosition}} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
                    )
                    // return (
                    //     <img className="CreateMap_baseMap" lx={baseMap.lx} src={baseMap.url} title={baseMap.name} onClick={()=>this.props.clickAddMap(baseMap)} />
                    // )
                })}
            </Fragment>
        )
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(ShopMap);