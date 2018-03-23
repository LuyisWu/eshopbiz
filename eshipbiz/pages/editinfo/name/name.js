// pages/editinfo/name/name.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: ""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.account.userName != null) {
      this.setData({
        userName: app.globalData.account.userName
      })
    }
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  saveInfo: function () {
    wx.request({
      url: app.globalData.host + "/rest/lp/uptAccount/updateAccount",
      data: {
        userName: this.data.userName,
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token
      },
      success: res => {
        app.globalData.account.userName = this.data.userName;
        wx.setStorageSync("account", app.globalData.account);
        wx.navigateTo({
          url: '/pages/info/info',
        })
      }
    })
  }
})