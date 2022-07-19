/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class Shop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shopList: [],
            shopMapList: [],
            shopType: "",
            nowShop: {},
            nowShopGoodsNum: 0,
            nowShopGoodsLength: 0,
            shopFlag: false,
            shop1Flag: false,
            shop2Flag: false,
            shopTitle: "",
            shopExplain: "",
            shopGoodsList: [],
            spendGold: null,
        }
        this.props.shopComponentOnRef ? this.props.shopComponentOnRef(this) : null;
        axios.get('data/baseMap/shopMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ shopMapList: result });
                this.returnImg(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMapList: result });
                this.returnImg2(result);
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get('data/shopList.json')
            .then((res) => {
                const result = res.data;
                let shopList = this.state.shopList;
                shopList.map((shop) => {
                    if (shop.shopType === this.props.shopType) {
                        this.setState({
                            nowShop: shop,
                            nowShopGoodsLength: shop.shopGoodsList.length,
                            shopTitle: shop.shopTitle,
                            shopExplain: shop.shopExplain,
                            shopGoodsList: shop.shopGoodsList,
                        })
                    }
                })
                this.setState({ shopList: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    /* 该时间周期函数中不能使用this */
    static getDerivedStateFromProps(props, state) {
        if (props.shopType !== state.shopType) {
            return {
                shopType: props.shopType
            };
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.shopType !== this.state.shopType) {
            let shopList = this.state.shopList;
            shopList.map((shop) => {
                if (shop.shopType === this.state.shopType) {
                    this.setState({
                        nowShop: shop,
                        nowShopGoodsLength: shop.shopGoodsList.length,
                        shopTitle: shop.shopTitle,
                        shopExplain: shop.shopExplain,
                        shopGoodsList: shop.shopGoodsList,
                    })
                }
            })
        }
    }

    render() {
        const { shopTitle, shopExplain, shopGoodsList, nowShopGoodsNum, nowShopGoodsLength } = this.state;
        return (
            <Fragment>
                {this.props.shopFlag ?
                    <div className="Shop_Row">
                        <div className="Shop_Main">
                            <div className="Shop_Main_Title">{shopTitle}</div>
                            <div className="Shop_Main_Tip">{shopExplain}</div>
                            <div className="Shop_Main_Goods" id="Shop_Main_Goods">
                                {shopGoodsList.map((goods, index) => {
                                    return (
                                        <div className={nowShopGoodsNum === index ? "Shop_Main_Goods_select_focus" : "Shop_Main_Goods_select"} onClick={() => this.selectGoods(goods.spend, goods.get)}>{goods.text}</div>
                                    )
                                })}
                                <div className={nowShopGoodsNum === nowShopGoodsLength ? "Shop_Main_Goods_exit_focus" : "Shop_Main_Goods_exit"} onClick={() => this.exitShop()}>退出</div>
                            </div>
                        </div>
                    </div>
                    : null}
            </Fragment>
        )
    }

    changeShopGoods = (num) => {
        // this.palyVoice('voice/event_03.mp3');
        this.palyVoice('voice/event_01.ogg');
        let nowShopGoodsNum = this.state.nowShopGoodsNum;
        let nowShopGoodsLength = this.state.nowShopGoodsLength;
        let nextNum = nowShopGoodsNum + num;
        if (nextNum >= 0 && nextNum <= nowShopGoodsLength) {    //因为退出商店键不隶属于商品列表之内，所以总长度需加一
            this.setState({ nowShopGoodsNum: nextNum })
        }
        else if (nextNum < 0) {
            this.setState({ nowShopGoodsNum: nowShopGoodsLength })
        }
        else {
            this.setState({ nowShopGoodsNum: 0 })
        }
    }
    selectGoods = (spend, get) => {
        // this.palyVoice('voice/event_04.mp3');
        this.palyVoice('voice/event_02.ogg');
        this.props.selectGoods(spend, get);
    }
    exitShop = () => {
        this.props.exitShop();
        this.setState({
            nowShopGoodsNum: 0,
        })
    }

    getShopGoods = () => {
        let plugin = document.getElementById("Shop_Main_Goods");
        let nowShopGoodsNum = this.state.nowShopGoodsNum;
        plugin.childNodes[nowShopGoodsNum].click();
    }

    returnShopMap = (lx, index, nowMapNum) => {
        let dataMapList = [...this.state.shopMapList];
        let list = [...dataMapList];
        let map = null;
        list.map((baseMap, baseMapIndex) => {
            if (baseMap.lx === lx) {
                let mapList = baseMap.baseMap;
                let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                let backgroundImage = baseMap.urlImage ? baseMap.urlImage : "URL(" + baseMap.url + ")";
                let tempMap2 = <div className={"NormalMap_ShopMap_1"} id={"NormalMap_ShopMap-" + index} style={{ backgroundImage: backgroundImage, backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} index={index} lx={baseMap.lx} key={nowMapNum + "个" + index} />;
                if (mapList) {
                    let baseMapList = [];
                    mapList.map((mapType, mapTypeIndex) => {
                        let tempList = [...this.state.baseMapList];
                        tempList.map((tempMap, tempIndex) => {
                            if (tempMap.lx === mapType) {
                                let tempBackgroundSize = tempMap.width * 100 + "% " + tempMap.height * 100 + "%";
                                let tempBackgroundPosition = tempMap.pos * 100 + "% " + tempMap.column * 100 + "%";
                                let temp = <div className="NormalMap_ShopMap_base" style={{ backgroundImage: "URL(" + tempMap.url + ")", backgroundSize: tempBackgroundSize, backgroundPosition: tempBackgroundPosition, position: "absolute", zIndex: mapTypeIndex }} lx={tempMap.lx} title={tempMap.name} />
                                baseMapList.push(temp);
                            }
                        })
                    })
                    baseMapList.push(tempMap2);
                    map = <div className="NormalMap_ShopMap_base_complex">
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
    returnImg = (shopMapList) => {
        let _this = this;
        let numLength = shopMapList.length;
        let numCount = 0;
        shopMapList.map((baseMap) => {
            if (baseMap == undefined){
                numCount+=1;
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
                numCount+=1;
                if(numCount===numLength){
                    _this.props.setPreloadFlag("shopPreloadFlag", true);
                }
            };
            if(numCount===numLength){
                _this.props.setPreloadFlag("monsterPreloadFlag", true);
            }
        })
        this.setState({ shopMapList: shopMapList });
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

    /* 播放音效 */
    palyVoice = (url) => {      //(未测试)效果存疑，之后加入音效再行测试
        const myAudio = new Audio()
        myAudio.preload = true; //
        // myAudio.controls = true;
        myAudio.loop = false;
        myAudio.src = url;
        // 播完时候播放下一首
        // myAudio.addEventListener('ended', this.ChangeMusic.bind(this, myAudio), false);
        myAudio.play();
        // setTimeout(() => {
        //     myAudio.pause();
        // }, 5000);
    }
    /*  */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(Shop);