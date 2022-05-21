<!-- 录入内容 -->
<template>
  <el-main style="background: #fff">
    <!-- <div style="text-align: right">注意：上传文件只支持视频格式mp4,avi,flv,ogg,wmv,rmvb,mov</div> -->
    <el-form ref="queryForm" :model="queryForm" class="search-form" label-width="120px">
      <el-form-item
        label="加粉日期"
        prop="newDate"
        required
        :rules="[{ required: true, message: '请输入加粉日期', trigger: 'blur' }]"
      >
        <el-date-picker
          v-model="queryForm.newDate"
          placeholder="请选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          :clearable="false"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="成交日期"
        prop="dealDate"
        required
        :rules="[{ required: true, message: '请输入成交日期', trigger: 'blur' }]"
      >
        <el-date-picker
          v-model="queryForm.dealDate"
          placeholder="请选择日期"
          type="date"
          value-format="yyyy-MM-dd"
          :clearable="false"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="咨询师"
        prop="sale"
        required
        :rules="[{ required: true, message: '请输入咨询师', trigger: 'blur' }]"
      >
        <el-select v-model="queryForm.sale" placeholder="请选择">
          <el-option
            v-for="(item, index) in salesOptions"
            :key="index"
            :label="item.name"
            :value="item.id + '_' + item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="成交手机">
        <el-input
          v-model="queryForm.dealPhone"
          placeholder="请输入"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item
        label="转化类型"
        prop="type"
        required
        :rules="[{ required: true, message: '请输入转化类型', trigger: 'blur' }]"
      >
        <el-select v-model="queryForm.type" placeholder="请选择" @change="typeChange">
          <el-option
            v-for="(item, index) in typeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="成交产品"
        prop="productOne"
        v-if="queryForm.type === 1"
        required
        :rules="[{ required: true, message: '请输入成交产品', trigger: 'blur' }]"
      >
        <el-select v-model="queryForm.productOne" placeholder="请选择">
          <el-option
            v-for="(item, index) in productOneOptions"
            :key="index"
            :label="item.name"
            :value="item.id + '_' + item.name"
          />
        </el-select>
      </el-form-item>
      <template v-if="queryForm.type === 2">
        <el-form-item
          v-for="(x, index) in queryForm.productTwo"
          :label="'成交产品' + index"
          :key="x.key + index"
          :prop="'productTwo.' + index + '.value'"
          :rules="[{ required: true, message: '请输入成交产品', trigger: 'blur' }]"
          required
        >
          <div>
            <el-select v-model="x.value" placeholder="请选择">
              <el-option
                v-for="(item, y) in productTwoOptions"
                :key="y"
                :label="item.name"
                :value="item.id + '_' + item.name"
              />
            </el-select>
            <i
              class="el-icon-remove"
              color="#ff7777"
              type="minus-filled"
              style="margin-left: 10px; cursor: pointer"
              @click="deleteProduct(x)"
            />
          </div>
        </el-form-item>
        <div class="el-form-item">
          <label class="el-form-item__label" style="width: 120px; visibility: hidden">x</label>
          <el-button type="primary" class="addProductsBtn" @click="addProducts">增加</el-button>
        </div>
      </template>
      <el-form-item
        label="支付方式"
        prop="pay"
        required
        :rules="[{ required: true, message: '请输入支付方式', trigger: 'blur' }]"
      >
        <el-select v-model="queryForm.pay" placeholder="请选择">
          <el-option
            v-for="(item, index) in payOptions"
            :key="index"
            :label="item.label"
            :value="item.value + '_' + item.label"
          />
        </el-select>
      </el-form-item>
      <h1 style="margin: 30px 38px; font-size: 16px">客户信息录入</h1>
      <el-form-item label="客户微信号">
        <el-input v-model="queryForm.weixin" placeholder="请输入" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item label="客户微信名">
        <el-input
          v-model="queryForm.weixinName"
          placeholder="请输入"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input
          v-model="queryForm.realName"
          placeholder="请输入"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="性别">
        <el-select
          v-model="queryForm.sex"
          placeholder="请选择"
          :clearable="true"
          style="width: 200px"
        >
          <el-option
            v-for="(item, index) in ['男', '女']"
            :key="index"
            :label="item"
            :value="index + 1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="阳历出生日">
        <el-date-picker
          v-model="queryForm.birthdayX_year"
          type="year"
          placeholder="某"
          :clearable="true"
          style="width: 96px"
          value-format="yyyy"
        />
        <span class="demonstration">年</span>
        <el-select
          v-model="queryForm.birthdayX_month"
          placeholder="某"
          :clearable="true"
          style="width: 70px"
        >
          <el-option v-for="(item, index) in dateMonth" :key="index" :label="item" :value="item" />
        </el-select>
        <span class="demonstration">月</span>
        <el-select
          v-model="queryForm.birthdayX_day"
          placeholder="某"
          :clearable="true"
          style="width: 70px"
        >
          <el-option v-for="(item, index) in dateDay" :key="index" :label="item" :value="item" />
        </el-select>
        <span class="demonstration">日</span>
      </el-form-item>
      <el-form-item label="阴历出生日">
        <el-date-picker
          v-model="queryForm.birthdayY_year"
          type="year"
          placeholder="某"
          :clearable="true"
          style="width: 96px"
          value-format="yyyy"
        />
        <span class="demonstration">年</span>
        <el-select
          v-model="queryForm.birthdayY_month"
          placeholder="某"
          :clearable="true"
          style="width: 70px"
        >
          <el-option v-for="(item, index) in dateMonth" :key="index" :label="item" :value="item" />
        </el-select>
        <span class="demonstration">月</span>
        <el-select
          v-model="queryForm.birthdayY_day"
          placeholder="某"
          :clearable="true"
          style="width: 70px"
        >
          <el-option v-for="(item, index) in dateDay" :key="index" :label="item" :value="item" />
        </el-select>
        <span class="demonstration">日</span>
      </el-form-item>
      <el-form-item label="出生时间">
        <el-time-picker
          v-model="queryForm.birthTime"
          :picker-options="{
            selectableRange: '00:00:00 - 23:59:59',
          }"
          value-format="HH:mm:ss"
          placeholder="请选择时间"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="出生地">
        <el-cascader
          ref="cascader"
          size="large"
          :options="addressOptions"
          v-model="queryForm.birthAddressCode"
          @change="handleChange"
          :clearable="true"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input
          v-model="queryForm.customerPhone"
          placeholder="请输入"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="身份证地址">
        <el-input
          v-model="queryForm.idCardAddress"
          placeholder="请输入"
          clearable
          style="width: 480px"
        />
      </el-form-item>
      <el-form-item label="现居地">
        <el-input
          v-model="queryForm.liveAddress"
          placeholder="请输入"
          clearable
          style="width: 480px"
        />
      </el-form-item>
      <el-form-item label="邮寄地址">
        <el-input
          v-model="queryForm.mailAddress"
          placeholder="请输入"
          clearable
          style="width: 480px"
        />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="queryForm.comment" placeholder="请输入" clearable style="width: 480px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('queryForm')">录入</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import { regionData } from 'element-china-area-data'
