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
    loginStatus:false,
    actionList:[{
        icon:"icon-Business-opportunity",
        iconColor:"#7bb0ff",
        name:"我的商机",
        path:"/pages/mybusiness/mybusiness",
        checkCert:false                                                                                                                    }, {
      icon: "icon-cert",
      iconColor: "#5ee09b",
      name: "实名认证",
      path: "/pages/cert/cert",
      checkCert: false
    }, {
      icon: "icon-The-exhibition-hall",
      iconColor: "#fabf13",
      name: "我的展厅",
      path: "/pages/eshop/eshop", 
      checkCert: true
    }, {
      icon: "icon-Personal-information",
      iconColor: "#fabf13",
      name: "个人信息",
      path: "/pages/info/info",
      checkCert: false
    },{
      icon: "icon-Supplier",
      iconColor: "#7bb0ff",
      name: "我的供应商",
      path: "/pages/mysupplier/mysupplier",
      checkCert: false
    }]
  },
  onShow: function(){
    this.dialog = this.selectComponent("#isCertDialog");
    if (app.globalData.loginStatus ==true){
      if (app.globalData.enterprise.authentication =="2"){
        this.setData({
          loginStatus: app.globalData.loginStatus,
          phone: app.globalData.account.phone || "",
          headImg: app.globalData.account.headImg || "/images/info-logo.png",
          enterpriseName: app.globalData.enterprise.enterpriseName || "",
          hasCert: true
        })
      }else{
      this.setData({
        loginStatus: app.globalData.loginStatus,
        phone: app.globalData.account.phone || "",
        headImg: app.globalData.account.headImg || "/images/info-logo.png",
        enterpriseName: app.globalData.enterprise.enterpriseName || "",
        hasCert: false
      })
      }
    }
  },
  loginCheckNav:function(e){
    var url = e.target.dataset.url;
    var ckCert = e.target.dataset.iscert;
    if(app.globalData.loginStatus){
      if (this.data.hasCert || !ckCert){
        wx.navigateTo({
          url: url
        })
      }else{
        this.dialog.showDialog();
      }
      
    }else{
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
    wx.navigateTo({
      url: '/pages/cert/cert',
    })
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