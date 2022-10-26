<template>
  <!--工作日历 -->
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" @change="dataChange" size="small" style="width: 120px;">
        <!-- 年 用组件给定的日期， 获取日期的年， 然后取前五年后五年 -->
        <el-option v-for="item in yearList" :key="item" :value="item" :label="item"></el-option>
      </el-select>
      <el-select v-model="currentMonth" @change="dataChange" size="small" style="width: 120px;" margin-left="10px">
        <!-- 循环 -->
        <el-option v-for="item in 12" :key="item" :value="item" :label="item"></el-option>
      </el-select>
    </el-row>
    <!-- 放置一个日历组件 -->
    <el-calendar v-model="currentDate">
      <!-- date当前单元格的日期， data各种属性 -->
      <template v-slot:dateCell="{date, data}">
        <div class="date-content">
          <span class="text"> {{data.day | getDay}} </span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
  export default {
    filters: {
      getDay(value) {
        const day = value.split('-')[2]
        return day.startsWith('0') ? day.substr(1) : day
      }
    },
    props: {
      startDate: {
        type: Date,
        // 此处需要回调函数式的返回值， 因为类型式Object或者Date，默认值必须是回调函数类型的
        default: () => new Date() // 如果没有传递指定年份，就取当前时间
      }
    },
    data() {
      return {
        yearList: [],
        currentYear: null, // 当前年份
        currentMonth: null,
        currentDate: null
      }
    },
    created() {
      // 获取当前月份
      this.currentMonth = this.startDate.getMonth() + 1
      //  获取当前的年份
      this.currentYear = this.startDate.getFullYear() //得到当前的年份
      // 快速生成年份
      // Array(100)生成长度100元素为undefine的数组，Array.form(Array(100))展示整个数组
      // Array.form(Array(100), (v, i) => i+1)从1到11赋值
      this.yearList = Array.from(Array(11), (v, i) => this.currentYear + i - 5)
      // 钩子函数执行完成之后
      this.dataChange()
    },
    methods: {
      dataChange() {
        // 生成新的日期
        this.currentDate = new Date(`${this.currentYear}-${this.currentMonth}-1`)
      },
      // 判断当前日期是否是周末
      isWeek(date) {
        return date.getDay() === 6 || date.getDay() === 0
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-calendar-day {
    height: auto;
  }
  /deep/ .el-calendar-table__row td,
  /deep/ .el-calendar-table tr td:first-child,
  /deep/ .el-calendar-table__row td.prev {
    border: none;
  }
  .date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
  .date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
  }
  .date-content .text {
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
  }
  /deep/ .el-calendar-table td.is-selected .text {
    background: #409eff;
    color: #fff;
    border-radius: 50%;
  }
  /deep/ .el-calendar__header {
    display: none;
  }
</style>