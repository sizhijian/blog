<template>
  <div>
    <HeaderItem logined=logined></HeaderItem>
    <Tabs @on-click="handleClick" type="line">
      <Tab-pane v-for="(item , index) in compiledMarkdown" :key="index" :label="item.type" ref="tabsItem">
        <div class="container">
          <Card v-for="(subitem , subindex) in item.contain" :key="subindex" :bordered="true" :class="{active : subitem.packUp}">
            <p slot="title" style="text-align: center;font-size: 16px;">{{subitem.title}}</p>
            <div v-html="subitem.content"></div>
            <!--{{subitem.packUp}}-->
            {{subitem.initHeight}}
            <a class="arrow" @click="handleToggle(index,subindex)">
              <Icon v-if="subitem.packUp" type="ios-arrow-down"></Icon>
              <Icon v-else type="ios-arrow-up"></Icon>
            </a>
          </Card>
          <div style="height:10px;"></div>
        </div>
      </Tab-pane>
    </Tabs>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .ivu-tabs-nav-container{width: 980px;margin: 0 auto;padding: 0 5px;}
  .ivu-tabs-tabpane .container{padding: 0 10px;}
  .ivu-card{margin-bottom: 10px;background: #f6f8fa}
  .arrow{
    position: absolute;
    left:0;bottom: -6px;width: 100%;
    text-align: center;font-size: 18px;}
  .active{max-height: 200px;overflow: hidden}
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
        directory: [],
        arrow: false
      }
    },
    computed: {
      compiledMarkdown: function () {
        return this.directory.filter(function (item, index) {
          return item.contain.filter(function (subitem, subindex) {
            subitem.content = marked(subitem.content);
            var initHeight = document.getElementsByClassName("ivu-tabs-tab")[0]
//            var initHeight = this.$refs.tabsItem

            subitem.initHeight = initHeight;
            return item.contain
          });
          return item;
        })
      }

    },
    created() {
      this.$http.get(
        CONST_apiUrl + '/articles'
      ).then((response) => {

        response.body.info.forEach((item)=>{
          item.contain.forEach((subitem)=>{
            subitem.packUp = true;
            subitem.initHeight = 0;
//            console.log(JSON.stringify(subitem))
          });

        });
        this.directory = response.body.info;
//        console.log(JSON.stringify(this.directory));
      });
    },
    mounted(){
    },
    components: {HeaderItem},
    methods: {
      handleClick(e){
          var el = document.getElementsByClassName("ivu-tabs-content")[0];
          el.style.height = el.childNodes[e].firstChild.offsetHeight + "px";
      },
      handleToggle(i,si){
//        console.log(this.directory[i].contain[si].packUp);
        this.directory[i].contain[si].packUp = !this.directory[i].contain[si].packUp;
      }
    }
  }
</script>
