<template>
  <section id="taskNoticeFrame">
    <!-- 动画样式 bounce-enter-active -->
    <div id="box" class="box">
      <div style="padding: 10px 18px 34px 18px;">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div class="let-bottom"></div>
        <div class="right-bottom"></div>
        <com-frame-box @closeState="closeState" :boxTit="remarkDatas.boxTit"></com-frame-box>
        <div class="boxContent">
          <!-- test -->
          <!-- {{JSON.stringify(taskData)}} -->
          <div v-for="(item,index) in taskData" :key="index" class="taskWrapper">
            <!-- {{item}} -->
            <!-- <p class="title"> -->
            <!-- {{item.list[index].title}} -->
            <!-- </p> -->
            <div class="titleWrapper left">
              <!-- <i class="iconfont icon-yuan node"></i> -->
              <p class="f18">
                {{item.version}}
                (
                {{item.date}}
                )
              </p>
            </div>
            <div class="listWrapper left">
              <div class="taskTextWrapper" v-for="(types,index) in item.data" :key="index">
                <p class="f20">{{types.title}}</p>
                <p v-for="(lists,listIndex) in types.list" :key="listIndex">
{{lists}}
                </p>
              </div>
              <!-- <div v-if="item.realList" class="taskTextWrapper">
                <p class="f20"> {{item.realList.title}}</p>
                <p v-for="(p,realListIndex) in item.realList.list" v-if="realListIndex < 3" :key="realListIndex">
                  {{p}}
                </p>
              </div>
              <div v-if="item.bugList" class="taskTextWrapper">
                <p class="f20"> {{item.bugList.title}}</p>
                <p v-for="(p,bugListIndex) in item.realList.list" v-if="bugListIndex < 20" :key="bugListIndex">
                  {{p}}
                </p>

              </div>
              <div v-if="item.planList" class="taskTextWrapper">
                <p class="f20"> {{item.planList.title}}</p>
                <p v-for="(p,planListIndex) in item.realList.list" v-if="planListIndex < 3" :key="planListIndex">
                  {{p}}
                </p>
              </div> -->
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import comFrameBox from "@/components/MessageBox/comFrameBox"; // 弹框公用头部
// import utils from '@/utils/tool';
import {} from "@/Api/mapApi.js";
export default {
  name: "taskNoticeBox",
  components: {
    comFrameBox
  },
  props: ["frameProp"],
  data() {
    return {
      remarkDatas: this.frameProp
    };
  },
  computed: {
    taskData() {
      return this.$store.getters.taskNoticeData;
    }
  },
  methods: {
    // 关闭弹框
    closeState() {
      this.$store.commit("carBoxOpenOrClose", { $closeClass: "taskNotice" });
    }
  },
  mounted() {}
};
</script>
