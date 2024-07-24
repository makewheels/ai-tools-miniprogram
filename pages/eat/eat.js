// index.js
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
        this.uploadImage(res.tempFiles[0].tempFilePath);
      }
    });
  },

  uploadImage(filePath) {
    // 请求服务器获取上传凭证
    wx.request({
      url: 'https://your-server.com/get-upload-credential',
      success: (res) => {
        const { uploadUrl, uploadAuth } = res.data;
        this.uploadToOSS(filePath, uploadUrl, uploadAuth);
      }
    });
  },

  uploadToOSS(filePath, uploadUrl, uploadAuth) {
    wx.uploadFile({
      url: uploadUrl,
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': uploadAuth
      },
      success: () => {
        // 通知后端服务器图片上传完成
        wx.request({
          url: 'https://your-server.com/notify-image-uploaded',
          method: 'POST',
          data: {
            imagePath: filePath
          },
          success: () => {
            this.getRecognitionResult(filePath);
          }
        });
      }
    });
  },

  getRecognitionResult(imagePath) {
    wx.request({
      url: 'https://your-server.com/get-recognition-result',
      data: {
        imagePath: imagePath
      },
      success: (res) => {
        this.setData({
          resultMarkdown: res.data.markdown
        });
      }
    });
  }
});