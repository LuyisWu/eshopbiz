// pages/editinfo/job/job.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position:""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.account.position !=null) {
        this.setData({
          position: app.globalData.account.position
        })
    }
  },
  positionInput: function(e){
    this.setData({
      position: e.detail.value
    })
  },
  saveInfo:function(){
    wx.request({
      url: app.globalData.host + "/rest/lp/uptAccount/updateAccount",
      data: {
        position: this.data.position,
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token
      },
      success: res => {
        app.globalData.account.position = this.data.position;
        wx.setStorageSync("account", app.globalData.account);
        wx.navigateTo({
          url: '/pages/info/info',
        })
      }
    })
  }
})