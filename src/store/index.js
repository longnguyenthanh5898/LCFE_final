import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(localStorage.getItem('currentUser')),
        loginResponse: null, // New property to store login response
    },
    getters: {
        user: state => state.user,
        loginResponse: state => state.loginResponse,
    },
    mutations: {
        ['UPDATE_USER'](s, user) {
            s.user = user;
        },
        ['SAVE_LOGIN_RESPONSE'](s, response) {
            s.loginResponse = response;
        },
    },
    actions: {
        updateUser({commit}, user) {
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('currentUser');
            }
            commit('UPDATE_USER', user);
        },
        saveLoginResponse({ commit }, response) {
            if (response) {
                localStorage.setItem('response', JSON.stringify(response));
            } else {
                localStorage.removeItem('response');
            }
            commit('SAVE_LOGIN_RESPONSE', response);
        },
    },
    modules: {},
});
