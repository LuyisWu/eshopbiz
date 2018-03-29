// pages/account/account.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    headImg: "/images/info-logo.png",
    enterpriseName:"",
    hasCert:"0",
    loginStatus:false
  },
  onShow: function(){
    this.dialog = this.selectComponent("#isCertDialog");
    if (app.globalData.loginStatus ==true){
      this.setData({
        loginStatus: app.globalData.loginStatus,
        phone: app.globalData.account.phone || "",
        headImg: app.globalData.account.headImg || "/images/info-logo.png",
        enterpriseName: app.globalData.enterprise.enterpriseName || "",
        hasCert: app.globalData.enterprise.authentication || "0"
      })
    }
  },
  navToRes:function(e){
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  certCheckNav:function(e){
    var url = e.currentTarget.dataset.url;
    if(this.data.loginStatus){
      if (this.data.hasCert =="0") {
        wx.navigateTo({
          url: "/pages/cert/cert"
        })
      }else{
        wx.navigateTo({
          url: url
        })
      }
    }else {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  loginCheckNav:function(e){
    var url = e.currentTarget.dataset.url;
    // 判断是否登录
    if(app.globalData.loginStatus){
        wx.navigateTo({
          url: url
        })
    }else{
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  eshopCheckNav: function (e) {
    var url = e.currentTarget.dataset.url;
    // 判断是否登录
    if (app.globalData.loginStatus) {
      if (this.data.hasCert =="2") {
        wx.navigateTo({
          url: url
        })
      } else {
        this.dialog.showDialog();
      }
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  _cancelEvent: function () {
    this.dialog.hideDialog();
  },
  _confirmEvent:function(){
    this.dialog.hideDialog();
    if (this.data.hasCert == "0"){
      wx.navigateTo({
        url: '/pages/cert/cert',
      })
    }else{
      wx.navigateTo({
        url: '/pages/certres/certres',
      })
    }
    
  },
  loginOut: function(e){
    wx.request({
      url: app.globalData.host+'/rest/lp/account/signOut',
      data:{
        userToken: app.globalData.account.accountId
      },
      success:res =>{
        if(res.data.status ==200){
          wx.clearStorage();
          app.globalData.account ="";
          app.globalData.enterprise = "";
          app.globalData.enterpriseExhSign = "";
          app.globalData.loginStatus = false;
          wx.showToast({
            title: '退出成功'
          })
          wx.reLaunch({
            url: '/pages/account/account',
          })
        }else{
          wx.showToast({
            title: res.data.msg
          })
        }
      }
    })
  }
})