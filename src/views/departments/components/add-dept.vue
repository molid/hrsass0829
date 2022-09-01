<template>
  <!-- 新增部门弹出层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <el-form :model="formData" :rules="rules" ref="deptForm" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%;" placeholder='1-50个字符' />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%;" placeholder='1-50个字符' />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%;" placeholder='请选择' @focus="getEmployeeSimple">
          <!-- 遍历选项 -->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%;" placeholder='1-300个字符' type="textarea" row="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOk">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
  import { getEmployeeSimple } from '@/api/employees'
  export default {
    props: {
      showDialog: {
        type: Boolean,
        default: false
      },
      // 添加子节点的父节点
      treeNode: {
        type: Object,
        default: null
      }
    },
    data() {
      // 检查部门名称是否重复
      const checkNameRepeat = async (rule, value, callback) => {
        // value是部门名称， 和同级部门下的部门去比较
        const { depts } = await getDepartments()
        let isRepeat = false
        if (this.formData.id) {
          // 有id就是编辑模式
          // 规则： 同级部门下，我的名字不能与其它同级部门的名字相同
          // 先找到我的同级部门，排除掉我自己，然后检查是否有名字相同的
          isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
        } else {
          // 没有id就是新增模式
          // 找到该节点下的所有子节点，然后遍历查找名字相同的
          isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
        }
        isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()
      }
      const checkCodeRepeat = async (rule, value, callback) => {
        const { depts } = await getDepartments()
        // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能没有code, 所以强制code存在值
        let isRepeat = false
        if(this.formData.id) {
          // 编辑
          // 要求不能有一样的code
          isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
        } else {
          // 新增
          isRepeat = depts.some(item => item.code === value && value)
        }
        isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
      }
      return {
        formData: {
          name: '',
          code: '',
          manager: '',
          introduce: ''
        },
        rules: {
          name: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' },
            {
              min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur'
            },
            {
              trigger: 'blur',
              validator: checkNameRepeat
            }
          ],
          code: [
            { required: true, message: '部门编码不能为空', trigger: 'blur' },
            {
              min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur'
            },
            {
              trigger: 'blur',
              validator: checkCodeRepeat
            }
          ],
          manager: [
            { required: true, message: '部门负责人不能为空', trigger: 'blur' }
          ],
          introduce: [
            { required: true, message: '部门介绍不能为空', trigger: 'blur' },
            {
              min: 1, max: 300, message: '部门介绍长度为1-300个字符', trigger: 'blur'
            }
          ]
        },
        peoples: []
      }
    },
    computed: {
      showTitle() {
        return this.formData.id ? '编辑部门' : '新增子部门'
      }
    },
    methods: {
      async getEmployeeSimple() {
        this.peoples = await getEmployeeSimple()
      },
      async getDepartDetail(id) {
        this.formData = await getDepartDetail(id)
        // 注意： 父组件调用子组件的该方法，在调用之前更新了node，props的传值是异步的，因此，此处参数应该是调用函数的时候传递过来，不能是props中接收的值（这个值没更新）。
      },
      btnOk() {
        this.$refs.deptForm.validate(async isOK => {
          if (isOK) {
            // 表单校验通过
            // 注意： 因为添加与编辑是作用于同一个组件，也就是确定按钮是同一个
            if (this.formData.id) {
              // 编辑
              await updateDepartments(this.formData)
            } else {
              // 添加
              // 将ID设置为pid
              await addDepartments({ ...this.formData, pid: this.treeNode.id })
            }
            // 告诉父组件，触发自定义事件调用更新数据方法更新页面
            this.$emit('addDepts')
            // 此时去修改showDialog的值
            // this.$emit('changeDialog', false)
            this.$emit('update:showDialog', false)
            // 关闭dialog的时候会触发el-dialog的close事件，调用btnCancel,清空之前的校验，所以不需要再单独重置数据了
          }
        })
      },
      btnCancel() {
        // 重置数据
        this.formData = {
          name: '',
          code: '',
          manager: '',
          introduce: ''
        }
        // 关闭弹出层
        this.$emit('update:showDialog', false)
        // 清除之前的校验，可以重置数据，但是只能重置定义在data中的数据
        this.$refs.deptForm.resetFields()
      }
    }

  }
</script>

<style>
</style>