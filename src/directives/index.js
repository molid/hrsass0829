/**
 * 负责管理所有的自定义指令
 */
export const imageerror = {
  inserted(dom, options) {
    // 图片有地址，但加载失败的时候会触发onerror事件
    // options是变量，values是其属性值
    dom.onerror = function() {
      // 当图片出现异常的时候将指令配置的默认图片设置为头像
      dom.src = options.value
    }
  }
}