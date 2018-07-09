//app.js
// 这里是调用公共函数库
var util = require('./config/utils.js')
App({

  /**
  * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  */
  onLaunch: function (options) {
    // 调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },

  /**
  * 当小程序启动，或从后台进入前台显示，会触发 onShow
  */
  onShow: function (options) {
    var that = this,
      // scenes是场景值它的类型是整形
      scenes = options.scene,
      // sid是参数,建议兼容ios和android的时候强转换为整形
      sid = Number(options.query.sid)

    // 获取用户信息
    that.getUserInfo(function (userInfo) {
      // 判断场景是否是从公众号进入（这里的意思是如果用户从公众号的自定义菜单进入的话且参数sid为1的话触发什么方法）
      // 获取场景值在onLaunch方法中也可以获取到，但是呢由于业务要求我们的这个方法需要用户进入就会触发
      // 各位可以根据需求去决定在哪里获取合适一些,onLaunch是小程序未关闭的情况下只执行一次,所以各位一定要考虑清楚
    })
  },

  /**
  * 获取用户信息
  */
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      //typeof cb == "function" & amp;&amp; cb(this.globalData.userInfo)

    } else {
      wx.checkSession({
        success: function () {
          console.log("111111111")
          //session_key 未过期，并且在本生命周期一直有效
        },
        fail: function () {
          console.log("22222222")
          // session_key 已经失效，需要重新执行登录流程
        }
      }),
      // 调用登录接口
      wx.login({
        success: function (res) {
          console.log(res)
          // 登录成功
          // 在这里登录的时候会返回一个登录凭证，以前是发送一次请求换一个，现在好像是登录凭证有5分钟的有效时间
          // 从这种情况来看微信小程序的发展还是不错的，以前估计没多少人访问，现在访问量上去后后台的布局都重新架构了
          var code = res.code// 登录凭证
          if (code) {
            //调取本地服务器将code传的本地服务器换取openid以及session_key
            util.commonAjax('login', 1, code)
              .then(function (resolve) {
                // 这里自然不用解释了，这是接口返回的参数
                console.log(resolve)
                if (resolve.data.status === '200') {
                  // 成功
                  wx.setStorageSync('userInfo', resolve.data.data)
                  // 新手们注意一下，记得把下面这个写到这里，有好处。
                  // typeof cb == "function" & amp;&amp; cb(that.globalData.userInfo)
                } else {
                  // 失败
                }
              })
          } else {
            console.log("获取用户登录状态失败:" + res.errMsg)
          }
          // 获取用户信息
          // wx.getUserInfo({
          //   // 当你获取用户信息的时候会弹出一个弹框是否允许授权

          //   // 这里点击允许触发的方法
          //   success: function (res) {
          //     console.log("asdasdas")
          //     that.globalData.userInfo = res2.userInfo

          //     // 准备数据（下面的这些参数都是必须参数，请不要问为什么，看文档去吧）
          //     var data = { encryptedData: res2.encryptedData, iv: res2.iv, code: code }

          //     // 请求自己的服务器(在这里我结合promise封装了一下request请求，下面会把方法给大家分享一下)
          //     util.commonAjax('方法名', 1, data)
          //       .then(function (resolve) {
          //         // 这里自然不用解释了，这是接口返回的参数
          //         if (resolve.data.status === '200') {
          //           // 成功
          //           wx.setStorageSync('userInfo', resolve.data.data)
          //           // 新手们注意一下，记得把下面这个写到这里，有好处。
          //          // typeof cb == "function" & amp;&amp; cb(that.globalData.userInfo)
          //         } else {
          //           // 失败
          //         }
          //       })
          //   },

          //   // 这里是点击拒绝触发的方法
          //   fail: function (res2) {
          //     // 在这里做一下兼容，有些同行业的用户会点击拒绝玩一玩看你们的小程序是否存在bug，
          //     // 所以在这里还是加上下面这两行代码吧，打开微信小程序的设置，允许小程序重新授权的页面
          //     wx.openSetting({

          //     })
          //   }
          // })
        }
      })
    }
  },

  /**
  * 全局变量配置（在这里放一些常量和配置文件，如果公共参数多的话大家也可以去重新布局一个文件，在里面进行设置）
  */
  globalData: {
    userInfo: null,
    url: 'https://dsn.apizza.net/mock/7ebd4782bbe409fc2bba8df768d79faf/'
  }
})

