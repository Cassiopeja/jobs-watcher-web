import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import VacancySingle from "@/views/VacancySingle";
import SubscriptionList from "@/views/SubscriptionList";
import SubscriptionVacancyList from "@/views/SubscriptionVacancyList";
import EmployerVacancyList from "@/views/EmployerVacancyList";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/vacancies/:id',
        name: 'Vacancy',
        component: VacancySingle,
        props: true
    },
    {
        path: '/subscriptions',
        name: 'Subscriptions',
        component: SubscriptionList
    },
    {
        path: '/subscription/:id/vacancies',
        name: 'SubscriptionVacancyList',
        component: SubscriptionVacancyList,
        props: true
    },
    {
        path: '/subscription/:id/employervacancies',
        name: 'EmployerVacancyList',
        component: EmployerVacancyList,
        props: true
    },
]

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => {
        if (err.name !== 'NavigationDuplicated') throw err
    });
}

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
export default router
