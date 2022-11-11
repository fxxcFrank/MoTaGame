// eslint-disable-next-line import/no-anonymous-default-export
import * as constants from './constants';
import { fromJS } from 'immutable';
const defaultState = fromJS({
    allState: {},
});

export default (state = defaultState, action) => {
    switch (action.type) {
        case constants.SET_ALL_STATE:
            return state.merge({
                allState: action.data,
            });
        default:
            return state;
    }
}