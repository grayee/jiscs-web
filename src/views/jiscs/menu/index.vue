<!-- 1.模板 :html 结构-->
<template>
  <div class="app-container">
    <vxe-grid ref='xGrid' v-bind="gridOptions" @toolbar-button-click="toolbarButtonClickEvent"></vxe-grid>

    <vxe-modal ref="xModal" v-model="showDialog" :title="dialogTitle" width="800" resize destroy-on-close size="small">
      <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="120" @submit="submitEvent">
        <vxe-form-item title="上级菜单" field="parentId" span="12">
          <treeselect v-model="formData.parentId" placeholder="请选择上级菜单" search-nested
            :multiple="false"
            :options="tableData"
            :normalizer="normalizer"
            :searchable="true"
            :max-height="500"/>
        </vxe-form-item>

        <vxe-form-item title="菜单类型" field="type" span="12" :item-render="{name: '$radio', options: menuTypes}" />

        <vxe-form-item title="菜单图标" field="icon" span="20">
          <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="formData.icon" placeholder="点击选择图标" readonly>
              <svg-icon v-if="formData.icon" slot="prefix" class="el-input__icon" style="height: 32px;width: 16px;"
                        :icon-class="formData.icon" />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </vxe-form-item>

        <vxe-form-item title="菜单名称" field="name" span="20" :item-render="{name: 'input', attrs: {placeholder: '请输入菜单名称'}}"></vxe-form-item>
        <vxe-form-item title="菜单路径" field="url" span="20" :item-render="{name: 'input', attrs: {placeholder: '请输入菜单路径'}}"></vxe-form-item>
        <vxe-form-item title="组件路径" field="component" span="20" :item-render="{name: 'input', attrs: {placeholder: '请输入组件路径'}}"></vxe-form-item>
        <vxe-form-item title="排序编码" field="orderCode" span="10" :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入数值'}}"></vxe-form-item>
        <vxe-form-item v-if ='formData.type===2' title="权限编码" field="authCode" span="10":item-render="{name: 'input', attrs: {placeholder: '请输入排序编码'}}"></vxe-form-item>
        <vxe-form-item title="备注信息" field="remark" span="20" :title-suffix="{message: '备注信息', icon: 'fa fa-question-circle'}":item-render="{name: 'textarea', attrs: {placeholder: '请输入地址'}}"></vxe-form-item>

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
  // import Treeselect component
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  import IconSelect from '@/components/IconSelect'

  export default {
    // register the component
    components: { Treeselect, IconSelect },
    data() {
      return {
        loading: false,
        menuTypes: [],
        gridOptions: {
          keepSource: true,
          rowId: 'id',
          formConfig: {
            titleWidth: 100,
            titleAlign: 'right',
            items: [
              { field: 'name', title: '菜单名称',span: 6,titlePrefix: { message: 'app.body.valid.rName', icon: 'fa fa-exclamation-circle' }, itemRender: { name: '$input', props: { placeholder: '请输入名称' }}},
              {span: 10,align: 'right',collapseNode: false, itemRender: {name: '$buttons', children: [
                    { props: { type: 'submit', content: 'app.body.label.search', status: 'primary' }},
                    { props: { type: 'reset', content: 'app.body.label.reset' }}] }
              }
            ]
          },
          toolbar: {
            buttons: [
              { code: 'add', name: '新增', icon: 'fa fa-plus vxe-primary-color' },
              { code: 'edit', name: '修改', icon: 'fa fa-edit' },
              { code: 'del', name: '删除', icon: 'fa fa-trash-o' },
              { code: 'save', name: '保存', icon: 'fa fa-save vxe-success-color' }
            ],
            refresh: true,
            export: true,
            zoom: true,
            custom: true
          },
          treeConfig:true,
          exportConfig: true,
          columns:[],
          proxyConfig: {
            seq: true, // 启用动态序号代理
            sort: true, // 启用排序代理
            filter: true, // 启用筛选代理
            form: true, // 启用表单代理
            ajax: {
              // 处理树结构转换
              query: ({ page, sort, filters, form }) => this.findList({ page, sort, filters, form }),
              delete: ({ body }) => this.delete(body),
              save: ({ body }) => this.update(body.updateRecords[0])
            }
          },
          editConfig: {
            trigger: 'click',
            mode: 'row',
            showStatus: true
          },
          radioConfig: {
            trigger: 'row',
            labelField: 'id',
            reserve: true,
            highlight: true
          },
        },
        tableData: [],
        showDialog: false,
        dialogTitle: '',
        formData: {},
        formRules: {
          name: [
            { required: true, message: '请输入菜单名称' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符' }
          ],
          type: [
            { required: true, message: '请选择菜单类型' }
          ]
        }
      }
    },
    mounted() {
    },
    methods: {
      findList(param) {
        this.loading = true;
        let queryFilters = [];
        // 处理筛选条件
        param.filters.forEach(({ property, values }) => {
          queryFilters.push({
            property: property,
            operator: "equals",
            value: values
          }) ;
        });

        for (let key in param.form) {
          if (typeof(param.form[key]) != "undefined") {
            queryFilters.push({
              property: key,
              operator: "like",
              value: param.form[key]
            });
          }
        }
        return this.$api.menu.getMenuList({
          pageNo: 1,
          pageSize: 1000,
          queryFilters: queryFilters
        }).then((response) => {
          this.loading = false;
          const extras = response.data.extras;
          this.menuTypes = extras.menuTypeMap.map(t => {
            return { label: t.text, value: t.value }
          });
          this.columns = [{type: 'seq', width: 60, fixed: 'left'},{type: 'radio', title: 'ID',width: 100,fixed: 'left' }].concat(
            extras.displayColumns.map(col => {
              switch (col.field){
                case "name":
                  col.treeNode = true;
                  break;
                case "icon":
                  col.slots = {
                    // 使用 JSX 渲染
                    default: ({row}) => {
                      return [row.icon ? <svg-icon slot="prefix"  icon-class={row.icon} class="el-input__icon" style="height: 32px;width: 16px;"/> :<span>无</span>]
                    }
                  };
                  break;
                case "type":
                  col.slots = {
                    // 使用 JSX 渲染
                    default: ({row}) => {
                      const obj = Object.fromEntries(this.menuTypes.map(item => [item.value, item.label]));
                      let status = row.type == this.menuTypes[0].value ? 'primary' : row.type == this.menuTypes[1].value ? "success" : "info";
                      return [<vxe-button type="text" status={status}>{obj[row.type]}</vxe-button>];
                    }
                  };
                  col.filters = this.menuTypes;
                  col.remoteSort = true;
                  break;
                case "component":
                  col.editRender = {name: 'input'};
                  break;
              }
              return col
            }));
          this.$refs.xGrid.loadColumn(this.columns);
          this.tableData = XEUtils.toArrayTree(response.data.content,
            { strict: false, key: 'id', parentKey: 'parentId', children: 'children' })
          return this.tableData
        }).catch(error => {
          console.log('error', error)
        })
      },
      update(data){
        this.loading = true;
        //更新
        return this.$api.menu.menuUpt(data).then((response) => {
          this.loading = false
          return response;
        }).catch(error => {
          console.log('error', error)
        });
      },
      add(data){
        this.loading = true;
        return this.$api.menu.menuAdd(data).then((response) => {
          this.loading = false;
          return response;
        }).catch(error => {
          console.log('error', error)
        });
      },
      delete(data){
        this.loading = true;
        return this.$api.menu.menuDel(data).then((response) => {
          this.loading = false;
          return response;
        }).catch(error => {
          console.log('error', error)
        });
      },
      toolbarButtonClickEvent({ code }, event) {
        const checkedRecord = this.$refs.xGrid.getRadioRecord()
        //删除空的children 属性，避免和 Treeselect 组件冲突！！！
        XEUtils.eachTree(this.tableData, item => {
          if (item.children && item.children.length === 0) {
            delete item.children
          }
        });
        switch (code) {
          case 'add':
            // this.$XModal.alert(code)
            this.showDialog = true;
            this.dialogTitle = '新增';
            this.formData = {
              parentId: null,
              type: 1,
              icon: '',
              name: '',
              url: '',
              component: '',
              orderCode: '',
              authCode: '',
              remark: ''
            };
            if (checkedRecord) {
              this.formData.parentId = checkedRecord.id;
            }
            break;
          case 'edit':
            if (checkedRecord) {
              this.showDialog = true
              this.dialogTitle = '编辑'
              this.$api.menu.menuDetail(checkedRecord.id).then((response) => {
                this.formData = response.data
                if(this.formData.parentId <=1){
                  this.formData.parentId = null
                }
              }).catch(error => {
                console.log('get menu detail error', error)
              })
            } else {
              this.$XModal.message({ message: '请至少选择一条记录', status: 'warning', id: 'unique1' })
            }
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
      submitEvent() {
        if (this.formData.id) {
           this.update(this.formData).then((res)=>{
             this.$XModal.message({message: '保存成功', status: 'success'})
             this.showDialog = false
             this.$refs.xGrid.commitProxy('reload')
           });
        } else {
          //新增
          this.add(this.formData).then((res)=>{
            this.$XModal.message({message: '保存成功', status: 'success'})
            this.showDialog = false
            this.$refs.xGrid.commitProxy('reload')
          });
        }
      },
      formatterDate({ cellValue }) {
        return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss')
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      // 选择图标
      selected(name) {
        this.formData.icon = name
      }
    }
  }
</script>
<!-- 3.样式:解决样式     -->
<style scoped>

</style>
