/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState } from "react"
import { Modal, message, Button, Input, Form, InputNumber, Select } from 'antd';
const { Item } = Form;
const { Option } = Select;
const createNewStory = (props) => {
    const [modeOptionList, setModeOptionList] = useState([
        { mode: 0, text: "黑幕旁白模式" },
        { mode: 2, text: "普通对话模式" },
        { mode: 3, text: "普通对话模式(不移动到故事方块上)" },
    ]);
    const [showFlag, setShowFlag] = useState(false);
    const [refForm, setRefForm] = useState({});
    const clickOk = () => {
        // setShowFlag(true);
        refForm.submit();
        // props.setCreateModelFlag(false);
    }
    const clickCancel = () => {
        // setShowFlag(false);
        props.setCreateFileModelFlag(false);
    }
    const onSubmit = (form) => {
        props.createNewStoryJson(form);
        props.setCreateFileModelFlag(false);
    }
    return (
        <Modal visible={props.createFileModelFlag} title="创建故事文件" onOk={clickOk} onCancel={clickCancel} okText="创建" cancelText="取消" closable={false}>
            <Form ref={(val) => { setRefForm(val) }} onFinish={(form) => onSubmit(form)}
                initialValues={{ storyContentChapter: 0, }}>
                <Item name="storyFileName" label="故事文件名" rules={[{ required: true, message: "请输入故事文件名！" }]}>
                    <Input />
                </Item>
                <Item name="storyContentChapter" label="故事章节" rules={[{ required: true, message: "请选择故事章节！" }]}>
                    <InputNumber />
                </Item>
                <Item name="storyMode" label="默认初始节点故事模式" rules={[{ required: true, message: "请选择故事模式！" }]}>
                    <Select >
                        {modeOptionList.map((data) => {
                            return <Option value={data.mode}>{data.mode + "（" + data.text + "）"}</Option>
                        })}
                    </Select>
                </Item>
                <Item name="storyMap" label="默认初始节点故事地图" rules={[{ required: true, message: "请选择故事地图！" }]}>
                    <Select >
                        {props.baseMapList.map((data, index) => {
                            return (
                                <Option className="CreateStory_LeftMenu_Option" value={data.lx}>
                                    <div className="CreateStory_LeftMenu_OptionText">{data.name + "（" + data.lx + "）"}</div>
                                    <div className="CreateStory_LeftMenu_BaseMap"
                                        style={{
                                            backgroundImage: "URL(" + data.url + ")",
                                            backgroundSize: data.width * 100 + "% " + data.height * 100 + "%",
                                            backgroundPosition: data.pos * -100 + "% " + data.column * -100 + "%",
                                            position: "absolute", zIndex: index
                                        }} lx={data.lx} title={data.name} />
                                </Option>
                            )
                        })}
                    </Select>
                </Item>
            </Form>
        </Modal>
    )
}
export default createNewStory;