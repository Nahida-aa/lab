// config/index.js
const devBaseURL = 'http://127.0.0.1:8000'
const proBaseURL = 'https://nahida-aa.us.kg'
// const is_dev = process.env.NODE_ENV === 'development';
const is_dev = false
const baseURL = is_dev ? devBaseURL : proBaseURL
export {
    baseURL,
    is_dev
}
// console.log('baseURL',baseURL)
export const defaultAvatar = '/static/images/xc.ico'