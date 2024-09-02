// 停车场接口

// 修改格式
import qs from 'qs' 

import request from '@/utils/request'

// 新增停车场
export const parkingAdd = (data) => {
    return request({
        url: '/parking/add',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 获取停车场列表
export const getParkingList = (data) => {
    return request({
        url: '/parking/list',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 删除停车场
export const deleteParking = (id) => {
    return request({
        url: `/parking/delete?id=${id}`,
        method: 'GET'
    })
}

// 获取停车场详情
export const getParkingDetail = (id) => {
    return request({
        url: `/parking/detail?id=${id}`,
        method: 'GET',
    })
}

// 编辑停车场
export const editParking = (data) => {
    return request({
        url: '/parking/edit',
        method: 'POST',
        data: qs.stringify(data)
    })
}

// 修改禁启用状态
export const changeEnable = (id, enable) => {
    return request({
        url: `/parking/changeEnable?id=${id}&enable=${enable}`,
        method: 'GET'
    })
}