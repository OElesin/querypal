import Vuex from 'vuex'
import Vue from 'vue';
import QueryDao from '@/data/queryDAO';

Vue.use(Vuex)

// A list of states in the store
const userState = {
    profile: null,
    isLoggedIn: false,
    loading: false,
    userQueriesList: [],
}

const userMutations = {
    /**
     * @param {*} state
     * @param {*} profile
     */
    setProfile (state, profile) {
        state.profile = profile
    },
    setLoginStatus (state, status) {
        state.isLoggedIn = status
    },
    setQueriesList(state, userQueriesList) {
        if (state.userQueriesList.length === 0) {
            state.userQueriesList = userQueriesList;
        } else {
            for (let i in userQueriesList)
                state.userQueriesList.push(userQueriesList[i]);
        }
        // may be do some insertion to dynamodb
    },
    /**
     * @param state
     * @param status
     */
    setLoading(state, status) {
        state.loading = status;
    },
}

/**
 * Actions can achieve async operations, hence the process of fetching
 * will be done in action asynchronously
 */
const userActions = {
    logout (context) {
        context.commit('setLoginStatus', false)
        context.commit('setProfile', null)
    },
    login (context, profile) {
        context.commit('setLoginStatus', true)
        context.commit('setProfile', profile)
    },
    addQueryToList(context, userQueriesList) {
        context.commit('setQueriesList', userQueriesList)
    }
}

const userGetters = {
    profile: userState => userState.profile,
    isLoggedIn: userState => userState.isLoggedIn,
    userQueriesList: userState => userState.userQueriesList
}

const userModule = {
    state: userState,
    mutations: userMutations,
    actions: userActions,
    getters: userGetters
}

const store = new Vuex.Store({
    modules: {
        user: userModule
    }
})

export default store
