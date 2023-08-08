//simport Vue from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import publicRoom from '../components/publicRoom.vue';



const routes = [
    {
        path: '/publicroom',
        name: 'publicRoom',
        component: publicRoom,
    }
];

const router = createRouter({

    history: createWebHistory(),
    routes,
})

export default router;
