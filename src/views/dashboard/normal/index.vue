<template>
  <el-main>
    <div id="myChart" :style="{ width: '100%', height: '5rem' }" />
  </el-main>
</template>
<script>
import echarts from '../echart'

export default {
  name: 'AdminDashboard',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const myChart = echarts.init(document.getElementById('myChart'));
      // 绘制图表
      myChart.setOption({
        title: {
          text: '普通用户'
        },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    }
  }
}
</script>
