// pages/account/account.js
var app = getApp()
var account = wx.getStorageSync("account") || app.globalData.account;
var enterprise = wx.getStorageSync("enterprise") || app.globalData.enterprise;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    headImg: "/images/menu/menu-1.png",
    enterpriseName:"",
    loginStatus:false,
    actionList:[{
        icon:"icon-Business-opportunity",
        iconColor:"#7bb0ff",
        name:"我的商机",
        path:"/pages/mybusiness/mybusiness",
        type:"navigate"
    }, {
      icon: "icon-cert",
      iconColor: "#5ee09b",
      name: "实名认证",
      path: "/pages/cert/cert",
      type: "navigate"
    }, {
      icon: "icon-The-exhibition-hall",
      iconColor: "#fabf13",
      name: "我的展厅",
      path: "/pages/eshop/eshop", 
      type: "navigate"
    }, {
      icon: "icon-Personal-information",
      iconColor: "#fabf13",
      name: "个人信息",
      path: "/pages/info/info",
      type: "navigate"
    },{
      icon: "icon-Supplier",
      iconColor: "#7bb0ff",
      name: "我的供应商",
      path: "/pages/mysupplier/mysupplier",
      type: "navigate"
    }]
  },
  onShow: function(){
    if (account!=null && account !=""){
      this.setData({
        loginStatus: app.globalData.loginStatus,
        phone: account.phone || "",
        headImg: account.headImg || "/images/menu/menu-1.png",
        enterpriseName: enterprise.enterpriseName || ""
      })
    }
  },
  loginCheckNav:function(e){
    var url = e.target.dataset.url;
    if(app.globalData.loginStatus ==true){
      wx.navigateTo({
        url: url
      })
    }else{
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },
  navToInfo: function(){
    wx.redirectTo({
      url: '/pages/info/info',
    })
  },
  loginOut: function(e){
    wx.request({
      url: app.globalData.host+'/rest/lp/account/signOut',
      data:{
        userToken: account.accountId
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