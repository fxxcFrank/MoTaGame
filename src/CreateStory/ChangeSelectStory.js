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
        props.setChangeStoryModelFlag(false);
    }
    const onSubmit = (form) => {
        props.changeStory(form);
        props.setChangeStoryModelFlag(false);
    }
    return (
        props.changeStoryModelFlag ?
            <Modal visible={props.changeStoryModelFlag} title="修改故事" onOk={clickOk} onCancel={clickCancel} okText="修改" cancelText="取消" closable={false} destroyOnClose>
                <Form ref={(val) => { setRefForm(val) }} onFinish={(form) => onSubmit(form)} preserve={false}
                    initialValues={{ storyMode: props.selectedInfo.node.storyMode,storyMap: props.selectedInfo.node.storyMap}}>
                    <Item name="storyMode" label="故事模式" rules={[{ required: true, message: "请选择故事模式！" }]}>
                        <Select defaultValue={props.selectedInfo.node.storyMode}>
                            {modeOptionList.map((data) => {
                                return <Option value={data.mode}>{data.mode + "（" + data.text + "）"}</Option>
                            })}
                        </Select>
                    </Item>
                    <Item name="storyMap" label="故事地图" rules={[{ required: true, message: "请选择故事地图！" }]}>
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
            </Modal> : null
    )
}
export default createNewStory;