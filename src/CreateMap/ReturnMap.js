/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class ReturnMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storyMap1List:[],
            shopMap1List:[],
            baseMap1List: [],
            monsterMap1List: [],
            mouseDownFlag: false,
        }
    }

    componentWillMount = () => {
        this.props.returnMapComponentOnRef ? this.props.returnMapComponentOnRef(this) : null;
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
        axios.get('data/baseMap/storyMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ storyMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/shopMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ shopMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <Fragment>
            </Fragment>
        )
    }

    /* 返回所有地图 */
    returnMap(lx, index) {
        /* 返回基础图元 */
        let dataMapList = [...this.state.baseMap1List];
        /* 返回怪物 */
        if (lx.includes("Monster")) {
            dataMapList = [...this.state.monsterMap1List];
        }
        /* 返回商店 */
        else if (lx.includes("Shop")) {
            dataMapList = [...this.state.shopMap1List];
        }
        /* 返回剧情块 */
        else if (lx.includes("Story")) {
            dataMapList = [...this.state.storyMap1List];
        }
        
        let list = [...this.state.baseMap1List];
        let map = null;
        dataMapList.map((baseMap,baseMapIndex) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                // this.returnImg(baseMap.url,baseMapIndex);
                let tempMap2 = <div className="CreateMap_baseMap_base" id={"CreateMap_baseMap_base-" + baseMapIndex} style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                    onClick={() => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} >{baseMap.name}</div>
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType, mapTypeIndex) => {
                        list.map((tempMap,tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                let temp = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition , position:"absolute",zIndex:mapTypeIndex}} lx={tempMap.lx} title={tempMap.name} />
                                baseMapList.push(temp);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <div className="CreateMap_baseMap_base_complex">
                        {baseMapList.map((map)=>{
                            return map;
                        })}
                    </div>
                }
                else {
                    map = tempMap2;
                }
            }
        })
        return map;
    }
    /* 返回基础地图 */
    returnBaseMap(lx, index) {
        let baseMap1List = this.state.baseMap1List;
        let map = null;
        baseMap1List.map((baseMap) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                let tempMap2 = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                    onClick={() => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} >{baseMap.name}</div>
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType) => {
                        baseMap1List.map((tempMap,tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                let tempMap = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition }} lx={tempMap.lx} title={tempMap.name} >{tempMap.name}</div>
                                baseMapList.push(tempMap);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <Fragment>
                        {baseMapList.map((map)=>{
                            return map;
                        })}
                    </Fragment>
                }
                else {
                    map = tempMap2;
                }
            }
        })
        return map;
    }

    /* 返回怪物地图 */
    returnMonsterMap(lx, index) {
        let monsterMap1List = this.state.monsterMap1List;
        let map = null;
        monsterMap1List.map((baseMap) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                let tempMap2 = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                    onClick={() => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} >{baseMap.name}</div>
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType) => {
                        monsterMap1List.map((tempMap,tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                let tempMap = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition }} lx={tempMap.lx} title={tempMap.name} >{tempMap.name}</div>
                                baseMapList.push(tempMap);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <Fragment>
                        {baseMapList.map((map)=>{
                            return map;
                        })}
                    </Fragment>
                }
                else {
                    map = tempMap2;
                }
            }
        })
        return map;
    }

    /* 返回商店地图 */
    returnShopMap(lx, index) {
        let shopMap1List = this.state.shopMap1List;
        let map = null;
        shopMap1List.map((baseMap) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                let tempMap2 = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                    onClick={() => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} >{baseMap.name}</div>
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType) => {
                        shopMap1List.map((tempMap,tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                let tempMap = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition }} lx={tempMap.lx} title={tempMap.name} >{tempMap.name}</div>
                                baseMapList.push(tempMap);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <Fragment>
                        {baseMapList.map((map)=>{
                            return map;
                        })}
                    </Fragment>
                }
                else {
                    map = tempMap2;
                }
            }   
        })
        return map;
    }

    /* 返回事件地图 */
    returnStoryMap(lx, index) {
        let storyMap1List = this.state.storyMap1List;
        let map = null;
        storyMap1List.map((baseMap) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                // let tempMap2 = <img  className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                //     onClick={()  => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} />
                let tempMap2 = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name}
                    onClick={() => this.props.changeMiddleMap(index)} onMouseDown={(e) => {this.setState({ mouseDownFlag: true },()=>this.mouseDownAndMove(e, index))}} onMouseUp={() => this.setState({ mouseDownFlag: false })} onMouseOver={(e) => this.mouseDownAndMove(e, index)} >{baseMap.name}</div>
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType) => {
                        storyMap1List.map((tempMap,tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                // let tempMap = <img className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition }} lx={tempMap.lx} title={tempMap.name}/>
                                let tempMap1 = <div className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition }} lx={tempMap.lx} title={tempMap.name} >{tempMap.name}</div>
                                baseMapList.push(tempMap1);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <Fragment>
                        {baseMapList.map((map)=>{
                            return map;
                        })}
                    </Fragment>
                }
                else {
                    map = tempMap2;
                }
            }
        })
        return map;
    }

    mouseDownAndMove = (e, index) => {
        if (this.props.mouseDownFlag) {
            this.props.changeMiddleMap(index)
        }
    }

    /* 通过将图片加载到canvas里面，使用canvas的函数改变画布中特定范围内的颜色通道，使得特定范围内的像素点颜色变得透明 
        目前是将素材中黑色背景替换成透明背景，准确率和召回率还算可以，有空的话再行优化吧。
    */
    returnImg = (dataImg, index) => {
        let canvas = document.createElement("canvas");
        canvas.className = "CreateMap_baseMap_base";
        canvas.style.border = "1px solid #d3d3d3";
        // 创建新图片
        var img = new Image();
        img.src = dataImg;
        img.onload = function () {
            canvas.width = img.width ;
            canvas.height = img.height ;
            let context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            var imageData = context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );
            for (var i = 0; i < imageData.data.length; i += 4) {
                //rgb小于40的透明度y均设置成0 即将黑色和近灰色都调整成透明
                if (
                    imageData.data[i] < 32 &&
                    imageData.data[i + 1] < 32 &&
                    imageData.data[i + 2] < 32
                ) {
                    imageData.data[i + 3] = 0;
                }
            }
            canvas.getContext("2d").putImageData(imageData, 0, 0);
            let div = document.getElementById("CreateMap_baseMap_base-" + index);
            div ? div.style.backgroundImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")" : null;
        };
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(ReturnMap);