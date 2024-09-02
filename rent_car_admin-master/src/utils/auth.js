import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const userNameKey = "username"

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() { 
  return Cookies.get(userNameKey); 
}
export function setUsername(value){
   return Cookies.set(userNameKey, value); 
}