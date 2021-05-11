import * as keyNames from './keynames';

export default {
    [keyNames.MUTATE_USER_LOGGED_IN]: (state, value) => {
        state.loggedIn = value;
    },
    [keyNames.MUTATE_USER_ACCESS_TOKEN]: (state, value) => {
        state.accessToken = value;
    },
    [keyNames.MUTATE_USER_ID]: (state, value) => {
        state.userId = value;
    },
    [keyNames.MUTATE_LOADING]: (state, value) => {
        state.loading = value;
    }
}