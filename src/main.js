import { createApp } from "vue";
import App from "./App.vue";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import "./style.css";

import VueCookies from "vue-cookies";
import router from "./router";
import { getEnv } from "./utils/env";

axios.defaults.baseURL = getEnv("VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL);
axios.defaults.withCredentials = true;

const app = createApp(App);

app.use(Toast);
app.use(router);
app.use(VueCookies);

app.mount("#app");
