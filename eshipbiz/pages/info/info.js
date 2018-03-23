// pages/info/info.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: "/images/info-logo.png",
    userName: "",
    sex: "",
    deptName: "",
    position: "",
    areaCode: "",
    landline: "", 
    index: 0,
    sList:['男', '女']
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.account != "" && app.globalData.account != null){
      this.setData({
        headImg: app.globalData.account.headImg ||"/images/info-logo.png",
        userName: app.globalData.account.userName || "",
        sex: app.globalData.account.sex ||"",
        deptName: app.globalData.account.deptName || "",
        position: app.globalData.account.position || "",
        areaCode: app.globalData.account.areaCode || "",
        landline: app.globalData.account.landline || ""
      });
    }
  },
  changeLogo:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.globalData.host +'/rest/lp/uptAccount/uploadHeadImg',
          filePath: tempFilePath,
          name:"upfile",
          formData:{
            type:"headImg",
            userToken: app.globalData.account.accountId,
            verificationToken: app.globalData.account.token
          },
          success: res =>{
            var imgData = JSON.parse(res.data);
            if (imgData.status ==200){
              this.setData({
                headImg: imgData.data
              })
              app.globalData.account.headImg = imgData.data;
              wx.setStorageSync("account", app.globalData.account);
              wx.showToast({
                title: '上传图片成功'
              })
            }else{
              wx.showToast({
                title: "上传失败",
                icon:"none"
              })
            }
          }
        })
      }
    })
  },
  pickerClick: function(){
    this.triggerEvent("bindPickerChange");
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
})