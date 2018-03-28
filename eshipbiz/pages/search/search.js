// pages/search/search.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentKeywords:"",
    historyList:[],
    hasHistory: false,
    recommendList: ["活塞环","缸套","水套","主轴承","喷油嘴","高压油管"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var searchHistory = wx.getStorageSync("history") || []
    if (searchHistory.length > 0){
      this.setData({
        historyList: searchHistory,
        currentKeywords: app.globalData.enterpriseKeywords,
        hasHistory: true
      })
    }else{
      this.setData({
        hasHistory: false
      })
    }
  },
  keywordInput: function(e){
      this.setData({
        currentKeywords: e.detail.value
      })
  },
  searchEnterprise: function(){
    var keys = this.data.historyList;
    if (this.data.currentKeywords ==""){
      return;
    }
    if (keys.indexOf(this.data.currentKeywords) == -1){
      keys.unshift(this.data.currentKeywords);
      this.setData({
        historyList: keys
      })
      wx.setStorageSync("history", keys);
    }
    app.globalData.enterpriseKeywords = this.data.currentKeywords;
    wx.switchTab({
      url: '/pages/supplier/supplier',
    })
  },
  searchKeyNav: function(e){
    // 历史记录搜索和热门搜索跳转
    var key = e.target.dataset.key;
    var keys = this.data.historyList;
    if (keys.indexOf(key) == -1) {
      keys.unshift(key);
      this.setData({
        historyList: keys
      })
      wx.setStorageSync("history", keys);
    }
    app.globalData.enterpriseKeywords = key;
    wx.switchTab({
      url: '/pages/supplier/supplier',
    })
  },
  clearHistory:function(){
    wx.removeStorageSync('history');
    this.setData({
      historyList:[],
      hasHistory: false
    })
  }
})