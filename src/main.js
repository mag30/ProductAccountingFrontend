import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import Router from "@/router"
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import './assets/main.css';
import "primeflex/primeflex.css";

//theme
import "primevue/resources/themes/lara-light-teal/theme.css";
//core
import "primevue/resources/primevue.min.css";
//icons
import "primeicons/primeicons.css";
import {store} from "@/store";


const app = createApp(App);
app.use(PrimeVue);
app.use(store)
app.use(Router);
app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app');
