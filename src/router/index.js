import { createRouter, createWebHistory } from 'vue-router'
import ChatContainer from '../components/ChatContainer.vue'

const routes = [
    {
        path: '/',
        redirect: '/chat'
    },
    {
        path: '/chat',
        name: 'Chat',
        component: ChatContainer
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
