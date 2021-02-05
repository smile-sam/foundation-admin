import request from '@/utils/request'

export function addRole(data) {
  return request({
    url: '/user/sysRole/add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/user/sysRole/update',
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
    url: '/user/sysRole/page',
    method: 'post',
    data
  })
}
export function deleteRole(data) {
  return request({
    url: '/user/sysRole/delete',
    method: 'post',
    data
  })
}


