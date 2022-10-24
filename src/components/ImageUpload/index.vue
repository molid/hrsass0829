<template>
  <div>
    <el-upload :file-list="fileList" action="#" list-type="picture-card" :limit="1" :class="{disabled:fileComputed }" :on-preview="preview" :on-remove="handleRemove" :on-change="changeFile" :before-upload="beforeUpload" :http-request="upload">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px;" :percentage="percent" />
    <el-dialog :visible.sync="showDialog" title="图片预览">
      <img :src="imgUrl" alt="" style="width: 100%;">
    </el-dialog>
  </div>
</template>

<script>
  // 引入腾讯云cos包
  import COS from 'cos-js-sdk-v5'
  // 实例化COS对象
  const cos = new COS({
    SecretId: 'AKIDEWlpdBWeWEiz2rKYXIqBIBqIXXKJ3Ypk',
    SecretKey: 'jHbgXAZiaBVYv50f7LK5dz95nIZeV7Wg'
  })
  export default {
    data() {
      return {
        fileList: [],
        showDialog: false,
        imgUrl: '',
        currentFileUid: null, //记录当前上传图片的uid
        percent: 0,
        showPercent: false
      }
    },
    computed: {
      fileComputed() {
        return this.fileList.length === 1
      }
    },
    methods: {
      //点击预览事件
      preview(file) {
        this.imgUrl = file.url
        this.showDialog = true
      },
      handleRemove(file) {
        // file是要删除的文件， fileList是删除后的文件
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)
        // this.fileList = fileList
      },
      // 不能用push， 这个钩子会执行多次
      changeFile(file, fileList) {
        this.fileList = fileList.map(item => item)
      },
      beforeUpload(file) {
        // 要开始做文件上传的检查
        // 文件类型 文件大小
        const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
        if (!types.includes(file.type)) {
          this.$message.error('上传图片只能是JPG、GIF、BMP、PNG格式！')
          return false
        }
        // 检查大小
        const maxSize = 5 * 1024 * 1024
        if (maxSize < file.size) {
          this.$message.error('图片大小最大不能超过5M')
          return false
        }
        this.currentFileUid = file.uid
        this.showPercent = true
        return true
      },
      // 进行上传操作
      upload(params) {
        if (params.file) {
          // 执行上传操作
          cos.putObject({
            // 上传到腾讯云  => 哪个存储桶 哪个地域的存储桶  文件  格式  名称  回调
            Bucket: 'hrsaas-1258310345', //存储桶
            Region: 'ap-beijing', // 地域
            Key: params.file.name, // 文件名
            Body: params.file, // 要上传的文件对象
            StorageClass: 'STANDARD', //上传的模式类型，直接默认标准模式
            onProgress: (params) => {
              console.log(params)
              this.percent = params.percent * 100
            }
          }, (err, data) => {
            if (!err && data.statusCode === 200) {
              this.fileList = this.fileList.map(item => {
                if (item.uid === this.currentFileUid) {
                  return { url: 'http://' + data.Location, upload: true }
                  // upload为true表示这张图片已经上传完成，这个属性为我们后期应用做标记
                  // 保存 => 图片有大有小 => 上传速度有快有慢 => 要根据有没有upload这个属性来决定是否保存
                }
                return item
              })
              // 上传成功之后， 关闭进度条， 置空进度百分比
              setTimeout(() => {
                this.showPercent = false
                this.percent = 0
              }, 500)
            }
          })
        }
      }
    }

  }
</script>

<style>
  .disabled .el-upload--picture-card {
    display: none;
  }
</style>