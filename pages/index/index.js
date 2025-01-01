Page({
  navigateToFood() {
    wx.navigateTo({
      url: '/pages/food/food'
    })
  },
  
  navigateToWordExplain() {
    wx.navigateTo({
      url: '/pages/wordExplain/wordExplain'
    })
  },

  navigateToExtractWordHome() {
    wx.navigateTo({
      url: '/pages/extractWord/home/home'
    })
  }
});