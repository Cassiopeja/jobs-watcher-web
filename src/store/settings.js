export default {
    state: {
        lang: 'en',
        template: ''
    },
    getters: {
        lang(state) {
            return state.lang;
        },
        template(state){
            return state.template;
        }
    },
    mutations: {
        setLang(state, lang) {
            state.lang = lang;
        },
        setTemplate(state, template) {
            state.template = template;
        }
    },
    actions: {
        setLang(context, lang) {
            context.commit('setLang', lang)
        },
        setTemplate(context, template) {
            context.commit('setTemplate', template)
        }
    }
}
