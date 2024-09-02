import {  Message } from 'element-ui'

// 获取点击的经纬度
export function getLnglat(e) {
    return e.lnglat.lng + ',' + e.lnglat.lat
}
// 城市定位
export function tranLnglat(map, address='北京市') {
    var geocoder = new AMap.Geocoder();
    geocoder.getLocation(address, function (status, result) {
        if (status === 'complete' && result.info === 'OK') {
            // 经纬度
            const lng = result.geocodes[0].location.lng
            const lat = result.geocodes[0].location.lat
            //设置地图中心点（平移过去）
            map.panTo([lng, lat]);
        } else {
            console.error('地址查询位置失败');
        }
    });
}

// 覆盖物
let marker = null
export function setMarker(map, lnglat='116.405036,39.917986') {
    // 清除上次点标记
    if (marker) {
        map.remove(marker)
        marker = null
    }
    let lnglatArr = lnglat.split(',')
    lnglatArr[0] = Number(lnglatArr[0])
    lnglatArr[1] = Number(lnglatArr[1])
    // 防止报错，改为默认的
    if (isNaN(lnglatArr[1]) || isNaN(lnglatArr[0])) {
        Message({message: '获取位置出错了，请刷新重试！',type: 'warning'})
        lnglatArr = [116.405036,39.917986]
    }
    marker = new AMap.Marker({
        position: lnglatArr,
    });
    map.add(marker)
    map.setFitView();
}

// 清除覆盖物
export function removeMarker(map) {
    map.remove(marker)
}