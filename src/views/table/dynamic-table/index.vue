<template>
  <div class="app-container">
    <div style="margin:0 0 5px 20px">
      {{ $t('table.dynamicTips1') }}
    </div>
    <fixed-thead />

    <div style="margin:30px 0 5px 20px">
      {{ $t('table.dynamicTips2') }}
    </div>
    <unfixed-thead />

    <div style="margin:30px 0 5px 20px">
      VXE TABLE
      <vxe-form :data="formData" @submit="findList">
        <vxe-form-item title="app.body.label.name" field="name">
          <vxe-input v-model="formData.name" placeholder="请输入名称" />
        </vxe-form-item>
        <vxe-form-item title="性别" field="sex" :title-prefix="{ message: '帮助信息！！！' }">
          <vxe-select v-model="formData.sex" placeholder="请选择性别" clearable>
            <vxe-option value="1" label="女" />
            <vxe-option value="2" label="男" />
          </vxe-select>
        </vxe-form-item>
        <vxe-form-item>
          <vxe-button type="submit" status="primary">查询</vxe-button>
          <vxe-button type="reset">重置</vxe-button>
        </vxe-form-item>
      </vxe-form>

      <vxe-toolbar
        custom
        export
        :buttons="toolbarButtons"
        :refresh="{query: findList}"
      />

      <vxe-table
        border
        highlight-hover-row
        :data="tableData"
      >
        <vxe-table-column type="seq" title="序" width="30" />
        <vxe-table-column field="name" title="Name" />
        <vxe-table-column field="sex" title="Sex" />
        <vxe-table-column field="role" title="Role" />
        <vxe-table-column field="address" title="Address" show-overflow />
      </vxe-table>
      <vxe-pager
        perfect
        size="mini"
        :loading="loading"
        :current-page="tablePage.currentPage"
        :page-size="tablePage.pageSize"
        :total="tablePage.totalResult"
        :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
        @page-change="handlePageChange"
      />

    </div>

  </div>
</template>

<script>
import FixedThead from './components/FixedThead'
import UnfixedThead from './components/UnfixedThead'

export default {
  name: 'DynamicTable',
  components: { FixedThead, UnfixedThead },
  data() {
    return {
      loading: false,
      formData: {
        name: '',
        sex: ''
      },
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      toolbarButtons: [
        {
          code: 'btn1',
          name: 'app.body.button.insert'
        },
        {
          name: '下拉按钮',
          dropdowns: [
            {
              name: '按钮111',
              code: 'btn2'
            },
            {
              name: '按钮222',
              code: 'btn3'
            }
          ]
        }
      ]
    }
  },
  created() {
    this.tableData = [
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
      { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', address: 'Shenzhen' },
      { id: 10002, name: 'Test2', role: 'Test', sex: 'Man', address: 'Guangzhou' },
      { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', address: 'Shanghai' }
    ]
  },
  methods: {
    findList() {
      this.loading = true
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      this.findList()
    }
  }
}
</script>

