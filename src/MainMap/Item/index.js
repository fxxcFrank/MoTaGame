/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
import axios from 'axios'

class ItemMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemList: [],
            itemMapList: [],

            baseMapList: [],
        }
        this.props.itemMapComponentOnRef ? this.props.itemMapComponentOnRef(this) : null;
        axios.get('data/baseMap/itemMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ itemMapList: result });
                // this.returnImg(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMapList: result });
                // this.returnImg2(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/gameData/itemList.json')
            .then((res) => {
                const result = res.data;
                this.setState({ itemList: result });
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
    returnItemMap = (lx, index, nowMapNum) => {
        /* 返回基础图元 */
        let dataMapList = [...this.state.itemMapList];
        let list = [...dataMapList];
        let map = null;
        list.map((itemMap, itemMapIndex) => {
            if (itemMap.lx === lx) {
                let itemList = this.state.itemList;
                let item = {};
                itemList.map((i) => {
                    if (i.itemID === lx) {
                        item = i;
                    }
                })

                let mapList = itemMap.baseMap;
                let backgroundSize = itemMap.width * 100 + "% " + itemMap.height * 100 + "%";
                let backgroundPosition = itemMap.pos * -100 + "% " + itemMap.column * -100 + "%";
                let backgroundImage = itemMap.urlImage ? itemMap.urlImage : "URL(" + itemMap.url + ")";
                let tempMap2 = <div className={"NormalMap_ItemMap"} id={"NormalMap_ItemMap-" + index} style={{ backgroundImage: backgroundImage, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} index={index} lx={itemMap.lx} key={nowMapNum + "个" + index} />;
                // this.returnImg(itemMap.url, index,tempMap2);
                if (mapList) {
                    let itemMapList = [];
                    mapList.map((mapType, mapTypeIndex) => {
                        let tempList = [...this.state.baseMapList];
                        tempList.map((tempMap, tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * -100 + "% " + tempMap.column * -100 + "%";
                                let temp = <div className="NormalMap_BaseMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition, position: "absolute", zIndex: mapTypeIndex }} lx={tempMap.lx} title={tempMap.name} />
                                itemMapList.push(temp);
                            }
                        })
                    })
                    itemMapList.push(tempMap2);
                    map = <div className="NormalMap_BaseMap_base_complex">
                        {itemMapList.map((map) => {
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

    /* 使用道具效果 */
    getItemEffect = (lx) => {
        let itemList = this.state.itemList;
        let item = {};
        itemList.map((i) => {
            if (i.itemID === lx) {
                item = i;
            }
        });
        let GetAndSpendData = {};
        if (item.play) this.props.palyVoice(item.play);
        if (item.get) {
            let data = {};
            for (let i in item.get) {
                data[i] = item.get[i];
            }
            GetAndSpendData.get = data;
        }
        if (item.spend) {
            let data = {};
            for (let i in item.spend) {
                data[i] = item.spend[i];
            }
            GetAndSpendData.spend = data;
        }
        this.props.setStateForGetAndSpend(GetAndSpendData);
    }

    /* 通过将图片加载到canvas里面，使用canvas的函数改变画布中特定范围内的颜色通道，使得特定范围内的像素点颜色变得透明 
        目前是将素材中黑色背景替换成透明背景，准确率和召回率还算可以，有空的话再行优化吧。
    */
    returnImg = (itemMapList) => {
        let _this = this;
        let numLength = itemMapList.length;
        let numCount = 0;
        itemMapList.map((itemMap) => {
            if (itemMap === undefined || itemMap.lx === "no" || itemMap.lx === "wall") {
                numCount += 1;
                return;
            }
            let dataImg = itemMap.url;
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
                itemMap.urlImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")";
                numCount += 1;
                if (numCount === numLength) {
                    _this.props.setPreloadFlag("itemMapPreloadFlag", true);
                }
            };
            if (numCount === numLength) {
                _this.props.setPreloadFlag("monsterPreloadFlag", true);
            }
        })
        this.setState({ itemMapList: itemMapList });
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
export default connect(mapState, mapProps)(ItemMap);