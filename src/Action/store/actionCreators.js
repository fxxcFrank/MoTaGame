import * as constants from './constants';

export const changeStatusPanel= (data) => ({
    type:constants.CHANGE_STATUS_PANEL,
    data:data,
});

export const changeCurrentMap= (data) => ({
    type:constants.CHANGE_CURRENT_MAP,
    data:data,
});

export const changeLoction= (data) => ({
    type:constants.CHANGE_LOCTION,
    data:data,
});

export const changeHP = (data) => ({
    type:constants.CHANGE_HP,
    data:data,
});

export const changeAttack = (data) => ({
    type:constants.CHANGE_ATTACK,
    data:data,
});

export const changeDefense = (data) => ({
    type:constants.CHANGE_DEFENSE,
    data:data,
});