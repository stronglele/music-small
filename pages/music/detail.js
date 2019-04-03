// pages/music/detail.js
import props from '../../utils/js/props.js'
import common from '../../utils/js/common.js'
import ajax from '../../utils/js/ajax.js'
const app = getApp()
let audioDom = app.audioDom;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    player:{},
    id: '',
    audioDom:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 1
    if(id == app.player.playing.id){

    }else{
      wx.stopBackgroundAudio()
      this.setData({ id: options.id || 1 }, () => {
        this.getDetail()
      })
    }
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

  getDetail() {
    ajax.get('audio/detail', { id: this.data.id }).then(res => {
      if (res.code === 0) {
        let { a_resource, i_resource } = res.data;
        let { lrc, id, url, cover, singer, name } = res.data.audio
        let { timeArr, lrcArr } = common.analysis(lrc)
        props.setPlaying.call(this, { id, timeArr, lrcArr, url, singer, name, cover })
        props.setPlayer.call(this, { i_resource, a_resource, global_show: 1 })

        this.playAudio()
      }
    })
  },
  playAudio(){
    let audioDom = app.audioDom
    setTimeout(() => {
      wx.playBackgroundAudio({
        title: app.player.playing.name,
        dataUrl: app.player.a_resource + app.player.playing.url // wepy 全局存储音频链接变量
      })
      audioDom.onPlay(() => {
        props.setPlayer.call(this, { status: 1 })
        props.setPlaying.call(this, { duration: audioDom })
      })
      audioDom.onTimeUpdate(() => {
        //console.log(audioDom.currentTime)
        props.setPlayer.call(this, { status: 1 })
        props.setPlaying.call(this, { currentTime: audioDom.currentTime })
        this.setData({ audioDom: app.audioDom })
      })
    }, 500)
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