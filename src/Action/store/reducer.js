import * as constants from './constants';
import { fromJS } from 'immutable';
const defaultState = fromJS({
    statusPanel:false,
    location:0,
    currentMap:[],
    hp:1000,
    attack:10,
    defense:10,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
    switch (action.type) {
        case constants.CHANGE_LOCTION:
            return state.merge({
                location:action.data,
            });
        case constants.CHANGE_HP:
            return state.merge({
                hp:action.data,
            });
        case constants.CHANGE_ATTACK:
            return state.merge({
                attack:action.data,
            });
        case constants.CHANGE_DEFENSE:
            return state.merge({
                defense:action.data,
            });
        case constants.CHANGE_CURRENT_MAP:
            return state.merge({
                currentMap:action.data,
            });
        case constants.CHANGE_STATUS_PANEL:
            return state.merge({
                statusPanel:action.data,
            })
        default:
            return state;
    }
}