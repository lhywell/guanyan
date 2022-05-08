<!-- 财务管理 -->
<template>
  <el-main style="background: #fff">
    <el-form class="search-form" :model="queryForm" inline>
      <el-form-item label="成交日期">
        <el-date-picker
          v-model="queryForm.dealDate"
          placeholder="请选择日期"
          type="daterange"
          value-format="yyyy-MM-dd"
          :clearable="true"
          :picker-options="pickerOptions"
          style="width: 230px"
        />
      </el-form-item>
      <el-form-item label="销售名称">
        <el-select v-model="queryForm.saleId" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in salesOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="转化类型">
        <el-select v-model="queryForm.type" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="queryForm.payId" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in payOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
      </el-form-item>
      <el-button type="primary" icon="el-icon-download" @click="handleExport">
        下载EXCEL
      </el-button>
    </el-form>
    <el-table
      v-if="height"
      ref="tableSort"
      v-loading="listLoading"
      :data="list"
      :element-loading-text="elementLoadingText"
      :height="height"
      :show-summary="true"
      :summary-method="getSummaries"
    >
      <el-table-column label="序号" type="index" width="90">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index, queryForm.page.current, queryForm.page.size)" />
        </template>
      </el-table-column>
      <el-table-column label="加粉日期" prop="newDate" width="120" />
      <el-table-column label="成交日期" prop="dealDate" width="120" />
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
      <el-table-column label="客户微信号" prop="weixin" />
      <el-table-column label="客户微信名" prop="weixinName" />
      <el-table-column label="真实姓名" prop="realName" />
      <el-table-column label="性别" prop="sex">
        <template #default="{ row }">
          <div>{{ row.sex === 1 ? '男' : '女' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="阳历出生日" prop="birthdayX" width="120" />
      <el-table-column label="阴历出生日" prop="birthdayY" width="120" />
      <el-table-column label="出生时间" prop="birthTime" />
      <el-table-column label="出生地" prop="birthAddressLabel" width="120" />
      <el-table-column label="电话号码" prop="customerPhone" />
      <el-table-column label="身份证地址" prop="idCardAddress" />
      <el-table-column label="现居地" prop="liveAddress" />
      <el-table-column label="邮寄地址" prop="mailAddress" />
      <el-table-column label="操作" width="260" align="center">
        <template #default="{ $index, row }">
          <div>
            <el-button
              type="primary"
              plain
              @click="handleEdit(row, $index)"
              v-permission="['admin', 'platformer']"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              plain
              v-permission="['admin', 'platformer']"
              @click="handleDelete(row, $index)"
            >
              删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :background="background"
      :current-page="queryForm.page.current"
      :layout="layout"
      :page-size="queryForm.page.size"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </el-main>
</template>

<script>
// import dayjs from 'dayjs'
import { getSaleList, getCustomer, downloadExcel } from '@/api/crm/index.js'

import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission, exportFile } from '@/common/conf/utils'
// 权限判断方法
import heightMix from '@/mixins/height'
import tableHeight from '@/mixins/tableHeight'

// const today = dayjs().format('YYYY-MM-DD')
// const startDate = dayjs().startOf('month').format('YYYY-MM-DD')
// const endDate = dayjs().endOf('month').format('YYYY-MM-DD')
// console.log(endDate)
// console.log(height)
export default {
  directives: { permission },
  mixins: [heightMix, tableHeight],
  data() {
    return {
      list: [],
      queryForm: {
        dealDate: '',
        saleId: '',
        type: '',
        payId: '',
        page: {
          size: 20,
          current: 1,
        },
      },
      salesOptions: [],
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
    this.getPickOption()
  },
  mounted() {
    this.initHeight()

    this.getSaleList()
    this.fetchData()
  },
  methods: {
    hasPermission,
    async getSaleList() {
      const { data } = await getSaleList()
      this.salesOptions = data
    },
    async fetchData() {
      const params = {
        ...this.queryForm,
      }
      this.listLoading = true
      const { data } = await getCustomer(params)
      const list = data.records
      this.total = data.total
      this.list = list

      setTimeout(() => {
        this.listLoading = false
      }, 500)
    },
    handleSizeChange(val) {
      this.queryForm.page.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.page.current = val
      this.fetchData()
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (column.property === 'price') {
          const values = data.map(item => Number(item[column.property]))
          // window.console.log(values, data, column)
          if (!values.every(value => Number.isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              }
              return prev
            }, 0)
            sums[index] += ' 元'
          } else {
            sums[index] = 'N/A'
          }
        }
      })
      // window.console.log(sums)
      return sums
    },
    handleEdit() {},
    handleDelete() {},
    async handleExport() {
      try {
        const res = await downloadExcel()

        if (res) {
          await exportFile(res, '流水', 'excel')
        }
      } catch (e) {
        window.console.log(1, e)
      }
    },
  },
}
</script>
