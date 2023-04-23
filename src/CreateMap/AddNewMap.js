/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, Component } from "react"
import { connect } from "react-redux"
import { Modal, message, Button, Input, Form, InputNumber, Select, Radio } from 'antd';
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

            complexNumValue: 2,
            complexMapModalFlag: false,

            widthCount: undefined,
            heightCount: undefined,
            refresh: undefined,
            refreshFlag: false,

            currentMainForm: {},
            lxValidateStatus: "success",
        }
        this.refForm = {};
    }

    componentDidUpdate(preProps, preState) {
        if (preProps.nowClickAddMap !== this.props.nowClickAddMap || preProps.loadNewBaseMap !== this.props.loadNewBaseMap) {
            // console.log("refForm",this.refForm,this.refForm!=={});
            // for(let i in this.refForm){
            //     console.log("refForm",i,this.refForm[i]);
            // }
            this.refForm && this.refForm.setFieldsValue && this.refForm.setFieldsValue({ url: this.props.loadNewBaseMap.imgURL, lxMap: this.props.lxMap, lxMapURL: this.props.lxMapURL });
        }
        if (!preProps.createNewMapModelFlag && this.props.createNewMapModelFlag) {
            this.addNewLXName();
        }
    }

    render() {
        const { modeOptionList, showFlag, preViewFlag, selectColumn, selectPos, widthCount, heightCount,
            cursorWidth, cursorHeight, cursorLeft, cursorTop, complexNumValue, complexMapModalFlag, refreshFlag } = this.state;
        const { nowClickAddMap, loadNewBaseMap, nowAllList } = this.props;
        const refForm = this.refForm;
        return (
            // this.props.createNewMapModelFlag ?
            <Modal visible={this.props.createNewMapModelFlag} title="新增地图" onOk={this.clickOk} onCancel={this.clickCancel} okText="创建" cancelText="取消" closable={false}>
                <Form ref={(val) => { this.refForm = val }} onFinish={(form) => this.onSubmit(form)}
                    initialValues={{ url: this.props.loadNewBaseMap.imgURL, lxMap: this.props.lxMap, lxMapURL: this.props.lxMapURL }}>
                    <Item name="lxMap" label="导入地图块类型" rules={[{ required: true, message: "请确认导入地图块类型！" }]}>
                        <Input disabled />
                    </Item>
                    <Item name="lxMapURL" label="导入地图块类型文件" rules={[{ required: true, message: "请确认地图块类型文件！" }]}>
                        <Input disabled />
                    </Item>
                    <Item name="name" label="地图块名" rules={[{ required: true, message: "请输入地图块名！" }]} >
                        <Input />
                    </Item>
                    <div className="CreateMao_AddNewMap_Column">
                        <Item name="lx" label="地图块类型名" rules={[{ required: true, message: "请定义地图块类型名！" }]}
                            help={this.returnLXValidateStatus() === "error" ? "地图块类型名重复！" : ""} validateStatus={this.returnLXValidateStatus()}>
                            <Input onChange={() => this.refreshToRender()} />
                        </Item>
                        <Button onClick={this.addNewLXName}>默认名</Button>
                    </div>
                    <Item name="url" label="地图块源" rules={[{ required: true, message: "请选择地图块源！" }]}>
                        <Input disabled />
                    </Item>
                    <Item name="complex" label="复合图块" rules={[{ required: complexNumValue === 1 ? true : false, message: "请选择复合图块！" }]}>
                        <Radio.Group onChange={this.complexSelect} defaultValue={complexNumValue} value={complexNumValue}>
                            <Radio value={1}>是</Radio>
                            <Radio value={2}>否</Radio>
                        </Radio.Group>
                    </Item>
                    {complexNumValue === 1 ? <Fragment>
                        <Button onClick={() => this.openSelectComplexMap()}>选择复合地图块</Button>
                        {nowClickAddMap ?
                            <Fragment>
                                {/* <Item name="complexName" label="复合图块名" rules={[{ required: true, message: "请选择复合图块！" }]}> */}
                                <Item name="complexName" label="复合图块名">
                                    <Input disabled value={nowClickAddMap.name} />
                                </Item>
                                <div className="CreateMap_LeftMenu_PreView">
                                    <div className="CreateMap_LeftMenu_PreViewText">预览</div>
                                    <div className="CreateMap_LeftMenu_BaseMap_PreView"
                                        style={{
                                            backgroundImage: "URL(" + nowClickAddMap.url + ")",
                                            backgroundSize: nowClickAddMap.width * 100 + "% " + nowClickAddMap.height * 100 + "%",
                                            backgroundPosition: nowClickAddMap.pos * -100 + "% " + nowClickAddMap.column * -100 + "%",
                                            zIndex: nowClickAddMap.width * (nowClickAddMap.column + 1) + nowClickAddMap.pos + 1
                                        }} lx={nowClickAddMap.lx} title={nowClickAddMap.name} />
                                </div>
                            </Fragment>
                            : null}
                        <Modal visible={complexMapModalFlag} onOk={this.selectComplexMap} onCancel={this.closeSelectComplexMap} title={"选择复合图层"} okText="确定" cancelText="取消">
                            {this.props.returnRightContent(true)}
                            {nowClickAddMap ?
                                <div className="CreateMap_LeftMenu_PreView">
                                    <div className="CreateMap_LeftMenu_PreViewText">预览</div>
                                    <div className="CreateMap_LeftMenu_BaseMap_PreView"
                                        style={{
                                            backgroundImage: "URL(" + nowClickAddMap.url + ")",
                                            backgroundSize: nowClickAddMap.width * 100 + "% " + nowClickAddMap.height * 100 + "%",
                                            backgroundPosition: nowClickAddMap.pos * -100 + "% " + nowClickAddMap.column * -100 + "%",
                                            zIndex: nowClickAddMap.width * (nowClickAddMap.column + 1) + nowClickAddMap.pos + 1
                                        }} lx={nowClickAddMap.lx} title={nowClickAddMap.name} />
                                </div>
                                : null}
                            {/* <div className="CreateMap_LeftMenu_ComplexMap_Cursor"
                                    style={{
                                        // width: cursorWidth, height: cursorHeight,
                                        // left: cursorLeft, top: cursorTop
                                    }} />
                                {selectColumn !== undefined && selectPos !== undefined ?
                                    <div className="CreateMap_LeftMenu_ComplexMap_CursorClick"
                                        style={{
                                            // width: cursorWidth, height: cursorHeight,
                                            // left: selectPos * cursorWidth, top: selectColumn * cursorHeight
                                        }} /> : null} */}
                        </Modal>
                    </Fragment> : null}

                    <Item name="column" label="选择行" rules={[{ required: true, message: "请选择地图块！" }]}>
                        <InputNumber disabled />
                    </Item>
                    <Item name="pos" label="选择列" rules={[{ required: true, message: "请选择地图块！" }]}>
                        <InputNumber disabled />
                    </Item>
                    <Item name="width" label="图片内块列数" rules={[{ required: true, message: "请输入图片内块行数！" }]}>
                        <InputNumber onChange={(e) => this.setState({ widthCount: e })} />
                    </Item>
                    <Item name="height" label="图片内块行数" rules={[{ required: true, message: "请输入图片内块列数！" }]}>
                        <InputNumber onChange={(e) => this.setState({ heightCount: e })} />
                    </Item>
                    <Button onClick={() => this.openSelectNewMap()} disabled={!(widthCount !== undefined && heightCount !== undefined)}>选择地图块</Button>
                    {refForm ?
                        <Fragment>
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
                        </Fragment>
                        : null}
                </Form>
            </Modal >
            // : null
        )
    }

    clickOk = () => {
        const refForm = this.refForm;
        refForm.submit();
    }
    clickCancel = () => {
        this.props.setCreateNewMapModelFlag(false);
        // this.refForm = {};
    }
    onSubmit = (form) => {
        let dataForm = { ...form };
        if (this.state.complexNumValue === 1) {
            let baseMap = [];
            baseMap.push(this.props.nowClickAddMap.lx)
            dataForm.baseMap = baseMap;
        }
        this.setState({ currentMainForm: dataForm });
        this.props.addNewMap(dataForm);
        this.props.setCreateNewMapModelFlag(false);
        // this.refForm = {};
        // this.setState({
        //     preViewFlag: false,
        //     selectColumn: undefined,
        //     selectPos: undefined,
        //     widthCount: undefined,
        //     heightCount: undefined,
        // })
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
                x: plugin.getBoundingClientRect().left,
                y: plugin.getBoundingClientRect().top,
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
        let rowCount = refForm.getFieldValue("width");
        let columnCount = refForm.getFieldValue("height");
        let ceilHeight = height / columnCount;
        let ceilWidth = width / rowCount;
        // let offLeft = e.clientX - plugin.x;      //偏移的缘由————不知道dom节点属性的x和y究竟是根据什么来进行判定的，其下那个是真实距离浏览器视口左侧和右侧的距离
        // let offTop = e.clientY - plugin.y;
        let offLeft = e.clientX - plugin.getBoundingClientRect().left;
        let offTop = e.clientY - plugin.getBoundingClientRect().top;
        console.log("e.clientX,e.clientY", e.clientX, e.clientY);
        console.log("plugin.getBoundingClientRect().left", plugin.getBoundingClientRect().left, plugin.getBoundingClientRect().top);
        console.log("offLeft,offTop", offLeft, offTop);
        offLeft < 0 ? offLeft = 0 : null;
        offTop < 0 ? offTop = 0 : null;
        let column = Math.floor(offTop / ceilHeight);
        let row = Math.floor(offLeft / ceilWidth);
        column < 0 ? column = 0 : null;
        row < 0 ? row = 0 : null;
        column >= columnCount ? column = columnCount - 1 : null;
        row >= rowCount ? row = rowCount - 1 : null;
        console.log("column,row", column, row, columnCount, rowCount);
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

    /*---- lx校验和默认生成 ----*/
    //返回lx校验结果
    returnLXValidateStatus = () => {
        if (this.refForm && this.refForm.getFieldValue) {
            // console.log("returnLXValidateStatus",this.refForm);
            let lxName = this.refForm.getFieldValue("lx");
            if (this.isSameLxName(lxName) || lxName === "") return "error";
            else return "success";
        };
        return "success"
    }
    //判断lx是否存在重复
    isSameLxName = (value) => {
        const { nowAllList, } = this.props;
        let flag = false;
        nowAllList.map((data) => {
            // console.log("isSameLxName",data,value,data === value);
            if (data.lx === value) flag = true;
        })
        return flag;
    }
    //设置lx的默认名（和lx保证不重复的函数记得联动-------后补，其实比判断重复与否要复杂不少，写了个新的函数）
    addNewLXName = () => {
        const { nowAllList, lxMap } = this.props;
        let nowLX = this.returnLXName(lxMap);
        let num = this.returnLXNoRepeatNum(1, nowAllList);
        // console.log("addNewLXName", nowAllList,nowLX, num);
        // if()
        // console.log("this.refForm",this.refForm);
        this.refForm && this.refForm.setFieldsValue && this.refForm.setFieldsValue({ lx: nowLX + "_" + num });
        this.refreshToRender();
    }
    returnLXNoRepeatNum = (num1, nowAllList) => {
        // let flag = true;
        let num = JSON.parse(JSON.stringify(num1));
        nowAllList.map((data) => {
            let lxList = data.lx.split("_");
            let dataNum = parseInt(lxList[lxList.length - 1]);
            // console.log("dataNum---num",dataNum,num);
            if (dataNum === num) {
                num = this.returnLXNoRepeatNum(num + 1, nowAllList);
            };
        })
        return num;
    }
    returnLXName = (lx) => {
        switch (lx) {
            case "常用": return "base";
            case "基础": return "base";
            case "怪物": return "Monster";
            case "商店": return "Shop";
            case "事件": return "Story";
            default: return lx;
        }
    }
    /* ---------------- */

    //是否为复合图层
    complexSelect = (e) => {
        this.setState({ complexNumValue: e.target.value })
    }
    openSelectComplexMap = () => {
        this.setState({ complexMapModalFlag: true });
    }
    selectComplexMap = () => {

        this.setState({ complexMapModalFlag: false });
    }
    closeSelectComplexMap = () => {
        this.setState({ complexMapModalFlag: false });
    }

    //为了操作form后也能刷新render
    refreshToRender = () => {
        this.setState({ refreshFlag: !this.state.refreshFlag });
    }
}
const mapState = (state) => ({

});

const mapProps = (dispatch) => ({
});
export default connect(mapState, mapProps)(AddNewMap);