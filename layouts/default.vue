<template>
    <el-container class="layout-default">
      <el-header height="197px">
        <mt-Header />
      </el-header>
      <el-main>
        <nuxt />
      </el-main>
      <el-footer height="100%">
        <mt-Footer />
      </el-footer>
    </el-container>
</template>
<script>
import mtHeader from '@/components/public/header/index.vue'
import mtFooter from '@/components/public/footer/index.vue'

export default {
  components: {
    mtHeader,
    mtFooter
  }
}
</script>
