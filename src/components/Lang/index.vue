<template>
  <!-- 点击菜单项事件 -->
  <el-dropdown @command="changeLanguage" trigger="click">
    <!-- 显示一个图标 -->
    <div>
      <svg-icon icon-class="language" style="color:#fff; font-size:20px;"></svg-icon>
    </div>
    <!-- 下拉图标 -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="this.$i18n.locale === 'zh'" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="this.$i18n.locale === 'en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import Cookie from 'js-cookie'
  export default {
    data() {
      return {
      }
    },
    methods: {
      changeLanguage(type) {
        // 设置语言类型， 先写入cookie
        Cookie.set('language', type) //写入cookie缓存
        // 改变当前的多语言
        this.$i18n.locale = type
        this.$message.success('切换多语言成功')
      }
    }
  };
</script>
<style scoped>
</style>