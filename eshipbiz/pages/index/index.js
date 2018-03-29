//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    bannerList:[],
    menuList: [{
      id:1,
      url: "",
      name:"发动机",
      path: "/images/menu/menu-1.png"
    }, {
      id: 2,
      url: "",
      name: "机舱辅机",
      path: "/images/menu/menu-2.png"
    }, {
      id: 3,
      url: "",
      name: "泵",
      path: "/images/menu/menu-3.png"
    }, {
      id: 4,
      url: "",
      name: "阀",
      path: "/images/menu/menu-4.png"
    }, {
      id: 5,
      url: "",
      name: "甲板机械",
      path: "/images/menu/menu-5.png"
    }, {
      id: 6,
      url: "",
      name: "消防逃生",
      path: "/images/menu/menu-6.png"
    }, {
      id: 7,
      url: "",
      name: "电力/中控",
      path: "/images/menu/menu-7.png"
    }, {
      id: 8,
      url: "",
      name: "通讯导航",
      path: "/images/menu/menu-8.png"
    }, {
      id: 9,
      url: "",
      name: "生活区域",
      path: "/images/menu/menu-9.png"
    }, {
      id: 10,
      url: "",
      name: "通用物资",
      path: "/images/menu/menu-10.png"
    }
    ],
    inquery:{title:"中速船用柴油发动机/九缸"}
  },
  onLoad: function () {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function(){
    var that =this;
    wx.request({
      url: app.globalData.domains.mallHomeDomain + '/wechat/banner',
      success: function(res){
        var r = res.data;
        if(r.status == 200){
          that.setData({
            bannerList: r.data
          })
        }
      }
    });
  },
  //banner图跳转事件
  bannerNav: function(e){
    wx.navigateTo({
      url: "",
    })
  },
  searchNav: function(e){
    wx.navigateTo({
      url: "/pages/search/search",
    })
  },
  menuNav:function(e){
    var name = e.currentTarget.dataset.name;
    app.globalData.enterpriseKeywords = name;
    wx.switchTab({
      url: "/pages/supplier/supplier"
    })
  }
})
