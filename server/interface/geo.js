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

// 获取城市数据
router.get('/city',async(ctx) => {
  let {status,data: {city}} = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`)
  ctx.body = {
    city: status===200?city:[]
  }
})

export default router