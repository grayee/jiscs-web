<!-- 组织管理视图 -->
<!-- 1.模板 :html 结构-->
<template>
  <div>
      <Layout>

        <LayoutPanel region="west" :bodyStyle="{padding:'3px'}" style="width:150px;">
          <Tree :data="menuData" :checkbox="true"></Tree>
        </LayoutPanel>

        <LayoutPanel region="center" style="height:100%" :bodyStyle="{padding:'5px'}">
          <Panel title="查询条件" :collapsible="true" :bodyStyle="{padding:'10px',marginBottom:'5px'}">
            <div style="margin-bottom:10px">
              <Label for="d2" style="text-align: right">日期： </Label>
              <DateBox inputId="d2" v-model="value" format="yyyy-MM-dd"></DateBox>
              至
              <DateBox inputId="d2" v-model="value" format="yyyy-MM-dd"></DateBox>
              <Label for="c1" style="text-align: right">条件1: </Label>
              <ComboBox inputId="c1" v-model="value" :data="data"></ComboBox>
            </div>
            <div style="margin-bottom:10px">
              <div style="float: left">
                <Label for="name" style="text-align: right">条件2:</Label>
                <TextBox inputId="name"></TextBox>
                <Label for="n1" style="text-align: right">条件3:</Label>
                <NumberBox inputId="n1" :value="100" :spinners="true"></NumberBox>
              </div>
              <div style="float: right">
                <LinkButton iconCls="icon-search" style="width:80px">查询</LinkButton>
                <LinkButton iconCls="icon-cancel" style="width:80px"> 重置</LinkButton>
              </div>
            </div>
          </Panel>

          <Panel title="列表" :bodyStyle="{padding:'3px'}">

            <template slot="header">
              <div class="f-row">
                <div class="f-full" style="line-height:30px">列表</div>
                <div>
                  <LinkButton iconCls="icon-add" :plain="true">新增</LinkButton>
                  <LinkButton iconCls="icon-reload" :plain="true">刷新</LinkButton>
                  <LinkButton iconCls="icon-remove" :plain="true">删除</LinkButton>
                  <LinkButton iconCls="icon-edit" :plain="true">编辑</LinkButton>
                  <LinkButton iconCls="icon-print" :plain="true">打印</LinkButton>
                  <LinkButton iconCls="icon-back" :plain="true"></LinkButton>
                </div>
              </div>
            </template>

            <DataGrid style="height:100%"
                      :pagination="true"
                      :lazy="true"
                      :pageList="pageList"
                      :data="data"
                      :total="total"
                      :loading="loading"
                      :pageNumber="pageNumber"
                      :pageSize="pageSize"
                      :pagePosition="pagePosition"
                      :pageLinks="5"
                      :pageLayout="['list','sep','first','prev','sep','tpl','sep','next','last','sep','refresh','links','info']"
                      @pageChange="onPageChange($event)">

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
                  <input type="checkbox" @click="checkAll($event)" />
                </template>
                <template slot="body" slot-scope="scope">
                  <input type="checkbox" v-model="checkedIds" :value="scope.row.inv"/>
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

              <GridColumn field="inv" title="Inv No"></GridColumn>
              <GridColumn field="name" title="Name"></GridColumn>
              <GridColumn field="amount" title="Amount" align="right" sortable="true"></GridColumn>
              <GridColumn field="price" title="Price" align="right" sortable="true"></GridColumn>
              <GridColumn field="cost" title="Cost" align="right"></GridColumn>
              <GridColumn field="note" title="Note"></GridColumn>
            </DataGrid>

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
        total: 0,
        pageNumber: 1,
        pageSize: 20,
        data: [],
        checkedIds:[],
        menuData: [
          {
            text: "Item1",
            children: [
              {text: "Item11"},
              {
                text: "Item12",
                state: "closed",
                children: [
                  {text: "Iteme121"},
                  {text: "Iteme122"},
                  {text: "Iteme123"}
                ]
              },
              {text: "Item13"},
              {text: "Item14"}
            ]
          },
          {text: "Item2"}
        ],
        pageList: [10, 20, 30, 40, 50],
        loading: false,
        pagePosition: "bottom",
        pageOptions: [
          {value: "bottom", text: "Bottom"},
          {value: "top", text: "Top"},
          {value: "both", text: "Both"}
        ]
      };
    },
    created() {
      this.loadPage(this.pageNumber, this.pageSize);
    },
    methods: {
      onPageChange(event) {
        this.loadPage(event.pageNumber, event.pageSize);
      },
      loadPage(pageNumber, pageSize) {
        this.loading = true;
        setTimeout(() => {
          let result = this.getData(pageNumber, pageSize);
          this.total = result.total;
          this.pageNumber = result.pageNumber;
          this.data = result.rows;
          this.loading = false;
        }, 1000);
      },
      getData(pageNumber, pageSize) {
        let total = 100000;
        let data = [];
        let start = (pageNumber - 1) * pageSize;
        for (let i = start + 1; i <= start + pageSize; i++) {
          let amount = Math.floor(Math.random() * 1000);
          let price = Math.floor(Math.random() * 1000);
          data.push({
            inv: "Inv No " + i,
            name: "Name " + i,
            amount: amount,
            price: price,
            cost: amount * price,
            note: "Note " + i
          });
        }
        return {
          total: total,
          pageNumber: pageNumber,
          pageSize: pageSize,
          rows: data
        };
      },
      checkAll(event){
        if(event.currentTarget.checked){
          this.checkedIds = [];
          let _this = this;
          this.data.forEach(function(item, i) {
            _this.checkedIds.push(item.inv);
          });
        }else{
          this.checkedIds = [];
        }
      }
    }
  };
</script>

<!-- 3.样式:解决样式     -->
<style scoped>
  .panel-header {
    background-color: #f5f5f5;
  }
</style>
<!--
https://www.cnblogs.com/wyguo/p/3556049.html
-->
