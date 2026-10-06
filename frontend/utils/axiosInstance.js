import axios from 'axios'

export const backendUrl=import.meta.env.VITE_BACKEND_URL;

const axiosInstance=axios.create({
  baseURL:backendUrl
})
// Har request ke sath agar token localStorage me mojood ho to
// Authorization header khud add ho jaye ga (Bearer token)

axiosInstance.interceptors.request.use((config)=>{
  const token=localStorage.getItem('hh_token')
  if(token){
    config.headers.Authorization=`Bearer ${token}`
  }
  return config
})
export default axiosInstance;