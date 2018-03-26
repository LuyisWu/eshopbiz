// pages/editinfo/phone/phone.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaCode:"",
    landline: ""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.account.phone != null) {
      this.setData({
        areaCode: app.globalData.account.areaCode || "",
        landline: app.globalData.account.landline || ""
      })
    }
  },
  areaCodeInput: function (e) {
    this.setData({
      areaCode: e.detail.value
    })
  },
  landlineInput: function (e) {
    this.setData({
      landline: e.detail.value
    })
  },
  saveInfo: function () {
    var n = /^[0-9]*$/;
    if (this.data.areaCode ===""){
      wx.showToast({
        title: '请输入区号',
        icon: "none"
      });
      return;
    }
    if (this.data.landline === "") {
      wx.showToast({
        title: '请输入电话号码',
        icon: "none"
      });
      return;
    }
    if (!n.test(this.data.areaCode)){
      wx.showToast({
        title: '请输入正确的区号',
        icon:"none"
      });
      return;
    }
    if (!n.test(this.data.landline)) {
      wx.showToast({
        title: '请输入正确的电话号码',
        icon: "none"
      });
      return;
    }
    wx.request({
      url: app.globalData.host + "/rest/lp/uptAccount/updateAccount",
      data: {
        areaCode: this.data.areaCode,
        landline: this.data.landline,
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token
      },
      success: res => {
        app.globalData.account.areaCode = this.data.areaCode;
        app.globalData.account.landline = this.data.landline;
        wx.setStorageSync("account", app.globalData.account);
        wx.showToast({
          title: '修改成功',
          icon:"success",
          duration:1500,
          complete: function(){
            wx.navigateTo({
              url: '/pages/info/info',
            })
          }
        });
        
      }
    })
  }
})