// pages/login/login.js
var app = getApp()
var account = wx.getStorageSync("account") || "";
var enterprise = wx.getStorageSync("enterprise") || "";
var enterpriseExhSign = wx.getStorageSync("enterpriseExhSign") || "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCode:"",
    password:'',
    disabled:false,
    hasValue:false,
    focus:false,
    passwordType:"password",
    isLookClass:"icon-hide"
  },

  userCodeInput: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  passwordInput: function (e) {
    if (e.detail.value ===""){
      this.setData({
        password: e.detail.value,
        hasValue: false,
        focus:true
      })
    }else{
      this.setData({
        password: e.detail.value,
        hasValue: true
      })
    }
  },
  cleanPassword: function(){
    this.setData({
      password: "",
      hasValue: false,
      focus:true
    })
  },
  seePassword: function () {
    if (this.data.passwordType =="password"){
      this.setData({
        isLookClass: "icon-display",
        passwordType: "text",
        focus: true
      })
    }else{
      this.setData({
        isLookClass: "icon-hide",
        passwordType: "password",
        focus: true
      })
    }
  },
  loginAction: function(e){
    wx.request({
      url: app.globalData.host +'/rest/login/accountLogin',
      data:{
        userCode: this.data.userCode || "",
        password:this.data.password || ""
      },
      success: function(res){
        if(res.data.status == 200){
          wx.showToast({
            title: "登录成功"
          })
          const result = res.data.data;
          app.globalData.account = result.account;
          app.globalData.enterprise = result.enterprise;
          app.globalData.enterpriseExhSign = result.enterpriseExhSign;
          app.globalData.loginStatus = true;
          wx.setStorageSync('account', result.account);
          wx.setStorageSync('enterprise', result.enterprise);
          wx.setStorageSync('enterpriseExhSign', result.enterpriseExhSign);
          wx.setStorageSync('loginStatus', result.enterpriseExhSign);
          wx.switchTab({
            url: '/pages/account/account',
          })
        }else{
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