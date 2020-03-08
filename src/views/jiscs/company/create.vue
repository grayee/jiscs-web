<!-- 1.模板 :html 结构-->
<template>
  <div class="app-container">
    <!-- Main content -->
    <div style="margin:0 0">
      <vxe-form ref="xForm" :data="formData3" :rules="formRules3" :loading="loading3" title-align="right" title-width="100" size="medium" @submit="submitEvent3" @reset="resetEvent">
        <vxe-form-item title="名称" field="name" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData3.name" placeholder="请输入名称" clearable @input="$refs.xForm.updateStatus(scope)" />
          </template>
        </vxe-form-item>
        <vxe-form-item title="昵称" field="nickname" span="10">
          <template v-slot="scope">
            <vxe-input v-model="formData3.nickname" placeholder="请输入昵称" clearable @input="$refs.xForm.updateStatus(scope)" />
          </template>
        </vxe-form-item>
        <vxe-form-item title="性别" field="sex" span="10">
          <template v-slot="scope">
            <vxe-select v-model="formData3.sex" placeholder="请选择性别" clearable @change="$refs.xForm.updateStatus(scope)">
              <vxe-option value="1" label="女" />
              <vxe-option value="2" label="男" />
            </vxe-select>
          </template>
        </vxe-form-item>
        <vxe-form-item title="年龄" field="age" span="10">
          <vxe-input v-model="formData3.age" type="integer" placeholder="请输入年龄" clearable />
        </vxe-form-item>
        <vxe-form-item title="日期" field="date" span="10">
          <vxe-input v-model="formData3.date" type="date" placeholder="请选择日期" clearable />
        </vxe-form-item>
        <vxe-form-item title="地址" field="address" span="20">
          <vxe-textarea v-model="formData3.address" placeholder="请输入地址" clearable />
        </vxe-form-item>
        <vxe-form-item align="center" span="24">
          <vxe-button type="submit" status="primary">提交</vxe-button>
          <vxe-button type="reset">重置</vxe-button>
        </vxe-form-item>
      </vxe-form>

    </div>
    <!-- /.content -->
  </div>
</template>

<!-- 2.行为 :处理逻辑-->
<script>
export default {
  name: 'Guide',
  data() {
    return {
      msg: null,
      loading: false,
      formData3: {
        name: '',
        nickname: '',
        sex: '',
        age: 26,
        date: null,
        address: null
      },
      formRules3: {
        name: [
          { required: true, message: '请输入名称' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
        ],
        nickname: [
          { required: true, message: '请输入昵称' }
        ],
        sex: [
          { required: true, message: '请选择性别' }
        ]
      }
    }
  },
  mounted() {
    this.msg = '123'
  },
  created() {

  },
  methods: {
    guide() {
      console.log('1111')
    },
    submitEvent3() {
      this.loading3 = true
      setTimeout(() => {
        this.loading3 = false
        this.$XModal.message({ message: '保存成功', status: 'success' })
      }, 1000)
    },
    resetEvent() {
      this.$XModal.message({ message: '重置事件', status: 'info' })
    }
  }
}
</script>

<!-- 3.样式:解决样式     -->
<style scoped>

</style>

