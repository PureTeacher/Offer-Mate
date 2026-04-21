import request from '../http/request.js'

// 问卷结果相关API
export const questionnaireApi = {
  // 保存问卷结果
  saveResult(data) {
    return request({
      url: '/questionnaireResults/savePhq9Result',
      method: 'POST',
      data
    })
  },

  // 获取用户问卷结果列表
  getUserResults(userId) {
    return request({
      url: `/questionnaireResults/listByUserId/${userId}`,
      method: 'GET'
    })
  },

  // 获取用户最新问卷结果
  getLatestResult(userId) {
    return request({
      url: `/questionnaireResults/latestByUserId/${userId}`,
      method: 'GET'
    })
  },

  // 获取问卷结果详情
  getResultDetail(id) {
    return request({
      url: `/questionnaireResults/${id}`,
      method: 'GET'
    })
  },

  // 删除问卷结果
  deleteResult(id) {
    return request({
      url: `/questionnaireResults/${id}`,
      method: 'DELETE'
    })
  },

  // 批量删除问卷结果
  batchDeleteResult(ids) {
    return request({
      url: '/questionnaireResults/batch',
      method: 'DELETE',
      data: ids
    })
  },

  // 统计问卷结果数量
  getResultCount(params) {
    return request({
      url: '/questionnaireResults/count',
      method: 'GET',
      data: params
    })
  }
}
