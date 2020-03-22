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
    />

    <vxe-modal ref="xModal" v-model="showDialog" :title="dialogTitle" width="800" resize destroy-on-close size="small">
      <vxe-form :data="formData" :rules="formRules" title-align="right" title-width="120" @submit="submitEvent">

        <vxe-form-item title="上级菜单" field="parentId" span="12">
          <treeselect
            v-model="formData.parentId"
            :multiple="false"
            :options="tableData"
            :normalizer="normalizer"
            placeholder="请选择上级菜单"
            :searchable="true"
            search-nested
            :max-height="500"
          />
        </vxe-form-item>

        <vxe-form-item title="菜单类型" field="type" span="12" :item-render="{name: '$radio', options: menuTypes}" />

        <vxe-form-item title="菜单图标" field="icon" span="20">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input slot="reference" v-model="formData.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="formData.icon"
                slot="prefix"
                :icon-class="formData.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </vxe-form-item>

        <vxe-form-item
          title="菜单名称"
          field="name"
          span="20"
          :item-render="{name: 'input', attrs: {placeholder: '请输入菜单名称'}}"
        />
        <vxe-form-item
          title="菜单路径"
          field="url"
          span="20"
          :item-render="{name: 'input', attrs: {placeholder: '请输入菜单路径'}}"
        />
        <vxe-form-item
          title="组件路径"
          field="component"
          span="20"
          :item-render="{name: 'input', attrs: {placeholder: '请输入组件路径'}}"
        />
        <vxe-form-item
          title="排序编码"
          field="orderCode"
          span="10"
          :item-render="{name: 'input', attrs: {type: 'number', placeholder: '请输入数值'}}"
        />
        <vxe-form-item
          title="权限编码"
          field="authCode"
          span="10"
          :item-render="{name: 'input', attrs: {placeholder: '请输入排序编码'}}"
        />
        <vxe-form-item
          title="备注信息"
          field="remark"
          span="20"
          :title-suffix="{message: '啦啦啦，就是这么强大！！！', icon: 'fa fa-question-circle'}"
          :item-render="{name: 'textarea', attrs: {placeholder: '请输入地址'}}"
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
  // import Treeselect component
  import Treeselect from '@riophae/vue-treeselect'
  import IconSelect from '@/components/IconSelect'

  export default {
    // register the component
    components: { Treeselect, IconSelect },
    data() {
      return {
        loading: false,
        menuTypes: [],
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
            { code: 'add', name: '新增', icon: 'fa fa-plus vxe-primary-color' },
            { code: 'edit', name: '修改', icon: 'fa fa-edit' },
            { code: 'mark_cancel', name: '删除', icon: 'fa fa-trash-o' },
            { code: 'save', name: '保存', icon: 'fa fa-save vxe-success-color' }
          ],
          refresh: true,
          export: true,
          zoom: true,
          resizable: true,
          custom: true
        },
        tableColumn: [],
        tableData: [],
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
        formData: {},
        formRules: {
          name: [
            { required: true, message: '请输入菜单名称' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符' }
          ],
          type: [
            { required: true, message: '请选择菜单类型' }
          ],
          parentId: [
            { required: true, message: '请选择上级菜单' }
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
          const extras = response.data.extras
          this.tableColumn = [{ type: 'radio', width: 50 }, { type: 'seq', width: 60 }].concat(
            extras.displayColumns.map(col => {
              if (col.field === 'name') {
                col.treeNode = true
                return col
              }
              return col
            }))
          this.tableData = XEUtils.toArrayTree(response.data.content,
            { strict: false, key: 'id', parentKey: 'parentId', children: 'children' })
          this.menuTypes = extras.menuTypeMap.map(t => {
            return { label: t.text, value: t.value }
          })
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
            XEUtils.eachTree(this.tableData, item => {
              if (item.children && item.children.length === 0) {
                delete item.children
              }
            })
            this.formData = {
              parentId: null,
              type: 1,
              icon: '',
              name: '',
              url: '',
              component: '',
              orderCode: 30,
              authCode: '1',
              remark: ''
            }
            break
          case 'edit':
            const checkedRecord = this.$refs.xGrid.getRadioRecord()
            if (checkedRecord) {
              this.showDialog = true
              this.dialogTitle = '编辑'
              this.$api.menu.menuDetail(checkedRecord.id).then((response) => {
                this.formData = response.data
              }).catch(error => {
                console.log('get menu detail error', error)
              })
            } else {
              this.$XModal.message({ message: '请至少选择一条记录', status: 'warning' })
            }
            break
        }
      },
      submitEvent() {
        this.loading = true
        if (this.formData.id) {
          this.$api.menu.menuUpt(this.formData).then((response) => {
            this.loading = false
            this.$XModal.message({ message: '保存成功', status: 'success' })
            this.showDialog = false
          }).catch(error => {
            console.log('error', error)
          })
        } else {
          this.$api.menu.menuAdd(this.formData).then((response) => {
            this.loading = false
            this.$XModal.message({ message: '保存成功', status: 'success' })
            this.showDialog = false
          }).catch(error => {
            console.log('error', error)
          })
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
