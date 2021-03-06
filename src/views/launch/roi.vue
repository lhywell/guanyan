<!-- 投放管理 -->
<template>
  <el-main style="background: #fff">
    <el-form class="search-form" :model="queryForm" inline>
      <WeChatEntry ref="weButton" @click.native="handleInput" @on-success="fetchData" />
      <el-form-item label="加粉月份">
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
    <el-table
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      stripe
    >
      <el-table-column label="加粉日期" prop="newDate">
        <template #default="{ row }">
          <div>
            <div>{{ row.newDate !== '合计' ? getDate(row.newDate) : row.newDate }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="公众号" prop="woa" />
      <el-table-column label="手机号" prop="dealPhone">
        <template #default="{ $index, row }">
          <div>
            {{ row.dealPhone ? row.dealPhone : '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="广告费" prop="adPrice">
        <template #default="{ $index, row }">
          <div>
            {{ numberWithCommas(row.adPrice) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="实际添加数" prop="newCustomerNumber" />
      <el-table-column label="获客成本（每人次）" prop="cost">
        <template #default="{ $index, row }">
          <div>
            {{ row.cost ? row.cost.toFixed(1) : row.cost }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="一转人数" prop="customerNumberOne" />
      <el-table-column label="一转订单额" prop="customerPriceOne" />
      <el-table-column label="二转人数" prop="customerNumberTwo" />
      <el-table-column label="二转订单额" prop="customerPriceTwo" />
      <el-table-column label="成交总额" prop="priceAll" />
      <el-table-column label="ROI" prop="roi">
        <template #default="{ $index, row }">
          <div>
            {{ row.roi !== 0 ? row.roi.toFixed(2) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="notice" />
      <el-table-column label="操作" align="center" width="210">
        <template #default="{ $index, row }">
          <div v-if="row.newDate !== '合计'">
            <addNoticeButton
              :ref="'noticeButton_' + row._id"
              @click.native="addNotice(row, $index)"
              @on-edit="fetchData"
            />
            <!-- <el-button type="primary" plain @click="addNotice(row)">添加备注</el-button> -->
            <el-button type="danger" plain @click="deleteRow(row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import dayjs from 'dayjs'
import WeChatEntry from './WeChatEntry'
import { getFans, deleteFans } from '@/api/crm/index.js'
import addNoticeButton from './addNoticeButton'
import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission, numberWithCommas } from '@/common/conf/utils'
// 权限判断方法
import heightMix from '@/mixins/height'
// import tableHeight from '@/mixins/tableHeight'

const startDate = dayjs().startOf('month').format('YYYY-MM')
export default {
  directives: { permission },
  mixins: [heightMix],
  components: {
    addNoticeButton,
    WeChatEntry,
  },
  data() {
    return {
      numberWithCommas,
      list: [],
      queryForm: {
        month: startDate,
        page: {
          size: 20,
          current: 1,
        },
      },
      listLoading: false,
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
  },
  methods: {
    hasPermission,
    async fetchData() {
      const params = {
        ...this.queryForm,
      }
      this.listLoading = true
      const { data } = await getFans(params)
      const list = data.records

      if (data.records.length > 0) {
        data.records.push({
          adPrice: data.adPrice,
          cost: data.cost,
          customerNumberOne: data.customerNumberOne,
          customerNumberTwo: data.customerNumberTwo,
          customerPriceOne: data.customerPriceOne,
          customerPriceTwo: data.customerPriceTwo,
          dealPhone: '    ',
          newCustomerNumber: data.newCustomerNumber,
          newDate: '合计',
          priceAll: data.priceAll,
          roi: data.roi,
          woaType: '',
          updateTime: '',
          woa: '',
        })
      }
      this.list = list

      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleInput() {
      this.$nextTick(() => {
        this.$refs.weButton.handleOpen()
      })
    },
    async deleteRow(row) {
      await deleteFans({ id: row._id })

      this.$message.success('删除成功')
      this.fetchData()
    },
    addNotice(row) {
      this.$nextTick(() => {
        this.$refs[`noticeButton_${row._id}`].handleEdit(row)
      })
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
.el-table__row:last-child {
  background: #f5f7fa;
}
</style>
