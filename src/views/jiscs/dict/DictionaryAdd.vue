<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout>
        <LayoutPanel region="west" :bodyStyle="{padding:'3px'}" style="width:200px;">
          <Panel title="字典明细树" :bodyStyle="{padding:'3px',marginBottom:'5px',height: '100%'}">
            <Tree ref="tree" :data="dictValues" :checkbox="false" @selectionChange="selected($event)"></Tree>
          </Panel>
        </LayoutPanel>

        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">

          <Panel :bodyStyle="{padding:'3px'}">
            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px"></div>
                <div>
                  <LinkButton iconCls="icon-add" :plain="true" @click="add()">新增</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="remove()">删除</LinkButton>
                  <LinkButton iconCls="icon-back" :plain="true" @click="goBack()"></LinkButton>
                </div>
              </div>
            </template>

            <Form :model="dictValue" :labelWidth="120" labelAlign="right">
              <div class="main">
                <div class="divRow">
                  <div>
                    <Label for="code" align="right">编码:</Label>
                    <TextBox inputId="code" name="code" v-model="dictValue.code" v-validate="'required|max:10'"
                             style="width:18em" data-vv-as="编码" placeholder="请输入编码"/>
                    <div class="error">{{ veeErrors.first('code') }}</div>
                  </div>
                </div>

                <div class="divRow">
                  <div>
                    <Label for="name" align="right">名称:</Label>
                    <TextBox inputId="name" name="name" v-model="dictValue.name"
                             v-validate="'required|max:10'" style="width:18em" data-vv-as="名称" placeholder="请输入名称"/>
                    <div class="error">{{ veeErrors.first('name') }}</div>
                  </div>
                </div>

                <div class="divRow">
                  <div>
                    <Label for="value" align="right">字典值:</Label>
                    <TextBox inputId="value" name="value" v-model="dictValue.value"
                             v-validate="'required|max:10'" style="width:18em" data-vv-as="字典值" placeholder="请输入字典值"/>
                    <div class="error">{{ veeErrors.first('value') }}</div>
                  </div>
                </div>

                <div class="divRow">
                  <Label for="enableStatus" align="right">状态:</Label>
                  <label>
                    <input type="radio" name="enableStatus" id="e1" value="1" v-model="dictValue.enableStatus" checked>
                    启用
                  </label>
                  <label>
                    <input type="radio" name="enableStatus" id="e0" value="0" v-model="dictValue.enableStatus"> 禁用
                  </label>
                </div>

                <div class="divRow">
                  <div>
                    <Label for="orderNo" align="right">显示序号:</Label>
                    <NumberBox inputId="name" name="orderNo" v-model="dictValue.orderNo" :spinners="true"
                               :value="1" v-validate="'max:3'" style="width:8em" data-vv-as="显示序号"
                               placeholder="请输入显示序号"></NumberBox>
                    <div class="error">{{ veeErrors.first('orderNo') }}</div>
                  </div>
                </div>

                <div class="divRow">
                  <div>
                    <Label for="description" align="right">备注:</Label>
                    <TextBox inputId="t2" name="description" :multiline="true" v-model="dictValue.description"
                             style="width:30%;height:120px;"></TextBox>
                    <div class="error">{{ veeErrors.first('description') }}</div>
                  </div>
                </div>

                <div class="formBtn">
                  <LinkButton style="width:60px" @click="submitForm()">保存</LinkButton>
                  <LinkButton style="width:60px" @click="goBack()">返回</LinkButton>
                </div>
              </div>
            </Form>
          </Panel>
        </LayoutPanel>
      </Layout>
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
  export default {
    data() {
      return {
        selectedId: null,
        dictValues: [],
        dictValue: {},
        loading: false
      };
    },
    created() {
      this.getValueTree();
    },
    methods: {
      getValueTree() {
        this.$api.dict.getValueTree(this.$route.query.id).then((response) => {
          if (response.status === 200) {
            this.dictValues = response.data.data;
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      add() {
        this.dictValue = {};
        this.dictValue.enableStatus = 1;
      },
      remove() {
        if(this.dictValue.id){
          this.$api.dict.dictValueDel(this.dictValue.id).then((response) => {
            if (response.status === 200) {
              this.getValueTree();
              this.add();
            }
          }).catch(error => {
            console.log("error", error);
          });
        }else{
          this.$messager.alert({ title: "提示信息", icon: "warning", msg: "请至少选中一条记录!" });
        }
      },
      selected(event) {
        this.selectedId = event.id;
        if (event.attributes) {
          this.dictValue = event.attributes.meta;
        } else {
          this.dictValue = {};
          this.dictValue.enableStatus = 1;
        }
      },
      goBack() {
        this.$router.go(-1);
      },
      submitForm() {
        this.$validator.validateAll().then((valid) => {
          if (valid) {
            if (this.dictValue.id) {
              this.$api.dict.dictValueUpt(this.$route.query.id, this.dictValue).then((response) => {
                if (response.status === 200) {
                  this.getValueTree();
                  this.add();
                }
              }).catch(error => {
                console.log("error", error);
              });
            } else {
              this.$api.dict.dictValueAdd(this.$route.query.id, this.dictValue).then((response) => {
                if (response.status === 200) {
                  this.getValueTree();
                  this.add();
                }
              }).catch(error => {
                console.log("error", error);
              });
            }
          }
        })
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
    width: 100%;
    float: left;
    padding: 3px;
  }

  .formBtn {
    text-align: center;
    clear: both;
    padding: 20px;
  }

  .panel-header {
    background-color: #f5f5f5;
  }

  .panel {
    min-height: 500px;
  }
</style>
