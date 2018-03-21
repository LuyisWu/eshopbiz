// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCode:"",
    password:'',
    disabled:false
  },
  userCodeInput: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
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
          wx.setStorageSync('account', result.account);
          wx.setStorageSync('enterprise', result.enterprise);
          wx.setStorageSync('enterpriseExhSign', result.enterpriseExhSign);
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