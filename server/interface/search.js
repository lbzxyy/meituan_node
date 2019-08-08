import Router from 'koa-router'
import axios from './utils/axios'

const sign = 'c0159e56b92b0f7e191b2228d917afc9'

let router = new Router({
  prefix: '/search'
})

router.get('/top',async(ctx) => {
  let {status, data: {top}} = await axios.get(`http://cp-tools.cn/search/top`,{
    params: {
      input: ctx.query.input,
      city: ctx.query.city,
      sign
    }
  })
  ctx.body = {
    top: status===200?top:[]
  }
})

// 获取热门
router.get('/hotPlace', async(ctx) => {
  let city = ctx.store?ctx.store.geo.position.city:ctx.query.city
  let {status, data: {result}} = await axios.get(`http://cp-tools.cn/search/hotPlace`,{
    params: {
      city,
      sign
    }
  })
  ctx.body = {
    result: status===200?result:[]
  }
})

export default router