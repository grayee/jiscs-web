<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout style="height:100%">
        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">

          <Form ref="form" :model="user" :labelAlign="right" class="form-horizontal">
            <fieldset>
              <legend>登录信息</legend>
              <div class="main">
                <div class="divRow">
                  <div>
                    <Label for="username" align="right">用户名称:</Label>
                    <TextBox inputId="username" name="username" v-model="user.username" v-validate="'required|min:4'"
                             style="width:18em" data-vv-as="用户名称" placeholder="请输入用户名称"></TextBox>
                    <div class="error">{{ veeErrors.first('username') }}</div>
                  </div>
                  <div>
                    <Label for="loginId" align="right">登录账号:</Label>
                    <TextBox inputId="loginId" name="loginId" v-model="user.loginId" v-validate="'required|max:10'"
                             style="width:18em" data-vv-as="登录账号" placeholder="请输入登录账号"></TextBox>
                    <div class="error">{{ veeErrors.first('loginId') }}</div>
                  </div>
                </div>
                <div class="divRow">
                  <div>
                    <Label for="password" align="right">登录密码:</Label>
                    <PasswordBox inputId="password" name="password" v-model="user.password" style="width:14em"
                                 v-validate="'required|min:6'" ref="password"
                                 data-vv-as="登录密码" placeholder="请输入登录密码:"></PasswordBox>
                    <span style="color: red; ">*</span>
                    <div class="error">{{ veeErrors.first('password') }}</div>
                  </div>
                  <div>
                    <Label for="pwdConfirm" align="right">确认密码:</Label>
                    <PasswordBox inputId="pwdConfirm" name="pwdConfirm" v-model="user.pwdConfirm" style="width:14em"
                                 v-validate="'required|confirmed:password'" data-vv-as="确认密码"
                                 placeholder="请确认登录密码:"></PasswordBox>
                    <span style="color: red; ">*</span>
                    <div class="error">{{ veeErrors.first('pwdConfirm') }}</div>
                  </div>
                </div>
              </div>
            </fieldset>


            <fieldset>
              <legend>基础信息</legend>
              <div class="main">
                <div class="divRow">
                  <div>
                    <Label for="nickname" align="right">昵称:</Label>
                    <TextBox inputId="nickname" name="nickname" v-model="user.nickname"
                             style="width:18em" data-vv-as="昵称" placeholder="请输入昵称"/>
                  </div>
                  <div>
                    <Label for="mobile" align="right">头像:</Label>
                    <DataList :data="files" :border="false"  style="width:120px;height:100px;float:right;margin-right:280px;">
                      <template slot-scope="{row}">
                        <div class="fileitem">
                          <img :src="row.url">
                          <LinkButton iconCls="icon-clear" :plain="true" @click="removeFile(row)"></LinkButton>
                        </div>
                      </template>
                    </DataList>
                    <FileButton style="width:100px" accept="image/*" :plain="true"  :multiple="false" @select="onFileSelect($event)">
                      请选择...
                    </FileButton>
                  </div>
                </div>
                <div class="divRow">
                  <div>
                    <Label for="mobile" align="right">手机号码:</Label>
                    <TextBox inputId="mobile" name="mobile" v-model="user.mobile"
                             v-validate="'max:11'" data-vv-as="手机号码" placeholder="请输入手机号码"/>
                    <div class="error">{{ veeErrors.first('mobile') }}</div>
                  </div>

                </div>

                <div class="divRow">
                  <div>
                    <Label for="tel" align="right">电话:</Label>
                    <TextBox inputId="tel" name="tel" v-model="user.tel"
                             v-validate="'alpha_num'" data-vv-as="电话" placeholder="电话"/>
                    <div class="error">{{ veeErrors.first('tel') }}</div>
                  </div>
                  <div>
                    <Label for="email" align="right">电子邮件:</Label>
                    <TextBox inputId="email" v-validate="'email'" name="email" v-model="user.email"
                             style="width:18em" data-vv-as="电子邮件" placeholder="请输入邮件地址"></TextBox>
                    <div class="error">{{ veeErrors.first('email') }}</div>
                  </div>
                </div>
                <div class="divRow">
                  <div>
                    <Label for="sex" align="right">性别:</Label>
                    <label>
                      <input type="radio" name="sex" id="male" value="male" v-model="user.sex" checked> 男
                    </label>
                    <label>
                      <input type="radio" name="sex" id="female" value="female" v-model="user.sex">女
                    </label>
                  </div>
                  <div>
                    <Label for="address" align="right">联系地址:</Label>
                    <TextBox inputId="t2" name="address" v-model="user.address"
                             v-validate="'max:200'" style="width:20em" data-vv-as="联系地址"
                             placeholder="请输入联系地址"></TextBox>
                    <div class="error">{{ veeErrors.first('address') }}</div>
                  </div>
                </div>

                <div class="divRow">
                  <div>
                    <Label for="remark" align="right">备注:</Label>
                    <TextBox inputId="t2" name="remark" :multiline="true" v-model="user.remark"
                             style="width:73%;height:120px;"></TextBox>
                    <div class="error">{{ veeErrors.first('remark') }}</div>
                  </div>
                </div>
              </div>

            </fieldset>

            <div class="formBtn">
              <LinkButton style="width:60px" @click="submitForm()">确认</LinkButton>
              <LinkButton style="width:60px" @click="goBack()">取消</LinkButton>
            </div>
          </Form>
        </LayoutPanel>
      </Layout>
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
  export default {
    data() {
      return {
        loading: false,
        user: {sex: "male"},
        sex: [
          {value: 0, text: "男"},
          {value: 1, text: "女"}
        ],
        userList: [],
        files: []
      };
    },
    created() {
      this.getOrgRelation();
    },
    methods: {
      getOrgRelation() {
        this.$api.org.getRelationTree('4').then((response) => {
          if (response.status === 200) {
            this.userList = response.data.data;
          }
          return true;
        }).then((result) => {
          if (this.$route.query.id != null || this.$route.query.orgId != null) {
            let detailId = this.$route.query.id;
            if (detailId == null || this.$route.query.orgId != null) {
              detailId = this.$route.query.orgId;
            }
            //编辑
            this.$api.user.userDetail(detailId).then((response) => {
              this.user = response.data.data;
            }).catch(error => {
              console.log("get menu detail error", error);
            });
          }
          if (this.$route.params.pid != null) {
            //组织机构新增
            this.user.parentId = this.$route.params.pid;
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      goBack() {
        this.$router.go(-1)
      },
      submitForm() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            if (this.$route.query.id != null || this.$route.query.orgId != null) {
              this.$api.user.userUpt(this.user).then((response) => {
                this.$router.go(-1);
              }).catch(error => {
                this.$messager.alert({title: "错误信息", icon: "error", msg: error.data.message});
              });
            } else {
              this.$api.user.userAdd(this.user).then((response) => {
                this.$router.go(-1);
              }).catch(error => {
                this.$messager.alert({title: "错误信息", icon: "error", msg: error.data.message});
              });
            }
          }
        })
      },
      onFileSelect(event) {
        event.forEach(file => {
          file.url = window.URL.createObjectURL(file);
        });
        this.files = this.files.concat(event);
        console.log(this.files);
        let formData = new FormData();
        formData.append('avatar', this.files[0]);
        this.$api.user.userUploadAvatar(formData).then((response) => {
          console.log(response.data.data);
          this.user.avatar= response.data.data;
        }).catch(error => {
          this.$messager.alert({title: "错误信息", icon: "error", msg: error.data.message});
        });
      },
      removeFile(file) {
        let index = this.files.indexOf(file);
        if (index >= 0) {
          this.files = this.files.filter((file, i) => i != index);
        }
      }
    }
  };
</script>

<!-- 3.样式:解决样式     -->
<style scoped>
  .error {
    margin: 2px 120px;
  }

  .main {
    padding: 20px;
  }

  .divRow {
    overflow: auto;
  }

  .divRow > div {
    width: 48%;
    float: left;
    padding: 3px;
  }

  .formBtn {
    text-align: center;
    clear: both;
    padding: 20px;
  }

  .fileitem {
    height: 70px;
    font-size: 14px;
    padding: 10px;
    display: block;
    align-items: center;
  }

  .fileitem img {
    width: 50px;
    height: 50px;
  }
</style>
