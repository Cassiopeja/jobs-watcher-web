export default {
    state: {
        lang: 'en'
    },
    getters: {
        lang(state) {
            return state.lang;
        }
    },
    mutations: {
        setLang(state, lang) {
            state.lang = lang;
        }
    },
    actions: {
        setLang(context, lang) {
            context.commit('setLang', lang)
        }
    }
}
