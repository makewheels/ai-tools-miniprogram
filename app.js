const request = require('./pages/utils/request.js')

App({
  onShow(options) {
    this.login();
  },

  login() {
    var token = wx.getStorageSync('token')
    // 校验token，如果没有，执行登录
    if (!token) {
      this.wechatLogin()
    } else {
      // 如果有token，请求服务器校验
      request.get('/user/getUserByToken?token=' + token)
      .then(response => {
        if(response.code != 0){
          this.wechatLogin()
        }
      })
    }
  },

  wechatLogin(){
    wx.login({
      success: (res) => {
        request.get('/user/login?code=' + res.code)
        .then(response => {
          var token = response.data.token;
          wx.setStorageSync('token', token)
        })
      }
    })
  }

});