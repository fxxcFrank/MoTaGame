/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState } from "react"
import { Modal, message, Button, Input, Form, InputNumber, Select } from 'antd';
const { Item } = Form;
const { Option } = Select;
const createNewStory = (props) => {
    const [modeOptionList, setModeOptionList] = useState([
        { mode: 0, text: "黑幕旁白模式" },
        { mode: 2, text: "普通对话模式" },
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
        props.setChangeFileModelFlag(false);
    }
    const onSubmit = (form) => {
        props.changeFile(form);
        props.setChangeFileModelFlag(false);
    }
    return (
        props.changeFileModelFlag ?
            <Modal visible={props.changeFileModelFlag} title="修改故事文件" onOk={clickOk} onCancel={clickCancel} okText="修改" cancelText="取消" closable={false} destroyOnClose>
                <Form ref={(val) => { setRefForm(val) }} onFinish={(form) => onSubmit(form)} preserve={false}
                    initialValues={{ storyFileName: props.selectedInfo.node.parentFileName, storyContentChapter: props.selectedInfo.node.chapter }}>
                    <Item name="storyFileName" label="故事文件名" rules={[{ required: true, message: "请输入故事文件名！" }]}>
                        <Input defaultValue={props.selectedInfo.node.parentFileName} />
                    </Item>
                    <Item name="storyContentChapter" label="故事章节" rules={[{ required: true, message: "请选择故事章节！" }]}>
                        <InputNumber defaultValue={props.selectedInfo.node.chapter} />
                    </Item>
                </Form>
            </Modal> : null
    )
}
export default createNewStory;