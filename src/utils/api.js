import axios from "axios";
import router from "@/router"

const api = axios.create()


api.interceptors.request.use(config => {
    if(localStorage.access_token) {
        config.headers.authorization = `Bearer ${localStorage.access_token}`
    }

    return config
},error => {

    return error

})


api.interceptors.response.use(config => {
    if(localStorage.access_token) {
        config.headers.authorization = `Bearer ${localStorage.access_token}`
    }

    return config
}, error => {

    if(error.response.status === 401) {
        router.push('/login')
    }
   return error
})

export default api