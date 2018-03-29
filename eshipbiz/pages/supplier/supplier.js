// pages/supplier/supplier.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 10,
    enterpriseKeywords: "",
    managementModelName:"",
    enterpriseList:[],
    total:0,
    hideBottom: true,
    loadMoreData: "加载更多",
    hideHeader: true,
    scrollHeight:0,
    refreshMsg:"刷新中",
    open: false,
    modelList:[],
    currentModel:0,
    currentModelName:'',
    targetModel:0,
    categoryList:["发动机","机舱辅机","泵","阀","甲板机械","消防逃生","电力/中控","通讯导航","生活区域","通用物资"],
    currentCategory:"",
    targetCategory:"",
    currentCategoryName:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight-60
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    wx.request({
      url: app.globalData.domains.mallHomeDomain+'/wechat/getEnterpriseManagementModel',
      success: function(res){
        if(res.data.status ==200){
          self.setData({
            modelList: res.data.data
          })
        }
      }
    })
    self.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight-60,
      enterpriseKeywords: app.globalData.enterpriseKeywords
    })
    self.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   app.globalData.enterpriseKeywords = "";
  },
  keywordNav: function(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  /**
   * 用户点击筛选,关闭筛选，保存筛选,设置选中
   */
  openFilter:function(e){
    var self = this;
    this.setData({
      currentCategory: self.data.targetCategory,
      currentModel: self.data.targetModel,
      open: true
    })
  },
  closeFilter: function(e){
    var self = this;
    this.setData({
      currentCategory: self.data.targetCategory,
      currentModel: self.data.targetModel,
      open: false
    })
  },
  saveFilter: function(){
    var self =this;
    var model = self.data.currentModel;
    var modelName = self.data.currentModelName;
    var category = self.data.currentCategory;
    var categoryName =self.data.currentCategoryName;
    self.setData({
      enterpriseKeywords: categoryName,
      managementModelName: modelName,
      targetModel: model,
      targetCategory: category,
      open: false
    })
    self.refresh();
  },
  filterCategoryActive: function(e) {
    var self= this;
    var id = e.currentTarget.dataset.cid;
    var name = e.currentTarget.dataset.cname;
    var ischeck = e.currentTarget.dataset.ischeck;
    if (ischeck) {
      self.setData({
        currentCategory: "",
        currentCategoryName: ""
      })
    } else {
      self.setData({
        currentCategory: id,
        currentCategoryName: name
      })
    }
    
  },
  filterModelActive: function(e){
    var self = this;
    var id = e.currentTarget.dataset.mid;
    var name = e.currentTarget.dataset.mname;
    var ischeck = e.currentTarget.dataset.ischeck;
    if (ischeck){
      self.setData({
        currentModel: 0,
        currentMdodelName: ""
      })
    }else{
      self.setData({
        currentModel: id,
        currentMdodelName: name
      })
    }
  },
  refresh: function(e){
    var self = this;
    self.setData({
      refreshMsg: "刷新中",
      hideHeader: false
    });
    setTimeout(function () {
      self.setData({
        page: 1,
        refreshMsg: "刷新中",
        hideHeader: true
      })
      self.getData();
    }, 300);
  },
  showMoreEnterprise: function(){
    var self =this;
    var currentpage = self.data.page;
    var total = self.data.total;
    var size = self.data.pageSize;
    if (currentpage == Math.ceil(total / size)) {
      self.setData({
        loadMoreData: '已经到顶',
        hideBottom: false
      })
      setTimeout(function () {
        self.setData({
          hideBottom: true
        })
      },300)
      return;
    }
    self.setData({
      loadMoreData: '加载更多',
      hideBottom: false
    })
    if (currentpage < Math.ceil(total / size)) {
      setTimeout(function () {
        self.setData({
          page: currentpage + 1,
          hideBottom: true
        })
        self.getData();
      },1000);
    }
  },
  toEshop: function(e){
    var eid = e.currentTarget.dataset.eid;
    var exhid = e.currentTarget.dataset.exhid;
    wx.redirectTo({
      url: '/pages/eshop/homepage/homepage?eid=' + eid + "&exhid=" + exhid
    })
  },
  getData: function(){
    var self = this;
    var pageIndex = self.data.page;
    var enterpriseList = self.data.enterpriseList || [];
    wx.request({
      url: app.globalData.domains.mallHomeDomain + '/wechat/enterprise',
      data: {
        page: self.data.page,
        pageSize: self.data.pageSize,
        enterpriseKeywords: self.data.enterpriseKeywords,
        managementModelName: self.data.managementModelName
      },
      success: function (res) {
        var dataModel = res.data;
        var showEnter = "";
        if (dataModel.status ==200){
          if (dataModel.total ==0){
            self.setData({
              refreshMsg: "无相关供应商",
              hideHeader: false,
              enterpriseList:[]
            });
            return;
          }
          if (pageIndex == 1){
            showEnter = dataModel.data;
            self.setData({
              enterpriseList: showEnter,
              total: dataModel.total,
              hideBottom: true
            });
          }else{
            showEnter = enterpriseList.concat(dataModel.data);
            self.setData({
              enterpriseList: showEnter,
              total: dataModel.total,
              hideBottom: true
            });
          }
        }
      }
    })
  }
})