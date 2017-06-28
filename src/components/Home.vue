<template>
  <div>
      <HeaderItem logined=logined></HeaderItem>
      <Menu class="navigation" mode="horizontal" :theme="theme1" @on-select="handleSelect" :open-names="[1]" ref="menu_side"
            active-name="1-1">
        <div class="container">
        <Submenu :name="(index+1)" v-for="(item , index) in diretory" :key="index">
          <template slot="title">
            <span v-if="item.type == 'JavaScript'">
              <Icon type="social-javascript"></Icon>
            </span>
            <span v-if="item.type == 'MongoDB'">
              <Icon type="soup-can"></Icon>
            </span>

            {{item.type}}
          </template>
          <Menu-item v-for="(subitem , subindex) in item.contain" :key="index" :name="(index+1)+'-' + (subindex+1)">
            {{subitem.title}}
          </Menu-item>
        </Submenu>
        </div>
      </Menu>
      <div class="container">
        <div class="wrap-content">
          <Breadcrumb>
            <Breadcrumb-item href="/">Home</Breadcrumb-item>
            <Breadcrumb-item href="/components/breadcrumb">Components</Breadcrumb-item>
            <Breadcrumb-item>Breadcrumb</Breadcrumb-item>
          </Breadcrumb>
          <h2 class="title">{{title}}</h2>
          <div v-html="compiledMarkdown"></div>
        </div>
      </div>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style scoped>
  .navigation {
    width: 100%;position: fixed;
    top: 54px;
  }
  .wrap-content {
    padding: 10px;background-color: #f6f8fa;
    margin-top: 60px;
  }
  .wrap-content .title{text-align: center;}
  .wrap-content p{background: #f6f8fa;margin-top: 5px;padding:5px;font-size: 14px;word-break: break-all;}
  .ivu-menu-vertical .ivu-menu-submenu-title{
    padding: 14px 8% !important;
  }
  .ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item{
    padding: 14px 10% !important;
    line-height: 16px
  }
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'

  Vue.use(VueResource);
  Vue.http.options.emulateJSON = true;

  export default {
    http: {
      root: '/root',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    data () {
      return {
        theme1: 'light',
        title: '默认标题',
        content: '默认正文',
        diretory: []
      }
    },
    computed: {
      compiledMarkdown: function () {
        return marked(this.content, { sanitize: true })
      }
    },
    created() {
      this.$http.get(
        CONST_apiUrl + '/articles'
      ).then((response)=>{
        this.diretory = response.body.info;
        this.title = this.diretory[0].contain[0].title
        this.content= this.diretory[0].contain[0].content;
      })
    },
    components: {HeaderItem},
    methods: {
      handleSelect (e) {
        let itemindex = e.split('-')[0] - 1
        let subitemindex = e.split('-')[1] - 1
        let target = this.diretory[itemindex].contain[subitemindex]
        this.title = target.title
        this.content = target.content
        console.log(target.content)
      }
    }
  }
</script>
