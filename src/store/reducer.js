import { combineReducers } from "redux-immutable";
import { reducer as Action } from "../Action/store"

const reducer = combineReducers({
    Action:Action,
})

export default reducer