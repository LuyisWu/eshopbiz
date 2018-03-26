// pages/cert/cert.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasImg:false,
    width:"",
    height:"",
    enterpriseCategory:[],
    enterpriseModuleId: "",
    enterpriseModuleName: "请选择",
    businessLicenseImg: ""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + '/rest/baseData/getEnterpriseSelectData',
      success: res => {
        if (res.data.status== 200){
          var eModule = res.data.data.enterprise_category;
          var eModuleNameList = [];
          for(let i = 0;i<eModule.length;i++){
            eModuleNameList.push(eModule[i].enterpriseCategoryName);
          }
          that.setData({
            enterpriseCategory: eModuleNameList,
          })
            wx.hideLoading();
        }
      }
    })
  },
  addCertImg:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.globalData.host + '/rest/lp/enterprise/uploadCertImg',
          filePath: tempFilePath,
          name: "fileloadimg",
          formData: {
            type: "wxCert",
            userToken: app.globalData.account.accountId,
            verificationToken: app.globalData.account.token
          },
          success: res => {
            var imgData = JSON.parse(res.data);
            if (imgData.status == 200) {
              this.setData({
                hasImg:true,
                businessLicenseImg: imgData.data.simpleUrl
              })
              app.globalData.enterprise.businessLicenseImg = imgData.data.simpleUrl;
              wx.setStorageSync("enterprise", app.globalData.enterprise);
              wx.showToast({
                title: '上传图片成功'
              })
            } else {
              wx.showToast({
                title: "上传失败",
                icon: "none"
              })
            }
          }
        })
      }
    })
  },
  showEnterpriseModule: function () {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.enterpriseCategory,
      success: function (res) {
        let idx = res.tapIndex;
        let enterpriseModuleId = idx + 1;
        let enterpriseModuleName = that.data.enterpriseCategory[idx];
        that.setData({
          enterpriseModuleId: enterpriseModuleId,
          enterpriseModuleName:enterpriseModuleName
        })
      }
    })
  },
  submitCert:function(){
    var that =this;
    if (that.data.businessLicenseImg ==""){
      wx.showToast({
        title: '请上传营业执照',
        icon:'none'
      })
      return;
    }
    if (that.data.enterpriseModuleId == "") {
      wx.showToast({
        title: '请选择企业类别',
        icon: 'none'
      })
      return;
    }
    wx.request({
      url: app.globalData.host +'/rest/lp/enterprise/bindCertWX',
      data:{
        enterpriseModuleId: that.data.enterpriseModuleId,
        enterpriseModuleName: that.data.enterpriseModuleName,
        businessLicenseImg: that.data.businessLicenseImg,
        userToken: app.globalData.account.accountId,
        verificationToken: app.globalData.account.token
      },
      success:res=>{
          if(res.data.status ==200){
            app.globalData.enterprise = res.data.data;
            wx.setStorageSync("enterprise", res.data.data);
            wx.navigateTo({
              url: '/pages/certres/certres',
            })
          }else{
            wx.showToast({
              title: '认证失败',
              icon:"none"
            })
          }
      }
    })
  }
})