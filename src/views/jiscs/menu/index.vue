<!-- 1.模板 :html 结构-->
<template>
  <!-- Main content -->
  <div class="app-container">
    <vxe-table
      :data="tableData"
      :tree-config="{children: 'children'}">
      <vxe-table-column type="seq"></vxe-table-column>
      <vxe-table-column field="name" title="Name" tree-node></vxe-table-column>
      <vxe-table-column field="sex" title="Sex"></vxe-table-column>
      <vxe-table-column field="date" title="Date"></vxe-table-column>
    </vxe-table>


<!--    <vxe-grid
      border
      resizable
      tree-config
      :proxy-config="tableProxy"
      :columns="tableColumn"></vxe-grid>-->

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
      tableData:[{
        name: 'test1',
        sex: '男',
        date: '2019-08',
        children: [
          {
            name: 'test2',
            sex: '女',
            date: '2019-08',
            children: [
              {
                name: 'test3',
                sex: '男',
                date: '2019-08',
              },
              {
                name: 'test11',
                sex: '男',
                date: '2019-08',
              }
            ]
          },
          {
            name: 'test7',
            sex: '女',
            date: '2019-08',
            children: [
              {
                name: 'test9',
                sex: '男',
                date: '2019-08',
              }
            ]
          }
        ]
      },
        {
          name: 'test4',
          sex: '男',
          date: '2019-08',
          children: [
            {
              name: 'test5',
              sex: '女',
              date: '2019-08',
            },
            {
              name: 'test15',
              sex: '女',
              date: '2019-08',
            }
          ]
        }],
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
          { code: 'save', name: 'app.body.button.save', icon: 'fa fa-save' }
        ],
        refresh: true,
        export: true,
        zoom: true,
        resizable: true,
        custom: true
      },
      tableColumn: [
        { field: 'name', title: '名称' },
        { field: 'sex', title: '大小' },
        { field: 'date', title: '创建时间'}
      ],
      tableProxy: {
        form: true, // 启用表单代理
        ajax: {
          // page 对象： { pageSize, currentPage }
          query: ({ page, sort, filters, form }) => this.findList({ page, sort, filters, form })

        }
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
      return this.$api.menu.getMenuTree({
        pageNo: 1,
        pageSize: 20,
        queryFilters: filters
      }).then((response) => {
        this.loading = false
        return [{
          name: 'test1',
          sex: '男',
          date: '2019-08',
          children: [
            {
              name: 'test2',
              sex: '女',
              date: '2019-08',
              children: [
                {
                  name: 'test3',
                  sex: '男',
                  date: '2019-08',
                },
                {
                  name: 'test11',
                  sex: '男',
                  date: '2019-08',
                }
              ]
            },
            {
              name: 'test7',
              sex: '女',
              date: '2019-08',
              children: [
                {
                  name: 'test9',
                  sex: '男',
                  date: '2019-08',
                }
              ]
            }
          ]
        },
          {
            name: 'test4',
            sex: '男',
            date: '2019-08',
            children: [
              {
                name: 'test5',
                sex: '女',
                date: '2019-08',
              },
              {
                name: 'test15',
                sex: '女',
                date: '2019-08',
              }
            ]
          }]
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

