
const SYSTEM_INFO = uni.getSystemInfoSync()
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15

export const getTitleBarHeight = ()=>{
    // #ifdef H5
    return 40
    // #endif
    // #ifdef MP
    let {top,height} = uni.getMenuButtonBoundingClientRect()
    return height + (top - getStatusBarHeight())*2
    // #endif
    
}

export const getNavBarHeight = ()=>{
    return getStatusBarHeight() + getTitleBarHeight()
}

// 抖音适配
export const getLeftIconLeft = ()=>{
    // #ifdef MP-TOUTIAO
    console.log(tt.getCustomButtonBoundingClientRect())
    let {leftIcon:{left,width}} = tt.getCustomButtonBoundingClientRect()
    return left + parseInt(width)
    // #endif
    return 0
}      