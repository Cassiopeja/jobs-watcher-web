import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Axios from 'axios'
import Notification from "vue-notification";
import {mapGetters} from "vuex";
import i18n from './i18n'

Vue.prototype.$http = Axios;
Vue.config.productionTip = false;
Vue.use(Notification);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
    computed: {
        ...mapGetters(['lang'])
    },
    i18n,

    created() {
        this.$http.interceptors.request.use(config => {
            config.baseURL = `${process.env.VUE_APP_BACKEND_API}/api`;
            return config;
        });
        // set lang from store
        this.$i18n.locale = this.lang;
    }
}).$mount('#app')


