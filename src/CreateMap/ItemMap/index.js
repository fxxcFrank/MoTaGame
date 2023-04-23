import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class ItemMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            baseMap1List: [],
            itemMap1List: [],
        }
    }

    componentWillMount = () => {
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/itemMap1.json')
            .then((res) => {
                const result = res.data;
                this.props.setAllCount(result.length);
                this.props.setNowAllList(result);
                this.setState({ itemMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/gameData/itemList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ itemList: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        const { baseMap1List, itemMap1List, itemList } = this.state
        const { nowCurrentPage, pageSizeCount } = this.props;
        let indexLimit = (nowCurrentPage - 1) * pageSizeCount;
        return (
            <Fragment>
                {itemMap1List.map((baseMap, index) => {
                    if (index < indexLimit || index >= indexLimit + pageSizeCount) return;
                    let map = null;
                    let mapList = baseMap.baseMap;
                    let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                    let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                    let tempMap2 = <div className="CreateMap_baseMap_moster" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} onClick={() => this.props.clickAddMap(baseMap)}
                        onMouseEnter={(e) => this.props.showHoverMapInfo(itemList[index], index, e)} onMouseLeave={this.props.outOfHoverMapInfo}>{baseMap.name}</div>
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
                    return map;
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
export default connect(mapState, mapProps)(ItemMap);