<template>
  <div>
    <HeaderItem></HeaderItem>
    <Row>
      <Col span="10">
      <Menu class="menu-side" :theme="theme2" @on-select="handleSelect" :open-names="[1]" ref="menu_side"
            active-name="1-1">
        <Submenu :name="(index+1)" v-for="(item , index) in diretory">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            {{item.menu}}
          </template>
          <Menu-item v-for="(subitem , subindex) in item.contain" :name="(index+1)+'-' + (subindex+1)">
            {{subitem.title}}
          </Menu-item>
        </Submenu>
      </Menu>
      </Col>
      <Col span="14">
      <div class="wrap-content">
        <h1>{{title}}</h1>
        <p>{{content}}</p>
      </div>
      </Col>
    </Row>
    <hr>
    <p>切换主题</p>
    <Radio-group v-model="theme2">
      <Radio label="light"></Radio>
      <Radio label="dark"></Radio>
    </Radio-group>

  </div>
</template>
<style>
  .menu-side {
    width: auto !important;
  }
  .wrap-content {
    text-align: center;
    padding: 10px;
  }
</style>
<script>
  import HeaderItem from './Header'
  export default {
    data () {
      return {
        theme2: 'dark',
        title: '默认标题',
        content: '默认正文',
        diretory: [
          {
            menu: 'javascript',
            contain: [
              {
                title: 'react 入门',
                content: 'react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门react 入门'
              },
              {
                title: 'vue 入门',
                content: 'vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门vue 入门'
              },
              {
                title: 'nodejs 入门',
                content: 'nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门nodejs 入门'
              }
            ]
          },
          {
            menu: 'html',
            contain: [
              {
                title: 'dom 入门'
              },
              {
                title: 'html5 入门'
              }
            ]
          }
        ]
      }
    },
    created () {
      let target = this.diretory[0].contain[0]
      this.title = target.title
      this.content = target.content
    },
    components: {HeaderItem},
    methods: {
      handleSelect (e) {
        let itemindex = e.split('-')[0] - 1
        let subitemindex = e.split('-')[1] - 1
        let target = this.diretory[itemindex].contain[subitemindex]
        this.title = target.title
        this.content = target.content
      }
    }
  }
</script>
