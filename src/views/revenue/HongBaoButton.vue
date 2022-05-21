<!-- 给红包 -->
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-button type="primary" plain v-permission="['admin', 'platformer']"> 给红包 </el-button>
    <!-- 给红包 -->
    <el-dialog
      title="给红包"
      :visible.sync="dialogPriceVisible"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="priceForm" :model="priceForm" class="search-form" label-width="120px">
        <el-form-item
          label="成交日期"
          prop="dealDate"
          required
          :rules="[{ required: true, message: '请输入成交日期', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="priceForm.dealDate"
            placeholder="请选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item
          label="支付方式"
          prop="pay"
          required
          :rules="[{ required: true, message: '请输入支付方式', trigger: 'blur' }]"
        >
          <el-select v-model="priceForm.pay" placeholder="请选择">
            <el-option
              v-for="(item, index) in payOptions"
              :key="index"
              :label="item.label"
              :value="item.value + '_' + item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="金额"
          prop="price"
          required
          :rules="[{ required: true, message: '请输入数字', trigger: 'blur' }]"
        >
          <el-input-number size="medium" v-model="priceForm.price" :step="1" />
          <div style="margin-left: -43px; color: #fe6e6d">
            注意：提交后会新增一条记录，确认无误后请点击提交
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPriceVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm('priceForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import dayjs from 'dayjs'

import permission from '@/common/directive/permission' // 权限判断指令

import { addCustomer } from '@/api/crm/index.js'

const today = dayjs().format('YYYY-MM-DD')

export default {
  directives: { permission },
  props: {
    productOneOptions: [],
    productTwoOptions: [],
  },
  data() {
    return {
      priceForm: {
        dealDate: today,
        type: 1,
        productOne: '',
        productTwo: [
          {
            value: '',
          },
        ],
        pay: '',
        price: 0,
      },
      dialogPriceVisible: false,
    }
  },
  mounted() {},
  methods: {
    addProducts() {
      this.priceForm.productTwo.push({
        value: '',
        key: Date.now(),
      })
    },
    deleteProduct(item) {
      const index = this.priceForm.productTwo.indexOf(item)
      if (this.priceForm.productTwo.length > 1 && index !== -1) {
        this.priceForm.productTwo.splice(index, 1)
      }
    },
    handleOpen(row) {
      this.currentPrice = row
      this.priceForm.type = row.type
      this.dialogPriceVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.priceForm.price < 0) {
            this.$message.error('红包不能为负数')
            return false
          }

          const newObj = _.cloneDeep(this.currentPrice)
          delete newObj.dealDate
          delete newObj.payId
          delete newObj.payMode
          delete newObj.price
          delete newObj.product
          delete newObj.productId
          delete newObj._id

          newObj.dealDate = this.priceForm.dealDate
          newObj.price = this.priceForm.price
          newObj.pay = this.priceForm.pay
          newObj.sale = `${newObj.saleId}_${newObj.saleName}`
          newObj.productOne = this.priceForm.productOne
          newObj.productTwo = this.priceForm.productTwo
          delete newObj.saleId
          delete newObj.saleName
          newObj.priceAdjustment = false
          newObj.hongbao = true
          window.console.log(1, newObj)
          await addCustomer(newObj)
          this.$message.success('提交成功')

          this.$emit('on-price')
          this.dialogPriceVisible = false
          return true
        }
        window.console.log('error submit!!', this.priceForm)
        return false
      })
    },
  },
}
</script>
