/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'

class BaseMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseMapList: [],
        }
        this.props.baseMapComponentOnRef ? this.props.baseMapComponentOnRef(this) : null;
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMapList: result });
                // this.returnImg(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/gameData/mapEventList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ mapEventList: result });
                // this.returnImg(result);
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

    /* 返回基础图像块 */
    returnBaseMap = (lx, index, nowMapNum) => {
        /* 返回基础图元 */
        let dataMapList = [...this.state.baseMapList];
        let list = [...dataMapList];
        let map = null;
        list.map((baseMap, baseMapIndex) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                let backgroundImage = baseMap.urlImage ? baseMap.urlImage : "URL(" + baseMap.url + ")";
                let tempMap2 = <div className={"NormalMap_BaseMap"} id={"NormalMap_BaseMap-" + index} style={{ backgroundImage: backgroundImage, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} index={index} lx={baseMap.lx} key={nowMapNum + "个" + index} />;
                if (lx == "start") {
                    tempMap2 = <div className={"NormalMap_BaseMap"} style={{ backgroundImage: backgroundImage, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} index={index} lx={baseMap.lx} key={nowMapNum + "个" + index} id="start">
                        {/* <div className="mtYS_Img_down" id="mtYS" index={index} style={{ backgroundImage: "URL(img/ys.png)" }}></div> */}
                    </div>;
                }
                // this.returnImg(baseMap.url, index,tempMap2);
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType, mapTypeIndex) => {
                        list.map((tempMap, tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * -100 + "% " + tempMap.column * -100 + "%";
                                let temp = <div className="NormalMap_BaseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition, position: "absolute", zIndex: mapTypeIndex }} lx={tempMap.lx} title={tempMap.name} />
                                baseMapList.push(temp);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <div className="NormalMap_BaseMap_base_complex">
                        {baseMapList.map((map) => {
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

    /* 通过将图片加载到canvas里面，使用canvas的函数改变画布中特定范围内的颜色通道，使得特定范围内的像素点颜色变得透明 
        目前是将素材中黑色背景替换成透明背景，准确率和召回率还算可以，有空的话再行优化吧。
    */
    returnImg = (baseMapList) => {
        let _this = this;
        let numLength = baseMapList.length;
        let numCount = 0;
        baseMapList.map((baseMap) => {
            if (baseMap === undefined || baseMap.lx === "no" || baseMap.lx === "wall") {
                numCount += 1;
                return;
            }
            let dataImg = baseMap.url;
            let canvas = document.createElement("canvas");
            var img = new Image();
            img.src = dataImg;
            img.onload = function () {
                canvas.width = img.width;
                canvas.height = img.height;
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
                        imageData.data[i] < 100 &&
                        imageData.data[i + 1] < 100 &&
                        imageData.data[i + 2] < 100
                    ) {
                        imageData.data[i + 3] = 0;
                    }
                }
                canvas.getContext("2d").putImageData(imageData, 0, 0);
                baseMap.urlImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")";
                numCount += 1;
                if (numCount === numLength) {
                    _this.props.setPreloadFlag("baseMapPreloadFlag", true);
                }
            };
            if (numCount === numLength) {
                _this.props.setPreloadFlag("monsterPreloadFlag", true);
            }
        })
        this.setState({ baseMapList: baseMapList });
    }

    returnImg2 = (dataImg, index, tempMap2) => {
        let canvas = document.createElement("canvas");
        // 创建新图片
        var img = new Image();
        img.src = dataImg;
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
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
        };
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(BaseMap);