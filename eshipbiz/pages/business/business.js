// pages/mysupplier/mysupplier.js
var app = getApp()
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    Keyword: "",
    inquiryList: [],
    total: 0,
    hideBottom: true,
    scrollHeight: 0,
    inquiryEndTime:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight - 60
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight - 60
    })
    self.getData();
  },
  keywordsInput: function (e) {
    this.setData({
      Keyword: e.detail.value
    })
  },
  search: function () {
    this.refresh();
  },
  refresh: function (e) {
    var self = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      self.setData({
        page: 1
      })
      self.getData();
    }, 300);
  },
  showMore: function () {
    var self = this;
    var currentpage = self.data.page;
    var total = self.data.total;
    var size = self.data.pageSize;
    wx.showNavigationBarLoading();
    if (currentpage == Math.ceil(total / size)) {
      self.setData({
        loadMoreData: '已经到底,无更多数据',
        hideBottom: false
      })
      setTimeout(function () {
        self.setData({
          hideBottom: true
        })
        wx.hideNavigationBarLoading();
      }, 1000)
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
      }, 1000);
    }
  },
  toInquiryDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/inquirydetail/inquirydetail?id=' + id
    })
  },
  getData: function () {
    var self = this;
    var pageIndex = self.data.page;
    var inquiryList = self.data.inquiryList || [];
    wx.request({
      url: app.globalData.domains.mallHomeDomain + '/wechat/inquirysheet',
      data: {
        page: self.data.page,
        pageSize: self.data.pageSize,
        q: self.data.Keyword
      },
      success: function (res) {
        var dataModel = res.data;
        var showInquiry = [];
        var now = new Date().getTime();
        if (dataModel.status == 200) {
          if (dataModel.total == 0) {
            self.setData({
              refreshMsg: "无相关询价单",
              hideHeader: false,
              inquiryList: []
            });
            wx.hideNavigationBarLoading();
            return;
          }
          if (pageIndex == 1) {
            showInquiry = dataModel.data;
            dataModel.data.forEach(function (item, index) {
              var endTime = item.inquiryEndTime;
              var diffTime = endTime - now;
              if (diffTime > 0){
                var days = Math.floor(diffTime / (24 * 3600 * 1000));
                var leave1 = diffTime % (24 * 3600 * 1000); 
                var hours = Math.floor(leave1 / (3600 * 1000));
                showInquiry[index].days = days;
                showInquiry[index].hours = hours;  
              }else {
                showInquiry[index].days = "";
                showInquiry[index].hours = "";
              }
              
            });
            self.setData({
              inquiryList: showInquiry,
              total: dataModel.total,
              hideBottom: true
            });
          } else {
            var newInquery = dataModel.data;
            dataModel.data.forEach(function (item, index) {
              var endTime = item.inquiryEndTime;
              var diffTime = endTime - now;
              if (diffTime > 0) {
                var days = Math.floor(diffTime / (24 * 3600 * 1000));
                var leave1 = diffTime % (24 * 3600 * 1000);
                var hours = Math.floor(leave1 / (3600 * 1000));
                newInquery[index].days = days;
                newInquery[index].hours = hours;
              }else{
                newInquery[index].days = "";
                newInquery[index].hours = "";
              }
            });
            showInquiry = inquiryList.concat(newInquery);
            self.setData({
              inquiryList: showInquiry,
              total: dataModel.total,
              hideBottom: true
            });
          }
        }
        wx.hideNavigationBarLoading();
      }
    })
  }
})