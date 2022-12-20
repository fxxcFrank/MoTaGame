import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class MonsterMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseMap1List: [],
            monsterMap1List: [],
        }
    }

    componentWillMount = () => {
        // eslint-disable-next-line no-unused-expressions
        // this.props.monsterMapComponentOnRef ? this.props.monsterMapComponentOnRef(this) : null;
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/monsterMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ monsterMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const { baseMap1List, monsterMap1List } = this.state
        return (
            <Fragment>
                {monsterMap1List.map((baseMap) => {
                    let map = null;
                    let mapList = baseMap.baseMap;
                    let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                    let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                    let tempMap2 = <img className="CreateMap_baseMap_moster" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
                    if (mapList) {
                        let baseMapList = [];
                        mapList.map((mapType, mapTypeIndex) => {
                            baseMap1List.map((tempMap, tempIndex) => {
                                if (tempMap.lx === mapType) {
                                    let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                    let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                    let temp = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition, position: "absolute", zIndex: mapTypeIndex }} lx={tempMap.lx} title={tempMap.name} />
                                    baseMapList.push(temp);
                                }
                            })
                        })
                        baseMapList.push(tempMap2);
                        map = <div className="CreateMap_baseMap_base_complex">
                            {baseMapList.map((map) => {
                                return map;
                            })}
                        </div>
                    }
                    else {
                        map = tempMap2;
                    }
                    return (
                        map
                        // <div className="CreateMap_baseMap_moster" style={{ backgroundImage: "URL(" + baseMap.url + ")",backgroundSize: backgroundSize, backgroundPosition: backgroundPosition}} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} >{baseMap.name}</div>
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
export default connect(mapState, mapProps)(MonsterMap);