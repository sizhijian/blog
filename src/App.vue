<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  html{width: 100%;}
  body,html,ul,ol,li,p,h1,h2,h3,h4,h5,h6 {
    padding: 0;
    margin: 0;
  }
  a {
    text-decoration: none;
    color: #404040;
  }
  body {
    font-family: -apple-system, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Microsoft JhengHei", "Source Han Sans SC", "Noto Sans CJK SC", "Source Han Sans CN", "Noto Sans SC", "Source Han Sans TC", "Noto Sans CJK TC", "WenQuanYi Micro Hei", SimSun, sans-serif;
  }
  h3 {
    margin-bottom: 30px;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
