const request = require('../../utils/request.js')

Page({
  data: {

  },

  navigateToExtract() {
    wx.navigateTo({
      url: '/pages/extractWord/extract/extract'
    })
  },

  navigateToWordBook() {
    wx.navigateTo({
      url: '/pages/extractWord/wordBook/wordBook'
    })
  },

  onShow() {

  }

})