const request = require('../utils/request.js')
const towxml = require('../../towxml/index.js')

Page({
  data: {
    resultMarkdown: {},
    imageUrl: ''
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.createTask(res.tempFiles[0].tempFilePath);
      }
    });
  },
    
  // 新建任务
  createTask(filePath) {
    wx.showLoading({
      title: '上传中',
    })
    var extension = filePath.split('.').pop();
    request.get('/food/createTask?extension=' + extension)
        .then(response => {
          this.getUploadCredentials(response.data, filePath)
        })
  },

  // 获取上传凭证
  getUploadCredentials(data, filePath){
    var fileId = data.originalImageFileId
    request.get('/file/getUploadCredentials?fileId=' + fileId)
    .then(response => {
      this.uploadFile(data, response.data, filePath);
    })
  },

  // 上传文件
  // 阿里云小程序上传对象存储文档 https://help.aliyun.com/zh/oss/use-cases/wechat-applet-uploads-files-directly-to-oss
  uploadFile(data, credentials, filePath){
    wx.uploadFile({
      url: 'https://' + credentials.bucket + "." + credentials.endpoint,
      filePath: filePath,
      name: 'file',
      formData: {
        key: credentials.key,
        policy: credentials.policy,
        OSSAccessKeyId: credentials.accessKeyId,
        signature: credentials.signature,
        'x-oss-security-token': credentials.securityToken
      },
      success: (res) => {
        this.uploadFinish(data);
      }
    });
  },

  // 通知文件上传完成
  uploadFinish(data){
    var fileId = data.originalImageFileId
    request.get('/file/uploadFinish?fileId=' + fileId)
    .then(response => {
      this.startTask(data);
    })
    // 显示图片
    var url = request.getApiUrl() + '/file/access?fileId=' + fileId
    this.setData({imageUrl: url})
  },

  // 发起识别
  startTask(data){
    var taskId = data.id
    request.get('/food/startTask?taskId=' + taskId)
    .then(response => {
      this.loopResult(taskId)
    })
  },

  // 轮询查询结果
  async loopResult(taskId) {
    var food = {}
    for (let i = 0; i < 120; i++) {
      if (food.status === 'finished') {
        break;
      }
      wx.showLoading({
        title: '识别中' +(i + 1),
      })
      const response = await request.get('/food/getById?taskId=' + taskId)
      food = response.data
      await new Promise((resolve) => setTimeout(resolve, 1200))
    }
    // 渲染markdown https://github.com/sbfkcel/towxml
    this.setData({resultMarkdown: getApp().towxml(food.result, 'markdown')})
    wx.hideLoading()
  }
});