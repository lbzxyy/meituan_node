import Router from 'koa-router'
import axios from './utils/axios'

let router = new Router({
  prefix: '/geo'
})

const sign = 'c0159e56b92b0f7e191b2228d917afc9'

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

export default router