import {request} from '@/utils/request.js'

export function apiGetBanner() {
    return request({
        url:'/homeBanner',
    })
}
export function apiGetNotice(data={}) {
    return request({
        url:'/newsList',
        data
    })
}
export function apiGetRecommend() {
    return request({
        url:'/recommend',
    })
}
export function apiGetClassify(data={}) {
    return request({
        url:'/classify',
        data
    })
}
export function apiGetWallpaperList(data={}) {
    return request({
        url:'/wallList',
        data
    })
}
export function apiScore({method,data}= {}) {
    return request({
        url:'/score/',
        method,
        data
    })
}