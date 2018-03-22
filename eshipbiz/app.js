//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var account = wx.getStorageSync('account')
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.request({
      url: this.globalData.host + "/rest/lp/common/getProjectInfo",
      success: res => {
        if (res.data.status == 200) {
          this.globalData.domains = res.data.data;
        }
      }
    });
    if (account !="" && account!=null){
      wx.request({
        url: this.globalData.host+'/rest/lp/account/getUserInfo',
        data: {
          userToken: account.accountId,
          verificationToken: account.token
        },
        success: res => {
          var result = res.data.data;
          this.globalData.account = result.account;
          this.globalData.enterprise = result.enterprise;
          this.globalData.enterpriseExhSign = result.enterpriseExhSign;
          this.globalData.loginStatus = true;
          wx.setStorageSync('account', result.account);
          wx.setStorageSync('enterpriseExhSign', result.enterpriseExhSign);
          wx.setStorageSync('enterprise', result.enterprise.enterprise);
          wx.setStorageSync('loginStatus', true);
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    loginStatus:false,
    account:null,
    enterprise:null,
    enterpriseExhSign:null,
    host:"http://192.168.101.77:8081",
    domains:null
  }
})