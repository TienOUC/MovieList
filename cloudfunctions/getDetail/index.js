// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let rp = require('request-promise');
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await rp(`http://api.douban.com/v2/movie/subject/${event.movieid}?apikey=0df993c66c0c636e29ecbb5344252a4a`)
  .then(function(res) {
      return res;
  })
  .catch(function(err) {
      console.log(err);
  });
}