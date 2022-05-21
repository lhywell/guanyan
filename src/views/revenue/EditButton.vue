<!-- 编辑 -->
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-button type="primary" v-permission="['admin', 'platformer']"> 编辑 </el-button>
    <!-- 编辑 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogEditVisible"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="editForm" :model="editForm" class="search-form" label-width="120px">
        <el-form-item label="客户微信号">
          <el-input v-model="editForm.weixin" placeholder="请输入" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item label="客户微信名">
          <el-input
            v-model="editForm.weixinName"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input
            v-model="editForm.realName"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="editForm.sex"
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
            v-model="editForm.birthdayX"
            placeholder="请选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="true"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="阴历出生日">
          <el-date-picker
            v-model="editForm.birthdayY"
            placeholder="请选择日期"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="true"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="出生时间">
          <el-time-picker
            v-model="editForm.birthTime"
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
            v-model="editForm.birthAddressCode"
            @change="handleChange"
            :clearable="true"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input
            v-model="editForm.customerPhone"
            placeholder="请输入"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="身份证地址">
          <el-input
            v-model="editForm.idCardAddress"
            placeholder="请输入"
            clearable
            style="width: 480px"
          />
        </el-form-item>
        <el-form-item label="现居地">
          <el-input
            v-model="editForm.liveAddress"
            placeholder="请输入"
            clearable
            style="width: 480px"
          />
        </el-form-item>
        <el-form-item label="邮寄地址">
          <el-input
            v-model="editForm.mailAddress"
            placeholder="请输入"
            clearable
            style="width: 480px"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editForm.comment"
            placeholder="请输入"
            clearable
            style="width: 480px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEditForm('editForm')">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { regionData } from 'element-china-area-data'
import permission from '@/common/directive/permission' // 权限判断指令

import { editCustomer } from '@/api/crm/index.js'

export default {
  name: 'query_edit',
  directives: { permission },
  data() {
    return {
      addressOptions: regionData,
      editForm: {
        weixin: '',
        weixinName: '',
        realName: '',
        sex: '',
        birthdayX: '',
        birthdayY: '',
        birthTime: '',
        birthAddressCode: [],
        customerPhone: '',
        liveAddress: '',
        idCardAddress: '',
        mailAddress: '',
        comment: '',
      },
      dialogEditVisible: false,
    }
  },
  methods: {
    handleEdit(row) {
      this.currentRow = row
      const {
        weixin,
        weixinName,
        realName,
        sex,
        birthdayX,
        birthdayY,
        birthTime,
        birthAddressCode,
        customerPhone,
        liveAddress,
        idCardAddress,
        mailAddress,
        comment,
      } = row

      this.editForm = {
        weixin,
        weixinName,
        realName,
        sex,
        birthdayX,
        birthdayY,
        birthTime,
        birthAddressCode,
        customerPhone,
        liveAddress,
        idCardAddress,
        mailAddress,
        comment,
      }
      this.dialogEditVisible = true
    },
    handleChange() {
      this.$nextTick(() => {
        if (this.$refs.cascader.getCheckedNodes().length === 0) {
          this.editForm.birthAddressLabel = ''
        } else {
          this.editForm.birthAddressLabel = this.$refs.cascader
            .getCheckedNodes()[0]
            ?.pathLabels.join('/')
        }
      })
    },
    submitEditForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.editForm.id = this.currentRow._id
          await editCustomer(this.editForm)

          this.$emit('on-edit')
          this.dialogEditVisible = false
          return true
        }
        window.console.log('error submit!!', this.priceForm)
        return false
      })
    },
  },
}
</script>
