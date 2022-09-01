<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容-头部 -->
      <el-card class="tree-card">
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 组织架构内容-树形列表 -->
        <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
          <!-- 作用域插槽 -->
          <tree-tools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增的弹出层组件 -->
    <add-dept ref="addDept" :show-dialog.sync="showDialog" :tree-node="node" @addDepts="getDepartments" />
  </div>
</template>

<script>
  import TreeTools from './components/tree-tools'
  import { getDepartments } from '@/api/departments'
  import { tranListToTreeData } from '@/utils'
  import AddDept from './components/add-dept'
  export default {
    data() {
      return {
        departs: [],
        defaultProps: {
          label: 'name'
        },
        company: {},
        showDialog: false, // 默认不显示弹出层
        node: null, // 记录当前点击的node
        loading: false //用于控制进度条弹层的显示与隐藏
      }
    },
    components: {
      TreeTools,
      AddDept
    },
    created() {
      this.getDepartments()
    },
    methods: {
      async getDepartments() {
        this.loading = true
        const result = await getDepartments()
        this.company = { name: result.companyName, manager: '负责人', id: '' }
        // 注意： 获取到的result.depts是一个数组，而departs需要的是一个树形结构数据，故需要将数组转化为树形结构数据。
        this.departs = tranListToTreeData(result.depts, '')
        this.loading = false
      },
      // 监听tree-tools中触发的点击添加子部门的事件
      addDepts(node) {
        this.showDialog = true
        this.node = node
      },
      editDepts(node) {
        this.showDialog = true
        this.node = node
        // 父组件调用子组件的方法
        this.$refs.addDept.getDepartDetail(node.id)

      }
    }

  }
</script>

<style scoped>
  .tree-card {
    padding: 30px 140px;
    font-size: 14px;
  }
</style>