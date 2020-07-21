<!-- 组织管理视图 -->
<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout style="min-height: 500px;">
        <LayoutPanel region="west" :split="true" title="资源树" :collapsible="true"  :expander="true"   :bodyStyle="{padding:'3px'}" style="width:200px">
          <Tree ref="tree" :data="treeData"  :selectLeafOnly="true" @selectionChange="treeSelected($event)"></Tree>
        </LayoutPanel>

        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">
          <Panel :bodyStyle="{padding:'3px'}">
            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">权限列表</div>
                <div>
                  <LinkButton iconCls="icon-add" :plain="true" @click="add()">新增</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="remove()">删除</LinkButton>
                  <LinkButton iconCls="icon-edit" :plain="true" @click="edit()">编辑</LinkButton>
                  <LinkButton iconCls="icon-back" :plain="true"></LinkButton>
                </div>
              </div>
            </template>

            <DataGrid style="height:100%" :lazy="true" :data="data" :loading="loading" :selectionMode="'multiple'"
                      @selectionChange="gridSelected($event)" >

              <GridColumn align="center" cellCss="datagrid-td-rownumber" width="3%">
                <template slot="header" slot-scope="scope">
                  <input type="checkbox" @click="checkAll($event)"/>
                </template>
                <template slot="body" slot-scope="scope">
                  <input type="checkbox" v-model="checkedIds" :value="scope.row.id"/>
                </template>
              </GridColumn>

              <GridColumn align="center" cellCss="datagrid-td-rownumber" width="5%">
                <template slot="header" slot-scope="scope">
                  <span>序</span>
                </template>
                <template slot="body" slot-scope="scope">
                  {{scope.rowIndex + 1}}
                </template>
              </GridColumn>

              <GridColumn field="name" title="权限名称" align="center"></GridColumn>
              <GridColumn field="value" title="权限编码" align="center"></GridColumn>
              <GridColumn field="description" title="描述信息" align="center"></GridColumn>
              <GridColumn field="enableStatus" title="状态" align="center"></GridColumn>
              <GridColumn field="createDate" title="创建时间" align="center"></GridColumn>
            </DataGrid>
          </Panel>

          <Dialog ref="d1" :title="permitDialogTitle" :dialogStyle="{width:'480px',height:'365px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true">
            <div class="f-full" style="padding: 20px 60px 20px 20px">
              <Form ref="form" :model="permission">
                <Label for="name" align="right">权限名称:</Label>
                <TextBox inputId="name" name="name" v-model="permission.name" style="width:18em"
                         v-validate="'required|max:10'" data-vv-as="权限名称" placeholder="请输入权限名称"></TextBox>
                <span style="color: red; ">*</span>
                <div class="error">{{ veeErrors.first('name') }}</div>

                <Label for="value" align="right">权限编码:</Label>
                <TextBox inputId="value" name="value" v-model="permission.value" style="width:18em"
                         v-validate="'required|max:30'" data-vv-as="权限编码" placeholder="请输入权限编码"></TextBox>
                <div class="error">{{ veeErrors.first('value') }}</div>

                <div STYLE=" margin-bottom: 3px;">
                  <Label for="enableStatus" align="right">状态:</Label>
                  <label>
                    <input type="radio" name="enableStatus" id="e1" value="1" v-model="permission.enableStatus" checked>
                    启用
                  </label>
                  <label>
                    <input type="radio" name="enableStatus" id="e0" value="0" v-model="permission.enableStatus"> 禁用
                  </label>
<!--
                  <SwitchButton inputId="s3" onText="启用" offText="禁用" v-model="permission.enableStatus"></SwitchButton>-->
                </div>

                <Label for="description" align="right">描述信息:</Label>
                <TextBox inputId="description" name="description" :multiline="true" v-model="permission.description"
                         style="width:218px;height:100px;"></TextBox>
                <div class="error">{{ veeErrors.first('description') }}</div>
              </Form>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="confirm()&&$refs.d1.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d1.close()">取消</LinkButton>
            </div>
          </Dialog>
        </LayoutPanel>
      </Layout>
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
  export default {
    data() {
      return {
        selection: null,
        permitSelection: null,
        data: [],
        checkedIds: [],
        treeData: [],
        loading: false,
        permitDialogTitle: "",
        permission: {}
      };
    },
    created() {
      this.getTreeData();
    },
    methods: {
      getTreeData() {
        this.$api.menu.getResourceTree('').then((response) => {
          if (response.status === 200) {
            this.treeData = response.data.data;
            this.$refs.tree.selectNode(this.treeData[0]);
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      treeSelected(event) {
        this.selection = event;
        if (event.attributes) {
          this.data = event.attributes.permissions;
        }else{
          this.data = [];
        }
      },
      gridSelected(event) {
        this.checkedIds = [];
        this.permitSelection = event;
        let _this = this;
        event.forEach(function (item, i) {
          _this.checkedIds.push(item.id);
        });
      },
      checkAll(event) {
        if (event.currentTarget.checked) {
          this.checkedIds = [];
          let _this = this;
          this.data.forEach(function (item, i) {
            _this.checkedIds.push(item.inv);
          });
        } else {
          this.checkedIds = [];
        }
      },
      add() {
        this.permission = {};
        this.permitDialogTitle = "新增权限";
        if (this.selection.id) {
          this.permission.enableStatus = 1;
          this.$refs.d1.open();
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      edit() {
        this.permitDialogTitle = "编辑权限";
        if (this.checkedIds.length ===1) {
          this.permission = this.permitSelection[0];
          this.$refs.d1.open();
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      remove() {
        if (this.checkedIds.length > 0) {
          this.$api.menu.permissionDel(this.checkedIds).then((response) => {
            this.getTreeData();
          }).catch(error => {
            console.log("error", error);
          });
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      confirm() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            console.log("commit json data:" + JSON.stringify(this.permission));
            if (this.permission.id) {
              this.$api.menu.permissionUpt(this.selection.id,this.permission).then((response) => {
                this.getTreeData();
                this.$refs.d1.close();
              }).catch(error => {
                console.log("error", error);
              });
            } else {
              this.$api.menu.resourceAddPermission(this.selection.id, this.permission).then((response) => {
                this.getTreeData();
                this.$refs.d1.close();
              }).catch(error => {
                console.log("error", error);
              });
            }
          }
        });
      }
    }
  };
</script>

<!-- 3.样式:解决样式     -->
<style scoped>
  .error {
    color: red;
    font-size: 12px;
    margin: 4px 120px;
  }

  .panel-header {
    background-color: #f5f5f5;
  }
</style>
