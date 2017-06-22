/**
 * Created by dell on 2017/6/13.
 */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        logined:false,
        nickName: 'XXX'
    },
    mutations: {
        login (state) {
            state.logined = true;
        },
        logout (state) {
            state.logined = false;
        },
        getNickName (state , nickName) {
            state.nickName = nickName
        }
    }
})
export default store;
