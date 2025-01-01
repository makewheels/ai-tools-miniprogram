const request = require('../utils/request.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    word: '',               // 存储词汇
    pronunciation: '',      // 存储发音
    meanings: [],           // 存储含义
  },
  requestWord(){
    request.get('/word/randomPick')
      .then(response => {
        if (response.code === 0) {
          const wordData = response.data;
          this.setData({
            word: wordData.content,
            pronunciation: wordData.pronunciation,
            meanings: wordData.meanings
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  },
  onShow() {
    this.requestWord()
  },
  changeWord(){
    this.requestWord()
  }
})