import dayjs from 'dayjs'
import { getSaleList, addCustomer, getProductOne, getProductTwo } from '@/api/crm/index.js'

import permission from '@/common/directive/permission' // 权限判断指令
import { hasPermission } from '@/common/conf/utils'
// 权限判断方法
import heightMix from '@/mixins/height'

// console.log(height)

export default {
  directives: { permission },
  mixins: [heightMix],
  components: {},
  data() {
    return {
      addressOptions: regionData,
      queryForm: {
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
        birthdayX_year: '2000',
        birthdayY_year: '2000',
        birthTime: '',
        birthAddressCode: [],
        customerPhone: '',
        liveAddress: '',
        idCardAddress: '',
        mailAddress: '',
        comment: '',
      },
      productOneOptions: [],
      productTwoOptions: [],
      products: [
        {
          label: '产品',
          id: Date.now(),
        },
      ],
      salesOptions: [],
      dateMonth: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      dateDay: [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 31,
      ],
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

    this.getSaleList()
    this.getPtOne()
    this.getPtTwo()
  },
  methods: {
    hasPermission,
    async getSaleList() {
      const { data } = await getSaleList()
      this.salesOptions = data
    },
    async getPtOne() {
      const { data } = await getProductOne()
      this.productOneOptions = data
    },
    async getPtTwo() {
      const { data } = await getProductTwo()
      this.productTwoOptions = data
    },
    typeChange() {
      this.queryForm.productOne = ''
      this.queryForm.productTwo = [
        {
          value: '',
        },
      ]
    },
    addProducts() {
      this.queryForm.productTwo.push({
        value: '',
        key: Date.now(),
      })
    },
    deleteProduct(item) {
      const index = this.queryForm.productTwo.indexOf(item)
      if (this.queryForm.productTwo.length > 1 && index !== -1) {
        this.queryForm.productTwo.splice(index, 1)
      }
    },
    handleChange() {
      this.$nextTick(() => {
        this.queryForm.birthAddressLabel = this.$refs.cascader
          .getCheckedNodes()[0]
          .pathLabels.join('/')
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 补差价为否
          this.queryForm.priceAdjustment = false
          this.queryForm.hongbao = false
          const birthdayX = `${this.queryForm.birthdayX_year}-${this.queryForm.birthdayX_month}-${this.queryForm.birthdayX_day}`
          const birthdayXR = dayjs(birthdayX).format('YYYY-MM-DD')
          this.queryForm.birthdayX = birthdayXR === 'Invalid Date' ? '' : birthdayXR

          const birthdayY = `${this.queryForm.birthdayY_year}-${this.queryForm.birthdayY_month}-${this.queryForm.birthdayY_day}`
          const birthdayYR = dayjs(birthdayY).format('YYYY-MM-DD')
          this.queryForm.birthdayY = birthdayYR === 'Invalid Date' ? '' : birthdayYR
          delete this.queryForm.birthdayX_year
          delete this.queryForm.birthdayX_month
          delete this.queryForm.birthdayX_day
          delete this.queryForm.birthdayY_year
          delete this.queryForm.birthdayY_month
          delete this.queryForm.birthdayY_day

          await addCustomer(this.queryForm)

          this.$message.success('录入成功')
          this.resetForm()
          return true
        }
        window.console.log('error submit!!', this.queryForm)
        return false
      })
    },
    resetForm() {
      this.queryForm = {
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
        birthdayX_year: '2000',
        birthdayY_year: '2000',
        birthTime: '',
        birthAddressCode: [],
        customerPhone: '',
        liveAddress: '',
        idCardAddress: '',
        mailAddress: '',
        comment: '',
      }
    },
  },
}
</script>
<style lang="scss" scope>
.el-icon-remove {
  color: #ff7777;
}
.demonstration {
  margin: 0 6px;
}
</style>
