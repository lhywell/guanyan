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
      <el-table-column label="累计金额(元)" prop="clearingEnergy">
        <template #default="{ $index, row }">
          <div>
            {{
              row.totalIncomeStatisticInfo.totalSettlementOkMoney +
              row.totalIncomeStatisticInfo.totalSettlementNoMoney
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="累计已支付金额(元)" prop="historyEnergy">
        <template #default="{ $index, row }">
          <div>
            {{ row.totalIncomeStatisticInfo.totalSettlementOkMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="累计未支付金额(元)" prop="historyEnergy">
        <template #default="{ $index, row }">
          <div>
            {{ row.totalIncomeStatisticInfo.totalSettlementNoMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="自开发用户累计电量(MWh)" prop="devUsedPower" />
      <el-table-column label="自开发用户累计金额（已支付）(元)" prop="dayAheadPrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.devIncomeStatisticInfo.totalSettlementOkMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="自开发用户累计金额（未支付）(元)" prop="realTimePrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.devIncomeStatisticInfo.totalSettlementNoMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="协作用户累计电量(MWh)" prop="cooperationUsedPower" />
      <el-table-column label="协作用户累计金额（已支付）(元)" prop="realTimePrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.cooperationIncomeStatisticInfo.totalSettlementOkMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="协作用户累计金额（未支付）(元)" prop="realTimePrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.cooperationIncomeStatisticInfo.totalSettlementNoMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="团队用户累计电量(MWh)" prop="teamUserPower" />
      <el-table-column label="团队用户累计金额（已支付）(元)" prop="realTimePrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.teamIncomeStatisticInfo.totalSettlementOkMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="团队用户累计金额（未支付）(元)" prop="realTimePrice">
        <template #default="{ $index, row }">
          <div>
            {{ row.teamIncomeStatisticInfo.totalSettlementNoMoney }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="360" align="center">
        <template #default="{ $index, row }">
          <div>
            <div>
              <el-button type="primary" plain @click="handleContractInfo('1', row)">
                自开发用户
              </el-button>
              <el-button type="primary" plain @click="handleContractInfo('2', row)">
                协作用户
              </el-button>
              <el-button type="primary" plain @click="handleContractInfo('3', row)">
                团队用户
              </el-button>
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
    <el-drawer
      title="查询"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      size="50%"
    >
      <div style="padding: 0 30px">
        <el-form class="search-form" :model="queryFormSecond" inline>
          <el-form-item label="电力用户名称">
            <el-input
              v-model="queryFormSecond.customerName"
              clearable
              placeholder="请输入电力用户名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSecond">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="tableSort"
          v-loading="drawLoading"
          :data="listDraw"
          :element-loading-text="elementLoadingText"
        >
          <el-table-column label="序号" type="index" width="90" />
          <el-table-column label="代理商名称" prop="agentName" />
          <el-table-column label="代理商级别" prop="level" v-if="agentType === '3'">
            <template #default="{ $index, row }">
              <div>
                {{ level[row.level - 1] }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="电力用户名称" prop="customerName" />
          <el-table-column label="合同开始时间" prop="startDate" />
          <el-table-column label="合同结束时间" prop="endDate" />
          <el-table-column label="累计电量(MWh)" prop="totalUsedPower" />
          <el-table-column label="累计金额(元)" prop="realTimePrice">
            <template #default="{ $index, row }">
              <div>
                {{
                  row.incomeStatisticInfo.totalSettlementNoMoney +
                  row.incomeStatisticInfo.totalSettlementOkMoney
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ $index, row }">
              <div>
                <div>
                  <el-button type="primary" plain @click="handleDetail(row)">详情</el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :background="background"
          :current-page="drawQueryForm.page.current"
          :layout="layout"
          :page-size="drawQueryForm.page.size"
          :total="drawTotal"
          @current-change="handleCurrentChangeDraw"
          @size-change="handleSizeChangeDraw"
        />
      </div>
    </el-drawer>
    <el-dialog
      title="详情"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleDgClose"
      :close-on-click-modal="false"
    >
      <!-- <el-row class="mb-20">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-row> -->
      <el-table
        ref="tableSort"
        v-loading="listLoading"
        :data="listDetail"
        :element-loading-text="elementLoadingText"
      >
        <el-table-column label="日期" prop="dateStr">
          <template #default="{ row }">
            <div>
              <span>{{ row.dateStr }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="电量(MWh)" prop="power">
          <template #default="{ row }">
            <div>
              <span>{{ row.power }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="金额(元)" prop="income">
          <template #default="{ row }">
            <div>
              <el-input v-if="row.isAdd || row.isEdit" v-model="row.income" maxlength="11" />
              <span v-else>{{ row.income }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否已支付" prop="settlement">
          <template #default="{ $index, row }">
            <div>
              <el-select
                v-if="row.isAdd || row.isEdit"
                v-model="row.settlement"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in ['是', '否']"
                  :key="index"
                  :label="item"
                  :value="item === '是' ? true : false"
                />
              </el-select>
              <span v-else>{{ row.settlement ? '是' : '否' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ $index, row }">
            <el-button v-show="row.isEdit" @click="cancelAdd($index)"> 取消 </el-button>
            <el-button
              v-show="row.isAdd || row.isEdit"
              type="primary"
              plain
              @click="handleSave(row)"
            >
              保存
            </el-button>
            <el-button
              v-show="!row.isEdit && !row.isAdd"
              type="primary"
              plain
              @click="handleEdit(row, $index)"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-main>
</template>

<script>
// import dayjs from 'dayjs'
import {
  getTeamAgentInfo,
  getContractInfoByName,
  getInfoByContract,
  action,
  downloadIncomeTemplate,
} from '@/api/balance/index.js'

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
      action,
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
      const { data } = await getTeamAgentInfo(params)
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
    agentNameChange() {
      this.queryForm.page.current = 1
    },
    conditionChange() {
      this.queryForm.page.current = 1
    },
    fileUploadError(err) {
      const msg = err.message
      if (msg) {
        this.$message.error(msg)
        this.$refs.upload.clearFiles()
      }
    },
    fileUploadSuccess(res) {
      if (res.code === 200) {
        if (res.message === 'error') {
          this.$message.error('导入失败')
        } else {
          if (res.data.length > 0) {
            this.errorLog = res.data.toString()
          }
          this.$message.success('导入成功')
          this.fetchData()
        }
      } else {
        this.$message.error(res.message || '导入失败')
      }
      this.$refs.upload.clearFiles()
    },
    async handleExport() {
      try {
        const res = await downloadIncomeTemplate()
        if (res) {
          await exportFile(res, '结算管理模板', 'excel')
        }
      } catch (e) {
        window.console.log(1, e)
      }
    },
    handleClose(done) {
      done()
      if (this.isChange) {
        this.fetchData()
      }
    },
    handleCurrentChangeDraw(val) {
      this.drawQueryForm.page.current = val
      this.searchSecond()
    },
    handleSizeChangeDraw(val) {
      this.drawQueryForm.page.size = val
      this.searchSecond()
    },
    async getSearchByName(params) {
      this.drawLoading = true
      const { data } = await getContractInfoByName(params)

      const list = data.records
      this.drawTotal = data.total
      this.listDraw = list

      this.drawLoading = false
    },
    async handleContractInfo(type, row) {
      this.agentType = type
      this.agentId = row.agentId
      this.agentName = row.agentName
      const params = {
        agentId: row.agentId,
        agentName: row.agentName,
        customerName: '',
        type,
        page: {
          current: this.drawQueryForm.page.current,
          size: this.drawQueryForm.page.size,
        },
      }

      this.getSearchByName(params)

      this.drawer = true
    },
    searchSecond() {
      const params = {
        agentId: this.agentId,
        agentName: this.agentName,
        customerName: this.queryFormSecond.customerName,
        type: this.agentType,
        page: {
          current: this.drawQueryForm.page.current,
          size: this.drawQueryForm.page.size,
        },
      }

      this.getSearchByName(params)
    },
    async handleDetail(row) {
      this.contractId = row.contractId
      const params = {
        contractId: row.contractId,
        type: this.agentType,
      }
      const { data } = await getInfoByContract(params)

      const list = data
      // this.drawTotal = data.total
      this.listDetail = list

      this.dialogVisible = true
    },
    handleDgClose() {
      this.handleContractInfo(this.agentType, {
        agentId: this.agentId,
        agentName: this.agentName,
      })
      this.dialogVisible = false
    },
    cancelAdd() {
      this.handleDetail({
        contractId: this.contractId,
        type: this.agentType,
      })
    },
    handleAdd() {
      if (this.listDetail[0]?.isAdd) {
        return
      }
      this.listDetail.unshift({
        isAdd: true,
        isEdit: false,
        dateStr: '',
        income: 0,
        power: 0,
        settlement: true,
      })
    },
    handleEdit(row, index) {
      const listNew = this.listDetail.slice()
      listNew[index].isEdit = true

      this.listDetail = listNew
    },
    changeSettlement(e, row) {
      row.settlement = e
    },
    async handleSave() {
      // const { dateStr, income, power, settlement } = row
      // const [year, month] = dateStr.split('-')
      // const params = {
      //   contractId: this.contractId,
      //   type: this.agentType,
      //   year,
      //   month,
      //   income,
      //   power,
      //   settlement,
      // }
      // await upsertIncome(params)
      // if (row.isAdd) {
      //   row.isAdd = false
      //   this.$message.success('添加成功')
      // }
      // if (row.isEdit) {
      //   row.isEdit = false
      //   this.$message.success('编辑成功')
      //   this.isChange = true
      // }
      // this.handleDetail({
      //   contractId: this.contractId,
      //   type: this.agentType,
      // })
    },
  },
}
</script>
