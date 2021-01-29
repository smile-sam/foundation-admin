import request from '@/utils/request'

export function save(data) {
  return request({
    url: '/flowable/save',
    method: 'post',
    data
  })
}