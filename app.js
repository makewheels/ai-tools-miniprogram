const request = require('./pages/utils/request.js')

App({
  onShow(options) {
    // this.login();
  },

  login() {
    var token = wx.getStorageSync('token')
    if(!token){
      this.wechatLogin()
    }
  },

  wechatLogin(){
    wx.login({
      success: (res) => {
      
      },
    })
  }

});