import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Explore from '@/views/Explore.vue';
import MyCodes from '@/views/MyCodes.vue';
import { authGuard } from '@/auth/authGuard';
import CreateCode from '@/views/CreateCode.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        name: 'explore',
        component: Explore,
    },
    {
        path: '/my-codes',
        name: 'my-codes',
        component: MyCodes,
        beforeEnter: authGuard,
    },
    {
        path: '/create-code',
        name: 'create-code',
        component: CreateCode,
        beforeEnter: authGuard
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;
