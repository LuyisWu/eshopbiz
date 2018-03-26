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
    msgDisabled:false,
    passwordType:"password",
    isLookClass:"icon-hide",
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
    if (e.detail.value === "") {
      this.setData({
        password: e.detail.value,
        hasValue: false,
        focus: true
      })
    } else {
      this.setData({
        password: e.detail.value,
        hasValue: true
      })
    }
  },
  seePassword: function () {
    if (this.data.passwordType == "password") {
      this.setData({
        isLookClass: "icon-display",
        passwordType: "text"
      })
    } else {
      this.setData({
        isLookClass: "icon-hide",
        passwordType: "password"
      })
    }
  },
  cleanPassword: function () {
    this.setData({
      password: "",
      hasValue: false,
      focus: true
    })
  },
  sendMsg: function(){
    var that = this;
    const mobile = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
    if (that.data.phone ===""){
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return;
    }
    if (mobile.test(that.data.phone)) {
      wx.request({
        url: app.globalData.host+'/rest/register/getTelValidateCode',
        data:{
          phone: that.data.phone
        },
        success:res=>{
            if(res.data.status ==200){
              that.countDown(that);
              wx.showToast({
                title: "短信发送成功，请注意查收",
                icon: "none"
              })
            }else{
              var msg = res.data.msg;
              wx.showToast({
                title: msg,
                icon: "none"
              })
            }
        }
      })
    }else{
      wx.showToast({
        title: '请输入正确的手机号',
        icon:"none"
      })
    }
  },
  countDown: function (e) {
    var that = this;
    var t = that.data.time;
    if (t === 0) {
      that.setData({
        msgDisabled: false,
        time: 60,
        text: "发送验证码"
      })
      return;
    }
    setTimeout(function () {
      that.setData({
        time: t - 1,
        text: "倒计时" + (t-1) + "s",
        msgDisabled: true
      })
      that.countDown(that);
    }, 1000)
  },
  signAction: function (e) {
    wx.request({
      url: app.globalData.host + '/rest/register/registerAccount',
      data: {
        phone: this.data.phone || "",
        phoneCode: this.data.phoneCode || "",
        password: this.data.password || "",
        deviceName:"wx"
      },
      success: function (res) {
        if (res.data.status == 200) {
          wx.showToast({
            title: "注册成功"
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