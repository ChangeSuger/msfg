import MSFG from './MSFG.vue';

MSFG.install = function (Vue) {
  Vue.component(MSFG.name, MSFG);
}

export default MSFG;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(MSFG.name, MSFG);
}