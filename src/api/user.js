import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/oauth',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/userinfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout/oauth',
    method: 'post'
  })
}
