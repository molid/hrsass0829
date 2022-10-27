// 多语言实例化文件
 import Vue from 'vue'
//  导入
 import VueI18n from 'vue-i18n'
//  引入cookie工具
 import Cookie from 'js-cookie'
// 导入elementui的语言包
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import elementEN from 'element-ui/lib/locale/lang/en'
import customZH from './zh'
import customEN from './en'
// 引入自定义的语言包，用于切换常规部分
//  完成全局注册
 Vue.use(VueI18n) 

// 导出
 export default new VueI18n({
    // i18n的选项
    // 从cookie中查找有没有存储语言类型，没有就是中文
    locale: Cookie.get('language') || 'en',   //指的是当前的多语言的类型，随意定义的字符串
    // 指的是当前的语言包
    messages:  {
      zh: {
        // 语言包 elementUI的语言包， 一种是自定义的语言包
        ...elementZH,
        ...customZH
      },
      en: {
        ...elementEN,
        ...customEN
      }
    }
 })
