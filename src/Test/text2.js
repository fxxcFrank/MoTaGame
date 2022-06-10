import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import * as echarts from 'echarts';
import * as actionCreators from '../Action/store/actionCreators'
import './style.css'
// import style from './style.css'

class Title extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        this.init()
    }

    render() {
        return (
            <Fragment>
                <div id="main_echart" style={{width:"100%", height:"100vh"}}></div>
            </Fragment>
        )
    }

    init() {
        var graph = {  //这是数据项目中一般都是获取到的
            nodes: [
                { "id": "0", "name": "id0", "attributes": { "modularity_class": 4 } },
                { "id": "1", "name": "id1", "attributes": { "modularity_class": 0 } },
                { "id": "2", "name": "id2", "attributes": { "modularity_class": 1 } },
                { "id": "3", "name": "id3", "attributes": { "modularity_class": 2 } }
            ],
            links: [
                { "id": "0", "source": "0", "target": "1" },
                { "id": "1", "source": "0", "target": "2" },
                { "id": "2", "source": "0", "target": "3" },
            ]
        }
        var myChart = echarts.init(document.getElementById('main_echart'));
        var categories = [
            {
                id: 0,
                name: '手机',
                itemStyle: { normal: { color: '#c23531' } },
                symbolSize: [42, 42]
            },
            {
                id: 1,
                name: 'QQ',
                itemStyle: { normal: { color: '#61a0a8' } },
                symbolSize: [42, 42]
            },
            {
                id: 2,
                name: '微信',
                itemStyle: { normal: { color: '#749f83' } },
                symbolSize: [42, 42]
            },
            {
                id: 3,
                name: '微博',
                itemStyle: { normal: { color: '#d48265' } },
                symbolSize: [42, 42]
            },
            {
                id: 4,
                name: ' ',
                itemStyle: { normal: { color: '#2E3F4C' } },
                symbolSize: [64, 64]
            }
        ];
        var winWidth = document.body.clientWidth;
        var winHeight = document.body.clientHeight;
        graph.nodes.forEach(function (node) {
            node.x = parseInt(Math.random() * 1000);  //这里是最重要的如果数据中有返回节点x,y位置这里就不用设置，如果没有这里一定要设置node.x和node.y，不然无法定位节点 也实现不了拖拽了；
            node.y = parseInt(Math.random() * 1000);
            if (node.attributes.modularity_class != 4) {
                node.symbolSize = [42, 42];
                node.sizeFlag = [42, 42];
            } else {
                node.symbolSize = [64, 64];
                node.sizeFlag = [64, 64];
            }
            node.category = node.attributes.modularity_class;
            node.label = {
                normal: {
                    show: true
                }
            }
        });
        var option = {    //这里是option配置
            legend: [{    //图例组件
                data: categories.map(function (a) {
                    return a.name;
                }),
                top: 0,
                left: (winWidth - 1300) / 2,         //这里是图例组件定位使用的，自定义
                itemGap: 26,
                textStyle: {
                    padding: [0, 12]
                },
                backgroundColor: '#f5f5f5'
            }],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
                {
                    type: 'graph',
                    layout: 'none',           //因为节点的位置已经有了就不用在这里使用布局了
                    circular: { rotateLabel: true },
                    animation: false,
                    data: graph.nodes,
                    links: graph.links,
                    categories: categories,   //节点分类的类目
                    roam: true,   //添加缩放和移动
                    draggable: false,   //注意这里设置为false，不然拖拽鼠标和节点有偏移
                    label: {
                        normal: {
                            position: 'bottom',
                            rich: {
                                bg: {
                                    backgroundColor: '#f5f5f5'
                                }
                            }
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
        initInvisibleGraphic();
        function initInvisibleGraphic() {
            // Add shadow circles (which is not visible) to enable drag.
            myChart.setOption({
                graphic: echarts.util.map(option.series[0].data, function (item, dataIndex) {
                    //使用图形元素组件在节点上划出一个隐形的图形覆盖住节点
                    var tmpPos = myChart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
                    return {
                        type: 'circle',
                        id: dataIndex,
                        position: tmpPos,
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: 20
                        },
                        // silent:true,
                        invisible: true,
                        draggable: true,
                        ondrag: echarts.util.curry(onPointDragging, dataIndex),
                        z: 100              //使图层在最高层
                    };
                })
            });
            window.addEventListener('resize', updatePosition);
            myChart.on('dataZoom', updatePosition);
        }
        myChart.on('graphRoam', updatePosition);
        function updatePosition() {    //更新节点定位的函数
            myChart.setOption({
                graphic: echarts.util.map(option.series[0].data, function (item, dataIndex) {
                    var tmpPos = myChart.convertToPixel({ 'seriesIndex': 0 }, [item.x, item.y]);
                    return {
                        position: tmpPos
                    };
                })
            });

        }
        function onPointDragging(dataIndex) {      //节点上图层拖拽执行的函数
            var tmpPos = myChart.convertFromPixel({ 'seriesIndex': 0 }, this.position);
            option.series[0].data[dataIndex].x = tmpPos[0];
            option.series[0].data[dataIndex].y = tmpPos[1];
            myChart.setOption(option);
            updatePosition();
        }

    }
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
    changeStatusPanel(data) {
        dispatch(actionCreators.changeStatusPanel(data))
    },
});
export default connect(mapState, mapProps)(Title);