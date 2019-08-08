import Router from 'koa-router'
import axios from './utils/axios'

let router = new Router({
  prefix: '/geo'
})

const sign = 'c0159e56b92b0f7e191b2228d917afc9'
// 获取所在地
router.get('/getPosition', async(ctx) => {
  // 请求第三方库
  let {status, data: { province, city}} = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`)
  if(status === 200) {
    ctx.body = {
      province,
      city
    }
  }else{
    ctx.body = {
      province: '',
      city: ''
    }
  }
})

// 获取菜单栏数据
router.get('/menu', async(ctx) => {
  let {status, data: {menu}} = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`)
  if(status === 200) {
    ctx.body = {
      menu
    }
  }else{
    ctx.body = {
      menu: []
    }
  }
})

// 获取省份数据
router.get('/province',async(ctx) => {
  let {status, data: {province}} = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`)
  ctx.body = {
    province: status===200?province:[]
  }
})

router.get('/province/:id', async (ctx) => {
  // let city = await City.findOne({id: ctx.params.id})
  //
  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  let {status, data: {
      city
    }} = await axios.get(`http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`)
  if (status === 200) {
    ctx.body = {
      city
    }
  } else {
    ctx.body = {
      city: []
    }
  }
})


// 获取城市数据
router.get('/city',async(ctx) => {
  let {status,data: {city}} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`)
  ctx.body = {
    city: status===200?city:[]
  }
})

router.get('/hotCity', async (ctx) => {
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  let {status, data: {
      hots
    }} = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    }
  } else {
    ctx.body = {
      hots: []
    }
  }
})


export default router