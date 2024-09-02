// 公共接口

// 修改格式
import qs from 'qs' 

import request from '@/utils/request'

// 获取城市列表
export const getCity = (data) => {
    return request({
        url: '/cityPicker',
        method: 'POST',
        data: qs.stringify(data)
    })
}

/**
 * 封装的table组件请求数据
 */
export const tableData = (params) => {
    return request({
        url: params.url,
        method: params.method,
        data: qs.stringify(params.data)
    })
}