import { combineReducers } from "redux-immutable";
import { reducer as MainWindow } from "../Title/store"

const reducer = combineReducers({
    MainWindow: MainWindow,
})

export default reducer