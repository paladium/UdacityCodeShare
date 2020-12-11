import Axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import join from 'url-join';
import { CreateCodeItem } from '@/models/CreateCodeItem';

Vue.use(Vuex);

const API_URL = process.env.VUE_APP_API;


export default new Vuex.Store({
    state: {
        accessToken: "",
        allCodes: [],
        userCodes: [],
        createCode: null,
    },
    mutations: {
        setAccessToken(state, value){
            state.accessToken = value;
        },
        setAllCodes(state, value){
            state.allCodes = value;
        },
        setUserCodes(state, value){
            state.userCodes = value;
        },
        setCreateCode(state, value){
            state.createCode = value;
        }
    },
    actions: {
        getAllCodes({commit, state}){
            return Axios.get(join(API_URL, "codes")).then((response) => {
                commit("setAllCodes", response.data);
            });
        },
        getUserCodes({commit, state}){
            return Axios.get(join(API_URL, "my-codes")).then((response) => {
                commit("setUserCodes", response.data);
            });
        },
        deleteCode({commit, state}, id: string){
            return Axios.delete(join(API_URL, "codes", id));
        },
        likeUnlikeCode({commit, state}, id: string){
            return Axios.put(join(API_URL, "codes", id)).then((response) => response.data);
        },
        createCode({commit, state}, create: CreateCodeItem){
            return Axios.post(join(API_URL, "codes"), create);
        }
    },
    modules: {
    },
});
