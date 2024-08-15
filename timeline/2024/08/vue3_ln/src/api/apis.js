import {request} from '@/utils/request.js'

export function apiGetBanner() {
    return request({
        url:'/homeBanner',
    })
}
export function apiNewsList(data={}) {
    return request({
        url:'/news/',
        data
    })
}
/**
 * 获取新闻详情
 * @param {Object} params - 参数对象
 * @param {number} params.id - 新闻 ID
 * @param {Object} [params.data={}] - 可选的数据对象
 * @returns {Promise} - 返回一个 Promise 对象，包含请求的响应数据
 */
export function apiNewsRead({id,data} = {}) {
    // Notice\News detail
    return request({
        url:`/news/${id}/`,
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
export function apiWallpaper(data = {}) {
    let url = '/wall';
    if (data.id) {
        url += `/${data.id}/`;
        delete data.id; // 删除 id 属性，避免在请求体中重复
    }
    return request({
        url,
        data
    });
}
export function apiScore({method,data}= {}) {
    return request({
        url:'/score/',
        method,
        data
    })
}
export function apiWriteDownload(data={}) {
    return request({
        url:'/downloadWall',
        data
    })
}
export function apiUserInfo() {
    return request({
        url:'/user',
    })
}
export function apiUserWall(data={}) {
    return request({
        url:'/userWallList',
        data
    })
}
export function apiSearch(data={}) {
    return request({
        url:'/search',
        data
    })
}