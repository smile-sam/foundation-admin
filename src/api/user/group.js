import request from '@/utils/request'

export function addGroup(data) {
  return request({
    url: '/user/sysGroup/add',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/user/sysGroup/update',
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
    url: '/user/sysGroup/page',
    method: 'post',
    data
  })
}
export function deleteGroup(data) {
  return request({
    url: '/user/sysGroup/delete',
    method: 'post',
    data
  })
}
