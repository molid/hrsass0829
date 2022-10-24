/**
 * 负责管理所有的自定义指令
 */
export const imageerror = {
  inserted(dom, options) {
    // 图片没地址
    dom.src = dom.src || options.value
    // 图片有地址，但加载失败的时候会触发onerror事件
    // options是变量，values是其属性值
    dom.onerror = function() {
      // 当图片出现异常的时候将指令配置的默认图片设置为头像
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    // 该钩子函数会在当前指令作用的组件 更新数据完毕之后 执行
    // inserted只会执行一次
    // 组件初始化 一旦更新就不会再进入inserted, 会进入componentUpdated
    dom.src = dom.src || options.value
  }
}