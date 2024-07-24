const request = {
  get(url) {
    return this._request('GET', url, {});
  },

  post(url, data = {}) {
    return this._request('POST', url, data);
  },
  
  _request(method, url, data = {}) {
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
};

function getApiUrl() {
  let envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
  if (envVersion == 'develop') {
    return 'http://localhost:5039';
  } else if (envVersion == 'trial') {
    return 'https://ai-tools.gpt6.plus';
  } else {
    return 'https://ai-tools.gpt6.plus';
  }
}

module.exports = request;