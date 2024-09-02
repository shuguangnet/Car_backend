import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getUsername } from '@/utils/auth'
import { resetRouter } from '@/router'


const getDefaultState = () => {
  return {
    token: getToken(),
    name: '' ,
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  async login({ commit }, loginForm) {
    let data = new URLSearchParams()
    data.append("username", loginForm.username.trim())
    data.append('password', loginForm.password.trim())
    let result = await login(data);
    if (result.code === 200) {
      commit('SET_TOKEN', result.token)
      setToken(result.token);
      return 'ok';
    } else {
      return Promise.reject(new Error('fail'))
    }
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { username, user_pic } = data
        commit('SET_NAME', username)
        commit('SET_AVATAR', user_pic)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

