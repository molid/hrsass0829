<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <!-- 多选框组 -->
    <el-checkbox-group v-model="roleIds">
      <!-- 要循环的选项 -->
      <!-- 要显示 角色的名称 存储 角色id label表示要存储的值 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{item.name}}
      </el-checkbox>
    </el-checkbox-group>
    <!-- 定义footer的插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import { getRoleList } from '@/api/setting'
  import { getUserDetailById } from '@/api/user'
  import { assignRoles } from '@/api/employees'

  export default {
    props: {
      showRoleDialog: {
        type: Boolean,
        default: false
      },
      userId: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        // 存储所有角色的列表
        list: [],
        // 存储当前用户拥有的角色的列表
        roleIds: []
      }
    },
    created() {
      //获取所有的角色
      this.getRoleList()
    },
    methods: {
      async getRoleList() {
        const { rows } = await getRoleList({ page: 1, pagesize: 20 })
        this.list = rows
      },
      // props赋值渲染是异步的，点击角色按钮的时候对id赋值，但此处获取不到id
      async getUserDetailById(id) {
        const { roleIds } = await getUserDetailById(id)
        this.roleIds = roleIds
        // 将用户所拥有的角色赋值给用户所拥有的对象
      },
      async btnOK() {
        await assignRoles({ id: this.userId, roleIds: this.roleIds })
        // 关闭弹层
        this.$emit("update:showRoleDialog", false)
        // 方法二
        // this.$parent.showRoleDialog = false
      },
      btnCancel() {
        // 取消
        // 重置数组，将它还原成一个空对象
        this.roleIds = []
        this.$emit('update: showRoleDialog', false)
      }
    }
  };
</script>
<style scoped>
</style>