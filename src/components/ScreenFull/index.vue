<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg图标 -->
    <svg-icon @click="changeScreen" icon-class="fullscreen" style="color:#fff; width:20px; height: 20px;" />
  </div>
</template>

<script>
  // import ScreenFull from 'screenfull'
  // 此处引入有报错，报错如下
  /**
   * ./node_modules/screenfull/index.js
    Module build failed: Error: ENOENT: no such file or directory, open 'D:\Data\vsCodeProjects\v7\stageFive\firstPass\projects\hrsaas\node_modules\screenfull\index.js'
    没有查找到文件
   */
  import ScreenFull from 'screenfull/dist/screenfull' 
  export default {
    methods: {
      changeScreen() {
        // 原生控制全屏
        // document.documentElement.requestFullscreen()
        if (!ScreenFull.isEnabled) {
          this.$message.warning('当前全屏功能不可用')
          return
        }
        // 直接全屏
        ScreenFull.toggle()
      }
    }
  };
</script>
<style scoped>
</style>