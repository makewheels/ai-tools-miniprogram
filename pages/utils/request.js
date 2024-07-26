  const request = {
    get(url) {
      return this._request('GET', url, {});
    },

    post(url, data = {}) {
      return this._request('POST', url, data);
    },
    
    getApiUrl() {
      let envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
      if (envVersion == 'develop') {
        return 'http://localhost:5039';
        // return 'https://ai-tools.gpt6.plus';
      } else if (envVersion == 'trial') {
        return 'https://ai-tools.gpt6.plus';
      } else {
        return 'https://ai-tools.gpt6.plus';
      }
    },

    _request(method, url, data = {}) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: this.getApiUrl() + url,
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
  }

  module.exports = request;