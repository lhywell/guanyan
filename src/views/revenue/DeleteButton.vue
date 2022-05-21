<!-- 删除 -->
<template>
  <div style="display: inline-block; margin-right: 10px">
    <el-button type="danger" v-permission="['admin', 'platformer']"> 删除 </el-button>
    <!-- 删除 -->
    <el-dialog
      title="请确认"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
    >
      确定删除所选记录吗，删除后将无法恢复？
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="danger" @click="deleteRow">确认删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import permission from '@/common/directive/permission' // 权限判断指令

import { deleteCustomer } from '@/api/crm/index.js'

export default {
  name: 'query_delete',
  directives: { permission },
  data() {
    return {
      dialogVisible: false,
    }
  },
  methods: {
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
        this.$emit('on-delete')
        this.dialogVisible = false
      } catch (error) {
        window.console.log(error)
      }
    },
  },
}
</script>
