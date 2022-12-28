import axios from 'axios'
import store from '../store'

let api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.bigbikebash.org.uk/v1' : 'http://localhost:8081/v1'
})

api.interceptors.request.use((config) => {
  if (store.state.admin.jwt) {
    config.headers['Authorization'] = 'Bearer ' + store.state.admin.jwt
  }

  return config
})

export default api
