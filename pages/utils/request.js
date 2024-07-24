// 发送 GET 请求
function get(url) {
  return request('GET', url);
}

// 发送 POST 请求
function post(url, data = {}) {
  return request('POST', url, data);
}

// 发送请求的通用函数
function request(method, url, data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: getApiUrl() + url,
      method: method,
      data: data,
      header: {
        'token': wx.getStorageSync('token')
      },
      success: (res) => {
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 根据小程序的 `wx.getAccountInfoSync()` 获取环境
// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/account-info/wx.getAccountInfoSync.html
function getApiUrl() {
  let envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
  if (envVersion == 'develop') {
    return 'http://localhost:5039';
  } else if (envVersion == 'trial') {
    return 'https://ai-tools.gpt6.plus';
  } else{
    return 'https://ai-tools.gpt6.plus';
  }
}

module.exports = { get, post };