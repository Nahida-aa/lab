export function formatTimeDifference(timestamp) {
    console.log('timestamp:', timestamp);
    const now = Date.now();
    console.log('now:', now);
    const diff = now - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day; // 近似值，一个月按30天计算

    if (diff < minute) {
        return '1分钟';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}分钟`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours}小时`;
    } else if (diff < month) {
        const days = Math.floor(diff / day);
        return `${days}天`;
    } else if (diff < 3 * month) {
        const months = Math.floor(diff / month);
        return `${months}月`;
    } else {
        return null;
    }
}

export function gotoHome() {
    uni.showModal({
        title: '提示',
        content: '页面有误将返回首页',
        showCancel: false,
        success: function (res) {
            if (res.confirm) {
                uni.switchTab({
                    url: '/pages/index/index'
                });
            }
        }
    })
}