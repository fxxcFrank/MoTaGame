import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class Monster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            monsterList: [],
            monsterMapList: [],

            baseMapList: [],
        }
        // eslint-disable-next-line no-unused-expressions
        this.props.monsterComponentOnRef ? this.props.monsterComponentOnRef(this) : null;
        axios.get('data/baseMap/monsterMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ monsterMapList: result });
                // this.returnImg(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMapList: result });
                this.returnImg2(result);
                // this.props.setPreloadFlag("monsterPreloadFlag", true);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/monsterList.json')
            .then((res) => {
                // debugger
                const result = res.data;
                // console.log("Monster-----",result);
                this.setState({ monsterList: result });
                // this.props.setPreloadFlag("monsterPreloadFlag", true);
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

    /* 返回怪物图像块 */
    returnMonsterMap = (lx, index, nowMapNum) => {
        let dataMapList = [...this.state.monsterMapList];
        let list = [...dataMapList];
        let map = null;
        list.map((baseMap, baseMapIndex) => {
            if (baseMap.lx === lx) {
                let monsterList = this.state.monsterList;
                let monster = {};
                monsterList.map((m) => {
                    if (m.monsterID === lx) {
                        monster = m;
                    }
                })
                let mapList = baseMap.baseMap;
                let backgroundImage = baseMap.urlImage ? baseMap.urlImage : "URL(" + monster.imgUrl + ")";
                // let tempMap2 = <div className={"NormalMap_Monster_" + monster.imgMode + "_" + monster.imgPos} style={{ backgroundImage: backgroundImage }} index={index} lx={monster.monsterID} life={monster.life} gong={monster.gong} fang={monster.fang} levelNum={monster.levelNum} gold={monster.gold} imgMode={monster.imgMode} imgPos={monster.imgPos} imgUrl={monster.imgUrl} key={nowMapNum + "个" + index}>{monster.monsterName}</div>;
                let tempMap2 = <div className={"NormalMap_Monster_" + monster.imgMode + "_" + monster.imgPos} style={{ backgroundImage: backgroundImage }} index={index} lx={monster.monsterID} life={monster.life} gong={monster.gong} fang={monster.fang} levelNum={monster.levelNum} gold={monster.gold} imgMode={monster.imgMode} imgPos={monster.imgPos} imgUrl={monster.imgUrl} key={nowMapNum + "个" + index}></div>;
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType, mapTypeIndex) => {
                        let tempList = [...this.state.baseMapList];
                        tempList.map((tempMap, tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
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

    // returnMonsterMap = (map, index, nowMapNum) => {
    //     let monsterList = this.state.monsterList;
    //     let monster = {};
    //     // console.log(map, index, nowMapNum,monsterList);
    //     monsterList.map((m) => {
    //         if (m.monsterID === map) {
    //             monster = m;
    //         }
    //     })
    //     return <div className={"NormalMap_Monster_" + monster.imgMode + "_" + monster.imgPos} style={{ backgroundImage: "URL(" + monster.imgUrl + ")" }} index={index} lx={monster.monsterID} life={monster.life} gong={monster.gong} fang={monster.fang} levelNum={monster.levelNum} gold={monster.gold} imgMode={monster.imgMode} imgPos={monster.imgPos} imgUrl={monster.imgUrl} key={nowMapNum + "个" + index}>{monster.monsterName}</div>;
    // }

    /* 通过将图片加载到canvas里面，使用canvas的函数改变画布中特定范围内的颜色通道，使得特定范围内的像素点颜色变得透明 
        目前是将素材中黑色背景替换成透明背景，准确率和召回率还算可以，有空的话再行优化吧。
    */
    returnImg = (monsterMapList) => {
        let _this = this;
        let numLength = monsterMapList.length;
        let numCount = 0;
        monsterMapList.map((baseMap) => {
            if (baseMap == undefined) {
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
                // console.log("imageData.data",imageData,imageData.data);
                for (var i = 0; i < imageData.data.length; i += 4) {
                    //rgb小于40的透明度y均设置成0 即将黑色和近灰色都调整成透明
                    if (
                        // imageData.data[i] === 0 &&
                        // imageData.data[i + 1] === 0 &&
                        // imageData.data[i + 2] === 0 
                        imageData.data[i] < 1 &&
                        imageData.data[i + 1] < 1 &&
                        imageData.data[i + 2] < 1
                        // imageData.data[i] <= 10 &&
                        // imageData.data[i + 1] <= 10 &&
                        // imageData.data[i + 2] <= 10
                    ) {
                        if (_this.imageDataCloseCompare(imageData.data, i)) {
                            continue;
                        }
                        imageData.data[i + 3] = 0;
                        // imageData.data[i + 3] = 100;
                    }
                }
                canvas.getContext("2d").putImageData(imageData, 0, 0);
                baseMap.urlImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")";
                numCount += 1;
                if (numCount === numLength) {
                    _this.props.setPreloadFlag("monsterPreloadFlag", true);
                }
            };
            if (numCount === numLength) {
                _this.props.setPreloadFlag("monsterPreloadFlag", true);
            }
        })
        this.setState({ monsterMapList: monsterMapList });
    }

    imageDataCloseCompare = (imageData, index) => {
        let mainLength = imageData.length;
        let mainWidth = Math.sqrt(mainLength);
        let nowColumn = Math.floor(index / mainWidth);
        let flag = false, flag1 = false, flag2 = false;
        for (let i = nowColumn; i > nowColumn - 1; i--) {
            let width = mainWidth * i;
            if (index < width || i < 0) {
                break;
            }
            let upIndex = index >= width ? index - width : index;
            // console.log("imageDataCloseCompare", imageData, width, mainLength);
            if (
                imageData[upIndex] >= 33 &&
                imageData[upIndex + 1] >= 33 &&
                imageData[upIndex + 2] >= 33
            ) {
                // console.log(imageData[upIndex], imageData[upIndex + 1], imageData[upIndex + 2], imageData[upIndex + 3]);
                flag1 = true;
                break;
            }
        }
        for (let j = nowColumn; j < nowColumn + 1; j++) {
            let width = mainWidth * j;
            if (index + width > 65535 || j > 65535) {
                break;
            }
            let downIndex = index + width <= 65535 ? index + width : index;
            if (
                imageData[downIndex] >= 33 &&
                imageData[downIndex + 1] >= 33 &&
                imageData[downIndex + 2] >= 33
            ) {
                flag2 = true;
                break;
            }
        }
        // console.log("flag1,flag2", flag1, flag2);
        if (flag1 || flag2)
            flag = true;
        return flag;
    }

    returnImg2 = (baseMapList) => {
        let _this = this;
        baseMapList.map((baseMap) => {
            if (baseMap == undefined)
                return;
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
                        imageData.data[i] < 32 &&
                        imageData.data[i + 1] < 32 &&
                        imageData.data[i + 2] < 32
                    ) {
                        imageData.data[i + 3] = 0;
                    }
                }
                canvas.getContext("2d").putImageData(imageData, 0, 0);
                baseMap.urlImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")";
                _this.props.setPreloadFlag("monsterPreloadFlag", true);
            };
        })
        this.setState({ baseMapList: baseMapList });
    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(Monster);