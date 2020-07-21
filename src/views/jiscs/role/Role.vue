<!-- 组织管理视图 -->
<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout>
        <LayoutPanel region="west" :split="true"   :collapsible="true"  :expander="true"  :bodyStyle="{padding:'3px'}" title="角色树" style="width:200px;">
          <Tree ref="tree" :data="orgRelationData" :checkbox="false" @selectionChange="selected($event)"></Tree>
        </LayoutPanel>

        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">

          <Panel title="详情" :bodyStyle="{padding:'10px',marginBottom:'5px'}" style="height:50%">
            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">详情</div>
                <div>
                  <LinkButton iconCls="icon-edit" :plain="true" @click="add()">新增</LinkButton>
                  <LinkButton iconCls="icon-edit" :plain="true" @click="edit()">编辑</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="remove()">删除</LinkButton>
                  <MenuButton text="授权管理" :plain="true" iconCls="icon-add">
                    <Menu @itemClick="grant($event)">
                      <MenuItem value="1" text="关联用户"></MenuItem>
                      <MenuItem value="2" text="功能授权"></MenuItem>
                      <MenuItem value="3" text="数据授权"></MenuItem>
                    </Menu>
                  </MenuButton>
                </div>
              </div>
            </template>
            <ul class="list-group">
              <li class="list-group-item" v-for="(org,index) in displayColumns"><strong>{{org.title}}：</strong>{{detailContent[org.field]}}
              </li>
            </ul>

            <div class="panel panel-default">
              <div class="panel-body">
                <Tabs style="height:250px">
                  <TabPanel :title="'功能权限'">
                    <p>
                      <Tree ref="funcAuthTree" :data="funcAuth"></Tree>
                    </p>
                  </TabPanel>
                  <TabPanel :title="'数据权限'">
                    <p>
                      <Tree ref="dataAuthTree" :data="dataAuth"></Tree>
                    </p>
                  </TabPanel>
                </Tabs>
              </div>
            </div>
          </Panel>

          <Panel :bodyStyle="{padding:'3px'}">
            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">已关联用户列表</div>
                <div>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="removeRefUser()">解除关联用户</LinkButton>
                </div>
              </div>
            </template>
            <DataGrid :data="users" style="height:250px" :selectionMode="'multiple'"
                      @selectionChange="refUserSelected($event)">

              <GridColumn align="center" cellCss="datagrid-td-rownumber" width="3%">
                <template slot="header" slot-scope="scope">
                  <input type="checkbox" @click="checkAll($event)"/>
                </template>
                <template slot="body" slot-scope="scope">
                  <input type="checkbox" v-model="checkedIds" :value="scope.row.id"/>
                </template>
              </GridColumn>

              <GridColumn align="center" cellCss="datagrid-td-rownumber" width="30" title="序">
                <template slot="body" slot-scope="scope">
                  {{scope.rowIndex + 1}}
                </template>
              </GridColumn>

              <GridColumn field="username" title="用户名" align="center"></GridColumn>
              <GridColumn field="loginId" title="登录账号" align="center"></GridColumn>
              <GridColumn field="email" title="用户邮箱" align="center"></GridColumn>
              <GridColumn field="mobilePhone" title="手机号码" align="center"></GridColumn>
              <GridColumn field="enableStatus" title="状态" align="center"></GridColumn>
              <GridColumn field="createDate" title="创建时间" align="center"></GridColumn>
            </DataGrid>
          </Panel>

          <Dialog ref="d1" :title="roleDialogTitle" :dialogStyle="{width:'480px',height:'365px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true"  borderType="none">
            <div class="f-full" style="padding: 20px 60px 20px 20px">
              <Form ref="form" :model="role">
                <Label for="name" align="right">角色名称:</Label>
                <TextBox inputId="name" name="name" v-model="role.name" style="width:18em"
                         v-validate="'required|max:10'" data-vv-as="角色名称" placeholder="请输入角色名称"></TextBox>
                <span style="color: red; ">*</span>
                <div class="error">{{ veeErrors.first('name') }}</div>

                <Label for="value" align="right">角色编码:</Label>
                <TextBox inputId="value" name="value" v-model="role.value" style="width:18em"
                         v-validate="'required|max:30'" data-vv-as="角色编码" placeholder="请输入角色编码"></TextBox>
                <div class="error">{{ veeErrors.first('value') }}</div>

                <div>
                  <Label for="enableStatus" align="right">状态:</Label>
                  <label>
                    <input type="radio" name="enableStatus" id="e1" value="1" v-model="role.enableStatus" checked>
                    启用
                  </label>
                  <label>
                    <input type="radio" name="enableStatus" id="e0" value="0" v-model="role.enableStatus"> 禁用
                  </label>
                </div>

                <Label for="remark" align="right">备注信息:</Label>
                <TextBox inputId="remark" name="remark" :multiline="true" v-model="role.remark"
                         style="width:218px;height:100px;"></TextBox>
                <div class="error">{{ veeErrors.first('remark') }}</div>
              </Form>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="confirm()&&$refs.d1.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d1.close()">取消</LinkButton>
            </div>
          </Dialog>


          <Dialog ref="d2" :title="roleDialogTitle" :dialogStyle="{width:'600px',height:'400px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true"  borderType="none">
            <div class="f-full" style="padding: 2px 2px">

              <Panel :bodyStyle="{padding:'3px',height:'288px'}">
                <template slot="header">
                  <div class="f-row">
                    <div class="f-full" style="line-height:25px">用户列表</div>
                    <TextBox iconCls="icon-search"></TextBox>
                  </div>
                </template>
                <DataGrid style="height:100%" :pagination="true" :lazy="true" :pageList="pageList" emptyMsg="暂无数据"
                          :data="refUsers" :total="total" :loading="loading" :pageNumber="pageNumber"
                          :pageSize="pageSize" :pagePosition="pagePosition" :pageLinks="5"
                          :pageLayout="['list','sep','first','prev','sep','tpl','sep','next','last','sep','refresh','links','info']"
                          @pageChange="onPageChange($event)" :selectionMode="'multiple'"
                          @selectionChange="refUserSelected($event)">

                  <div slot="tpl" slot-scope="{datagrid}">
                    &nbsp;第
                    <NumberBox style="width:80px;height:23px" spinAlign="left" :spinners="true"
                               v-model="datagrid.pageNumberState"
                               :min="1" :max="Math.floor((total-1)/pageSize+1)"
                               :inputStyle="{textAlign:'left'}">
                      <Addon align="right">
                        <LinkButton iconCls="icon-search"
                                    :style="{borderRadius:0,borderWidth:'0 1px 0 0',width:'20px'}"></LinkButton>
                      </Addon>
                    </NumberBox>
                    页,共 {{Math.floor((total-1)/pageSize+1)}} 页 &nbsp;
                  </div>

                  <GridColumn align="center" cellCss="datagrid-td-rownumber" width="3%">
                    <template slot="header" slot-scope="scope">
                      <input type="checkbox" @click="checkAll($event)"/>
                    </template>
                    <template slot="body" slot-scope="scope">
                      <input type="checkbox" v-model="checkedIds" :value="scope.row.id"/>
                    </template>
                  </GridColumn>

                  <GridColumn align="center" cellCss="datagrid-td-rownumber" width="3%">
                    <template slot="header" slot-scope="scope">
                      <span>序</span>
                    </template>
                    <template slot="body" slot-scope="scope">
                      {{scope.rowIndex + 1}}
                    </template>
                  </GridColumn>

                  <GridColumn v-for="column in refUserDisplayColumns" :key="column.id" :field="column.field" :title="column.title"
                              v-if="column.visible" :align="column.align" :sortable="column.sortable"
                              :width="column.width">
                  </GridColumn>
                </DataGrid>
              </Panel>

            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="refUser()&&$refs.d2.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d2.close()">取消</LinkButton>
            </div>
          </Dialog>

          <Dialog ref="d3" :title="roleDialogTitle" :dialogStyle="{width:'350px',height:'500px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true"  borderType="none">
            <div class="f-full" style="padding: 3px 3px">
              <Tree ref="funcTree" :data="permFuncTreeData" :checkbox="true" :selectLeafOnly="true" cascadeCheck="true"
                    @selectionChange="treeSelected($event)"></Tree>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="grantFunc()&&$refs.d3.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d3.close()">取消</LinkButton>
            </div>
          </Dialog>


          <Dialog ref="d4" :title="roleDialogTitle" :dialogStyle="{width:'350px',height:'500px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true"  borderType="none">
            <div class="f-full" style="padding: 2px 2px">
              <Tree ref="dataTree" :data="permDataTreeData" :checkbox="true" :selectLeafOnly="true" cascadeCheck="true"
                    @selectionChange="treeSelected($event)"></Tree>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="grantData()&&$refs.d4.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d4.close()">取消</LinkButton>
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
        total: 0,
        pageNumber: 0,
        pageSize: 20,
        pageList: [10, 20, 30, 40, 50],
        pagePosition: "bottom",
        filters: [],
        selection: null,
        orgRelationData: [],
        displayColumns: [],
        refUserDisplayColumns: [],
        detailContent: {},
        refUsers: [],
        users: [],
        funcAuth: [],
        dataAuth: [],
        checkedIds: [],
        roleDialogTitle: "",
        role: {},
        permFuncTreeData: [],
        permDataTreeData: [],
        loading: false
      };
    },
    created() {
      this.getTreeData();
    },
    methods: {
      getTreeData() {
        this.$api.user.getRoleTree('').then((response) => {
          if (response.status === 200) {
            this.orgRelationData = response.data.data;
            this.$refs.tree.selectNode(this.orgRelationData[0].children[0]);
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      add() {
        this.role = {};
        this.roleDialogTitle = "新增角色";
        if (this.selection.id) {
          this.role.enableStatus = 1;
          this.$refs.d1.open();
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      edit() {
        this.roleDialogTitle = "编辑角色";
        if (this.selection.id) {
          this.role = this.detailContent;
          this.$refs.d1.open();
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      remove() {
        if (this.selection) {
          this.$api.user.roleDel([this.detailContent.id]).then((response) => {
            this.getTreeData();
          }).catch(error => {
            console.log("error", error);
          });
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      removeRefUser() {
        if (this.checkedIds) {
          this.$api.user.roleRemoveRefUser(this.detailContent.id, this.checkedIds).then((response) => {
            this.getTreeData();
          }).catch(error => {
            console.log("error", error);
          });
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      onPageChange(event) {
        this.loadPage(event.pageNumber, event.pageSize);
      },
      loadPage(pageNumber, pageSize, filters) {
        this.loading = true;
        this.$api.user.roleRefUsers(this.detailContent.id, {
          pageNo: pageNumber,
          pageSize: pageSize,
          queryFilters: filters
        }).then((response) => {
          //console.log("--->", response.data);
          let result = response.data.data;
          this.total = result.totalCount;
          this.pageNumber = result.pageNo;
          this.refUsers = result.content;
          this.loading = false;
          this.refUserDisplayColumns = result.extras.displayColumns;
        }).catch(error => {
          console.log("error", error);
        });
      },
      grant(event) {
        if (this.selection.id) {
          let checkedNodes = [];
          let getCheckedNodes = function (treeData) {
            treeData.forEach((node) => {
              if (node.children && node.children.length) {
                if (node.checked) {
                  checkedNodes.push(node);
                }
                getCheckedNodes(node.children);
              } else {
                if (node.checked) {
                  checkedNodes.push(node);
                }
              }
            });
            return checkedNodes;
          };
          if (event === "1") {
            this.roleDialogTitle = "关联用户";
            this.checkedIds = [];
            this.loadPage(this.pageNumber, this.pageSize, this.filters);
            this.$refs.d2.open();
          } else if (event === "2") {
            this.roleDialogTitle = "功能授权";
            this.$api.user.rolePermFuncTree(this.detailContent.id, {}).then((response) => {
              //console.log("--->", response.data);
              this.permFuncTreeData = response.data.data;
              getCheckedNodes(this.permFuncTreeData);
              checkedNodes.forEach((node) => {
                this.$refs.funcTree.checkNode(node);
              });
            }).catch(error => {
              console.log("error", error);
            });
            this.$refs.d3.open();
          } else {
            this.roleDialogTitle = "数据授权";
            this.$api.user.rolePermDataTree(this.detailContent.id, {}).then((response) => {
              //console.log("--->", response.data);
              this.permDataTreeData = response.data.data;
              getCheckedNodes(this.permDataTreeData);
              checkedNodes.forEach((node) => {
                this.$refs.dataTree.checkNode(node);
              });
            }).catch(error => {
              console.log("error", error);
            });
            this.$refs.d4.open();
          }
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      selected(event) {
        this.selection = event;
        this.$api.org.getOrgDetail(this.selection.id).then((response) => {
          if (response.status === 200) {
            let result = response.data.data;
            this.displayColumns = result.extras.displayColumns;
            this.detailContent = result.content;
            this.users = result.extras.users;
            this.funcAuth = result.extras.funcAuth;
            this.dataAuth = result.extras.dataAuth;
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      refUserSelected(event) {
        this.checkedIds = [];
        let _this = this;
        event.forEach(function (item, i) {
          _this.checkedIds.push(item.id);
        });
      },
      checkAll(event) {
        if (event.currentTarget.checked) {
          this.checkedIds = [];
          let _this = this;
          this.refUsers.forEach(function (item, i) {
            _this.checkedIds.push(item.id);
          });
          this.users.forEach(function (item, i) {
            _this.checkedIds.push(item.id);
          });
        } else {
          this.checkedIds = [];
        }
      },
      confirm() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            this.role.parentId = this.selection.id;
            console.log("commit json data:" + JSON.stringify(this.role));
            if (this.role.id) {
              this.$api.user.roleUpt(this.role).then((response) => {
                this.getTreeData();
                this.$refs.d1.close();
              }).catch(error => {
                console.log("error", error);
              });
            } else {
              this.$api.user.roleAdd(this.role).then((response) => {
                this.getTreeData();
                this.$refs.d1.close();
              }).catch(error => {
                console.log("error", error);
              });
            }
          }
        });
      },
      refUser() {
        this.loading = true;
        this.$api.user.roleRefUser(this.detailContent.id, this.checkedIds).then((response) => {
          //console.log("--->", response.data);
          this.loading = false;
          this.getTreeData();
          this.$refs.d2.close();
        }).catch(error => {
          console.log("error", error);
        });
      },
      grantFunc() {
        let permIds = this.$refs.funcTree.getCheckedNodes().map(item => {
          if (item.attributes) {
            return item.id + "@" + item.attributes.isPerm;
          } else {
            return item.id + "@false"
          }
        });
        console.log(permIds);
        this.$api.user.roleGrantFunc(this.detailContent.id, permIds).then((response) => {
          //console.log("--->", response.data);
          this.loading = false;
          this.getTreeData();
          this.$refs.d3.close();
        }).catch(error => {
          console.log("error", error);
        });
      },
      grantData() {
        let permIds = this.$refs.dataTree.getCheckedNodes().map(item => item.id);
        console.log(permIds);
        this.$api.user.roleGrantData(this.detailContent.id, permIds).then((response) => {
          //console.log("--->", response.data);
          this.loading = false;
          this.getTreeData();
          this.$refs.d4.close();
        }).catch(error => {
          console.log("error", error);
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

  .panel {
    min-height: 200px;
  }
</style>
<!--
https://www.cnblogs.com/wyguo/p/3556049.html
-->
