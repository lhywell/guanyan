<!-- 录入 -->
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-button type="primary" plain v-permission="['admin', 'platformer', 'launcher']">
      录入
    </el-button>
    <!-- 录入 -->
    <el-dialog
      title="录入"
      :visible.sync="dialogPriceVisible"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="priceForm" :model="priceForm" class="search-form" label-width="120px">
        <el-form-item
          label="加粉日期"
          prop="newDate"
          required
          :rules="[{ required: true, message: '加粉日期不能为空', trigger: 'blur' }]"
        >
          <el-date-picker
            v-model="priceForm.newDate"
            placeholder="请选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item
          label="投放了"
          required
          prop="woaType"
          :rules="[{ required: true, message: '投放公众号不能为空', trigger: 'blur' }]"
        >
          <el-select v-model="priceForm.woaType" placeholder="请选择" @change="typeChange">
            <el-option
              v-for="(item, index) in typeOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="公众号"
          required
          prop="woa"
          :rules="[{ required: true, message: '公众号名称不能为空', trigger: 'blur' }]"
        >
          <!-- Wechat Official Accounts -->
          <el-input v-model="priceForm.woa" required placeholder="请输入公众号名称" clearable />
        </el-form-item>
        <template v-if="priceForm.woaType === '2'">
          <el-form-item
            v-for="(x, index) in priceForm.phoneMulti"
            :label="'成交手机' + index"
            :key="x.key + index"
            :prop="'phoneMulti.' + index + '.value'"
            :rules="[{ required: true, message: '成交手机不能为空', trigger: ['blur', 'change'] }]"
            required
          >
            <el-input
              v-model="x.value"
              placeholder="请输入成交手机"
              clearable
              style="width: 210px; display: inline-block"
            />
            <i
              class="el-icon-remove"
              color="#ff7777"
              type="minus-filled"
              style="margin-left: 10px; cursor: pointer"
              @click="deleteProduct(x)"
            />
          </el-form-item>
          <div class="el-form-item">
            <label class="el-form-item__label" style="width: 120px; visibility: hidden">x</label>
            <el-button type="primary" class="addProductsBtn" @click="addProducts">增加</el-button>
          </div>
        </template>
        <el-form-item
          label="广告费"
          required
          prop="adPrice"
          :rules="[
            { required: true, message: '广告费不能为空', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' },
          ]"
        >
          <el-input-number size="medium" v-model="priceForm.adPrice" :min="0" :step="1" />
        </el-form-item>
        <el-form-item
          label="实际添加数"
          required
          prop="newCustomerNumber"
          :rules="[
            { required: true, message: '实际添加数不能为空', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' },
          ]"
        >
          <el-input-number size="medium" v-model="priceForm.newCustomerNumber" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="备注" prop="notice">
          <el-input v-model="priceForm.notice" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('priceForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import dayjs from 'dayjs'

import permission from '@/common/directive/permission' // 权限判断指令

import { addFans } from '@/api/crm/index.js'

const today = dayjs().format('YYYY-MM-DD')

export default {
  directives: { permission },
  props: {},
  data() {
    return {
      priceForm: {
        newDate: today,
        woaType: '',
        woa: '',
        dealPhone: '',
        phoneMulti: [
          {
            value: '',
            key: Date.now(),
          },
        ],
        adPrice: 0,
        newCustomerNumber: 0,
        notice: '',
      },
      typeOption: [
        {
          label: '一个公众号',
          value: '1',
        },
        {
          label: '多个公众号',
          value: '2',
        },
      ],
      dialogPriceVisible: false,
      validatePass: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请输入大于0数值'))
        } else {
          callback()
        }
      },
    }
  },
  mounted() {},
  methods: {
    handleOpen() {
      this.dialogPriceVisible = true
    },
    typeChange() {
      this.priceForm.dealPhone = ''
    },
    addProducts() {
      this.priceForm.phoneMulti.push({
        value: '',
        key: Date.now(),
      })
    },
    deleteProduct(item) {
      const index = this.priceForm.phoneMulti.indexOf(item)
      if (this.priceForm.phoneMulti.length > 1 && index !== -1) {
        this.priceForm.phoneMulti.splice(index, 1)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.priceForm.dealPhone = this.priceForm.phoneMulti.map(d => d.value).toString()
          delete this.priceForm.phoneMulti
          const obj = _.cloneDeep(this.priceForm)

          await addFans(obj)
          this.$message.success('提交成功')

          this.$emit('on-success')
          this.dialogPriceVisible = false
          this.reset()
          return true
        }
        window.console.log('error submit!!', this.priceForm)
        return false
      })
    },
    reset() {
      this.priceForm = {
        newDate: today,
        woaType: '',
        woa: '',
        dealPhone: '',
        adPrice: 0,
        newCustomerNumber: 0,
        notice: '',
      }
    },
    cancel() {
      this.reset()
      this.dialogPriceVisible = false
    },
  },
}
</script>
