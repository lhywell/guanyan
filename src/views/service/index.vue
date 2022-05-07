<!-- 售后管理 -->
<template>
  <el-main style="background: #fff">
    <el-form class="search-form" :model="queryForm" inline>
      <el-form-item label="成交日期">
        <el-date-picker
          v-model="queryForm.dateStr"
          placeholder="请选择日期"
          type="daterange"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          style="width: 230px"
        />
      </el-form-item>
      <el-form-item label="转化类型">
        <el-select
          v-model="queryForm.type"
          placeholder="请选择"
          clearable
          @change="conditionChange"
        >
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成交产品">
        <el-select
          v-model="queryForm.type"
          placeholder="请选择"
          clearable
          @change="conditionChange"
        >
          <el-option
            v-for="(item, index) in productOptions"
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
      :data="listClear"
      :element-loading-text="elementLoadingText"
      :height="height"
    >
      <el-table-column label="序号" type="index" width="90">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index, queryForm.page.current, queryForm.page.size)" />
        </template>
      </el-table-column>
      <el-table-column label="代理商名称" prop="agentName" />
      <el-table-column label="累计电量(MWh)" prop="totalUsedPower" />
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
import { getCustomer, downloadExcel } from '@/api/crm/index.js'

import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission, getToken, exportFile } from '@/common/conf/utils'
// 权限判断方法
import heightMix from '@/mixins/height'

// const today = dayjs().format('YYYY-MM-DD')
// const startDate = dayjs().startOf('month').format('YYYY-MM-DD')
// const endDate = dayjs().endOf('month').format('YYYY-MM-DD')
// console.log(endDate)
// console.log(height)
export default {
  directives: { permission },
  mixins: [heightMix],
  data() {
    return {
      listClear: [],
      queryForm: {
        agentName: '',
        condition: '',
        page: {
          size: 20,
          current: 1,
        },
      },
      form: {
        date: ['', ''],
        file: '',
      },
      drawLoading: false,
      drawQueryForm: {
        page: {
          size: 20,
          current: 1,
        },
      },
      headers: { token: getToken() },
      params: {},
      file: null,
      uploadData: {},
      drawer: false,
      direction: 'rtl',
      listDraw: [],
      agentType: '',
      drawTotal: 0,
      listDetail: [],
      dialogVisible: false,
      queryFormSecond: {
        customerName: '',
      },
      settleOptions: ['是', '否'],
      level: ['一级', '二级', '三级'],
      productOptions: [
        {
          label: '灵宝',
          value: 1,
        },
        {
          label: '灵符',
          value: 2,
        },
        {
          label: '法事',
          value: 3,
        },
      ],
      errorLog: '',
      isChange: false,
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

    // this.fetchData()
  },
  methods: {
    hasPermission,
    async fetchData() {
      const params = {
        ...this.queryForm,
      }
      this.listLoading = true
      const { data } = await getCustomer(params)
      const list = data.records
      this.total = data.total
      this.listClear = list

      this.isChange = false

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
    conditionChange() {
      this.queryForm.page.current = 1
    },
    async handleExport() {
      try {
        const res = await downloadExcel()
        if (res) {
          await exportFile(res, '结算管理模板', 'excel')
        }
      } catch (e) {
        window.console.log(1, e)
      }
    },
  },
}
</script>
