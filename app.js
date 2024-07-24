const { get, post } = require('./pages/utils/request.js')

App({
  onShow(options) {
    this.login();
  },

  login() {
    get('/healthCheck')
      .then(data => console.log(data))
  },

});