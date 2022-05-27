<!-- 投放管理 -->
<template>
  <el-main style="background: #fff">
    <el-form class="search-form" :model="queryForm" inline>
      <el-form-item label="成交月份">
        <el-date-picker
          v-model="queryForm.month"
          style="width: 240px"
          type="month"
          placeholder="选择月份"
          value-format="yyyy-MM"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="amount">
      成交总额：<em>{{ amount }}</em> 元
    </div>
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      stripe
    >
      <el-table-column label="加粉日期" prop="">
        <template #default="{ row }">
          <div>{{ row.month }}</div>
        </template>
      </el-table-column>
      <el-table-column label="成交日期" prop="dealDate">
        <template #default="{}">
          <div>{{ queryForm.month }}</div>
        </template>
      </el-table-column>
      <el-table-column label="成交总额（元）" prop="price" />
    </el-table>
    <div id="priceDataChart" class="echarts" />
  </el-main>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { getCustomer, getPriceByMonth } from '@/api/crm/index.js'

import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission } from '@/common/conf/utils'
// 权限判断方法
import heightMix from '@/mixins/height'
// import tableHeight from '@/mixins/tableHeight'
import lineOption from './line'

const startDate = dayjs().startOf('month').format('YYYY-MM')
export default {
  directives: { permission },
  mixins: [heightMix],
  components: {},
  data() {
    return {
      list: [],
      queryForm: {
        month: startDate,
      },
      listLoading: false,
      lineOption,
      amount: 0,
      monthList: [],
    }
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', [val])
      },
    },
  },
  watch: {
    roles() {
      this.key += 1
    },
  },
  created() {
    this.getTableProps()
  },
  mounted() {
    this.initHeight()

    this.fetchData()

    const chartDom = document.getElementById('priceDataChart')
    this.myChart = echarts.init(chartDom)
  },
  methods: {
    hasPermission,
    async fetchData() {
      const params = {
        ...this.queryForm,
      }
      this.listLoading = true
      const { data } = await getPriceByMonth(params)
      this.list = data.everymonth

      // 当月成交总额
      this.amount = data.price

      const ary = []
      this.list.forEach(d => {
        ary.push(Object.values(d))
      })
      this.lineOption.dataset[0].source = ary

      // window.console.log(ary, this.lineOption)
      this.myChart.setOption(this.lineOption)
      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleChange(list) {
      for (let i = 0; i < list.length; i++) {
        const { month } = list[i]

        const currentMonth = this.queryForm.month
        const start = dayjs(month).startOf('month').format('YYYY-MM-DD')
        const end = dayjs(month).endOf('month').format('YYYY-MM-DD')
        const dstart = dayjs(currentMonth).startOf('month').format('YYYY-MM-DD')
        const dend = dayjs(currentMonth).endOf('month').format('YYYY-MM-DD')
        window.console.log([start, end], [dstart, dend])
        const obj = {
          newDate: [start, end],
          dealDate: [dstart, dend],
        }
        this.getCostomer(obj, i + 1)
      }
    },
    async getCostomer(params, index) {
      const { data } = await getCustomer(params)
      window.console.log(params, data)
      setTimeout(() => {
        this[`monthList${index}`] = data.records
      }, 1500)
    },
  },
}
</script>
<style lang="scss">
.echarts {
  margin-top: 20px;
  width: 100%;
  height: 400px;
}
.amount {
  background: #f2aa53;
  color: #fff;
  width: 250px;
  height: 60px;
  line-height: 60px;
  border-radius: 10px;
  margin-bottom: 10px;
  text-align: center;

  em {
    font-size: 30px;
    font-weight: bold;
    font-style: normal;
  }
}
</style>
