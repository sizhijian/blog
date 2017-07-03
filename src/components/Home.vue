<template>
  <div>
    <HeaderItem logined=logined></HeaderItem>
    <div class="tabs">
      <!-- <div class="tabs-bar" v-if="compiledMarkdown.length != 0">
        <div class="container">
          <div class="tabs-nav">
            <a :class="['tabs-tab',{this: activeIndex == index}]"  v-for="(item , index) in compiledMarkdown" @click="handleSelect(index)">{{item.type}}</a>
          </div>
        </div>
      </div> -->
      <!-- <div class="tabs-con"  v-if="compiledMarkdown.length != 0">
        <div class="tabs-tabpane" v-for="(item , index) in compiledMarkdown" v-if="index == activeIndex">
          <div class="container">
            <Card v-for="(subitem , subindex) in item.contain" :key="subindex" :bordered="true" :class="{active : subitem.packUp}">
              <p slot="title" style="text-align: center;font-size: 16px;">{{subitem.title}}</p>
              <h5 style="text-align: right;color: #2d8cf0;"><span v-if="subitem.author">From：{{subitem.author}}</span></h5>
              <h5 style="text-align: right;color: #8590a6;"><span v-if="subitem.author">{{subitem.date}}</span></h5>
              <div v-html="subitem.content"></div>
              <a v-if="subitem.showToggle" class="arrow" @click="handleToggle(index,subindex)">
                <Icon v-if="subitem.packUp" type="ios-arrow-down"></Icon>
                <Icon v-else type="ios-arrow-up"></Icon>
              </a>
            </Card>
          </div>
        </div>
      </div> -->
      <div class="tabs-bar" v-if="content.length != 0" hidden>
        <div class="container">
          <div class="tabs-nav">
            <a :class="['tabs-tab',{this: activeIndex == 0}]" @click="handleSelect()">全部</a>
          </div>
        </div>
      </div>
      <div class="tabs-con"  v-if="content.length != 0">
        <div class="tabs-tabpane">
          <Row class="container" type="flex" justify="center" align="top">
            <Col :xs="24" :sm="24">
              <Card v-for="(subitem , subindex) in compiledMarkdown" :key="subindex" :class="{active : subitem.packUp} " style="margin-left: 10px;margin-right: 10px;">
                <h2>{{subitem.title}}&nbsp;&nbsp;<Tag type="border">{{subitem.type}}</Tag></h2>
                <p style="margin: 8px auto;">
                  <span v-if="subitem.author" style="color: #2d8cf0;">From：{{subitem.author}}</span>&nbsp;&nbsp;&nbsp;
                  <span v-if="subitem.author" style="color: #8590a6;">{{subitem.created_at}}</span>
                </p>
                <h5 style="text-align: left;color: #8590a6;"></h5>
                <div v-html="subitem.body"></div>
                <a v-if="subitem.showToggle" class="arrow" @click="handleToggle(index,subindex)">
                  <Icon v-if="subitem.packUp" type="ios-arrow-down"></Icon>
                  <Icon v-else type="ios-arrow-up"></Icon>
                </a>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <h1 v-else style="text-align: center;padding: 100px 0;">
        空空如也 ~
      </h1>
    </div>
    <template>
      <Back-top></Back-top>
    </template>
  </div>
</template>
<style>
  .tabs-bar {border-bottom: 1px solid #dddee1;}
  .tabs-nav{overflow: hidden;}
  .tabs-nav .this{color: #2baee9;border-bottom: 2px solid}
  .tabs-tab{float: left;padding: 8px 16px;font-size: 12px;}
  .tabs-tabpane{margin-top: 10px;}
  .ivu-card{margin-bottom: 10px;background: #f6f8fa}
  .arrow{position: absolute;left:0;bottom: -6px;width: 100%;text-align: center;font-size: 18px;}
  .active{max-height: 220px;overflow: hidden}
</style>
<script>
  import HeaderItem from './Header'
  import marked from 'marked'
  import Vue from 'vue'
  import VueResource from 'vue-resource'
  import moment from 'moment'
  require('moment-timezone')

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
        activeIndex: 0,
        content: [],
        arrow: false
      }
    },
    computed: {
       compiledMarkdown: function () {
         return this.content.filter(function (item, index) {
           item.body = marked(item.body);
           return item;
         })
       }
    },
    created() {
      this.$http.get(
        CONST_apiUrl + '/articles'
      ).then((response) => {
//         response.body.info.forEach((item)=>{
//           item.contain.forEach((subitem)=>{
//             subitem.packUp = false;
//             subitem.showToggle = false;
// //            console.log(JSON.stringify(subitem))
//           });
//         });
        response.body.info.forEach((item)=>{
//            console.log(item.created_at)
          item.created_at = moment(item.created_at).tz('Asia/Shanghai').format("MM-DD HH:mm");
//          console.log(item.created_at)
            item.packUp = false;
            item.showToggle = false;
        });
        this.content = response.body.info;
//       console.log(JSON.stringify(this.content));
      });
    },
    mounted(){
      let _this = this, _height = 220;
//       setTimeout(function(){
//         let elArr = document.getElementsByClassName('tabs-tabpane');
// //        elArr[0].offsetHeight = 500 + "px";
//
//         for(let i=0; i<elArr.length;i++ ) {
//
//           elArr[i].firstChild.childNodes.forEach(function (item, index) {
//             if(item.offsetHeight > _height) {
//               _this.content[i].contain[index].showToggle = true;
//               _this.content[i].contain[index].packUp = true;
//             }
//           })
//         }
//       },500);
    },
    components: {HeaderItem},
    methods: {
      handleSelect(index) {
        this.activeIndex = index;
      },
      handleToggle(i,si){
//        this.content[i].contain[si].packUp = !this.content[i].contain[si].packUp;
      }
    }
  }
</script>
