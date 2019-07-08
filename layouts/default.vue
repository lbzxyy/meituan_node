<template>
    <el-container class="layout-default">
      <el-header>
        <mt-Header />
      </el-header>
      <el-main>
        <nuxt />
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
</template>
<script>
import mtHeader from '@/components/public/header/index.vue'
export default {
  components: {
    mtHeader
  }
}
</script>
