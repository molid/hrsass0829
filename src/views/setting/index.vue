<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button icon="el-icon-plus" type="primary" size="small" @click="showDialog = true">新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="角色名" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px;">
              <el-pagination layout="prev, pager, next" :total="page.total" :page-size="page.pagesize" :current-page="page.page" @current-change="changePage" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <!-- 右侧内容 -->
            <el-alert title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改" type="info" show-icon :closable="false"></el-alert>
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 编辑部门弹出层 -->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 防止footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限弹出层 -->
    <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
      <!-- 权限 树形数据 -->
      <!-- check-strictly 如果为true 拿表示父子勾选时 不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree ref="permTree" :data="permData" :props="defaultProps" :default-expand-all="true" :show-checkbox="true" :check-strictly="true" node-key="id" :default-checked-keys="selectCheck" />
      <!-- 确定取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole, assignPerm } from '@/api/setting'
  import { mapGetters } from 'vuex'
  import { getPermissionList } from '@/api/permission'
  import { tranListToTreeData } from '@/utils'
  export default {
    data() {
      return {
        list: [],
        page: {
          page: 1,
          pagesize: 10,
          total: 0 //记录总数据条数
        },
        formData: {},
        showDialog: false, //控制弹出层
        showPermDialog: false, //控制分配权限的弹出层
        roleForm: {
          name: '',
          description: ''
        },
        rules: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
        // 接收权限数据
        permData: [],
        // 定义显示字段的名称和子属性字段的名称
        defaultProps: {
          label: 'name'
        },
        roleId: null, //用来记录当前分配权限的角色Id
        selectCheck: [], //用来记录当前的权限点标识
      }
    },
    created() {
      this.getRoleList()
      this.getCompanyInfo()
    },
    computed: {
      ...mapGetters(['companyId'])
    },
    methods: {
      async getRoleList() {
        const { total, rows } = await getRoleList(this.page)
        this.page.total = total
        this.list = rows
      },
      changePage(newPage) {
        this.page.page = newPage
        this.getRoleList()
      },
      async getCompanyInfo() {
        this.formData = await getCompanyInfo(this.companyId)
      },
      async deleteRole(id) {
        try {
          await this.$confirm('确认删除该角色？')
          // 只有点击了确定，才能进入下方
          await deleteRole(id)
          this.getRoleList()
          this.$message.success('删除角色成功')
        } catch (error) {
          console.log(error)
        }
      },
      async editRole(id) {
        this.roleForm = await getRoleDetail(id)
        this.showDialog = true
      },
      async btnOk() {
        try {
          this.$refs.roleForm.validate()
          // 只有校验通过的情况下，才会执行下面的内容，相当于写在括号中
          // roleForm 这个对象有id就是编辑，没有id就是新增
          if (this.roleForm.id) {
            // 编辑功能
            await updateRole(this.roleForm)
          } else {
            // 新增功能
            await addRole(this.roleForm)
          }
          this.getRoleList()
          this.$message.success('操作成功')
          // 点击确定的时候并没有清除校验，但是出发了关闭事件，关闭事件调用关闭按钮事件，从而清除了校验
          this.showDialog = false
        } catch (error) {
          console.log(error)
        }
      },
      btnCancel() {
        this.roleForm = {
          name: '',
          description: ''
        }
        // 移出校验
        this.$refs.roleForm.resetFields()
        this.showDialog = false
      },
      // 弹出层
      async assignPerm(id) {
        this.roleId = id
        // 获取该角色的 权限点
        const { permIds } = await getRoleDetail(id)
        this.selectCheck = permIds
        // 将当前角色所拥有的权限点id赋值并回写到视图上， 通过default-checked-keys与node-key
        this.permData = tranListToTreeData(await getPermissionList(), '0')
        this.showPermDialog = true
      },
      async btnPermOK() {
        // 调用el-tree的方法，需要获取el-tree的实例
        await assignPerm({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
        this.$message.success('分配权限成功')
        this.showPermDialog = false
      },
      btnPermCancel() {
        this.selectCheck = [] //重置弹出层的数据
        this.showPermDialog = false
      }
    }
  }
</script>

<style>
</style>