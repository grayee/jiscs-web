<!-- 1.模板 :html 结构-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <!-- Main content -->
  <div class="app-container">
    <vxe-grid ref='xGrid' v-bind="gridOptions" @toolbar-button-click="toolbarButtonClickEvent">
    </vxe-grid>
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
  import XEUtils from 'xe-utils'
  import { dateFmt } from '@/utils'

  export default {
    data() {
      return {
        msg: null,
        loading: false,
        gridOptions:{
          rowId: 'id',
          height: 600,
          formConfig: {
            titleWidth: 100,
            titleAlign: 'right',
            items: [
              { field: 'companyNo', title: '公司编码', span: 6, titlePrefix: { message: 'app.body.valid.rName', icon: 'fa fa-exclamation-circle' }, itemRender: { name: '$input', props: { placeholder: '请输入公司编码' }}},
              { field: 'companyName', title: '公司名称', span: 6, itemRender: { name: '$input', props: { placeholder: '请输入公司名称' }}},
              { field: 'parentId', title: '所属公司', span: 7, itemRender: { name: 'TreeSelect',props: { placeholder: '请选择所属公司',options:[],multiple:false,searchable:true,normalizer:this.normalizer}}},
              { field: 'createDate', title: '创建日期', span: 8, folding: true, itemRender: { name: 'ElDatePicker', props: { type: 'daterange', format: 'yyyy-MM-dd',rangeSeparator:'至',startPlaceholder: '开始日期',endPlaceholder: '结束日期' }}},
              { align: 'right', collapseNode: true, itemRender: { name: '$buttons', children: [{ props: { type: 'submit', content: 'app.body.label.search', status: 'primary' }}, { props: { type: 'reset', content: 'app.body.label.reset' }}] }}
            ]
          },
          toolbar: {
            buttons: [
              { code: 'toAdd', name: '新增', icon: 'fa fa-plus' },
              { code: 'edit', name: '修改', icon: 'fa fa-edit' },
              { code: 'mark_cancel', name: '删除/取消', icon: 'fa fa-trash-o' },
              { code: 'save', name: 'app.body.label.save', icon: 'fa fa-save' }
            ],
            refresh: true,
            export: true,
            zoom: true,
            custom: true
          },
          pagerConfig:true,
          columns:[],
          proxyConfig: {
            seq: true, // 启用动态序号代理
            sort: true, // 启用排序代理
            filter: true, // 启用筛选代理
            form: true, // 启用表单代理
            // 配置响应的数据属性
            props: {
              result: 'content',
              total: 'totalCount'
            },
            ajax: {
              // page 对象： { pageSize, currentPage }
              query: ({ page, sort, filters, form }) => this.findList({ page, sort, filters, form }),
              // body 对象： { removeRecords }
              delete: ({ body }) => this.findList(body),
              // body 对象： { insertRecords, updateRecords, removeRecords, pendingRecords }
              save: ({ body }) => this.findList(body)
            }
          },
          checkboxConfig: {
            labelField: 'id',
            trigger: 'row',
            reserve: true,
            highlight: true,
            range: true
          },
          exportConfig: true
        },
        ownComOptions:null,
      }
    },
    mounted() {
      this.msg = 'hello company page!'
    },
    created() {
      this.loadOwnComOptions()
    },
    methods: {
      async  loadOwnComOptions(){
        await this.$api.org.getRelationTree('1').then((response) => {
          if (response.code === 0) {
            this.ownComOptions = response.data
            //删除空的children 属性，避免和 Treeselect 组件冲突！！！
            XEUtils.eachTree(this.ownComOptions, item => {
              if (item.children && item.children.length === 0) {
                delete item.children
              }
            });
            this.$refs.xGrid.getFormItems(2).itemRender.props.options = this.ownComOptions
          }
        })
      },
      findList(param) {
        this.loading = true
        const filters = []
        for (const field in param.form) {
          if (param.form[field]) {
            const filter = {
              property: field,
              operator: 'LIKE',
              value: param.form[field]
            }
            if (field.endsWith('Date')) {
              filter.operator = 'GREATER_THAN_OR_EQUAL_TO'
              filter.value = dateFmt(param.form[field][0],0)
              filters.push(filter)
              const endFilter = {}
              endFilter.property= field
              endFilter.operator = 'LESS_THAN_OR_EQUAL_TO'
              endFilter.value = dateFmt(param.form[field][1], 1)
              filters.push(endFilter)
            } else{
              filters.push(filter)
            }
          }
        }
        return this.$api.company.companyList({
          pageNo: param.page.currentPage,
          pageSize: param.page.pageSize,
          queryFilters: filters
        }).then((response) => {
          this.loading = false
          this.columns = [{ type: 'seq', width: 60 },{ type: 'checkbox', width: 100 ,title:"ID"}].concat(response.data.extras.displayColumns)
          this.$refs.xGrid.loadColumn(this.columns);
          return response.data
        }).catch(error => {
          console.log('error', error)
        })
      },
      toolbarButtonClickEvent({ code }, event) {
        const checkedRecord = this.$refs.xGrid.getCheckboxRecords()[0];
        switch (code) {
          case 'toAdd':
            // this.$XModal.alert(code)
            if (checkedRecord) {
              this.$router.push({name: 'company/add', params: {pid: checkedRecord.id}});
            } else {
              this.$router.push({path: this.$route.path + '/add'});
            }
            this.$route.meta.title = '新增公司'
            break;
          case 'edit':
            if (checkedRecord) {
              this.$router.push({name: 'company/add', params: {id: checkedRecord.id}});
            } else {
              this.$XModal.message({ message: '请至少选择一条记录', status: 'warning', id: 'unique1' })
            }
            this.$route.meta.title = '修改公司'
            break;
          case 'del':
            if (checkedRecord) {
              this.$XModal.confirm('您确定要删除吗？').then(type => {
                if ("confirm" === type) {
                  this.delete([checkedRecord.id]).then((res) => {
                    this.$refs.xGrid.commitProxy('reload');
                  });
                }
              });
            } else {
              this.$XModal.message({ message: '请至少选择一条记录', status: 'warning', id: 'unique1' })
            }
        }
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.text,
          children: node.children
        }
      },
    }
  }
</script>

<!-- 3.样式:解决样式     -->
<style scoped>

</style>

