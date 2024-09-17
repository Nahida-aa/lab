import {baseURL,is_dev} from '@/config/index.js'
const API_URL = baseURL+'/api/wallpaper'

export function request({
    url = '',
    method = 'GET',
    header = {},
    data = {}
} = {}) {
    header['access-key'] = 'Nahida-aa'
    return new Promise((resolve, reject) => {
        uni.request({
            url: API_URL + url,
            method: method,
            header,
            // header: {
            //     'access-key': 'Nahida-aa',
            //     ...header
            // },
            data: data,
            success: (res) => {
                if (res.data.errCode === 0) {
                    // if(is_dev) console.log('res', res)
                    resolve(res.data)
                } else if (res.data.errCode === 400) {
                    uni.showModal({
                        title: '提示',
                        content: res.data.errMsg,
                        showCancel: false,
                    })
                    reject(res.data)
                } else {
                    uni.showToast({
                        title: '意外错误',
                        icon: 'none'
                    })
                    reject(res.data)
                }
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}