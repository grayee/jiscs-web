<!-- 1.模板 :html 结构-->
<template>
  <div class="app-container">
    <!-- Main content -->
    <div style="margin:0 0">
      <vxe-form ref="xForm" :data="formData" :rules="formRules" :loading="loading" title-align="right" title-width="100"
                size="medium" @submit="submitEvent" @reset="resetEvent">
        <vxe-form-item title="公司名称" field="companyName" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.companyName" placeholder="请输入公司名称" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司简称" field="shortName" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.shortName" placeholder="请输入公司简称" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司编码" field="companyNo" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.companyNo" placeholder="请输入公司编码" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司标识" field="companyFlag" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.companyFlag" placeholder="请输入公司标识" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司类型" field="companyType" span="10"
                       :item-render="{name: '$select', options: companyType, props: {placeholder: '请输入公司类型'}}"/>

        <vxe-form-item title="所属公司" field="parentId" span="10">
          <template v-slot="scope">
            <treeselect v-model="formData.parentId" placeholder="请选择所属公司" search-nested
                        :multiple="false"
                        :options="companyList"
                        :normalizer="normalizer"
                        :searchable="true"
                        :max-height="500"/>
          </template>
        </vxe-form-item>


        <vxe-form-item title="电子邮件" field="email" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.email" placeholder="请输入电子邮件" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="联系人" field="linkMan" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.linkMan" placeholder="请输入联系人" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="联系电话" field="mobilePhone" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.mobilePhone" placeholder="请输入联系电话" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司网址" field="webSite" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.webSite" placeholder="请输入公司网址" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="公司地址" field="address" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData.address" placeholder="请输入公司地址" clearable
                       @input="$refs.xForm.updateStatus(scope)"/>
          </template>
        </vxe-form-item>

        <vxe-form-item title="座机电话" field="telPhone" span="10">
          <vxe-input v-model="formData.telPhone" type="integer" placeholder="请输入座机电话" clearable/>
        </vxe-form-item>

        <vxe-form-item title="创建日期" field="createDate" span="10">
          <vxe-input v-model="formData.createDate" type="date" placeholder="请选择日期" clearable/>
        </vxe-form-item>

        <vxe-form-item title="邮编" field="postalCode" span="10">
          <vxe-input v-model="formData.postalCode" type="integer" placeholder="请输入邮编" clearable/>
        </vxe-form-item>

        <vxe-form-item title="备注信息" field="remark" span="20">
          <vxe-textarea v-model="formData.remark" placeholder="请输入备注信息" clearable/>
        </vxe-form-item>
        7
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
          <vxe-button type="reset">重置</vxe-button>
          <vxe-button @click="goBack">取消</vxe-button>
        </vxe-form-item>
      </vxe-form>
    </div>
    <!-- /.content -->
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
  import XEUtils from 'xe-utils'
  import Treeselect from '@riophae/vue-treeselect'

  export default {
    components: {Treeselect},
    name: 'Guide',
    data() {
      return {
        value: [],
        msg: null,
        loading: false,
        formData: {parentId: null},
        companyType: [
          {value: 0, label: "总公司"},
          {value: 1, label: "分公司"},
          {value: 2, label: "中支公司"},
          {value: 3, label: "本部"}
        ],
        companyList: [],
        formRules: {
          companyName: [
            {required: true, message: '请输入公司名称'},
            {min: 3, max: 50, message: '长度在 3 到 50 个字符'}
          ],
          shortName: [
            {required: true, message: '请输入公司简称'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符'}
          ],
          companyNo: [
            {required: true, message: '请选择性别'}
          ],
          email: [
            {required: true, message: '请输入邮件地址'}
          ],
          telPhone: [
            {required: true, message: '请输入座机号码'},
            {digits: 11, message: '座机号码为 11 个数字'}
          ],
          mobilePhone: [
            {required: true, message: '请输入手机号码'},
            {digits: 11, message: '手机号码为 11 个数字'}
          ]
        }
      }
    },
    mounted() {
      this.msg = '123'
    },
    created() {
      this.getOrgRelation();
    },
    methods: {
      getOrgRelation() {
        this.$api.org.getRelationTree('1').then((response) => {
          if (response.code === 0) {
            this.companyList = response.data
            //删除空的children 属性，避免和 Treeselect 组件冲突！！！
            XEUtils.eachTree(this.companyList, item => {
              if (item.children && item.children.length === 0) {
                delete item.children
              }
            });
          }
          return true;
        }).then((result) => {
          if (this.$route.params.id != null || this.$route.params.orgId != null) {
            let detailId = this.$route.params.id || this.$route.params.orgId;
            //编辑
            this.detail(detailId)
          }
          if (this.$route.params.pid != null) {
            //新增
            this.formData.parentId = this.$route.params.pid;
          }
        }).catch(error => {
          console.log("error", error);
        });
      },
      detail(id) {
        this.$api.company.companyDetail(id).then((response) => {
          this.formData = response.data;
        }).catch(error => {
          console.log("get company detail error", error);
        });
      },
      update() {
        this.$api.company.companyUpt(this.formData).then((response) => {
          this.$XModal.message({message: '更新成功', status: 'success'})
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.go(-1);
        }).catch(error => {
          this.$XModal.message({message: '错误信息:' + error.data.message, status: 'error'})
        });
      },
      add() {
        this.$api.company.companyAdd(this.formData).then((response) => {
          this.$XModal.message({message: '保存成功', status: 'success'})
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.go(-1);
        }).catch(error => {
          this.$XModal.message({message: '错误信息:' + error.data.message, status: 'error'})
        });
      },
      goBack() {
        this.$store.dispatch('tagsView/delView', this.$route)
        this.$router.go(-1)
      },
      submitEvent() {
        this.loading = true;
        if (this.$route.query.id != null || this.$route.query.orgId != null) {
          this.update();
        } else {
          this.add();
        }
      },
      resetEvent() {
        //this.$XModal.message({ message: '重置事件', status: 'info' })
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

