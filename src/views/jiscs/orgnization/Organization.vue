<!-- 组织管理视图 -->
<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout v-if="orgRelationData !== undefined && orgRelationData.length >0">
        <LayoutPanel region="west" :split="true" :collapsible="true"  :expander="true"  :bodyStyle="{padding:'3px'}" title="组织机构树" style="width:200px;">
            <Tree ref="tree" :data="orgRelationData" :checkbox="false" @selectionChange="selected($event)"></Tree>
        </LayoutPanel>

        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">

          <Panel title="详情" :bodyStyle="{padding:'3px'}">
            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">详情</div>
                <div>
                  <MenuButton text="新增" :plain="true" iconCls="icon-add">
                    <Menu @itemClick="add($event)">
                      <MenuItem v-for="(val,index) in subOrgTypes" :key="index" :value="val.value" :text="val.name"></MenuItem>
                    </Menu>
                  </MenuButton>

                  <LinkButton iconCls="icon-edit" :plain="true" @click="edit()">编辑</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true" @click="remove()">删除</LinkButton>
                  <LinkButton iconCls="icon-reload" :plain="true">排序</LinkButton>
                </div>
              </div>
            </template>
            <ul class="list-group">
              <li class="list-group-item" v-for="(org,index) in displayColumns" :key="index"><strong>{{org.title}}：</strong>{{detailContent[org.field]}}
              </li>
            </ul>
          </Panel>
        </LayoutPanel>
      </Layout>

      <Layout v-else>
        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'10px'}">
           <div class="f-full">
             暂无数据,请选择新增的根节点：<br>
             <router-link to="/org/company/add"><i class="fa fa-org" style="font-size: 20px; position: relative; top: 2px; left: -3px;"></i>公司</router-link><br>
             <router-link to="/org/department/add"><i class="fa fa-org" style="font-size: 20px; position: relative; top: 2px; left: -3px;"></i>部门</router-link><br>
             <router-link to="/org/position/add"><i class="fa fa-org" style="font-size: 20px; position: relative; top: 2px; left: -3px;"></i>岗位</router-link><br>
           </div>
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
        orgRelationData: [],
        displayColumns: [],
        detailContent: {},
        subOrgTypes: [],
        curOrgType: null,
        loading: false
      };
    },
    created() {
      this.getOrgRelation();
    },
    methods: {
      getOrgRelation() {
        this.$api.org.getRelationTree('').then((response) => {
          if (response.status === 200) {
            this.orgRelationData = response.data.data;
            this.$refs.tree.selectNode(this.orgRelationData[0]);
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      add(event) {
        let urlName;
        switch (event) {
          case 1:
            urlName = "/org/company/add";
            break;
          case 2:
            urlName = "/org/department/add";
            break;
          case 3:
            urlName = "/org/position/add";
            break;
          case 4:
            urlName = "/org/employee/add";
            break;
          case 5:
            urlName = "/org/role/add";
            break;
          default:
            urlName = "/org/company/add";
            break;
        }
        this.$router.push({name: urlName, params: {pid: this.selectedId}});
      },
      edit() {
        let urlPath;
        switch (this.curOrgType) {
          case 1:
            urlPath = "/org/company/add";
            break;
          case 2:
            urlPath = "/org/department/add";
            break;
          case 3:
            urlPath = "/org/position/add";
            break;
          case 4:
            urlPath = "/org/employee/add";
            break;
          case 5:
            urlPath = "/org/role/add";
            break;
          default:
            urlPath = "/org/company/add";
            break;
        }
        //path来匹配路由，然后通过query来传递参数
        this.$router.push({path: urlPath + '?orgId=' + this.detailContent.id});
      },
      remove(){
        let orgId = this.detailContent.id;
        switch (this.curOrgType) {
          case 1:
            this.$api.company.companyDel([orgId]).then((response) => {
              if (response.status === 200) {
                this.getOrgRelation();
              }
            }).catch(error => {
              this.$messager.alert({title: "错误信息", icon: "error", msg: error.data.message});
            });
            break;
          case 2:

            break;
          case 3:

            break;
          case 4:

            break;
          case 5:

            break;
          default:

            break;
        }
      },
      selected(event) {
        this.selectedId = event.id;
        this.$api.org.getOrgDetail(this.selectedId).then((response) => {
          if (response.status === 200) {
            let result = response.data.data;
            this.displayColumns = result.extras.displayColumns;
            this.detailContent = result.content;
            this.subOrgTypes = result.extras.subOrgTypes;
            this.curOrgType = result.extras.curOrgType;
          }
        }).catch(error => {
          console.log("error", error);
        });
      }
    }
  };
</script>

<!-- 3.样式:解决样式     -->
<style scoped>
  .panel-header {
    background-color: #f5f5f5;
  }

  .panel {
    min-height: 500px;
  }
</style>
<!--
https://www.cnblogs.com/wyguo/p/3556049.html
-->
