const BASE_URL = 'http://127.0.0.1:8000/api/wallpaper'

export function request({
    url = '',
    method = 'GET',
    header = {},
    data = {}
} = {}) {
    header['access-key'] = 'Nahida-aa'
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASE_URL + url,
            method: method,
            header,
            // header: {
            //     'access-key': 'Nahida-aa',
            //     ...header
            // },
            data: data,
            success: (res) => {
                if (res.data.errCode === 0) {
                    // console.log('res', res)
                    resolve(res.data)
                } else if (res.data.errCode === 400) {
                    uni.showModal({
                        title: '错误提示',
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