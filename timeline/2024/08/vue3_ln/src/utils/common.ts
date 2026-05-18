export function formatTimeDifference(timestamp: number): string | null {
    const now: number = Date.now();
    const diff: number = now - timestamp;

    const minute: number = 60 * 1000;
    const hour: number = 60 * minute;
    const day: number = 24 * hour;
    const month: number = 30 * day; // 近似值，一个月按30天计算

    if (diff < minute) {
        return '1分钟';
    } else if (diff < hour) {
        const minutes: number = Math.floor(diff / minute);
        return `${minutes}分钟`;
    } else if (diff < day) {
        const hours: number = Math.floor(diff / hour);
        return `${hours}小时`;
    } else if (diff < month) {
        const days: number = Math.floor(diff / day);
        return `${days}天`;
    } else if (diff < 3 * month) {
        const months: number = Math.floor(diff / month);
        return `${months}月`;
    } else {
        return null;
    }
}