// pages/message/message.js
var app = getApp()
var util =require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    Keyword: "",
    messageList: [],
    total: 0,
    hideBottom: true,
    scrollHeight: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight-50
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight-50,
    })
    if(app.globalData.loginStatus){
      self.getData();
    }else{
      wx.showModal({
        title: '您还未登录',
        content: '请登录后再查看消息',
        cancelText: "取消",
        cancelColor: "#969696",
        confirmText: "去登录",
        confirmColor: "#fabf1b",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this;
    wx.showNavigationBarLoading();
    setTimeout(function () {
      self.setData({
        page: 1
      })
      self.getData();
    }, 300);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
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
  toMsgDetail: function (e) {
    var mid = e.currentTarget.dataset.mid;
    wx.navigateTo({
      url: '/pages/mdetail/mdetail?mid=' + mid
    })
  },
  getData: function () {
    var self = this;
    var pageIndex = self.data.page;
    var messageList = self.data.messageList || [];
    wx.request({
      url: app.globalData.host + '/rest/lp/msg/getMsgPage',
      data: {
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token,
        page: self.data.page,
        pageSize: self.data.pageSize
      },
      success: function (res) {
        var dataModel = res.data;
        var showMsg = "";
        if (dataModel.status == 200) {
          if (dataModel.data.total == 0) {
            self.setData({
              refreshMsg: "无相关供应商",
              hideHeader: false,
              messageList: []
            });
            wx.hideNavigationBarLoading();
            return;
          }
          if (pageIndex == 1) {
            showMsg = dataModel.data.list;
            dataModel.data.list.forEach(function (item, index) {
              var sendMsgTime = util.formatTime(item.sendTime,"Y-M-D");
              showMsg[index].sendMsgTime = sendMsgTime;
            });
            self.setData({
              messageList: showMsg,
              total: dataModel.data.total,
              hideBottom: true
            });
          } else {
            var newShowModel = dataModel.data.list;
            dataModel.data.list.forEach(function (item, index) {
              var sendMsgTime = util.formatTime(item.sendTime, "Y-M-D");
              newShowModel[index].sendMsgTime = sendMsgTime;
            });
            showMsg = messageList.concat(newShowModel);
            self.setData({
              messageList: showMsg,
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