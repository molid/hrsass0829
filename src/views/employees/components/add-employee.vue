<template>
  <el-dialog :visible="showDialog" title="新增员工" @close="btnCancel">
    <!-- 表单 -->
    <el-form :model="formData" :rules="rules" ref="addEmployee" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" @focus="getDepartments" />
        <!-- 放置一个tree组件 -->
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" default-expand-all="true" :props="{ label: 'name' }" @node-click="selectNode" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
  import { getDepartments } from '@/api/departments'
  import { tranListToTreeData } from '@/utils'
  import EmployeeEnum from '@/api/constant/employees'
  import { addEmployee } from '@/api/employees'

  export default {
    props: {
      showDialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        EmployeeEnum, // 在data中定义数据
        // 表单数据
        treeData: [], // 定义数组接收树形数据
        showTree: false, // 控制树形的显示或者隐藏
        loading: false, // 控制树的显示或者隐藏进度条
        formData: {
          username: '',
          mobile: '',
          formOfEmployment: '',
          workNumber: '',
          departmentName: '',
          timeOfEntry: '',
          correctionTime: ''
        },
        rules: {
          username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
            min: 1, max: 4, message: '用户姓名为1-4位'
          }],
          mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
            pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
          }],
          formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
          workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
          departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
          timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
        }
      }
    },
    methods: {
      async getDepartments() {
        this.loading = true
        const { depts } = await getDepartments()
        // depts是数组 但不是树形
        this.treeData = tranListToTreeData(depts, '')
        this.showTree = true
        this.loading = false
      },
      selectNode(node) {
        this.formData.departmentName = node.name
        this.showTree = false
      },
      async btnOk() {
        // 校验表单
        try {
          await this.$refs.addEmployee.validate()
          // 校验成功
          await addEmployee(this.formData)
          // 通知父组件 更新数据
          // this.$parent 父组件的实例
          this.$parent.getEmployeeList()
          this.$parent.showDialog = false
        } catch (error) {
          console.log(error)
        }
      },
      btnCancel() {
        this.formData = {
          username: '',
          mobile: '',
          formOfEmployment: '',
          workNumber: '',
          departmentName: '',
          timeOfEntry: '',
          correctionTime: ''
        },
          // 移除校验
          this.$refs.addEmployee.resetFields()
        // this.$parent.showDialog = false 非常规方式
        this.$emit('update:showDialog')
        // update: props名称 这样写可以在父组件中用sync修饰符处理
      }
    }

  }
</script>

<style>
</style>