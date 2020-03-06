import base from './base'; // 导入接口域名列表
import axios from '@/utils/request'; // 导入request中创建的axios实例

const department = {
  // 公司列表
  departmentList(param) {
    return axios.post(`${base.sq}/org/department/list`, param);
  },
  // 部门新增
  departmentAdd(param) {
    return axios.post(`${base.sq}/org/department`, param);
  },
  // 部门新增
  departmentUpt(param) {
    return axios.put(`${base.sq}/org/department`, param);
  },
  // 部门详情,演示
  departmentDetail(id, params) {
    return axios.get(`${base.sq}/org/department/detail/${id}`, {
      params: params
    });
  },
  departmentDel(param) {
    return axios.delete(`${base.sq}/org/department`, {data: param});
  },
  // 其他接口…………
};

export default department;
