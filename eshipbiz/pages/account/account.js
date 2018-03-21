// pages/account/account.js
const app = getApp()
const account = wx.getStorageSync("account") || "";
const enterprise = wx.getStorageSync("enterprise") || "";
const enterpriseExhSign = wx.getStorageSync("enterpriseExhSign") || "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    headImg:"",
    enterpriseName:"",
    actionList:[{
        icon:"icon-logo",
        iconColor:"#7bb0ff",
        name:"我的商机",
        path:"/pages/mybusiness/mybusiness",
        type:"redirect"
    }, {
      icon: "icon-logo",
      iconColor: "#5ee09b",
      name: "实名认证",
      path: "/pages/cert/cert",
      type: "redirect"
    }, {
      icon: "icon-logo",
      iconColor: "#fabf13",
      name: "我的展厅",
      path: "/pages/eshop/eshop",
      type: "redirect"
    }, {
      icon: "icon-logo",
      iconColor: "#fabf13",
      name: "个人信息",
      path: "/pages/info/info",
      type: "redirect"
    },{
      icon: "icon-logo",
      iconColor: "#7bb0ff",
      name: "我的供应商",
      path: "/pages/mysupplier/mysupplier",
      type: "redirect"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!account){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }else{
      this.setData({
        phone: account.phone,
        headImg: account.headImg || "/images/menu/menu-1.png",
        enterpriseName: enterprise.enterpriseName
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
          wx.showToast({
            title: '退出成功'
          })
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})