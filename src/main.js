import Vue from 'vue';
import App from './App.vue';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import "@aws-amplify/ui-vue";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Amplify from '@aws-amplify/core';
import { Auth } from '@aws-amplify/auth';
import { Analytics } from '@aws-amplify/analytics';
import awsconfig from "./aws-exports";
import VueLodash from 'vue-lodash';
import lodash from 'lodash';
import VueTour from 'vue-tour'
import 'vue-tour/dist/vue-tour.css'

Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(VueTour);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
Amplify.configure(awsconfig);
Auth.configure(awsconfig);
Analytics.autoTrack('pageView', {
  enabled: true,
  provider: 'AWSPinpoint',
  eventName: 'pageView',
  type: 'SPA',
  getUrl: () => {
    return window.location.origin + window.location.pathname;
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
