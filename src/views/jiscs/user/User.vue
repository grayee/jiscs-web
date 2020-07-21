<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout>
        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">
          <Panel title="查询条件" :collapsible="true" :bodyStyle="{padding:'10px',marginBottom:'5px'}">
            <Form :model="qUser" :labelWidth="120" labelAlign="right">
              <div style="margin-bottom:10px">
                <Label for="loginId" align="right">登录账号：</Label>
                <TextBox inputId="loginId" name="loginId" v-model="qUser.loginId"></TextBox>
                <Label for="username" align="right">用户名：</Label>
                <TextBox inputId="username" name="username" v-model="qUser.username"></TextBox>
                <Label for="userStatus" style="text-align: right">用户状态: </Label>
                <ComboBox inputId="userStatus" v-model="qUser.enableStatus" :data="data"></ComboBox>
              </div>
              <div style="margin-bottom:10px">
                <Label for="name" style="text-align: right">所属机构:</Label>
                <ComboBox inputId="c1" v-model="qUser.parentId" :data="data"></ComboBox>

                <Label for="d2" align="right">创建日期： </Label>
                <DateBox inputId="d2" format="yyyy-MM-dd" name="createDateFrom"
                         v-model="qUser.createDateFrom"></DateBox>
                至
                <DateBox inputId="d2" format="yyyy-MM-dd" name="createDateTo" v-model="qUser.createDateTo"></DateBox>
                <Label/>

                <LinkButton iconCls="icon-search" style="width:60px" @click="search()">查询</LinkButton>
                <LinkButton iconCls="icon-cancel" style="width:60px" @click="reset()"> 重置</LinkButton>
              </div>
            </Form>
          </Panel>

          <Panel title="列表" :bodyStyle="{padding:'3px'}">

            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">列表</div>
                <div>
                  <LinkButton iconCls="icon-add" :plain="true" @click="toRef()">关联</LinkButton>
                  <LinkButton iconCls="icon-add" :plain="true" @click="toAdd()">新增</LinkButton>
                  <LinkButton iconCls="icon-edit" :plain="true" @click="edit()">编辑</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="remove()">删除</LinkButton>
                  <LinkButton iconCls="icon-reload" :plain="true" @click="refresh()">刷新</LinkButton>

                  <MenuButton text="授权管理" :plain="true" iconCls="icon-add">
                    <Menu @itemClick="grant($event)">
                      <MenuItem value="1" text="授权角色"></MenuItem>
                      <MenuItem value="2" text="功能授权"></MenuItem>
                      <MenuItem value="3" text="数据授权"></MenuItem>
                    </Menu>
                  </MenuButton>


                  <LinkButton iconCls="icon-back" :plain="true" @click="goBack()"></LinkButton>
                  <LinkButton iconCls="icon-filter" :plain="true" @click="$refs.d5.open()">调整显示列</LinkButton>
                </div>
              </div>
            </template>

            <DataGrid style="height:100%" :pagination="true" :lazy="true" :pageList="pageList"
                      :data="data" :total="total" :loading="loading" :pageNumber="pageNumber"
                      :pageSize="pageSize" :pagePosition="pagePosition" :pageLinks="5"
                      :pageLayout="['list','sep','first','prev','sep','tpl','sep','next','last','sep','refresh','links','info']"
                      @pageChange="onPageChange($event)" :selectionMode="'multiple'"
                      @selectionChange="selected($event)">

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

              <GridColumn v-for="column in displayColumns" :key="column.id" :field="column.field" :title="column.title"
                          v-if="column.visible" :align="column.align" :sortable="column.sortable" :width="column.width">
              </GridColumn>
            </DataGrid>
          </Panel>

          <Dialog ref="d5" :title="'调整显示列'" :dialogStyle="{width:'300px'}" :draggable="true"
                  :closed="true" :modal="true" borderType="none">

            <DataList style="width:100%;height:410px;" :data="displayColumns"
                      selectionMode="multiple" @rowClick="onRowClick($event)">
              <template slot-scope="scope">
                <div class="dataList">
                  <input type="checkbox" :value="scope.row.field" :id="scope.row.id" v-model="checkedFields"
                         style="margin-bottom: 3px"/>
                  <label :for="scope.row.id">{{scope.row.title}}</label>
                </div>
              </template>
            </DataList>

            <div class="dialog-button">
              <LinkButton style="width:60px" @click="submitForm($refs.d5)">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d5.close()">取消</LinkButton>
            </div>
          </Dialog>

          <Dialog ref="d1" :title="userDialogTitle" :dialogStyle="{width:'480px',height:'400px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true" borderType="none">
            <div class="f-full" style="padding: 20px 60px 20px 20px">
              <p>
                友情提示：密码至少为6位，只能为数字、字母、下划线，不能使用中文。
              </p>
              <Form ref="form" :model="user">
                <Label for="username" align="right">用户姓名:</Label>
                <ComboTree name='username' :data="treeData" v-model="user.username" placeholder="-请选择-"
                           style="width: 200px">
                  <Tree slot="tree" :checkbox="false" :selectLeafOnly="true"></Tree>
                </ComboTree>
                <div class="error">{{ veeErrors.first('username') }}</div>

                <Label for="loginId" align="right">登录账号:</Label>
                <TextBox inputId="loginId" name="loginId" v-model="user.loginId" style="width:14em"
                         v-validate="'required|max:10'" data-vv-as="登录账号" placeholder="请输入登录账号"
                         iconCls="icon-man"></TextBox>
                <span style="color: red; ">*</span>
                <div class="error">{{ veeErrors.first('loginId') }}</div>

                <Label for="password" align="right">登录密码:</Label>
                <PasswordBox inputId="password" name="password" v-model="user.password" style="width:14em"
                             v-validate="'required|min:6'"
                             data-vv-as="登录密码" placeholder="请输入登录密码:"></PasswordBox>
                <span style="color: red; ">*</span>
                <div class="error">{{ veeErrors.first('password') }}</div>

                <Label for="pwdConfirm" align="right">确认密码:</Label>
                <PasswordBox inputId="pwdConfirm" name="pwdConfirm" v-model="user.pwdConfirm" style="width:14em"
                             v-validate="{is:user.password}" data-vv-as="确认密码" placeholder="请确认登录密码:"></PasswordBox>
                <span style="color: red; ">*</span>
                <div class="error">{{ veeErrors.first('pwdConfirm') }}</div>

                <Label for="enableStatus" align="right">是否启用:</Label>
                <label>
                  <input type="radio" name="enableStatus" id="e1" value="1" v-model="user.enableStatus" checked> 是
                </label>
                <label>
                  <input type="radio" name="enableStatus" id="e0" value="0" v-model="user.enableStatus">否
                </label>
              </Form>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="confirm()&&$refs.d1.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d1.close()">取消</LinkButton>
            </div>
          </Dialog>


          <Dialog ref="d2" :title="userDialogTitle" :dialogStyle="{width:'350px',height:'500px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true" borderType="none">
            <div class="f-full" style="padding: 3px 3px">
              <Tree ref="roleTree" :data="roleTreeData" :checkbox="true" :selectLeafOnly="true" cascadeCheck="true"
                    @selectionChange="treeSelected($event)"></Tree>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="grantRole()&&$refs.d2.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d2.close()">取消</LinkButton>
            </div>
          </Dialog>


          <Dialog ref="d3" :title="userDialogTitle" :dialogStyle="{width:'350px',height:'500px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true" borderType="none">
            <div class="f-full" style="padding: 3px 3px">
              <Tree ref="funcTree" :data="permFuncTreeData" :checkbox="true" :selectLeafOnly="true" cascadeCheck="true"
                    @selectionChange="treeSelected($event)"></Tree>
            </div>
            <div class="dialog-button">
              <LinkButton style="width:60px" @click="grantFunc()&&$refs.d3.close()">确认</LinkButton>
              <LinkButton style="width:60px" @click="$refs.d3.close()">取消</LinkButton>
            </div>
          </Dialog>


          <Dialog ref="d4" :title="userDialogTitle" :dialogStyle="{width:'350px',height:'500px'}"
                  bodyCls="f-column" :draggable="true" :closed="true" :modal="true" borderType="none">
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
        data: [],
        checkedIds: [],
        checkedFields: [],
        pageList: [10, 20, 30, 40, 50],
        loading: false,
        pagePosition: "bottom",
        displayColumns: [],
        user: {},
        qUser: {},
        userDialogTitle: "",
        treeData: [],
        roleTreeData: [],
        permFuncTreeData: [],
        permDataTreeData: []
      };
    },
    created() {
      this.loadPage(this.pageNumber, this.pageSize);
    },
    methods: {
      getTreeData() {
        this.$api.org.getTargetTree('4').then((response) => {
          if (response.status === 200) {
            this.treeData = response.data.data;
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      onPageChange(event) {
        this.loadPage(event.pageNumber, event.pageSize);
      },
      loadPage(pageNumber, pageSize, filters) {
        this.loading = true;
        this.$api.user.userList({
          pageNo: pageNumber,
          pageSize: pageSize,
          queryFilters: filters
        }).then((response) => {
          //console.log("--->", response.data);
          let result = response.data.data;
          this.total = result.totalCount;
          this.pageNumber = result.pageNo;
          this.data = result.content;
          this.loading = false;
          this.displayColumns = result.extras.displayColumns;
          this.displayColumns.forEach((item, i) => {
            if (item.visible) {
              this.checkedFields.push(item.field);
            }
          });
        }).catch(error => {
          console.log("error", error);
        });
      },
      search() {
        let filters = [];
        let dateFmt = Vue.filter('dateFmt');
        for (let field in this.qUser) {
          let filter = {};
          if (field.endsWith("From")) {
            filter.property = field.substr(0, field.indexOf("From"));
            filter.operator = "greaterThanOrEqualTo";
            filter.value = dateFmt(this.qUser[field]);
          } else if (field.endsWith("To")) {
            filter.property = field.substr(0, field.indexOf("To"));
            filter.operator = "lessThanOrEqualTo";
            filter.value = dateFmt(this.qUser[field], 1);
          } else {
            filter.property = field;
            filter.operator = "like";
            filter.value = this.qUser[field];
          }
          filters.push(filter);
        }
        this.loadPage(this.pageNumber, this.pageSize, filters);
      },
      reset() {
        this.user = {};
      },
      remove() {
        if (this.checkedIds.length > 0) {
          this.$api.user.userDel(this.checkedIds).then((response) => {
            this.loadPage(this.pageNumber, this.pageSize);
          }).catch(error => {
            console.log("error", error);
          });
        } else {
          this.$messager.alert({
            title: "提示信息",
            icon: "warning",
            msg: "请至少选中一条记录!"
          });
        }
      },
      edit() {
        if (this.checkedIds.length === 1) {
          //path来匹配路由，然后通过query来传递参数
          this.$router.push({path: '/auth/user/add?id=' + this.checkedIds[0]});
        } else {
          this.$messager.alert({title: "提示信息", icon: "warning", msg: "请至少选中一条记录!"});
        }
      },
      refresh() {
        location.reload();
      },
      print() {
        let printhtml = window.document.body.innerHTML; // 获取打印区域
        let oldhtml = window.document.innerHTML; // 保存原始内容
        document.innerHtml = printhtml; // 赋值打印
        window.print();
        document.innerHtml = oldhtml; // 还原页面
        window.location.reload(); // 刷新解决页面无法点击
      },
      goBack() {
        this.$router.go(-1);
      },
      toRef() {
        this.user = {};
        this.user.enableStatus = 1;
        this.userDialogTitle = "用户关联";
        this.getTreeData();
        this.$refs.d1.open();
      },
      toAdd() {
        this.$router.push({path: '/auth/user/add'});
      },
      onRowClick(row) {
        if (this.checkedFields.indexOf(row.field) > -1) {
          delete this.checkedIds[this.checkedFields.indexOf(row.field)];
        } else {
          this.checkedFields.push(row.field);
        }
      },
      selected(event) {
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
          this.data.forEach(function (item, i) {
            _this.checkedIds.push(item.id);
          });
        } else {
          this.checkedIds = [];
        }
      },
      submitForm(dialog) {
        if (this.checkedFields.length <= 0) {
          alert("请至少选中一条数据");
        } else {
          this.displayColumns.forEach((column, index) => {
            column.visible = this.checkedFields.indexOf(column.field) > -1;
          });
          dialog.close();
        }
      },
      confirm() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            console.log("commit json data:" + JSON.stringify(this.user));
            if (this.user.id) {
              this.$api.user.userUpt(this.checkedIds[0]).then((response) => {
                this.loadPage(this.pageNumber, this.pageSize);
                this.$refs.d1.close();
              }).catch(error => {
                console.log("get menu detail error", error);
              });
            } else {
              this.$api.user.userRefAdd(this.user).then((response) => {
                this.loadPage(this.pageNumber, this.pageSize);
                this.$refs.d1.close();
              }).catch(error => {
                console.log("get menu detail error", error);
              });
            }
          }
        });
      },
      grant(event) {
        if (this.checkedIds.length === 1) {
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
            this.userDialogTitle = "关联角色";
            this.$api.user.getRoleTree(this.checkedIds[0]).then((response) => {
              if (response.status === 200) {
                this.roleTreeData = response.data.data;
                getCheckedNodes(this.roleTreeData);
                checkedNodes.forEach((node) => {
                  this.$refs.roleTree.checkNode(node);
                });
              }
            }).catch(error => {
              console.log("error", error);
            });
            this.$refs.d2.open();
          } else if (event === "2") {
            this.userDialogTitle = "功能授权";
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
            this.userDialogTitle = "数据授权";
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
      grantRole() {
        let roleIds = this.$refs.roleTree.getCheckedNodes().map(item => item.id);;
        console.log(roleIds);
        this.$api.user.userGrantRole(this.checkedIds[0], roleIds).then((response) => {
          //console.log("--->", response.data);
          this.loading = false;
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

  .dataList {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    height: 35px;
    border-bottom: 1px solid #eee;
  }
</style>
