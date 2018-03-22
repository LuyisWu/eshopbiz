// pages/sign/sign.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    phoneCode:"",
    password:"",
    class: "",
    disabled: false,
    time: 60,
    text: "发送验证码"
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
    countDown(this);
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  phoneCodeInput: function (e) {
    this.setData({
      phoneCode: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  sendMsg: function(e){
    const mobile = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (mobile.test(this.data.phone)) {
      wx.request({
        url: app.globalData.host+'/rest/register/getTelValidateCode',
        success:res=>{

        }
      })
    }
  },
  countDown: function (ele) {
    var that = ele;
    var t = that.data.time;
    if (t === 0) {
      that.setData({
        disabled: false,
        time: 60,
        text: "发送验证码"
      })
      return;
    }
    var ct = setTimeout(function () {
      that.setData({
        time: t - 1,
        text: "倒计时" + t + "s",
        disabled: true
      })
      countDown(that);
    }, 1000)
  },
  signAction: function (e) {
    wx.request({
      url: app.globalData.host + '/rest/register/registerAccount',
      data: {
        phone: this.data.userCode || "",
        phoneCode: this.data.phoneCode || "",
        password: this.data.password || "",
        deviceName:"wx"
      },
      success: function (res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: "注册成功"
          })
          const result = res.data.data;
          app.globalData.account = result.account;
          app.globalData.enterprise = result.enterprise;
          app.globalData.enterpriseExhSign = result.enterpriseExhSign;
          wx.setStorageSync('account', result.account);
          wx.setStorageSync('enterprise', result.enterprise);
          wx.setStorageSync('enterpriseExhSign', result.enterpriseExhSign);
          wx.switchTab({
            url: '/pages/account/account',
          })
        } else {
          const msg = res.data.msg || "";
            wx.showToast({
              title: msg,
              icon: "none"
            })
        }
      }
    })
  }
})