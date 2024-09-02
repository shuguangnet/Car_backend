import request from '@/utils/request'

export function login(data) {
  return request({
   
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  const data = new URLSearchParams();
  data.append('token', token);
  return request({
   
    url: '/getUserInfo',
    method: 'post',
    data
  })
}

export function logout(token) {
  const data = new URLSearchParams();
  data.append('token', token);
  return request({
    url: '/logout/',
    method: 'post',
    data
  })
}
