import request from '@/utils/request'

export function getCaptchaCode(data) {
  return request({
    url: '/user/captcha',
    method: 'post',
    data
  })
}
