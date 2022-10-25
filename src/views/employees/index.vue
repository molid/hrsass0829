<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span>共{{page.total}}条记录</span>
        </template>
        <!-- 右侧显示按钮，excel导入 excel导出 新增员工 -->
        <template v-slot:after>
          <el-button size="small" type="success" @click="$router.push('/import?type=user')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true" :disabled="!checkPermission('POINT-USER-ADD')">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <!-- 注意： table数据源绑定是:data, form数据源绑定是：model -->
        <!-- <el-table border :model="list"> -->
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center" style="width: 120px;">
            <!-- 插槽 -->
            <template slot-scope="{row}">
              <img v-imageerror="require('@/assets/common/head.jpg')" @click="showQrCode(row.staffPhoto)" :src="row.staffPhoto" style="border-radius: 50%; width: 100px; height: 100px; padding: 10px;" alt="">
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 格式化：作用域插槽+过滤器 -->
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{row}">
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination layout="prev, pager, next" :current-page="page.page" :page-size="page.size" :total="page.total" @current-change="changePage" />
        </el-row>
      </el-card>
    </div>
    <!-- 放置新增员工弹出层 -->
    <add-employee :show-dialog.sync="showDialog" />
    <!-- 点击头像图片，显示二维码，扫码显示图片地址 -->
    <el-dialog title='二维码' :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配角色的组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
  import { getEmployeeList, delEmployee } from '@/api/employees'
  // 引入员工的枚举对象
  import EmployeeEnum from '@/api/constant/employees'
  import AddEmployee from './components/add-employee'
  import { formatDate } from '@/filters'
  import AssignRole from './components/assign-role'
  // 生成二维码的包
  import QrCode from 'qrcode'

  export default {
    components: {
      AddEmployee,
      AssignRole
    },
    data() {
      return {
        list: [], //接收数组
        page: {
          page: 1,
          size: 10,
          total: 0
        },
        loading: false, //显示遮盖层
        showDialog: false, //控制新增弹出层的关闭与显示
        showCodeDialog: false, //控制显示二维码弹出层
        showRoleDialog: false, //控制显示分配角色的弹出层显示
        userId: null, // 定义一个userId
      }
    },
    created() {
      this.getEmployeeList()
    },
    methods: {
      async getEmployeeList() {
        this.loading = true
        const { total, rows } = await getEmployeeList(this.page)
        this.page.total = total
        this.list = rows
        this.loading = false
      },
      changePage(newPage) {
        this.page.page = newPage
        this.getEmployeeList()
      },
      // 格式化聘用形式
      formatEmployment(row, column, cellValue, index) {
        // 要找1所对应的值
        const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
        return obj ? obj.value : '未知'
      },
      async delEmployee(id) {
        try {
          await this.$confirm('确定删除该员工？')
          // 点击确定后才能进行后续操作
          await delEmployee(id)
          this.$message.success('删除员工成功')
          this.getEmployeeList()
        } catch (error) {
          console.log(error)
        }
      },
      // 导出excel
      exportData() {
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        // 懒加载
        import('@/vendor/Export2Excel').then(async excel => {
          const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
          const data = this.formatJson(headers, rows)
          const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
          const merges = ['A1:A2', 'B1:F1', 'G1:G2']

          excel.export_json_to_excel({
            header: Object.keys(headers),
            data,
            filename: '员工信息表',
            autoWidth: true,
            bookType: 'xlsx',
            multiHeader, // 复杂表头
            merges //合并选项
          })
        })
      },
      // 将表头数据和数据进行对应
      formatJson(headers, rows) {
        return rows.map(item => {
          return Object.keys(headers).map(key => {
            // 需要判断 字段
            if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
              // 格式化日期
              return formatDate(item[headers[key]])
            } else if (headers[key] === 'formOfEmployment') {
              const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
              return obj ? obj.value : '未知'
            }
            return item[headers[key]]
          })
        })
      },
      showQrCode(url) {
        //url 存在的情况下 才弹出层
        if (url) {
          // 数据更新了，但是弹层不会立刻出现，页面的渲染是异步的
          this.showCodeDialog = true
          // 报错： [Vue warn]: Error in v-on handler: "TypeError: Cannot read properties of undefined (reading 'getContext')"
          // 报错原因： 页面没有渲染完就转化，获取不到dom
          // QrCode.toCanvas(this.$refs.myCanvas, url) //将地址转化为二维码
          // Vue.nextTick或者this.$nextTick()可以保证在上一次数据更新后，页面渲染完毕之后
          this.$nextTick(() => {
            QrCode.toCanvas(this.$refs.myCanvas, url)
            // 如果转化的二维码后面信息是一个地址的话 就会跳转到该地址，如果不是地址就会显示内容
          })
        } else {
          this.$message.warning('该用户还未上传头像')
        }
      },
      editRole(id) {
        // props赋值渲染异步的
        this.userId = id
        this.$refs.assignRole.getUserDetailById(id)
        this.showRoleDialog = true

      }
    }
  }
</script>

<style>
</style>