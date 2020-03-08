<!-- 1.模板 :html 结构-->
<template>
  <div class="app-container">
    <!-- Main content -->
    <div style="margin:30px 0 5px 20px" />
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
      loading: false

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
    }
  }
}
</script>

<!-- 3.样式:解决样式     -->
<style scoped>

</style>

