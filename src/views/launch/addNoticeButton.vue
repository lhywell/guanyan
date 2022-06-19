<!-- 编辑 -->
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-button type="primary" plain v-permission="['admin', 'platformer', 'launcher']">
      添加备注
    </el-button>
    <!-- 编辑 -->
    <el-dialog
      title="添加备注"
      :visible.sync="dialogEditVisible"
      width="30%"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="editForm" :model="editForm" class="search-form" label-width="120px">
        <el-form-item label="备注">
          <el-input v-model="editForm.text" placeholder="请输入" clearable style="width: 200px" />
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
import permission from '@/common/directive/permission' // 权限判断指令

import { updateNotice } from '@/api/crm/index.js'

export default {
  name: 'query_edit',
  directives: { permission },
  data() {
    return {
      editForm: {
        text: '',
      },
      dialogEditVisible: false,
    }
  },
  methods: {
    handleEdit(row) {
      this.currentRow = row
      const { notice } = row

      this.editForm = {
        text: notice,
      }
      this.dialogEditVisible = true
    },
    async submitEditForm() {
      this.editForm.id = this.currentRow._id
      await updateNotice(this.editForm)

      this.$emit('on-edit')
      this.dialogEditVisible = false
    },
  },
}
</script>
