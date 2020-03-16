<!-- 1.模板 :html 结构-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- Main content -->
  <div class="app-container">

    <vxe-form :data="formData" @submit="findList">
      <vxe-form-item title="菜单名称" field="name">
        <vxe-input v-model="formData.name" placeholder="请输入名称" />
      </vxe-form-item>
      <vxe-form-item>
        <vxe-button type="submit" status="primary">查询</vxe-button>
        <vxe-button type="reset">重置</vxe-button>
      </vxe-form-item>
    </vxe-form>

    <vxe-toolbar :refresh="{query: findList}" export zoom custom>
      <template v-slot:buttons>
        <vxe-button size="mini" icon="fa fa-plus" @click="insert">新增</vxe-button>
        <vxe-button size="mini" @click="getUpdateEvent">修改</vxe-button>
        <vxe-button size="mini" @click="removeEvent">删除</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      resizable
      export-config
      tree-config
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="checkbox" width="60" />
      <vxe-table-column type="seq" width="60" />
      <vxe-table-column field="icon" title="图标" width="60">
        <template v-slot="{ row }">
          <i v-if="row.icon" :class="'fa ' + row.icon">{{ row.icon }}</i>
          <span v-else>无</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="name" title="菜单名称" tree-node />
      <vxe-table-column field="url" title="菜单路径" />
      <vxe-table-column field="component" title="组件" />
      <vxe-table-column field="type" title="菜单类型" />
      <vxe-table-column field="orderCode" title="排序码" />
      <vxe-table-column field="createDate" title="更新时间" />
    </vxe-table>

    <vxe-modal ref="xModal" v-model="showDialog" title="编辑&保存" width="800" resize destroy-on-close>
      <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="100" @submit="submitEvent">
        <vxe-form-item title="Basic information" span="24" title-align="left" title-width="200px" :title-prefix="{icon: 'fa fa-address-card-o'}" />
        <vxe-form-item title="Name" field="name" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}" />
        <vxe-form-item title="Nickname" field="nickname" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入昵称'}}" />
        <vxe-form-item title="Role" field="role" span="12" :item-render="{name: 'input', attrs: {placeholder: '请输入角色'}}" />
        <vxe-form-item title="Sex" field="sex" span="12" :item-render="{name: '$select', options: sexList}" />
        <vxe-form-item title="Age" field="age" span="12" :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入年龄'}}" />
        <vxe-form-item title="Other information" span="24" title-align="left" title-width="200px" :title-prefix="{message: '请填写必填项', icon: 'fa fa-info-circle'}" />
        <vxe-form-item title="Number" field="num" span="12" :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入数值'}}" />
        <vxe-form-item title="Date" field="date3" span="12" :item-render="{name: 'input', attrs: {type: 'date', placeholder: '请选择日期'}}" />
        <vxe-form-item title="Address" field="address" span="24" :title-suffix="{message: '啦啦啦，就是这么强大！！！', icon: 'fa fa-question-circle'}" :item-render="{name: 'textarea', attrs: {placeholder: '请输入地址'}}" />
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">保存</vxe-button>
          <vxe-button type="reset">重置</vxe-button>
          <vxe-button @click="$refs.xModal.close()">取消</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
    <!-- /.content -->
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
import XEUtils from 'xe-utils'

export default {
  name: 'Menu',
  data() {
    return {
      msg: null,
      loading: false,
      formData: {
        name: ''
      },
      tableData: [],
      showDialog: false
    }
  },
  mounted() {
    this.msg = '123'
  },
  created() {
    this.findList()
  },
  methods: {
    guide() {
      console.log('1111')
    },
    findList(param) {
      this.loading = true
      const filters = [{
        property: 'name',
        operator: 'like',
        value: this.formData.name
      }]
      return this.$api.menu.getMenuList({
        pageNo: 1,
        pageSize: 1000,
        queryFilters: filters
      }).then((response) => {
        this.loading = false
        this.tableData = XEUtils.toArrayTree(response.data, { key: 'id', parentKey: 'parentId', children: 'children' })
      }).catch(error => {
        console.log('error', error)
      })
    },
    insert() {
      this.showDialog = true
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.findList()
    }
  }
}
</script>

<!-- 3.样式:解决样式     -->
<style scoped>

</style>

