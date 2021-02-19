import request from '@/utils/request'

export function addOrganization(data) {
  return request({
    url: '/user/sysOrganization/add',
    method: 'post',
    data
  })
}

export function updateOrganization(data) {
  return request({
    url: '/user/sysOrganization/update',
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
    url: '/user/sysOrganization/page',
    method: 'post',
    data
  })
}

export function list(data) {
  return request({
    url: '/user/sysOrganization/list',
    method: 'post',
    data
  })
}

export function queryOrgTree(data) {
  return request({
    url: '/user/sysOrganization/queryOrgTree',
    method: 'post',
    data
  })
}

export function deleteOrganization(data) {
  return request({
    url: '/user/sysOrganization/delete',
    method: 'post',
    data
  })
}
