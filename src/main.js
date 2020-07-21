import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import 'font-awesome/css/font-awesome.css'

import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
import api from './api' // 导入api接口
Vue.prototype.$api = api // 将api挂载到vue的原型上*/

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

Vue.use(VXETable, {
  // 对参数的内容自动进行国际化翻译
  translate: key => i18n.t(key),
  // 对组件内置的提示语进行国际化翻译
  i18n: key => i18n.t(key)
})

// 表格的全局参数
VXETable.setup({
  size: Cookies.get('size') || 'medium', // set element-ui default size
  zIndex: 999,
  table: {
    highlightHoverRow: true,
    showOverflow: true,
    headerAlign: 'center',
    align: 'center',
    resizable: true,
    showHeader: true,
    border: true
  },
  pager: {
    currentPage: 1,
    pageSize: 10,
    align: 'right',
    pageSizes: [10, 20, 50, 100, 200, 500],
    layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
    perfect: true
  }
})

VXETable.use(VXETablePluginElement)

Vue.prototype.$VXETable = VXETable

// import Treeselect component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
Vue.component('treeselect', Treeselect)
// 创建一个简单的表单-输入框渲染
VXETable.renderer.add('TreeSelect', {
  // 项显示模板
  renderItem (h, renderOpts, params) {
    const { data, property } = params
    const props = renderOpts.props || {}
    // const { events } = renderOpts.events || {}
    return [
      <treeselect v-model={ data[property] } { ...{ props } }></treeselect>
  ]
  }
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
