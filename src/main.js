import { createApp } from "vue";
import App from "./App.vue";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";

import "./style.css";

import VueCookies from "vue-cookies";
import router from "./router";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(Toast);
app.use(router);
app.use(VueCookies);

app.mount("#app");
