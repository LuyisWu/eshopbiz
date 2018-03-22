// pages/login/login.js
var app = getApp()
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
  onHide:function(){

  },
  seePassword: function () {
    if (this.data.passwordType =="password"){
      this.setData({
        isLookClass: "icon-display",
        passwordType: "text"
      })
    }else{
      this.setData({
        isLookClass: "icon-hide",
        passwordType: "password"
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
          var result = res.data.data;
          app.globalData.account = result.account;
          app.globalData.enterprise = result.enterprise;
          app.globalData.loginStatus = true;
          wx.setStorageSync('account', result.account);
          wx.setStorageSync('enterprise', result.enterprise);
          wx.setStorageSync('loginStatus', true);
          wx.switchTab({
            url: '/pages/account/account',
          })
        }else{
          var msg = res.data.msg || "";
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
      }
    })
  }
})