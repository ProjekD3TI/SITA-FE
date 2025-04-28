import { createApp } from "vue";
import App from "./App.vue";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import axios from "axios";
import "./style.css";
import VueCookies from "vue-cookies";
import router from "./router";

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faBars, faTachometerAlt, faTools, faShoppingCart, 
  faExclamationTriangle, faBuilding, faGraduationCap, 
  faClipboardList, faChevronRight, faChevronLeft, 
  faChevronUp, faChevronDown, faIdBadge 
} from '@fortawesome/free-solid-svg-icons';

// Add all icons you need
library.add(
  faBars, faTachometerAlt, faTools, faShoppingCart, 
  faExclamationTriangle, faBuilding, faGraduationCap, 
  faClipboardList, faChevronRight, faChevronLeft, 
  faChevronUp, faChevronDown, faIdBadge
);

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // Register globally
app.use(Toast);
app.use(router);
app.use(VueCookies);

app.mount("#app");