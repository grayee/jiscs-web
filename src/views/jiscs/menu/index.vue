<!-- 1.模板 :html 结构-->
<template>
  <div class="app-container">
    <vxe-grid
      ref="xGrid"
      border
      resizable
      tree-config
      :form-config="tableForm"
      :toolbar="tableToolbar"
      :proxy-config="tableProxy"
      :columns="tableColumn"
      @toolbar-button-click="toolbarButtonClickEvent"
    >>
    </vxe-grid>

    <vxe-modal ref="xModal" v-model="showDialog" :title="dialogTitle" width="800" resize destroy-on-close>
      <vxe-form
        :data="formData"
        :rules="formRules"
        title-align="right"
        title-width="100"
        size="mini"
        @submit="submitEvent"
      >
        <vxe-form-item
          title="上级菜单"
          field="name"
          span="12"
          :item-render="{name: 'input', attrs: {placeholder: '请输入名称'}}"
        />
        <vxe-form-item title="菜单类型" field="nickname" span="12">
          <vxe-radio-group v-model="formData.nickname">
            <vxe-radio label="1">目录</vxe-radio>
            <vxe-radio label="0">菜单</vxe-radio>
            <vxe-radio label="0">按钮</vxe-radio>
          </vxe-radio-group>
        </vxe-form-item>
        <vxe-form-item
          title="菜单名称"
          field="role"
          span="12"
          :item-render="{name: 'input', attrs: {placeholder: '请输入角色'}}"
        />
        <vxe-form-item title="菜单图标" field="sex" span="12" :item-render="{name: '$select', options: sexList}" />
        <vxe-form-item
          title="菜单路径"
          field="age"
          span="12"
          :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入年龄'}}"
        />
        <vxe-form-item
          title="组件路径"
          field="num"
          span="12"
          :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入数值'}}"
        />
        <vxe-form-item
          title="排序编码"
          field="date3"
          span="12"
          :item-render="{name: 'input', attrs: {type: 'date', placeholder: '请选择日期'}}"
        />
        <vxe-form-item
          title="权限编码"
          field="address"
          span="12"
          :title-suffix="{message: '啦啦啦，就是这么强大！！！', icon: 'fa fa-question-circle'}"
          :item-render="{name: 'textarea', attrs: {placeholder: '请输入地址'}}"
        />
        <vxe-form-item
          title="备注信息"
          field="date3"
          span="12"
          :item-render="{name: 'input', attrs: {type: 'date', placeholder: '请选择日期'}}"
        />
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">保存</vxe-button>
          <vxe-button type="reset">重置</vxe-button>
          <vxe-button @click="$refs.xModal.close()">取消</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </vxe-modal>
  </div>
</template>
<!-- 2.行为 :处理逻辑-->
<script>
import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      loading: false,
      tableProxy: {
        form: true, // 启用表单代理
        ajax: {
          // 处理树结构转换
          query: () => this.findList(),
          delete: ({ body }) => this.findList(),
          save: ({ body }) => this.findList()
        }
      },
      tableToolbar: {
        buttons: [
          { code: 'add', name: '新增', icon: 'fa fa-plus' },
          { code: 'edit', name: '修改', icon: 'fa fa-edit' },
          { code: 'mark_cancel', name: '删除', icon: 'fa fa-trash-o' },
          { code: 'save', name: '保存', icon: 'fa fa-save' }
        ],
        refresh: true,
        export: true,
        zoom: true,
        resizable: true,
        custom: true
      },
      tableColumn: [
        { type: 'checkbox', width: 50 }, { type: 'seq', width: 60 },
        { field: 'name', title: '菜单名称', treeNode: true },
        { field: 'url', title: '菜单路径' },
        { field: 'component', title: '组件' },
        { field: 'type', title: '菜单类型' },
        { field: 'orderCode', title: '排序码' },
        { field: 'authCode', title: '权限编码' },
        { field: 'modifyDate', title: '更新时间', formatter: this.formatterDate }
      ],
      tableForm: {
        titleWidth: 100,
        titleAlign: 'right',
        items: [
          {
            field: 'name',
            title: '菜单名称',
            span: 6,
            titlePrefix: { message: 'app.body.valid.rName', icon: 'fa fa-exclamation-circle' },
            itemRender: { name: '$input', props: { placeholder: '请输入名称' }}
          },
          {
            span: 10,
            align: 'right',
            collapseNode: false,
            itemRender: {
              name: '$buttons',
              children: [
                { props: { type: 'submit', content: 'app.body.label.search', status: 'primary' }},
                { props: { type: 'reset', content: 'app.body.label.reset' }}]
            }
          }
        ]
      },
      showDialog: false,
      dialogTitle: '',
      formData: {
        name: '',
        nickname: '',
        sex: '',
        age: 30,
        status: '1',
        region: null,
        weight: null,
        date: null,
        single: '1'
      },
      formRules: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ]
      }
    }
  },
  mounted() {
  },
  methods: {
    findList(param) {
      this.loading = true
      const filters = []
      return this.$api.menu.getMenuList({
        pageNo: 1,
        pageSize: 1000,
        queryFilters: filters
      }).then((response) => {
        this.loading = false
        this.tableData = XEUtils.toArrayTree(response.data.content,
          { key: 'id', parentKey: 'parentId', children: 'children' })
        return this.tableData
      }).catch(error => {
        console.log('error', error)
      })
    },
    toolbarButtonClickEvent({ code }, event) {
      switch (code) {
        case 'add':
          // this.$XModal.alert(code)
          this.showDialog = true
          this.dialogTitle = '新增'
          break
        case 'edit':
          const xGrid = this.$refs.xGrid
          const removeRecords = xGrid.getCheckboxRecords()
          if (removeRecords.length > 0) {
            this.showDialog = true
            this.dialogTitle = '编辑'
          } else {
            this.$XModal.message({ message: '请至少选择一条记录', status: 'warning' })
          }
          break
      }
    },
    submitEvent() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$XModal.message({ message: '保存成功', status: 'success' })
      }, 1000)
    },
    formatterDate({ cellValue }) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
    }
  }
}
</script>
<!-- 3.样式:解决样式     -->
<style scoped>

</style>
