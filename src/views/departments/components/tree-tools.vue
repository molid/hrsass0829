<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%;">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{treeNode.name}}</span>
    </el-col>
    <el-col :span="4">
      <!-- 右侧内容 -->
      <el-row type="flex" justify="end">
        <el-col>{{treeNode.manager}}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span>
              操作<i class="el-icon-arrow-down"></i>
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import { delDepartments, addDepartments } from '@/api/departments'
  // 组件需要对外开放属性，外部需要提供一个对象，对象中有name, manager
  export default {
    props: {
      treeNode: {
        type: Object,
        required: true
      },
      isRoot: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      operateDepts(type) {
        if (type === 'add') {
          // 添加子部门
          // 触发自定义事件，在当前点击的部门下添加子部门
          this.$emit('addDepts', this.treeNode)
        } else if (type === 'edit') {
          // 编辑部门信息
          this.$emit('editDepts', this.treeNode)
        } else {
          // 删除部门
          this.$confirm('您确定要删除该组织部门吗？').then(() => {
            return delDepartments(this.treeNode.id)
            // 删除成功之后，后台数据已处理，需要重新加载前端页面
          }).then(() => {
            this.$emit('delDepts')
            this.$message.success('删除部门成功')
          })
        }
      }
    }
  }
</script>

<style>
</style>