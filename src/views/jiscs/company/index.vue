<!-- 1.模板 :html 结构-->
<template>
  <!-- Main content -->
  <div class="app-container">
    <vxe-grid
      height="100%"
      :loading="loading"
      :form-config="tableForm"
      :toolbar="tableToolbar"
      :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
      :pager-config="tablePage"
      :columns="tableColumn"
      :proxy-config="tableProxy"
      :checkbox-config="{reserve: true, highlight: true, range: true}"
      @form-submit="findList"
      @page-change="handlePageChange"
    />
    <!-- /.content -->
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
export default {
  name: 'Menu',
  data() {
    return {
      msg: null,
      loading: false,
      tableForm: {
        titleWidth: 100,
        titleAlign: 'right',
        items: [
          { field: 'companyName', title: '公司名称', span: 6, titlePrefix: { message: 'app.body.valid.rName', icon: 'fa fa-exclamation-circle' }, itemRender: { name: '$input', props: { placeholder: '请输入名称' }}},
          { field: 'role', title: '角色', span: 6, itemRender: { name: '$input', props: { placeholder: '请输入角色' }}},
          { field: 'nickname', title: '昵称', span: 6, itemRender: { name: '$input', props: { placeholder: '请输入昵称' }}},
          { field: 'sex', title: '性别', span: 6, folding: true, titleSuffix: { message: '注意，必填信息！', icon: 'fa fa-info-circle' }, itemRender: { name: '$select', options: [] }},
          { field: 'age', title: '年龄', span: 6, folding: true, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入年龄' }}},
          { span: 24, align: 'right', collapseNode: true, itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: 'app.body.label.search', status: 'primary' }}, { props: { type: 'reset', content: 'app.body.label.reset' }}] }}
        ]
      },
      tableToolbar: {
        buttons: [
          { code: 'insert_actived', name: '新增', icon: 'fa fa-plus' },
          { code: 'mark_cancel', name: '删除/取消', icon: 'fa fa-trash-o' },
          { code: 'save', name: 'app.body.label.save', icon: 'fa fa-save' }
        ],
        refresh: true,
        export: true,
        zoom: true,
        resizable: true,
        custom: true
      },
      tableColumn: null,
      tableProxy: {
        // 配置响应的数据属性
        props: {
          result: 'content',
          total: 'totalCount'
        },
        form: true, // 启用表单代理
        ajax: {
          // page 对象： { pageSize, currentPage }
          query: ({ page, sort, filters, form }) => this.findList({ page, sort, filters, form }),
          // body 对象： { removeRecords }
          delete: ({ body }) => this.findList(body),
          // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
          save: ({ body }) => this.findList(body)
        }
      },
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        align: 'right',
        pageSizes: [10, 20, 50, 100, 200, 500],
        layouts: ['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total'],
        perfect: true
      }
    }
  },
  mounted() {
    this.msg = '123'
  },
  created() {

  },
  methods: {
    guide() {
      console.log('1111')
    },
    findList(param) {
      this.loading = true
      const filters = []
      for (const field in param.form) {
        if (param.form[field]) {
          const filter = {
            property: field,
            operator: 'like',
            value: param.form[field]
          }
          if (field.endsWith('From')) {
            filter.property = field.substr(0, field.indexOf('From'))
            filter.operator = 'greaterThanOrEqualTo'
            filter.value = this.dateFmt(param.form[field])
          } else if (field.endsWith('To')) {
            filter.property = field.substr(0, field.indexOf('To'))
            filter.operator = 'lessThanOrEqualTo'
            filter.value = this.dateFmt(param.form[field], 1)
          }
          filters.push(filter)
        }
      }
      return this.$api.company.companyList({
        pageNo: param.page.currentPage,
        pageSize: param.page.pageSize,
        queryFilters: filters
      }).then((response) => {
        this.loading = false
        this.tableColumn = [{ type: 'checkbox', width: 50 }, { type: 'seq', width: 60 }].concat(response.data.extras.displayColumns)
        return response.data
      }).catch(error => {
        console.log('error', error)
      })
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

