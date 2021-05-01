import * as keyNames from './keynames';

export default {
    [keyNames.MUTATE_USER_LOGGED_IN]: (state, value) => {
        state.loggedIn = value;
    }
}