import request from '@/utils/request'

export function addMenu(data) {
  return request({
    url: '/user/sysMenu/add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/user/sysMenu/update',
    method: 'post',
    data
  })
}

export function getById(id) {
  return request({
    url: '/menu/' + id,
    method: 'get'
  })
}

export function page(data) {
  return request({
    url: '/user/sysMenu/page',
    method: 'post',
    data
  })
}
export function list(data) {
  return request({
    url: '/user/sysMenu/list',
    method: 'post',
    data
  })
}

export function queryMenuTree(data) {
  return request({
    url: '/user/sysMenu/queryMenuTree',
    method: 'post',
    data
  })
}

export function deleteMenu(data) {
  return request({
    url: '/user/sysMenu/delete',
    method: 'post',
    data
  })
}
