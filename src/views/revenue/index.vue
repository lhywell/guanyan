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
      <el-table-column label="备注" prop="comment" />
      <el-table-column label="补差价" prop="priceAdjustment">
        <template #default="{ row }">
          <div v-for="(item, index) in row.priceAdjustment" :key="index">
            <div>{{ item }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260" align="center">
        <template #default="{ $index, row }">
          <div>
            <el-button
              type="primary"
              plain
              @click="handlePrice(row, $index)"
              v-permission="['admin', 'platformer']"
            >
              补差价
            </el-button>
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
    <el-dialog
      title="请确认"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      确定删除所选记录吗，删除后将无法恢复？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteRow">确认删除</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog
      title="编辑"
      :visible.sync="dialogEditVisible"
      width="50%"
      :close-on-click-modal="false"
    >

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确认</el-button>
      </span>
    </el-dialog> -->
    <el-dialog
      title="补差价"
      :visible.sync="dialogPriceVisible"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form ref="priceForm" :model="priceForm" class="search-form" label-width="120px">
        <el-form-item
          label="金额"
          prop="num"
          required
          :rules="[{ required: true, message: '请输入数字', trigger: 'blur' }]"
        >
          <el-input-number size="medium" v-model="priceForm.num" :step="1" />
          <div style="margin-left: -43px; color: #fe6e6d">
            注意：提交后产品总价会重新计算，确认无误后请点击提交
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPriceVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('priceForm')">提交</el-button>
      </span>
    </el-dialog>
  </el-main>
</template>

<script>
// import dayjs from 'dayjs'
import { regionData } from 'element-china-area-data'
import {
  getSaleList,
  getCustomer,
  deleteCustomer,
  downloadExcel,
  editPrice,
} from '@/api/crm/index.js'

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
      priceForm: {
        num: 0,
      },
      editForm: {
        newDate: '',
        dealDate: '',
        sale: '',
        dealPhone: '',
        type: 1,
        productOne: '',
        productTwo: [
          {
            value: '',
          },
        ],
        pay: '',

        weixin: '',
        weixinName: '',
        realName: '',
        sex: '',
        birthdayX: '',
        birthdayY: '',
        birthTime: '',
        birthAddressCode: '',
        customerPhone: '',
        liveAddress: '',
        idCardAddress: '',
        mailAddress: '',
        comment: '',
      },
      addressOptions: regionData,
      salesOptions: [],
      listLoading: false,
      dialogVisible: false,
      dialogEditVisible: false,
      dialogPriceVisible: false,
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
    handleEdit(row) {
      this.currentRow = row
      this.editForm = row
      this.editForm.sale = `${row.saleId}_${row.saleName}`
      this.editForm.pay = `${row.payId}_${row.payMode}`
      this.editForm.birthAddressCode = row.birthAddressCode

      this.dialogEditVisible = true
    },
    handleDelete(row) {
      this.currentId = row._id
      this.dialogVisible = true
    },
    handleClose() {
      this.dialogVisible = false
    },
    async deleteRow() {
      try {
        await deleteCustomer({
          id: this.currentId,
        })

        this.$message.success('删除成功')
        this.fetchData()
        this.dialogVisible = false
      } catch (error) {
        window.console.log(error)
      }
    },
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
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.priceForm.id = this.currentId
          this.priceForm.price = this.currentPrice
          await editPrice(this.priceForm)

          this.$message.success('提交成功')

          this.fetchData()
          this.dialogPriceVisible = false
          return true
        }
        window.console.log('error submit!!', this.priceForm)
        return false
      })
    },
    handlePrice(row) {
      this.currentId = row._id
      this.currentPrice = row.price
      this.dialogPriceVisible = true
    },
  },
}
</script>
