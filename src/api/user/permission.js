import request from '@/utils/request'

export function addPermission(data) {
  return request({
    url: '/user/sysPermission/add',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/user/sysPermission/update',
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
    url: '/user/sysPermission/page',
    method: 'post',
    data
  })
}
export function deletePermission(data) {
  return request({
    url: '/user/sysPermission/delete',
    method: 'post',
    data
  })
}
