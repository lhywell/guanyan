<!-- 账户管理 -->
<template>
  <el-main>
    <el-form :model="queryForm" inline>
      <el-row style="display: inline-block; margin-right: 20px">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-row>
      <el-form-item label="登录账户名">
        <el-input maxlength="64" v-model="queryForm.username" clearable @input="debounceFilter" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleFilter">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        v-if="height"
        ref="tableList"
        v-loading="listLoading"
        :data="list"
        :element-loading-text="elementLoadingText"
        :height="height"
      >
        <el-table-column type="index" label="序号" width="55">
          <template slot-scope="scope">
            <span v-text="getIndex(scope.$index, queryForm.page.current, queryForm.page.size)" />
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="username">
          <template #default="{ row }">
            <div>
              <el-input maxlength="64" v-if="row.isAdd" v-model="row.username" />
              <span v-else>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="真实姓名" prop="realName">
          <template #default="{ row }">
            <div>
              <el-input maxlength="64" v-if="row.isAdd || row.isEdit" v-model="row.realName" />
              <span v-else>{{ row.realName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="150">
          <template #default="{ row }">
            <div>
              <el-input maxlength="64" v-if="row.isAdd || row.isEdit" v-model="row.phone" />
              <span v-else>{{ row.phone }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="密码" prop="password">
          <template #default="{ row }">
            <div>
              <el-input maxlength="64" v-if="row.isAdd || row.isEdit" v-model="row.password" />
              <span v-else>{{ row.password }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属角色" prop="roleName">
          <template #default="{ row }">
            <div>
              <el-select
                v-model="row.roleName"
                @change="changeSelect($event, row)"
                placeholder="请选择"
                v-if="row.isAdd || row.isEdit"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleDesc"
                  :value="item.roleDesc"
                />
              </el-select>
              <span v-else>{{ row.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属售电公司" prop="companyName">
          <template #default="{ row }">
            <div>
              <el-select
                v-model="row.companyName"
                @change="changeCompany($event, row)"
                placeholder="请选择"
                v-if="row.isAdd || row.isEdit"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyName"
                />
              </el-select>
              <span v-else>{{ row.companyName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ $index, row }">
            <div>
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
                修改
              </el-button>
              <el-button
                v-show="!row.isEdit || row.isAdd"
                type="danger"
                plain
                @click="handleDel(row, $index)"
              >
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        ref="paging"
        :background="background"
        :current-page="queryForm.page.current"
        :layout="layout"
        :page-size="queryForm.page.size"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-row>
  </el-main>
</template>
<script>
import _ from 'lodash'
import {
  getUserlist,
  getRoleList,
  usersDelete,
  userAdd,
  userUpdate,
} from '@/api/usermanage/index.js'
import { getCompany } from '@/api/crm/index.js'
// import { list as sellerList, sellerTypeList } from '@/api/seller'
// import { height } from '@/mixins/height'
import getUsers from './userRoles'

import heightMix from '@/mixins/height'
import { areaAll } from '@/common/area.js'

export default {
  mixins: [heightMix],
  data() {
    return {
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      background: true,
      userTypes: getUsers(),
      listLoading: false,
      elementLoadingText: '正在加载...',
      queryForm: { username: '', page: { current: 1, size: 20 } },
      list: [],
      roleOptions: [],
      companyOptions: [],
      cityOptions: areaAll,
    }
  },
  created() {
    this.handleQuery()
    this.handleRoleList()
    this.handleCompanyList()
  },
  mounted() {
    this.initHeight()
  },
  methods: {
    debounceFilter: _.debounce(function XXX() {
      this.handleFilter()
    }, 500),
    async handleRoleList() {
      const res = await getRoleList()
      this.roleOptions = res.data
    },
    async handleCompanyList() {
      const { data } = await getCompany({
        page: {
          current: 1,
          size: 10000,
        },
      })
      this.companyOptions = data.records
    },
    handleRoleChange(val, row) {
      if (+val > 2) {
        this.sellerList(row)
      }
      const isPlugUser = [5, 6, 8, 9, 11].includes(+val)
      const isPlug = isPlugUser ? 1 : 0
      this.$set(row, 'isPlug', isPlug)
    },
    handleFilter() {
      this.queryForm.page.current = 1
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryForm.page.size = val
      this.handleQuery()
    },
    handleCurrentChange(val) {
      this.queryForm.page.current = val
      this.handleQuery()
    },
    async handleQuery() {
      const params = { ...this.queryForm }

      const { data } = await getUserlist(params)
      const list = data.records
      this.total = data.total
      this.list = list
      this.baklist = this.list.slice()
    },
    async handleDel(row, index) {
      const name = row.userAccount || ''
      let res = await this.$confirm(`确认删除 ${name} ?`, '提示', {})
      if (res) {
        if (row.isAdd) {
          this.list.splice(index, 1)
          return
        }
        res = await usersDelete({ id: row.id })
        if (res.data) {
          this.$message.success('成功', 'success')
        }
        this.list.splice(index, 1)

        this.handleQuery()
      }
    },
    handleEdit(row, index) {
      const listNew = this.list.slice()
      listNew[index].isEdit = true

      this.list = listNew
    },
    changeSelect(e, row) {
      row.roleId = this.roleOptions.filter(d => d.roleDesc === e)[0].id
    },
    changeCompany(e, row) {
      row.companyId = this.companyOptions.filter(d => d.companyName === e)[0].id
    },
    async handleSave(row) {
      const { id, username, password, companyId, realName, roleId, phone } = row

      const phonereg = /^1\d{10}/
      if (!phonereg.test(phone)) {
        this.$message.warning('请输入正确手机号!')
        return
      }
      const validtypes = ['username:用户名', 'realName:真实姓名']

      for (let i = 0, len = validtypes.length; i < len; i++) {
        const curType = validtypes[i]
        const [key, name] = curType.split(':')
        if (!row[key]) {
          this.$message.warning(`请输入${name}`)
          return
        }
      }

      const params = {
        username,
        password,
        companyId,
        realName,
        roleId,
        phone,
      }
      if (row.isAdd && !id) {
        await userAdd(params)
        // window.console.log(params, 222)
        row.isAdd = false
        this.handleQuery()
        this.$message.success('添加成功')
      }
      if (row.isEdit && id) {
        // window.console.log(params, 222)
        await userUpdate({
          id,
          ...params,
        })
        row.isEdit = false

        this.handleQuery()

        this.$message.success('修改成功')
      }
    },
    cancelAdd() {
      this.handleQuery()
    },
    handleAdd() {
      if (this.list[0]?.isAdd) {
        return
      }
      this.list.unshift({
        name: '',
        isAdd: true,
        isEdit: false,
        code: '',
        province: '山西省',
        sellerName: '',
        pluginId: '',
        phone: '',
      })
    },
  },
}
</script>
