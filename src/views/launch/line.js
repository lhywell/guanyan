// const savedColor = localStorage.getItem('theme_color')

export default {
  legend: {
    inactiveColor: '#ccc',
    textStyle: {
      color: '#333',
    },
    orient: 'horizontal',
    x: 'center',
    y: 'top',
    icon: 'pin',
    padding: [30, 80, 0, 0],
    data: ['成交总额'],
  },
  grid: {
    top: 80,
    bottom: 30,
    left: 30,
    right: 30,
    containLabel: true,
  },
  // color: [
  //   'rgb(234,124,204)',
  //   'rgb(145,204,117)',
  //   'rgb(250,200,88)',
  //   'rgb(238,102,102)',
  //   '#5470c6',
  //   '#9a60b4',
  //   '#ea7ccc',
  //   '#91cc75',
  //   '#fac858',
  //   '#ee6666',
  //   '#73c0de',
  //   '#3ba272',
  //   '#fc8452',
  //   '#9a60b4',
  // ],
  tooltip: {
    trigger: 'axis',
    triggerOn: 'mousemove', // mousemove click,
    axisPointer: {
      animation: false,
      type: 'cross',
      lineStyle: {
        color: '#376df4',
        width: 2,
        opacity: 1,
      },
    },
  },
  dataset: [
    {
      dimensions: ['id', 'price', 'count', 'month', 'date'],
      // source: [
      //   ['Hannah Krause', 41, 'Engineer', 314, '2011-02-12'],
      //   ['Zhao Qian', 20, 'Teacher', 351, '2011-03-01'],
      //   ['Jasmin Krause ', 52, 'Musician', 287, '2011-02-14'],
      //   ['Li Lei', 37, 'Teacher', 219, '2011-02-18'],
      //   ['Karle Neumann', 25, 'Engineer', 253, '2011-04-02'],
      //   ['Adrian Groß', 19, 'Teacher', '-', '2011-01-16'],
      //   ['Mia Neumann', 71, 'Engineer', 165, '2011-03-19'],
      //   ['Böhm Fuchs', 36, 'Musician', 318, '2011-02-24'],
      //   ['Han Meimei', 67, 'Engineer', 366, '2011-03-12'],
      // ],
    },
    {
      transform: {
        type: 'sort',
        config: { dimension: 'price', order: 'desc' },
      },
    },
  ],
  xAxis: {
    type: 'category', // 还有其他的type，可以去官网喵两眼哦
    // data: timePoints, // x轴数据
    name: '', // x轴名称
    // x轴名称样式
    nameTextStyle: {
      fontWeight: 600,
      fontSize: 18,
    },
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 12,
    },
  },
  yAxis: {
    name: '单位(元)',
  },
  series: {
    type: 'bar',
    encode: { x: 'month', y: 'price' },
    name: '成交总额',
    barWidth: 24,
    smooth: true,
  },
}
