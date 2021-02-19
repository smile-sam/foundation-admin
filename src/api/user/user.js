import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })

  return request({
    url: '/auth/currentUser',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function addUser(data) {
  return request({
    url: '/user/sysUser/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/sysUser/update',
    method: 'post',
    data
  })
}

export function getById(id) {
  return request({
    url: '/role/' + id,
    method: 'get'
  })
}

export function page(data) {
  return request({
    url: '/user/sysUser/page',
    method: 'post',
    data
  })
}
export function deleteUser(data) {
  return request({
    url: '/user/sysUser/delete',
    method: 'post',
    data
  })
}

