// pages/comment/comment.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},  // 海报详情
    dsc: '',     // 观后感
    rate: 0,     // 评分
    fileList: [],  // 上传的文件
    fileIds: [],
    movieId: -1
  },
  onDscChange: function(event){
    this.setData({
      dsc: event.detail
    })
  },
  onRateChange: function(event){
    this.setData({
      rate: event.detail
    })
  },

  delImg: function(event){
    let index = event.currentTarget.dataset.index 
    let arr = this.data.fileList
    let deleteImg = this.data.fileList.splice(index, 1)
    console.log(index)
    this.setData({
      fileList: arr
    })
    console.log(this.data.fileList)
  },

  upLoadImg: function(){
    wx.chooseImage({
      count: 6,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        this.setData({
          fileList: this.data.fileList.concat({url:`${tempFilePaths}`})
        })
        console.log(this.data.fileList)
      }
    })
  },

  submit: function(){
    wx.showLoading({
      title: '提交中',
    })
    let fileArr = []
    for(let i = 0; i < this.data.fileList.length; i++){
      fileArr.push(new Promise((resolve, reject) => {
        let item = this.data.fileList[i].url
        let suffix = /\.\w+$/.exec(item)[0]  // 文件扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            this.setData({
              fileIds: this.data.fileIds.concat(res.fileID)
            })
            resolve()

          },
          fail: console.error
        })
      }))
    }
    Promise.all(fileArr)
    .then( res => {
      db.collection('fileData').add({
        data: {
          dsc: this.data.dsc,
          rate: this.data.rate,
          movieid: this.data.movieId,
          fileIds: this.data.fileIds
        }
      })
      .then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
      })
      .catch( err => {
        wx.hideLoading()
        wx.showToast({
          title: '提交失败',
        })
        console.log(err)
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieId: options.movieid
    })
    wx.cloud.callFunction({
      name: 'getDetail',
      data: {
        movieid: options.movieid
      }
    }).then( res => {
      console.log(res)
      this.setData({
        detail: JSON.parse(res.result)
      })
    }).catch( err => {
      console.log(err)
    })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})