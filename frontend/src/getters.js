import * as keyNames from './keynames';

export default {
    [keyNames.GET_USER_LOGGED_IN]: (state) => {
        return state.loggedIn;
    }
}