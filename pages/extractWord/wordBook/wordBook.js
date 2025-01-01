const request = require('../../utils/request.js')

Page({
  data: {
    word: '',               // 存储词汇
    pronunciation: '',      // 存储发音
    meanings: [],           // 存储含义
  },

  requestWord(){
    request.get('/wordBook/randomPick')
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
  },

  onShow() {
    this.requestWord()
  },

  changeWord(){
    this.requestWord()
  }
})
