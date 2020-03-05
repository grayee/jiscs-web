<!-- 1.模板 :html 结构-->
<template>
  <!-- Main content -->
  <div class="app-container">
    <div style="margin:0 0 0px 0px">

      <vxe-grid
        height="530"
        :loading="loading"
        :form-config="tableForm"
        :toolbar="tableToolbar"
        :seq-config="{startIndex: (tablePage.currentPage - 1) * tablePage.pageSize}"
        :pager-config="tablePage"
        :columns="tableColumn"
        :data="tableData"
        :checkbox-config="{reserve: true, highlight: true, range: true}"
        @form-submit="findList"
        @page-change="handlePageChange"></vxe-grid>

    </div>
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
            { field: 'name', title: '名称', span: 8, titlePrefix: { message: 'app.body.valid.rName', icon: 'fa fa-exclamation-circle' }, itemRender: { name: '$input', props: { placeholder: '请输入名称' } } },
            { field: 'role', title: '角色', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入角色' } } },
            { field: 'nickname', title: '昵称', span: 8, itemRender: { name: '$input', props: { placeholder: '请输入昵称' } } },
            { field: 'sex', title: '性别', span: 8, folding: true, titleSuffix: { message: '注意，必填信息！', icon: 'fa fa-info-circle' }, itemRender: { name: '$select', options: [] } },
            { field: 'age', title: '年龄', span: 8, folding: true, itemRender: { name: '$input', props: { type: 'number', placeholder: '请输入年龄' } } },
            { span: 24, align: 'center', collapseNode: true, itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: 'app.body.label.search', status: 'primary' } }, { props: { type: 'reset', content: 'app.body.label.reset' } }] } }
          ]
        },
        tableToolbar: {
          refresh: true,
          export: true,
          zoom: true,
          custom: true
        },
        tableColumn: [
          { type: 'checkbox', width: 50 },
          { type: 'seq', width: 60 },
          { field: 'name', title: 'Name' },
          { field: 'nickname', title: 'Nickname' },
          { field: 'sex', title: 'Sex' },
          { field: 'role', title: 'Role' },
          { field: 'address', title: 'Address', showOverflow: true }
        ],
        tableData: [],
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
      this.findList()
    },
    methods: {
      guide() {
        console.log('1111')
      },
      findList() {
        this.loading = true
        this.tableData = [
          { id: 10001, name: 'Test9999', nickname: 'nickNameTest1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
          { id: 10002, name: 'Test99', nickname: 'nickNameTest2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
          { id: 10001, name: 'Test99', nickname: 'nickNameTest1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
          { id: 10002, name: 'Test99', nickname: 'nickNameTest2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
          { id: 10001, name: 'Test99', nickname: 'nickNameTest1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
          { id: 10002, name: 'Test99', nickname: 'nickNameTest2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
          { id: 10003, name: 'Test99', nickname: 'nickNameTest3', role: 'PM', sex: 'Man', address: 'Shanghai1111111111111111111111111111111111111111111111111111111111111' }
        ]
        this.loading = false
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

