import {createRouter, createWebHashHistory} from "vue-router";
import Login from "@/pages/Login.vue"
import Main from "@/pages/Main.vue";
import ChapterSetting from "@/pages/ChapterSetting.vue";

const routes = [
    {
        path:'/login',
        component: Login
    },
    {
        path: '/',
        component: Main
    },
    {
        path: "/chapterSetting",
        component: ChapterSetting
    }
]

const router = createRouter({
    routes,
    history:createWebHashHistory()
})
export default router;