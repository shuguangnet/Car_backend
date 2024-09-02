// 车辆管理接口

import request from '@/utils/request'
import qs from 'qs'


// 添加车辆
export const carAdd = (data) => {
    return request({
        url: '/car/add',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 删除车辆
export const carDelete = (id) => {
    return request({
        url: `/car/delete?id=${id}`,
        method: 'get',
    })
}

// 修改禁启用状态
export const changeEnable = (id, enable) => {
    return request({
        url: `/car/changeEnable?id=${id}&enable=${enable}`,
        method: 'GET'
    })
}

// 获取车辆详情
export const getCarDetail = (id) => {
    return request({
        url: `/car/detail?id=${id}`,
        method: 'GET'
    })
}

// 编辑车辆信息
export const carEdit = (data) => {
    return request({
        url: '/car/edit',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 获取车辆属性列表
export const getCarAttr = (data) => {
    return request({
        url: `/car/attr`,
        method: 'POST',
        data: qs.stringify(data)
    })
}



// 获取车辆品牌列表
export const getBrandList = () => {
    return request({
        url: '/car/brandList',
        method: 'GET',
    })
}

// 获取停车场列表
export const getParkingList = () => {
    return request({
        url: '/car/parkingList',
        method: 'GET',
    })
}