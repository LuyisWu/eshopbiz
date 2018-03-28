// pages/supplier/supplier.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    enterpriseKeywords: "",
    managementModelName:"",
    enterpriseList:[],
    total:0,
    hideBottom: true,
    loadMoreData: "加载更多",
    hideHeader: true,
    scrollHeight:0,
    refreshMsg:"刷新中",
    open: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight
    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight,
      enterpriseKeywords: app.globalData.enterpriseKeywords
    })
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   app.globalData.enterpriseKeywords = "";
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  keywordNav: function(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  openFilter:function(e){
    this.setData({
      open: true
    })
  },
  refresh: function(e){
    var self = this;
    self.setData({
      refreshMsg: "刷新中",
      hideHeader: false
    });
    setTimeout(function () {
      self.setData({
        page: 1,
        refreshMsg: "刷新中",
        hideHeader: true
      })
      self.getData();
    }, 1000);
  },
  showMoreEnterprise: function(){
    var self =this;
    var currentpage = self.data.page;
    var total = self.data.total;
    var size = self.data.pageSize;
    if (currentpage == Math.ceil(total / size)) {
      self.setData({
        loadMoreData: '已经到顶',
        hideBottom: false
      })
      setTimeout(function () {
        self.setData({
          hideBottom: true
        })
      },1000)
      return;
    }
    self.setData({
      loadMoreData: '加载更多',
      hideBottom: false
    })
    if (currentpage < Math.ceil(total / size)) {
      setTimeout(function () {
        self.setData({
          page: currentpage + 1,
          hideBottom: true
        })
        self.getData();
      },1000);
    }
  },
  getData: function(){
    var self = this;
    var pageIndex = self.data.currentPage;
    var enterpriseList = self.data.enterpriseList || [];
    wx.request({
      url: app.globalData.domains.mallHomeDomain + '/wechat/enterprise',
      data: {
        page: self.data.page,
        pageSize: self.data.pageSize,
        enterpriseKeywords: self.data.enterpriseKeywords,
        managementModelName: self.data.managementModelName
      },
      success: function (res) {
        var dataModel = res.data;
        var showEnter = "";
        if (dataModel.status ==200){
          if (dataModel.total ==0){
            self.setData({
              refreshMsg: "无相关供应商",
              hideHeader: false,
              enterpriseList:[]
            });
            return;
          }
          showEnter = enterpriseList.concat(dataModel.data);
          self.setData({
            enterpriseList: showEnter,
            total: dataModel.total,
            hideBottom: true
          });
        }
      }
    })
  }
})