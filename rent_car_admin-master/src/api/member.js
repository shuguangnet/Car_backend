// 会员接口

// 修改格式
import qs from 'qs' 

import request from '@/utils/request'


// 删除会员
export const memberDelete = (id) => {
    return request({
        url: `/member/delete?id=${id}`,
        method: 'GET'
    })
}

// 获取会员详情
export const getMemberDetail = (id) => {
    return request({
        url: `/member/detail?id=${id}`,
        method: 'GET',
    })
}
