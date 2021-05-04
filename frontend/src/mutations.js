import * as keyNames from './keynames';

export default {
    [keyNames.MUTATE_USER_LOGGED_IN]: (state, value) => {
        state.loggedIn = value;
    },
    [keyNames.MUTATE_USER_ACCESS_TOKEN]: (state, value) => {
        state.accessToken = value;
    }
}