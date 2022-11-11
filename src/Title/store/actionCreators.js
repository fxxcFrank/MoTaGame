// import axios from 'axios';
import * as constants from './constants';
// import { message } from 'antd'

// export const login = () => {
//     return (dispatch) => {
//         // axios.get(
//         // ).then((res) => {
//         //     console.log("res", res);
//         // }).catch((e) => {
//         //     console.log(e);
//         // })
//         // console.log("login");
//         // dispatch(setUserID());
//     }
// };

//设置MainWindow所有State
export const setAllState = (data) => ({
    type: constants.SET_ALL_STATE,
    data: data,
});
//设置用户所有信息
// export const setUserInfo = (data) => ({
//     type: constants.SET_USERINFO,
//     data: data,
// });
// //设置用户ID
// export const setUserID = (data) => ({
//     type: constants.SET_USERID,
//     data: data,
// });

