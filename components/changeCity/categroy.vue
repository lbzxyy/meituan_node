<template>
  <div class="">
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
export default {
  data(){
    return {
      list:'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block:[]
    }
  },
  async mounted(){
    let self = this;
    let blocks = []
    let {status,data:{city}} = await self.$axios.get('/geo/city')
    if(status===200){
      let p 
      let c
      let d ={}
      city.forEach(item => {
        // pyjs.getFullChars 获取文字的全拼
        // 取到城市的首字母
        p = pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
        c = p.charCodeAt(0) // 字母的编码值
        if(c>96&&c<123) { // a-z
          if(!d[p]){
            d[p] = []
          }
          d[p].push(item.name)
        }
      })
      for (let [k,v]  of Object.entries(d)) {
        blocks.push({
          title: k.toLocaleUpperCase(),
          city: v
        })
      }
      blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0))
      self.block = blocks
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/categroy.scss";
</style>
