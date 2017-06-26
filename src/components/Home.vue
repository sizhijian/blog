<template>
  <div>
    <Affix>
      <HeaderItem logined=logined></HeaderItem>
    </Affix>
    <Row>
      <Col :xs="8" :lg="4">
      <Menu class="menu-side" :theme="theme2" @on-select="handleSelect" :open-names="[1]" ref="menu_side"
            active-name="1-1">
        <Submenu :name="(index+1)" v-for="(item , index) in diretory">
          <template slot="title">
            <!--<Icon :type="item.type"></Icon>-->
            {{item.type}}
          </template>
          <Menu-item v-for="(subitem , subindex) in item.contain" :name="(index+1)+'-' + (subindex+1)">
            {{subitem.title}}
          </Menu-item>
        </Submenu>
      </Menu>
      </Col>
      <Col :xs="16" :lg="20">
        <div class="wrap-content">
          <h2 class="title">{{title}}</h2>
          <!--<div v-html="formatContent"></div>-->
          <div v-html="compiledMarkdown"></div>
          <!--<div v-html="content"></div>-->
        </div>
      </Col>
    </Row>
    <hr>
    <p>切换主题</p>
    <Radio-group v-model="theme2">
      <Radio label="light"></Radio>
      <Radio label="dark"></Radio>
    </Radio-group>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .menu-side {
    width: auto !important;
  }
  .wrap-content {
    padding: 10px;
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
        theme2: 'dark',
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
    created () {
      this.$http.get(
        'http://192.168.1.62:3000/articles'
      ).then((response)=>{
        console.log(response.body.info)
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
