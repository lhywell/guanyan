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
      成交总额：<em>{{ numberWithCommas(amount) }}</em> 元
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
          <a
            href="#"
            @click="openDialoge(row)"
            style="text-decoration: underline; color: #0078fe"
            >{{ row.month }}</a
          >
        </template>
      </el-table-column>
      <el-table-column label="成交日期" prop="dealDate">
        <template #default="{}">
          <div>{{ queryForm.month }}</div>
        </template>
      </el-table-column>
      <el-table-column label="成交单数" prop="count" />
      <el-table-column label="成交总额（元）" prop="price">
        <template #default="{ row }">
          <div>{{ numberWithCommas(row.price) }}</div>
        </template>
      </el-table-column>
    </el-table>
    <div id="priceDataChart" class="echarts" />
    <!-- 抽屉 -->
    <el-drawer
      title="月度数据"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      append-to-body
      size="80%"
    >
      <div style="margin: 20px">
        <el-table
          ref="tableSort"
          v-loading="listLoading"
          :data="monthList"
          :element-loading-text="elementLoadingText"
          stripe
        >
          <el-table-column label="序号" type="index" width="60">
            <template slot-scope="scope">
              <span v-text="getIndex(scope.$index, drawForm.page.current, drawForm.page.size)" />
            </template>
          </el-table-column>
          <el-table-column label="加粉日期" prop="newDate" width="120">
            <template #default="{ row }">
              <div>
                <div>{{ getDate(row.newDate) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="成交日期" prop="dealDate" width="120">
            <template #default="{ row }">
              <div>
                <div>{{ getDate(row.dealDate) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="咨询师" prop="saleName" />
          <el-table-column label="成交手机" prop="dealPhone" />
          <el-table-column label="转化类型" prop="type" />
          <el-table-column label="成交产品" prop="product" width="160">
            <template #default="{ row }">
              <div v-for="(item, index) in row.product.split(',')" :key="index">
                <div>{{ item }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="成交产品总价" prop="price" width="120" />
          <el-table-column label="支付方式" prop="payMode" />
          <el-table-column label="性别" prop="sex">
            <template #default="{ row }">
              <div v-if="row.sex">{{ row.sex === 1 ? '男' : '女' }}</div>
            </template>
          </el-table-column>
          <el-table-column label="阳历出生日" prop="birthdayX" width="120" />
          <el-table-column label="阴历出生日" prop="birthdayY" width="120" />
          <el-table-column label="出生时间" prop="birthTime" />
          <el-table-column label="出生地" prop="birthAddressLabel" width="120" />
          <!-- <el-table-column label="电话号码" prop="customerPhone" /> -->
          <el-table-column label="身份证地址" prop="idCardAddress">
            <template #default="{ $index, row }">
              <div>
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content" style="max-width: 200px">
                    {{ row.idCardAddress }}
                  </div>
                  <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
                    {{ row.idCardAddress }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="现居地" prop="liveAddress">
            <template #default="{ $index, row }">
              <div>
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content" style="max-width: 200px">
                    {{ row.liveAddress }}
                  </div>
                  <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
                    {{ row.liveAddress }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="邮寄地址" prop="mailAddress">
            <template #default="{ $index, row }">
              <div>
                <el-tooltip class="item" effect="dark" placement="top">
                  <div slot="content" style="max-width: 200px">
                    {{ row.mailAddress }}
                  </div>
                  <div style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden">
                    {{ row.mailAddress }}
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="comment" />
          <el-table-column label="是否补差价" prop="priceAdjustment">
            <template #default="{ row }">
              <div v-if="row.priceAdjustment" class="patch">补</div>
            </template>
          </el-table-column>
          <el-table-column label="是否红包" prop="hongbao">
            <template #default="{ row }">
              <div v-if="row.hongbao" class="red_package">红</div>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" />
          <el-table-column label="更新时间" prop="updateTime" />
        </el-table>
      </div>
    </el-drawer>
  </el-main>
</template>

<script>
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { getCustomer, getPriceByMonth } from '@/api/crm/index.js'

import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission, numberWithCommas } from '@/common/conf/utils'
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
      numberWithCommas,
      list: [],
      queryForm: {
        month: startDate,
      },
      listLoading: false,
      lineOption,
      amount: 0,
      monthList: [],
      drawer: false,
      direction: 'rtl',
      drawForm: {
        page: {
          size: 20,
          current: 1,
        },
      },
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
    async getCostomer(params) {
      const { data } = await getCustomer(params)
      window.console.log(params, data)
      this.$nextTick(() => {
        this.monthList = data
      })
    },
    openDialoge(row) {
      this.drawer = true
      const currentMonth = this.queryForm.month
      const { month } = row

      const start = dayjs(month).startOf('month').format('YYYY-MM-DD')
      const end = dayjs(month).endOf('month').format('YYYY-MM-DD')
      const dstart = dayjs(currentMonth).startOf('month').format('YYYY-MM-DD')
      const dend = dayjs(currentMonth).endOf('month').format('YYYY-MM-DD')
      window.console.log([start, end], [dstart, dend])
      const obj = {
        newDate: [start, end],
        dealDate: [dstart, dend],
      }
      this.getCostomer(obj)
    },
    handleClose(done) {
      done()
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
