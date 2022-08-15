/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal, message, Button, Input, Form, InputNumber, Select } from 'antd';
const { Item } = Form;
const { Option } = Select;
class AddNewMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modeOptionList: [
                { mode: 0, text: "黑幕旁白模式" },
                { mode: 2, text: "普通对话模式" },
                { mode: 3, text: "普通对话模式(不移动到故事方块上)" },
            ],
            showFlag: false,
            preViewFlag: false,
            nowImgPlugin: {},
            selectColumn: undefined,
            selectPos: undefined,
            cursorWidth: undefined,
            cursorHeight: undefined,
            cursorLeft: undefined,
            cursorTop: undefined,

            widthCount: undefined,
            heightCount: undefined,
            refresh: undefined,
        }
        this.refForm = {};
    }

    componentDidUpdate(preProps) {

    }

    render() {
        const { modeOptionList, showFlag, preViewFlag, selectColumn, selectPos, widthCount, heightCount,
            cursorWidth, cursorHeight, cursorLeft, cursorTop } = this.state;
        const refForm = this.refForm;
        return (
            this.props.createNewMapModelFlag ?
                <Modal visible={this.props.createNewMapModelFlag} title="新增故事" onOk={this.clickOk} onCancel={this.clickCancel} okText="创建" cancelText="取消" closable={false}>
                    <Form ref={(val) => { this.refForm = val }} onFinish={(form) => this.onSubmit(form)}
                        initialValues={{ url: this.props.loadNewBaseMap.imgURL, lxMap:this.props.lxMap,lxMapURL:this.props.lxMapURL}}>
                        <Item name="lxMap" label="导入地图块类型" rules={[{ required: true, message: "请确认导入地图块类型！" }]}>
                            <Input disabled/>
                        </Item>
                        <Item name="lxMapURL" label="导入地图块类型文件" rules={[{ required: true, message: "请确认地图块类型文件！" }]}>
                            <Input disabled/>
                        </Item>
                        <Item name="name" label="地图块名" rules={[{ required: true, message: "请输入地图块名！" }]}>
                            <Input />
                        </Item>
                        <Item name="lx" label="地图块类型名" rules={[{ required: true, message: "请定义地图块类型名！" }]}>
                            <Input />
                        </Item>
                        <Item name="url" label="地图块源" rules={[{ required: true, message: "请选择地图块源！" }]}>
                            <Input disabled />
                        </Item>
                        <Item name="column" label="选择行" rules={[{ required: true, message: "请选择地图块！" }]}>
                            <InputNumber disabled />
                        </Item>
                        <Item name="pos" label="选择列" rules={[{ required: true, message: "请选择地图块！" }]}>
                            <InputNumber disabled />
                        </Item>
                        <Item name="width" label="图片内块行数" rules={[{ required: true, message: "请输入图片内块行数！" }]}>
                            <InputNumber onChange={(e) => this.setState({ widthCount: e })} />
                        </Item>
                        <Item name="height" label="图片内块列数" rules={[{ required: true, message: "请输入图片内块列数！" }]}>
                            <InputNumber onChange={(e) => this.setState({ heightCount: e })} />
                        </Item>
                        <Button onClick={() => this.openSelectNewMap()} disabled={!(widthCount !== undefined && heightCount !== undefined)}>选择地图块</Button>
                        {refForm.getFieldValue ? !(refForm.getFieldValue("width") && refForm.getFieldValue("height") ?
                            <div>请输入导入地图图片的方块数行数和列数</div> : null)
                            : null}
                        {preViewFlag && refForm.getFieldValue ?
                            <div className="CreateMap_LeftMenu_PreView">
                                <div className="CreateMap_LeftMenu_PreViewText">预览</div>
                                <div className="CreateMap_LeftMenu_BaseMap_PreView"
                                    style={{
                                        backgroundImage: "URL(" + this.renturnImgUrl() + ")",
                                        backgroundSize: refForm.getFieldValue("width") * 100 + "% " + refForm.getFieldValue("height") * 100 + "%",
                                        backgroundPosition: refForm.getFieldValue("pos") * -100 + "% " + refForm.getFieldValue("column") * -100 + "%",
                                        zIndex: refForm.getFieldValue("width") * (refForm.getFieldValue("column") + 1) + refForm.getFieldValue("pos") + 1
                                    }} lx={refForm.getFieldValue("lx")} title={refForm.getFieldValue("name")} />
                            </div> : null}
                        {refForm.getFieldValue ?
                            <Modal id="CreateMap_NowLoadNewMap_Modal" visible={showFlag} onOk={this.selectMap} onCancel={this.closeSelectMap} title={this.props.loadNewBaseMap.fileName} okText="确定" cancelText="取消">
                                {/* <div className="CreateMap_LeftMenu_BaseMap" id="CreateMap_NowLoadNewMap"
                                style={{
                                    backgroundImage: "URL(" + renturnImgUrl() + ")",
                                    // backgroundSize: refForm.getFieldValue("width") * 100 + "% " + refForm.getFieldValue("height") * 100 + "%",
                                    backgroundSize:"100% 100%"
                                }} onClick={(e) => clickMap(e)} onMouseMove={(e) => moveOnMap(e)}>
                                <div className="CreateMap_LeftMenu_BaseMap_Cursor" />
                            </div> */}
                                <div className="CreateMap_LeftMenu_BaseMapDiv" onClick={(e) => this.clickMap(e)}>
                                    <img className="CreateMap_LeftMenu_BaseMap_Img" id="CreateMap_NowLoadNewMap" src={this.renturnImgUrl()}
                                        onMouseMove={(e) => this.moveOnMap(e)} />
                                    <div className="CreateMap_LeftMenu_BaseMap_Cursor"
                                        style={{
                                            width: cursorWidth, height: cursorHeight,
                                            left: cursorLeft, top: cursorTop
                                        }} />
                                    {selectColumn !== undefined && selectPos !== undefined ?
                                        <div className="CreateMap_LeftMenu_BaseMap_CursorClick"
                                            style={{
                                                width: cursorWidth, height: cursorHeight,
                                                left: selectPos * cursorWidth, top: selectColumn * cursorHeight
                                            }} /> : null}
                                </div>
                            </Modal> : null}
                    </Form>
                </Modal > : null
        )
    }

    clickOk = () => {
        const refForm = this.refForm;
        refForm.submit();
    }
    clickCancel = () => {
        this.props.setCreateNewMapModelFlag(false);
    }
    onSubmit = (form) => {
        this.props.addNewMap(form);
        this.props.setCreateNewMapModelFlag(false);
        this.setState({
            preViewFlag: false,
            selectColumn: undefined,
            selectPos: undefined,
            widthCount: undefined,
            heightCount: undefined,
        })
    }
    selectMap = () => {
        const { selectColumn, selectPos } = this.state;
        const refForm = this.refForm;
        refForm.setFieldsValue({
            column: selectColumn,
            pos: selectPos,
        })
        this.setState({ showFlag: false, preViewFlag: true })
    }
    closeSelectMap = () => {
        this.setState({ showFlag: false })
    }
    renturnImgUrl = () => {       //目前仅适用于public路径下的图片文件
        const refForm = this.refForm;
        let path = refForm.getFieldValue("url");
        let paths = path.split("\\");
        let url = "";
        let flag = false;
        paths.map((p, index) => {
            if (p === "public")
                flag = true;
            if (flag && index !== paths.length - 1) {
                url += p + "/";
            }
            else if (flag) {
                url += p;
            }

        })
        return url;
    }
    openSelectNewMap = () => {
        this.setState({ showFlag: true }, () => {
            let plugin = document.getElementById("CreateMap_NowLoadNewMap");
            let data = {
                x: plugin.x,
                y: plugin.y,
                width: plugin.width,
                height: plugin.height,
            }
            this.setState({ nowImgPlugin: data });
        })
    }
    clickMap = (e) => {
        const { tempColumn, tempRow } = this.state;
        console.log("clickMap", e, tempColumn, tempRow);
        this.setState({
            selectColumn: tempColumn,
            selectPos: tempRow,
        })
    }

    //设置鼠标移动时，在固定行列数的图片上计算预选择图块位置并为此高亮边框（已完成）
    moveOnMap = (e) => {
        const refForm = this.refForm;
        let plugin = document.getElementById("CreateMap_NowLoadNewMap");
        let width = plugin.width;
        let height = plugin.height;
        let columnCount = refForm.getFieldValue("width");
        let rowCount = refForm.getFieldValue("height");
        let ceilWidth = width / columnCount;
        let ceilHeight = height / rowCount;
        // let offLeft = e.clientX - plugin.x;      //偏移的缘由————不知道dom节点属性的x和y究竟是根据什么来进行判定的，其下那个是真实距离浏览器视口左侧和右侧的距离
        // let offTop = e.clientY - plugin.y;
        let offLeft = e.clientX - plugin.getBoundingClientRect().left;
        let offTop = e.clientY - plugin.getBoundingClientRect().top;
        offLeft < 0 ? offLeft = 0 : null;
        offTop < 0 ? offTop = 0 : null;
        let column = Math.floor(offTop / ceilHeight);
        let row = Math.floor(offLeft / ceilWidth);
        column < 0 ? column = 0 : null;
        row < 0 ? row = 0 : null;
        column >= columnCount ? column = columnCount - 1 : null;
        row >= rowCount ? row = rowCount - 1 : null;
        let borderTop = column * ceilHeight;
        let borderLeft = row * ceilWidth;
        this.setState({
            cursorWidth: ceilWidth,
            cursorHeight: ceilHeight,
            cursorLeft: borderLeft,
            cursorTop: borderTop,
            // cursorLeft: offLeft,
            // cursorTop: offTop,
            tempColumn: column,
            tempRow: row,
        })
    }
}
const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(AddNewMap);