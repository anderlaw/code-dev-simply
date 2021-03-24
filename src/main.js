import { createApp } from 'vue'

import ElementPlus from 'element-plus';

import 'element-plus/lib/theme-chalk/index.css';
import VueTree from "vue-tree-plugin";
import App from './App.vue';

const app = createApp(App)
app.use(ElementPlus)
app.use(VueTree)
app.mount('#app')
