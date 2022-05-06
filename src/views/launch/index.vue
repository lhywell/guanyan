<!-- 投放管理 -->
<template>
  <el-main style="background: #fff">
    <el-form class="search-form" :model="queryForm" inline>
      <el-form-item label="加粉日期">
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
      <el-table-column label="操作" width="360" align="center">
        <template #default="{ $index, row }">
          <div>
            <div>
              <el-button type="primary" plain @click="handleEdit('1', row)"> 编辑 </el-button>
              <el-button type="primary" plain @click="handleDel('2', row)"> 删除 </el-button>
            </div>
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
      pickerOptions: {
        shortcuts: [
          {
            text: '本周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              // console.log(start.getDay(), start.getDate(), 'start')
              const thisDay = start.getDay() - 1
              const thisDate = start.getDate()
              if (thisDay !== 0) {
                start.setDate(thisDate - thisDay)
              }
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '上周',
            onClick(picker) {
              const oDate = new Date()
              oDate.setTime(oDate.getTime() - 3600 * 1000 * 24 * 7)

              const day = oDate.getDay() - 1

              const start = new Date()
              const end = new Date()
              if (day === 0) {
                start.setDate(oDate.getDate())
                end.setDate(oDate.getDate() + 6)
              } else {
                start.setTime(oDate.getTime() - 3600 * 1000 * 24 * day)
                end.setTime(oDate.getTime() + 3600 * 1000 * 24 * (6 - day))
              }
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '本月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setDate(1)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '上月',
            onClick(picker) {
              const oDate = new Date()
              let year = oDate.getFullYear()
              const month = oDate.getMonth()
              let start
              let end
              if (month === 0) {
                year--
                start = new Date(year, 11, 1)
                end = new Date(year, 11, 31)
              } else {
                start = new Date(year, month - 1, 1)
                end = new Date(year, month, 0)
              }

              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '今年至今',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().getFullYear(), 0)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近六个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setMonth(start.getMonth() - 6)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      listClear: [],
      listLoading: false,
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      elementLoadingText: '正在加载...',
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
      typeOptions: [
        {
          label: '一转',
          value: 1,
        },
        {
          label: '二转',
          value: 2,
        },
      ],
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
