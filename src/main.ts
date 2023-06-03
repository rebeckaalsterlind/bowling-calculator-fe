// import { createApp } from "vue";
// import { createPinia } from 'pinia';

// import App from "./App.vue";
// const pinia = createPinia();

// import router from "./router";

// createApp(App).use(router).mount("#app");

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

app.mount("#app");
