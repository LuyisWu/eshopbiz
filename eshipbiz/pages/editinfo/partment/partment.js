// pages/editinfo/partment/partment.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deptName: ""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.account.deptName != null) {
      this.setData({
        deptName: app.globalData.account.deptName
      })
    }
  },
  deptNameInput: function (e) {
    this.setData({
      deptName: e.detail.value
    })
  },
  saveInfo: function () {
    wx.request({
      url: app.globalData.host + "/rest/lp/uptAccount/updateAccount",
      data: {
        deptName: this.data.deptName,
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token
      },
      success: res => {
        app.globalData.account.deptName = this.data.deptName;
        wx.setStorageSync("account", app.globalData.account);
        wx.navigateTo({
          url: '/pages/info/info',
        })
      }
    })
  }
})