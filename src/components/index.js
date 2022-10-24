// 负责所有全局自定义组件的注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
export default {
  /* 
    Vue.use({
      install(v){
        console.log(v)
        // v是vue的全局对象， vue对象是通过install方法传递过来的，因此封装install方法
      }
    }
    )
   */
  install(Vue){
    // 组件的注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
    Vue.use(Print)
  }
}