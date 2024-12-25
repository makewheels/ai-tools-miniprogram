const request = require('./pages/utils/request.js');

App({
  towxml: require('/towxml/index'),
  
  onLaunch(options) {
    this.login();
  },

  login() {
    var token = wx.getStorageSync('token');
    
    // 校验token，如果没有，执行登录
    if (!token) {
      this.wechatLogin();
    } else {
      // 如果有token，请求服务器校验
      request.get('/user/getUserByToken?token=' + token)
        .then(response => {
          if (response.code !== 0) {
            this.wechatLogin();
          } else {
            this.checkForUpdates();  // 强行更新检查
          }
        });
    }
  },

  wechatLogin() {
    wx.login({
      success: (res) => {
        request.get('/user/login?code=' + res.code)
          .then(response => {
            var token = response.data.token;
            wx.setStorageSync('token', token);
            this.checkForUpdates();  // 强行更新检查
          });
      }
    });
  },

  // 强行检查小程序更新
  checkForUpdates() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 服务器返回是否有新版本
      if (res.hasUpdate) {
        // 强制更新小程序
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，重启应用以应用更新。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // 强制重启小程序
                updateManager.applyUpdate();
              }
            }
          });
        });

        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
          wx.showToast({
            title: '更新失败，请检查网络或稍后再试',
            icon: 'none'
          });
        });
      }
    });
  }
});
