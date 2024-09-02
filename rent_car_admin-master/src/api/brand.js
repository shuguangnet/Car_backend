// 车辆品牌接口

import request from '@/utils/request'

import qs from 'qs'

// 获取车辆品牌列表
export const getBrandList = (data) => {
    return request({
        url: '/brand/list',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 新增车辆品牌
export const addBrand = (data) => {
    return request({
        url: '/brand/add',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 删除车辆品牌
export const deleteBrand = (id) => {
    return request({
        url: `/brand/delete?id=${id}`,
        method: 'GET'
    })
}

// 修改车辆品牌状态
export const changeStatus = (id, status) => {
    return request({
        url: `/brand/changeStatus?id=${id}&status=${status}`,
        method: 'GET'
    })
}

// 获取车辆品牌详情
export const getBrandDetail = (id) => {
    return request({
        url: `/brand/detail?id=${id}`,
        method: 'GET'
    })
}

// 修改车辆品牌
export const editBrand = (data) => {
    return request({
        url: '/brand/edit',
        method: 'POST',
        data: qs.stringify(data)
    })
}