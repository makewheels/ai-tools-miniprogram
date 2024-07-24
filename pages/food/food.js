const request = require('../utils/request.js')

Page({
  data: {
    resultMarkdown: ''
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
    var extension = filePath.split('.').pop();
    request.get('/food/createTask?extension=' + extension)
        .then(response => {
          this.getUploadCredentials(response.data)
        })
  },

  // 获取上传凭证
  getUploadCredentials(data){
    var fileId = data.originalImageFileId
    request.get('/file/getUploadCredentials?fileId=' + fileId)
    .then(response => {
      this.uploadFile(data, credentials);
    })
  },

  // 上传文件
  uploadFile(data, credentials){
    
  },

  // 通知文件上传完成
  uploadFinish(data){
    var fileId = data.originalImageFileId
    request.get('/file/uploadFinish?fileId=' + fileId)
    .then(response => {
      this.startTask(data);
    })
  },

  // 发起识别
  startTask(data){
    var taskId =  data.id
    request.get('/food/startTask?taskId=' + taskId)
    .then(response => {
      this.setData({resultMarkdown:response.data.resultMarkdown})
      console.log(response)
    })
  }
});