/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"

import './style.css'
import axios from 'axios'

class BaseMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseMap1List: [],
        }
    }

    componentWillMount = () => {
        // eslint-disable-next-line no-unused-expressions
        this.props.baseMapComponentOnRef ? this.props.baseMapComponentOnRef(this) : null;
        axios.get('data/baseMap/baseMap1.json')
            .then((res) => {
                const result = res.data;
                this.setState({ baseMap1List: result });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        // console.log("this.state.baseMap1List", this.state.baseMap1List);
        return (
            <Fragment>
                {this.state.baseMap1List.map((baseMap, index) => {
                    let backgroundSize = baseMap.width * 100 + "% " + baseMap.height * 100 + "%";
                    let backgroundPosition = baseMap.pos * -100 + "% " + baseMap.column * -100 + "%";
                    return (
                        // <img className="CreateMap_baseMap_base" style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
                        // <img className="CreateMap_baseMap_base" style={{ backgroundImage: "url(data:image/png;base64," + this.changeImage(baseMap.url, baseMap.width, baseMap.height) + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
                        // this.returnImg(baseMap.url, baseMap.width, baseMap.height, index, baseMap, backgroundSize, backgroundPosition)
                        this.returnImg_simple(baseMap.url, baseMap.width, baseMap.height, index, baseMap, backgroundSize, backgroundPosition)
                    )
                })}
            </Fragment>
        )
    }

    getImg = (e) => {
        console.log("e", e);
    }

    returnImg_simple = (dataImg, width, height, index, baseMap, backgroundSize, backgroundPosition) => {
        let div = <img className="CreateMap_baseMap_base" id={"BaseMap_rightMenu-" + index} key={"BaseMap_rightMenu-" + index} style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
        return (
            <Fragment>
                {div}
            </Fragment>
        );
    }
    returnImg = (dataImg, width, height, index, baseMap, backgroundSize, backgroundPosition) => {
        // console.log("dataImg", dataImg);
        //backgroundImage: "URL(" + this.changeImage(baseMap.url) + ")"
        //backgroundImage: "url(data:image/png;base64," + this.changeImage(baseMap.url, baseMap.width, baseMap.height) + ")"
        let self = this;
        let div = <img className="CreateMap_baseMap_base" id={"BaseMap_rightMenu-" + index} key={"BaseMap_rightMenu-" + index} style={{ backgroundImage: "URL(" + baseMap.url + ")", backgroundSize: backgroundSize, backgroundPosition: backgroundPosition }} lx={baseMap.lx} title={baseMap.name} onClick={() => this.props.clickAddMap(baseMap)} />
        let canvas = document.createElement("canvas");
        canvas.className = "CreateMap_baseMap_base";
        // canvas.style.position = "absolute";
        // canvas.style.left = 0;
        // canvas.style.top = 0;
        // canvas.style.zIndex = 100000000000000000;
        canvas.style.border = "1px solid #d3d3d3";
        // ???????????????
        var img = new Image();
        // img.src = "img/doors--.png";
        img.src = dataImg;
        img.onload = function () {
            // console.log("img", img, img.width, img.height, img.naturalWidth, img.naturalHeight);
            // canvas.width = img.width / baseMap.width;
            // canvas.height = img.height / baseMap.height;
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
                //rgb??????40????????????y????????????0 ??????????????????????????????????????????
                if (
                    imageData.data[i] < 32 &&
                    imageData.data[i + 1] < 32 &&
                    imageData.data[i + 2] < 32
                ) {
                    imageData.data[i + 3] = 0;
                }
            }
            canvas.getContext("2d").putImageData(imageData, 0, 0);
            // img.src = canvas.toDataURL("image/png").slice(22);//??????base64

            let div1 = document.getElementById("BaseMap_rightMenu-" + index);
            div1 ? div1.style.backgroundImage = "url(data:image/png;base64," + canvas.toDataURL("image/png").slice(22) + ")" : null;
        };
        return (
            <Fragment>
                {/* <div className="CreateMap_baseMap_base" style={{ position: "relative", }} ref={(nodeElement) => { nodeElement && nodeElement.appendChild(canvas) }} /> */}
                {div}
            </Fragment>
        );
    }

    /*
    * dataimg      base64????????????
    * callback      ????????????  callback = undefined,
    */
    changeImage = (dataImg, width, height) => {
        console.log("dataImg", dataImg);
        //backgroundImage: "URL(" + this.changeImage(baseMap.url) + ")"
        //backgroundImage: "url(data:image/png;base64," + this.changeImage(baseMap.url, baseMap.width, baseMap.height) + ")"
        let self = this;
        let base64Img = document.createElement("base64Img");
        let canvas = document.createElement("canvas");
        // ???????????????
        var img = new Image();
        img.src = dataImg;
        console.log("img", img);
        // canvas.style.width = img.width!==0 ? img.width : 32;
        // canvas.style.height = img.height!==0 ? img.height : 32;
        // canvas.width = img.width!==0 ? img.width : 32;
        // canvas.height = img.height!==0 ? img.height : 32;
        canvas.style.width = width * 100 + "%";
        canvas.style.height = height * 100 + "%";
        // canvas.width = width * 100 + "%";
        // canvas.height = height * 100 + "%";
        console.log("canvas", canvas);
        console.log("img.width", img.width, img.height, width, height);
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0);
        var imageData = canvas.getContext("2d").getImageData(0, 0, 128, 128);
        // for (var i = 0; i < imageData.data.length; i += 4) {
        //     // ?????????????????????????????????????????????
        //     if (imageData.data[i + 3] == 0) {
        //         imageData.data[i] = 255;
        //         imageData.data[i + 1] = 255;
        //         imageData.data[i + 2] = 255;
        //         imageData.data[i + 3] = 255;
        //     }
        // }
        canvas.getContext("2d").putImageData(imageData, 0, 0);
        var img1 = canvas.toDataURL("image/png");
        img1 = img1.substring(img1.indexOf(',') + 1);
        console.log("img1", img1);
        return img1;
        for (var i = 0; i < imageData.data.length; i += 4) {
            // ?????????????????????????????????????????????
            if (imageData.data[i] == 255) {
                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = 0;
            }
        }
        canvas.getContext("2d").putImageData(imageData, 0, 0);
        // let context = canvas.getContext("2d");
        // context.drawImage(img, 0, 0);

        // ???canvas??????????????????????????????
        // var imageData = context.getImageData(
        //     0,
        //     0,
        //     canvas.width,
        //     canvas.height
        // );
        // for (var i = 0; i < imageData.data.length; i += 4) {
        //     //rgb??????250????????????y????????????0
        //     // if (
        //     //     imageData.data[i] < 5 &&
        //     //     imageData.data[i + 1] < 5 &&
        //     //     imageData.data[i + 2] < 5
        //     // ) {
        //     //     imageData.data[i + 3] = 255;
        //     // }
        // }
        // context.putImageData(imageData, 0, 0);
        console.log("canvas", canvas);
        self.baseImg = canvas.toDataURL("image/png").slice(22);//??????base64
        console.log("self.baseImg", self.baseImg);
        return self.baseImg;
        // img.addEventListener(
        //     "load",
        //     function () {
        //         // ???????????????canvas???
        //         canvas.width = img.width;
        //         canvas.height = img.height;
        //         context.drawImage(img, 0, 0);

        //         // ???canvas??????????????????????????????
        //         var imageData = context.getImageData(
        //             0,
        //             0,
        //             canvas.width,
        //             canvas.height
        //         );
        //         for (var i = 0; i < imageData.data.length; i += 4) {
        //             //rgb??????250????????????y????????????0
        //             if (
        //                 imageData.data[i] > 250 &&
        //                 imageData.data[i + 1] > 250 &&
        //                 imageData.data[i + 2] > 250
        //             ) {
        //                 imageData.data[i + 3] = 0;
        //             }
        //         }
        //         context.putImageData(imageData, 0, 0);
        //         self.baseImg = canvas.toDataURL("image/png").slice(22);//??????base64
        //         console.log("self.baseImg", self.baseImg);
        //         return self.baseImg;
        //         if (typeof callback !== undefined) {
        //             if (callback) callback(self.baseImg);
        //         }
        //     },
        //     false
        // );
    }

    // /* ??????????????????????????? */
    // returnMap(lx) {
    //     let baseMap1List = this.state.baseMap1List;
    //     baseMap1List.map((baseMap) => {
    //         if (baseMap.lx === lx)
    //             return <img className="CreateMap_baseMap" lx={baseMap.lx} src={baseMap.url} onClick={this.props.clickAddMap(baseMap)} />
    //     })
    // }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    // changeStatusPanel(data) {
    //     dispatch(actionCreators.changeStatusPanel(data))
    // },
});
export default connect(mapState, mapProps)(BaseMap);