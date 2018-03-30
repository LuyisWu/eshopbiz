// pages/mysupplier/mysupplier.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    Keyword: "",
    enterpriseList: [],
    total: 0,
    hideBottom: true,
    scrollHeight: 0,
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
  keywordsInput: function(e){
    this.setData({
      Keyword:e.detail.value
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
  showMoreEnterprise: function () {
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
  toEshop: function (e) {
    var eid = e.currentTarget.dataset.eid;
    var exhid = e.currentTarget.dataset.exhid;
    wx.navigateTo({
      url: '/pages/eshop/homepage/homepage?eid=' + eid + "&exhid=" + exhid
    })
  },
  getData: function () {
    var self = this;
    var pageIndex = self.data.page;
    var enterpriseList = self.data.enterpriseList || [];
    wx.request({
      url: app.globalData.domains.crmDomain + '/crm/lp/addSupplier/getSupplierVoPage',
      data: {
        userToken:app.globalData.account.accountId,
        verificationToken: app.globalData.account.token,
        page: self.data.page,
        pageSize: self.data.pageSize,
        "addSupplier.type": 0,
        Keyword: self.data.Keyword
      },
      success: function (res) {
        var dataModel = res.data;
        var showEnter = "";
        if (dataModel.status == 200) {
          if (dataModel.data.total == 0) {
            self.setData({
              refreshMsg: "无相关供应商",
              hideHeader: false,
              enterpriseList: []
            });
            return;
          }
          if (pageIndex == 1) {
            showEnter = dataModel.data.list;
            self.setData({
              enterpriseList: showEnter,
              total: dataModel.data.total,
              hideBottom: true
            });
          } else {
            showEnter = enterpriseList.concat(dataModel.data.list);
            self.setData({
              enterpriseList: showEnter,
              total: dataModel.data.total,
              hideBottom: true
            });
          }
        }
        wx.hideNavigationBarLoading();
      }
    })
  }
})