<template>
  <!-- 图表必须给高宽 -->
  <div ref="myDiv" class="radar-echart"></div>
</template>

<script>
  // 引入echarts
  // var echarts = require('echarts') 全局加载
  // 按需加载
  // 引入echarts的主模块
  var echarts = require('echarts/lib/echarts')
  // 引入雷达图
  require('echarts/lib/chart/radar')
  // 引入提示框与标题组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/title')
  // 引入图例
  require('echarts/lib/component/legend')

  export default {
    // 页面渲染完毕事件，才能获取到实例
    mounted() {
      //得到图标实例
      const myChart = echarts.init(this.$refs.myDiv)
      var option = {
        title: {
          text: 'Basic Radar Chart'
        },
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Administration', max: 16000 },
            { name: 'Information Technology', max: 30000 },
            { name: 'Customer Support', max: 38000 },
            { name: 'Development', max: 52000 },
            { name: 'Marketing', max: 25000 }
          ]
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
              }
            ]
          }
        ]
      };
      myChart.setOption(option)
    }
  }
</script>

<style scoped>
  .radar-echart {
    width: 600px;
    height: 400px;
  }
</style>