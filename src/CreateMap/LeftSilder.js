/* eslint-disable no-unused-expressions */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Tree,message } from 'antd'
import { DownOutlined } from '@ant-design/icons';
// import * as actionCreators from '../Action/store/actionCreators'
import './style.css'

class LeftSilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadMapList: [],
            selectedMap: [],
            selectedInfo:{},
        }
        let _this = this;
        window.electron ? window.electron.ipcRenderer.on('loadMap', function (event, loadMap) {
            console.log('所有地图-----', loadMap);
            _this.setState({ loadMapList: loadMap });
        }) : null;
        this.loadMap();
    }

    componentDidMount = () => {
    }

    render() {
        const { selectedMap } = this.state;
        return (
            <Fragment>
                <div className="CreateMap_LeftMenu">
                    <div className="CreateMap_LeftMenu_TreeDir">
                        <Tree
                            showLine
                            switcherIcon={<DownOutlined />}
                            onSelect={this.onSelect}
                            selectedKeys={selectedMap}
                            treeData={this.returnMapData()}
                        />
                    </div>
                    <input onChange={(e) => this.setState({ saveMapName: e.target.value })} value={this.state.saveMapName} />
                    <div className="CreateMap_LeftMenu_Buttons">
                        <div className="CreateMap_LeftMenu_Button" onClick={() => this.saveNowMap()}>保存</div>
                        <div className="CreateMap_LeftMenu_Button" onClick={() => this.loadMap_json()}>读取（暂未实现）</div>
                        <div className="CreateMap_LeftMenu_Button" onClick={() => this.props.Exit()}>推出编辑</div>
                    </div>
                </div>
            </Fragment>
        )
    }

    onSelect = (selectedKeysValue, info) => {
        console.log('onSelect', selectedKeysValue,info);
        this.setState({ selectedMap: selectedKeysValue,selectedInfo:info });
        this.props.setMap(info.node.map);
    };
    returnMapData = () => {
        const { loadMapList } = this.state;
        let treeList = [];
        loadMapList.map((map, index) => {
            let children = [];
            if (map.data[0].name) {
                map.data.map((data, index1) => {
                    let middleMap = {
                        title: data.name,
                        key: 'tree-' + index + "-" + index1,
                        map:data.map,
                        parentFileName:map.fileName,
                        mapIndex:index1,
                        parentIndex:index,
                    }
                    children.push(middleMap);
                })
                let data = {
                    title: map.fileName,
                    key: 'tree-' + index,
                    children: [...children]
                }
                treeList.push(data);
            }
        })
        return treeList;
    }
    /* 左侧菜单 */
    saveNowMap = () => {    //之后给保存成功做界面显示反馈
        const {selectedInfo,loadMapList} =this.state;
        if(selectedInfo && selectedInfo!={}){
            let data = this.props.nowMap;
            let sendLoadMapList=[...loadMapList[selectedInfo.node.parentIndex].data];
            sendLoadMapList[selectedInfo.node.mapIndex].map=data;
            let jsonData = JSON.stringify(sendLoadMapList);
            // let saveData = this.splitStringData(jsonData);
            let filename = selectedInfo.node.parentFileName;
            // let filename = "112.json";
            window.electron ? window.electron.ipcRenderer.send("SaveCreateMap", filename, jsonData) : null;
            message.error('保存成功！');
        }
        else{
            message.error('保存失败！');
        }
    }
    loadMap = () => {           //读取地图
        let url = "public/data/createMap";
        window.electron ? window.electron.ipcRenderer.send("getAllMapData", url) : null;
    }
    loadMap_json = () => {           //读取地图
        let url = "public/data/createMap";
        window.electron ? window.electron.ipcRenderer.send("getMapData_json", url) : null;
    }
    open = (e, data) => {       //原用以测试‘JSON.stringify()’函数的功能，现暂未测试成功
        console.log("e", e, data);
        return "data";
    }
    splitStringData = (string) => { //将json字符串中每固定数值的点之间，加入\n。
        let list = string.split(",");
        let saveData = "";
        let widthNum = this.state.middleWidth;
        for (let i = 0; i < list.length; i++) {
            if (i === list.length - 1) {
                saveData += list[i];
                break;
            }
            saveData += list[i] + ",";
            if ((i + 1) % widthNum === 0)
                saveData += "\n"
        }
        return saveData;
    }
    /* */
}

const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(LeftSilder);