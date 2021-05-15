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
    },
    [keyNames.MUTATE_NOTIFICATIONS]: (state, value) => {
        state.notifications.push(value);
    },
    clearNotification: (state, value) => {
        state.notifications = value;
    },
    removeNotification: (state, userId) => {
        const index = state.notifications.findIndex(notification => {
            return notification.userThatSentFriendship.id.toString() === userId.toString();
        })
        state.notifications.splice(index, 1);
    },
    reset: (state) => {
        state.loggedIn = false;
        state.accessToken = null
        state.userId = null;
        state.notifications = [];
      /*  loggedIn: false,
            accessToken: null,
            userId: null,
            loading: false,
            notifications: []*/
    }
}