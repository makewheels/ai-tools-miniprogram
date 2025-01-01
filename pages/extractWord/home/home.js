const request = require('../../utils/request.js')

Page({
  data: {
    wordList: []
  },

  // 跳转到提取单词页面
  navigateToExtract() {
    wx.navigateTo({
      url: '/pages/extractWord/extract/extract'
    })
  },

  // 跳转到单词本页面
  navigateToWordBook() {
    wx.navigateTo({
      url: '/pages/extractWord/wordBook/wordBook'
    })
  },

  /**
   * 获取我的单词本
   */
  listMyWordBook() {
    request.get('/wordBook/listMyWordBook')
      .then(response => {
        if (response.code === 0) {
          const wordData = response.data;
          // 将获取到的数据格式化为需要的格式
          const wordList = wordData.map(item => ({
            id: item.id,
            content: item.content,
            meaningChinese: item.meanings[0]?.meaningChinese || '无中文释义'
          }));
          
          // 更新页面的数据
          this.setData({
            wordList: wordList
          });
        } else {
          wx.showToast({
            title: '获取单词本失败',
            icon: 'none'
          });
        }
      })
  },

  onShow() {
    // 页面显示时自动获取单词本
    this.listMyWordBook();
  }
});
