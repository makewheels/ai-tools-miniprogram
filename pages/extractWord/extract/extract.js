const request = require('../../utils/request.js')

Page({
  data: {
    imageUrl: '',
    resultWordList: []
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
    request.get('/extract/createTask?extension=' + extension)
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
    request.get('/extract/startTask?taskId=' + taskId)
    .then(response => {
      this.loopResult(taskId)
    })
  },

  // 轮询查询结果
  async loopResult(taskId) {
    var task = {}

    for (let i = 0; i < 120; i++) {
      if (task.status === 'finished') {
        break;
      }
      wx.showLoading({
        title: '识别中 ' +(i + 1),
      })
      const response = await request.get('/extract/getById?taskId=' + taskId)
      task = response.data
      await new Promise((resolve) => setTimeout(resolve, 1200))
    }

    console.log(task.resultWordList)
    this.setData({resultWordList: task.resultWordList})

    wx.hideLoading()
    wx.showToast({
      title: '提取完成',
      icon: 'success',
      duration: 2000
    })
  }
});