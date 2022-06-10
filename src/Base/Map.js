import React, { Fragment, Component } from "react"
import './base.css'
export default class Map extends Component{     //地图一般为正方形，所以请使用某个整数的平方长度来定制区域长度
    render() {
        let mapWidth = Math.sqrt(this.props.areaList.length);
        // let list = [...this.props.areaList];
        console.log('mapWidth',mapWidth);
        return(
            <Fragment>
                <div className={'baseMap'}>
                    <div className={'mapColumn'}>
                    {this.props.areaList.map((area, index1) => {
                        if(( index1 + 1 ) % mapWidth === 0){
                            return (
                                <div className='mapRow'>
                                    {this.props.areaList.map((area, index2) => {
                                        if(index1 - index2 >= 0 && index1 - index2 < mapWidth){
                                            // area.key = index2;
                                            // let a = JSON.parse(JSON.stringify(area));
                                            // a.key=index2
                                            // console.log(a)
                                            // console.log('area',area)
                                            // let index = JSON.parse(JSON.stringify(index2));
                                            // let nowArea = JSON.parse(JSON.stringify(this.props.areaList[index2]));
                                            // let nowArea = this.props.areaList[index2];
                                            
                                            // let nowArea = JSON.parse(JSON.stringify(this.list[index]));
                                            // nowArea.key=index2;
                                            // console.log('nowArea',nowArea)
                                            // list[index].key=index2;
                                            // return list[index]
                                            return area
                                        }
                                    })}
                                    {/* {
                                        for(let i = 0, length = this.props.areaList.length; i <= length; i++){
                                            
                                        }

                                    } */}
                                </div>
                            )
                        }
                    })}
                    </div>
                </div>
            </Fragment>
        )
    }
}