/**
 * Created by dell on 2017/6/13.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        logined:false,
        nickname: 'XXX'
    },
    mutations: {
        login (state) {
            state.logined = true;
        },
        logout (state) {
            state.logined = false;
        },
        getNickname (state , nickname) {
            state.nickname = nickname
        }
    }
})
export default store;
