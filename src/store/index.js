import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VuexORM from '@vuex-orm/core'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import SourceType from "@/models/SourceType";
import Subscription from "@/models/Subscription";
import Reference from "@/models/Reference";
import SubscriptionVacancy from "@/models/SubscriptionVacancy";
import Employment from "@/models/Employment";
import Employer from "@/models/Employer";
import Schedule from "@/models/Schedule";
import Vacancy from "@/models/Vacancy";
import Area from "@/models/Area";
import SubscriptionVacanciesFilter from "@/models/SubscriptionVacanciesFilter";
import createPersistedState from 'vuex-persistedstate';
import settings from "@/store/settings";
import Skill from "@/models/Skill";

VuexORM.use(VuexORMAxios, {axios})
const database = new VuexORM.Database();

database.register(SourceType);
database.register(Subscription);
database.register(Reference);
database.register(SubscriptionVacancy);
database.register(Area);
database.register(Employment);
database.register(Employer);
database.register(Schedule);
database.register(Vacancy);
database.register(SubscriptionVacanciesFilter);
database.register(Skill);

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        settings
    },
    plugins: [
        createPersistedState({
            paths: ['settings']
        }),
        VuexORM.install(database),
    ],
})
