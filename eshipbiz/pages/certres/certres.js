// pages/certres/certres.js
var util = require("../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    certLv:"0",
    phone:"",
    enterprise:"",
    registeredDate:"",
    businessStartDate:"",
    businessEndDate:""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.loginStatus){
      this.setData({
        certLv: app.globalData.enterprise.authentication || "0",
        phone: app.globalData.domains.cbytPhoneNum || "400-828-9936",
        enterprise: app.globalData.enterprise || "",
        registeredDate: util.formatTime(app.globalData.enterprise.registeredDate) || ""
      })
    }
  },
  calling:function(){
    wx.makePhoneCall({
      phoneNumber: '4008289936'
    })
  },
  toCert: function(){
    wx.navigateTo({
      url: '/pages/cert/cert',
    })
  }
})