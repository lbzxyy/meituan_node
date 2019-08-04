import Router from 'koa-router'
import Redis from 'koa-redis'
import nodeMailer from 'nodemailer'
import User from '../dbs/models/users'
import Passport from './utils/passport'
import axios from './utils/axios'
import Email from '../dbs/config'
// 声明一个路由对象
let router = new Router({
  prefix: '/users', // 前缀
})
// 获取redis的客户端
let Store = new Redis().client

// 注册接口
router.post('/signup', async (ctx)=>{
  const {
    username,
    password,
    email,
    code
  } = ctx.request.body;
  if(code) {
    // 取验证码
    const saveCode = await Store.hget(`nodemail:${username}`,'code')
    // 取过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, 'expire')
    if(code === saveCode) {
      if(new Date().getTime() - saveExpire >0){
        ctx.body = {
          code: -1,
          msg: '验证码已过期，请重新尝试'
        }
        return false
      }
    }else{
      ctx.body = {
        code: -1,
        msg: '请填写正确的验证码'
      }
    }
  }else{
    ctx.body = {
      code: -1,
      msg: '请填写验证码'
    }
  }
 // 接下来要验证用户名和密码
 let user = await User.find({username})
 if(user.length) {
   ctx.body = {
     code: -1,
     msg: '账户已经被注册了'
   }
   return
 }
 // 用户名没有被注册，接下来就是把用户名和密码写库了
 let nuser = await User.create({
   username,
   password,
   email
 })
 if(nuser) { // 写入成功
  let res = await axios.post('/users/signin', {
    username,
    password
  })
  if(res.data && res.data.code ===0){
    ctx.body = {
      code: 0,
      msg: '注册成功',
      user: res.data.user
    }
  }else{
    ctx.body = {
      code: -1,
      msg: 'error'
    }
  }
 }else{
   ctx.body = {
     code: -1,
     msg: '注册失败'
   }
 }
})
// 登录接口
router.post('signin', async (ctx,next) => {
  return Passport.authenticate('local', function(err, user, info, status) {
    if(err) {
      ctx.body = {
        code: -1,
        msg: err
      }
    }else{
      if(user) {
        ctx.body = {
          code: 0,
          msg: '登录成功',
          user
        }
        return ctx.login(user)
      }else{
        ctx.body = {
          code: 1,
          msg: info
        }
      }
    }
  })(ctx,next)
})
// 验证码验证
router.post('/verify', async(ctx,next) => {
  let username = ctx.request.body.username
  const saveExpire = await Store.hget(`nodemail:${username}`,'expire')
  // 过期时间是否存在并且当前时间小于了过期时间
  if(saveExpire&&new Date().getTime()-saveExpire<0) {
    ctx.body = {
      code: 1,
      msg: ' 验证请求过于频繁，一分钟内一次'
    }
    return false
  }
  // 下面实现发邮件功能
  let transporter = nodeMailer.createTransport({
    host: Email.smtp.host,
    port: 587,
    secure: false,
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  })
  // 接收方是谁
  let ko = {
    code: Email.smtp.code(),
    expire: Email.smtp.expire(),
    email: ctx.request.body.email, // 给谁发
    user: ctx.request.body.username
  } 
  // 邮件中显示什么
  let mailOptions = {
    from: `"认证邮件" <${Email.smtp.user}>`,
    to: ko.email,
    subject: 'leepoo 给您发来祝贺',
    html: `您的邀请码${ko.code}`
  }
  // 发送
  await transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
      return console.log('error')
    }else{ // success 存储key值
      Store.hmset(`nodemail:${ko.user}`,'code',ko.code,'expire',ko.expire,'email',ko.email)
    }
  })
  ctx.body = {
    code: 0,
    msg: '验证码已发送，可能会有延时，有效期1分钟'
  }
}) 
// 退出
router.get('/exit', async (ctx, next) => {
  await ctx.logout()
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})

// 获取用户名
router.get('/getUser', async(ctx) => {
  if(ctx.isAuthenticated()){
    const {username, email} = ctx.session.passport.user
    ctx.body={
      user:username,
      email
    }
  }else{
    ctx.body={
      user:'',
      email:''
    }
  }
})
export default router
