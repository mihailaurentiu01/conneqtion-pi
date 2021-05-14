import * as keyNames from './keynames';

export default {
    [keyNames.GET_USER_LOGGED_IN]: (state) => {
        return state.loggedIn;
    },
    [keyNames.GET_USER_ID]: state => {
        return state.userId;
    },
    [keyNames.GET_LOADING]: state => {
        return state.loading;
    },
    [keyNames.GET_NOTIFICATIONS]: state => {
        return state.notifications;
    }
}