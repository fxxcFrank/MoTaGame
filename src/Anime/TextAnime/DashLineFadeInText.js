/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as echarts from 'echarts';
import './style.css'

//2023.07.24 刚刚看到echart的一个样式，目前考虑可以用于开幕、过场或是闭幕动画，现在感觉最为贴合的是开场文字过后，
//用这个样式展示一遍游戏标题或者魔塔、勇者，然后渐隐出现最开始的地方。
class DashLineFadeInText extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
        this.init();
    }

    //目前仅使用于开始游戏时的报幕，共计15s的动画，暂时自定义程度较低（因为显隐模式都已固定，之后有空可以再行调整）
    init = () => {
        const { index, nowAnimeData } = this.props;
        let nowIndex = index || 0;
        let nowText = nowAnimeData.text || '勇者';
        let nowTime = nowAnimeData.time || 6000;
        let chartDom = document.getElementById(`DashLineFadeInText-${nowIndex}`);
        let myChart = echarts.init(chartDom);
        let option;
        console.log('nowAnimeData', nowAnimeData);
        option = {
            graphic: {
                elements: [
                    {
                        type: 'text',
                        left: 'center',
                        top: 'center',
                        style: {
                            // text: 'Apache Echarts',
                            // text: '勇者',
                            text:nowText,
                            fontSize: 80,
                            fontWeight: 'bold',
                            lineDash: [0, 200],
                            lineDashOffset: 0,
                            fill: 'transparent',
                            // stroke: '#000',
                            stroke: '#fff',
                            lineWidth: 1,
                        },
                        keyframeAnimation: {
                            // duration: 6000,
                            duration: nowTime,
                            loop: false,
                            keyframes: [
                                {
                                    percent: 0.33,           //第一步线条渐变，大概需要5s
                                    style: {
                                        stroke: '#fff',
                                        fill: 'transparent',
                                        color: 'black',
                                        lineDashOffset: 200,
                                        lineDash: [200, 0]
                                    }
                                },
                                {
                                    percent: 0.4,          
                                    style: {
                                        fill: 'transparent',
                                        color: 'black',
                                    }
                                },
                                {
                                    percent: 0.46,           //第二步内容填充，大概需要2s
                                    style: {
                                        fill: '#fff'
                                    }
                                },
                                {
                                    percent: 0.66,          //第三步暂停展示，大概需要3s
                                    style: {
                                        fill: '#fff',
                                        stroke: '#fff',
                                        color: 'black',
                                    }
                                },
                                {
                                    percent: 0.8,          //第四步渐隐消失，大概需要2s
                                    style: {
                                        fill: 'transparent',
                                        stroke: 'transparent',
                                        color: 'transparent',
                                    }
                                },
                                {
                                    percent: 1,             //第五步消失后白屏暂停1s，再花2s逐渐透明显示
                                    style: {
                                        fill: 'transparent',
                                        stroke: 'transparent',
                                        color: 'transparent',
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        };
        option && myChart.setOption(option);
    }

    render() {
        const { index ,nowAnimeData} = this.props;
        let nowIndex = index || 0;
        return (
            <Fragment>
                <div className="DashLineFadeInText" id={`DashLineFadeInText-${nowIndex}`} 
                style={{"--backgroundColor":`${nowAnimeData.backgroundColor}`,"--time":`${nowAnimeData.time}ms`}}/>
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
export default connect(mapState, mapProps)(DashLineFadeInText);