const request = require('../../utils/request.js')

Page({
  data: {
    imageUrl: '',
    wordList: [],
    isRecognized: false,  // 控制识别结果显示
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
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    this.setData({
      wordList: task.resultWordList,
      isRecognized: true
    })

    wx.hideLoading()
    wx.showToast({
      title: '提取完成',
      icon: 'success',
      duration: 2000
    })
  },

  // 一键复制按钮的点击事件
  onCopyClick: function() {
    // 直接访问 this.data 获取 wordList
    const wordList = this.data.wordList;

    // 检查 wordList 是否有效并进行拼接
    if (wordList && wordList.length > 0) {
      let wordListString = '';

      // 遍历单词列表，拼接字符串
      for (let i = 0; i < wordList.length; i++) {
        wordListString += wordList[i];  // 拼接单词
        if (i < wordList.length - 1) {
          wordListString += '\n';  // 在每个单词后加换行符，除了最后一个
        }
      }

      // 设置剪贴板内容
      wx.setClipboardData({
        data: wordListString,  // 设置拼接后的字符串
        success: function() {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        },
        fail: function() {
          wx.showToast({
            title: '复制失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '单词列表为空',
        icon: 'none'
      });
    }
  }

});