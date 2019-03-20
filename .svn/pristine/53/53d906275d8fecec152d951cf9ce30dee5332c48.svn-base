<!--*
* @description: 个人菜单
* @author: wp,wqh
* @update: 2018-05-5
-->
<template>
  <section id="setTool">
    <div :class="headPortrait"
      :title="headTitle"
      @click.stop="headPortraitClick">
      <img src="../../assets/images/headPng.jpg"
        alt="头像" />
    </div>
    <div :class="'setBox transitionHeight02 '+current">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <div style="margin:12px">
        <p :class="resetConnet"
          @click="resetConnect">重新连接</p>
        <!--<p class="iconfont icon-fl-renyuan">个人信息</p>-->
        <!--<p class="iconfont icon-xiugaimima">修改密码</p>-->
        <p class="iconfont icon-shujugengxin"
          @click="updateData">数据更新</p>
        <!-- <p class="iconfont icon-gongjuxiang" @click="openSet('work')">工作交接</p> -->
        <p class="iconfont icon-shezhi"
          @click="openSet">设置</p>
        <p class="iconfont icon-theme">主题</p>
        <p class="themeSelect"
          themename="default"
          @click.stop="mapThemeRefresh('a68e4ef956562f5634b461b6e0e4a408',$event)">
          <img class="activeTheme"
            src="../../assets/images/themeTab.png" />
          <img class="themeImg"
            src="../../assets/images/mapTheme1.png" />
          <span>主题蓝</span>
        </p>
        <p class="themeSelect"
          themename="normal"
          @click.stop="mapThemeRefresh('normal',$event)">
          <img class="activeTheme"
            src="../../assets/images/themeTab.png" />
          <img class="themeImg"
            src="../../assets/images/mapTheme2.jpg" />
          <span>标准</span>
        </p>
        <p class="themeSelect"
          themename="satellite"
          @click.stop="mapThemeRefresh('satellite',$event)">
          <img class="activeTheme"
            src="../../assets/images/themeTab.png" />
          <img class="themeImg"
            src="../../assets/images/wxt.jpg" />
          <span>卫星图</span>
        </p>
        <!-- <p class="iconfont icon-ziliaoshouce">操作手册</p> -->
        <!-- <p class="iconfont icon-caozuorizhi">操作日记</p> -->
        <p class="iconfont icon-caozuorizhi" @click="vpsAbout">关于</p>

        <p class="iconfont icon-tuichu"
          @click.stop="outLogin">退出登录</p>
      </div>
    </div>
    <!--设置内容-->
    <div class="setInfo"
      v-if="setInfo">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <div>
        <span class="leftTit">设置</span>
        <span style="cursor: pointer"
          class="iconfont icon-guanbib rightIcon"
          @click="closeSet"></span>
      </div>

      <div class="setInfoContent">
        <div class="setAll"
          v-for="(item,index) in setListArr"
          :key="index">
          <p class="openP"
            :class="rotateSetIcon"
            @click.stop="closeOrOpen(item.listType,$event)">
            <span v-text="item.listTit"></span>
            <span class="iconfont icon-xiangxiajiantou rightIcon rotatejiantouOriginal"></span>
          </p>
          <div v-if="item.listType === 3" class="setChecks">
            <el-checkbox class="checkInfo"
              v-for="ite in item.listContentArr"
              :key="ite.details"
              @change="(a)=>changeCorp(ite.key,a)"
              :checked="settingCorp.indexOf(ite.key) === -1"
              :disabled='ite.disabled'>
              {{ite.details}}
            </el-checkbox>
          </div>
          <div v-else class="setChecks">
            <el-checkbox class="checkInfo"
              v-for="ite in item.listContentArr"
              :key="ite.details"
              @change="(a)=>changePolice(ite.key,a)"
              :checked="!!settingPolice[ite.key]"
              :disabled='ite.disabled'>
              {{ite.details}}
            </el-checkbox>
          </div>
        </div>
      </div>
    </div>
    <!--end-->
    <!--工作交接内容-->
    <div v-if="workShow"
      class="workHandoverBox bounce-enter-active">
      <div class="workHandoverContent">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div>
          <span class="leftTit">工作交接</span>
          <span style="cursor: pointer"
            class="iconfont icon-guanbib rightIcon"
            @click="closeSet('work')"></span>
        </div>
        <div class="handoverHead">
          <span>任攀</span>
          <i class="iconfont icon-youjiantou"></i>
          <span>梁伟</span>
          <i class="zhankai iconfont icon-web_xiangxiazhankai"
            :class="arrowState ? 'rotatejiantouOriginal' : 'rotatejiantou'"
            @click="openDeaslit"></i>
          <i class="seach iconfont icon-fangdajing"></i>
        </div>
        <div class="handoverContent">
          <p class="handoverTit">选择班型</p>
          <el-radio v-model="workType"
            label="1">白班</el-radio>
          <el-radio v-model="workType"
            label="2">夜班</el-radio>
          <div class="rightTime">
            <el-date-picker @change="handTime"
              v-model="time"
              type="datetimerange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <p class="handoverTit">交接客户</p>
          <el-radio v-model="handoverCustomer"
            label="1">全部</el-radio>
          <el-radio v-model="handoverCustomer"
            label="2">部分</el-radio>
          <div class="namelist"
            v-if="handoverCustomer==2">
            <span style="margin-right: 12px"
              v-for="(item,index) in CustomerNmaeList"
              v-text="item.name"
              :key="index"></span>
          </div>
          <p class="handoverTit">交接功能</p>
          <el-radio v-model="handoverFn"
            label="1">全部</el-radio>
          <el-radio v-model="handoverFn"
            label="2">部分</el-radio>
          <div class="namelist"
            v-if="handoverFn==2">
            <span v-for="(item,index) in CustomerFnList"
              v-text="item.name"
              :key="index"></span>
          </div>
        </div>
      </div>
      <div class="bottomBtn">确定</div>
    </div>
    <!--end-->
  </section>
</template>

<script>
import {getTaskNotice} from '@/Api/mapApi.js'

export default {
  name: 'setTool',
  computed: {
    settingPolice () {
      return this.$store.getters.setting.police
    },
    settingCorp () {
      let str = this.$store.getters.screenCorp
      let arr = str.split(',')
      if (arr[0].length === 0) {
        arr.pop()
      }
      return arr
    },
    // 实时改变用户通信状态
    headPortrait () {
      return this.$store.getters.signalState === 0 ? 'headPortrait online' : 'headPortrait offline';
    },
    // 用户状态标题
    headTitle () {
      return this.$store.getters.signalState === 0 ? '通信中' : '离线，重新连接中';
    },
    resetConnet () {
      return this.$store.getters.signalState === 0 ? 'iconfont icon-lianjie disabeld' : 'iconfont icon-lianjie';
    }
  },
  data () {
    return {
      // 展开个人菜单
      setInfo: false,
      current: '',
      /* 设置栏信息 */
      setListArr: [
        // {
        //   listType: 1,
        //   listTit: '车辆信息设置',
        //   listContentArr: [
        //     {
        //       details: '车主姓名',
        //       detailsId: 1
        //     },
        //     {
        //       details: '设备编号',
        //       detailsId: 2
        //     },
        //     {
        //       details: '车辆类型',
        //       detailsId: 3
        //     },
        //     {
        //       details: '购买盗抢险',
        //       detailsId: 4
        //     },
        //     {
        //       details: '车辆型号',
        //       detailsId: 5
        //     },
        //     {
        //       details: '车身颜色',
        //       detailsId: 6
        //     },
        //     {
        //       details: '通讯时间',
        //       detailsId: 7
        //     },
        //     {
        //       details: '速度',
        //       detailsId: 8
        //     },
        //     {
        //       details: '有效定位',
        //       detailsId: 9
        //     },
        //     {
        //       details: '车辆状态',
        //       detailsId: 10
        //     },
        //     {
        //       details: '经度',
        //       detailsId: 11
        //     },
        //     {
        //       details: '纬度',
        //       detailsId: 12
        //     },
        //     {
        //       details: '所属公司',
        //       detailsId: 13
        //     },
        //     {
        //       details: '服务器时间',
        //       detailsId: 14
        //     },
        //     {
        //       details: '围栏信息',
        //       detailsId: 15
        //     },
        //     {
        //       details: '关注信息',
        //       detailsId: 16
        //     },
        //     {
        //       details: '地址',
        //       detailsId: 17
        //     }
        //   ]
        // },
        // {
        //   listType: 2,
        //   listTit: '监控表格显示字段设置',
        //   listContentArr: [
        //     {
        //       details: '车牌号',
        //       detailsId: 20085
        //     },
        //     {
        //       details: '备注',
        //       detailsId: 20086
        //     },
        //     {
        //       details: '通讯时间',
        //       detailsId: 20087
        //     },
        //     {
        //       details: '服务器时间',
        //       detailsId: 20088
        //     },
        //     {
        //       details: '定为有效',
        //       detailsId: 20089
        //     },
        //     {
        //       details: '方向',
        //       detailsId: 20090
        //     },
        //     {
        //       details: '速度',
        //       detailsId: 20091
        //     },
        //     {
        //       details: 'SIM卡',
        //       detailsId: 20092
        //     },
        //     {
        //       details: '设备号码',
        //       detailsId: 20093
        //     },
        //     {
        //       details: '设备安装时间',
        //       detailsId: 20094
        //     },
        //     {
        //       details: '服务到期时间',
        //       detailsId: 20095
        //     },
        //     {
        //       details: '车架号',
        //       detailsId: 20096
        //     },
        //     {
        //       details: '车主姓名',
        //       detailsId: 20097
        //     },
        //     {
        //       details: '车主性别',
        //       detailsId: 20098
        //     },
        //     {
        //       details: '身份证号码',
        //       detailsId: 20099
        //     },
        //     {
        //       details: '创建时间',
        //       detailsId: 20100
        //     },
        //     {
        //       details: '车辆类型',
        //       detailsId: 20101
        //     },
        //     {
        //       details: '车辆型号',
        //       detailsId: 20102
        //     },
        //     {
        //       details: '车身颜色',
        //       detailsId: 20103
        //     },
        //     {
        //       details: '详细地址',
        //       detailsId: 20104
        //     },
        //     {
        //       details: '组织名称',
        //       detailsId: 20105
        //     },
        //     {
        //       details: '关注类型',
        //       detailsId: 20106
        //     },
        //     {
        //       details: '车辆状态',
        //       detailsId: 20107
        //     },
        //     {
        //       details: '原地设防',
        //       detailsId: 20108
        //     },
        //     {
        //       details: '电子围栏',
        //       detailsId: 20109
        //     },
        //     {
        //       details: '定位方式',
        //       detailsId: 20110
        //     },
        //     {
        //       details: '电量',
        //       detailsId: 20111
        //     },
        //     {
        //       details: '手机号码',
        //       detailsId: 20112
        //     },
        //     {
        //       details: '当日里程',
        //       detailsId: 20113
        //     },
        //     {
        //       details: '总里程',
        //       detailsId: 20114
        //     },
        //     {
        //       details: '可信度',
        //       detailsId: 20115
        //     }
        //   ]
        // },
        {
          listType: 3,
          listTit: '分组显隐设置',
          listContentArr: [
            // {
            //   details: '成都一区'
            // },
            // {
            //   details: '重庆大区'
            // },
            // {
            //   details: '异常设备'
            // },
            // {
            //   details: '铂镜汽车'
            // },
            // {
            //   details: '富民银行'
            // }
          ]
        },
        // {
        //   listType: 4,
        //   listTit: '报警类型显示设置',
        //   listContentArr: [
        //     {
        //       details: '未知报警'
        //     },
        //     {
        //       details: '设备低电报警'
        //     },
        //     {
        //       details: '开关机报警'
        //     },
        //     {
        //       details: 'GPS五险故障报警'
        //     },
        //     {
        //       details: 'ACC检测报警'
        //     }
        //   ]
        // },
        {
          listType: 5,
          listTit: '报警设置',
          listContentArr: [
            {
              details: '显示报警框', // Tip',
              key: 'tipOn'
            },
            {
              details: '开启声音',
              key: 'soundsOn'
            },
            {
              details: '显示关注车辆报警',
              key: 'followOn'

            },
            {
              details: '一直显示报警信息框',
              key: 'savaFollow'

            },
            // {
            //   details: '开启订单提醒'
            // },
            {
              details: '未知报警',
              key: 'weizhibaojing',
              disabled: true,
              code: 1000

            },
            {
              details: '设备低电报警',
              key: 'didianbaojing',
              disabled: true,
              code: ''

            },
            {
              details: '开关机报警',
              key: 'kaiguanjibaojing',
              disabled: true,
              code: ''

            },
            {
              details: '设备拆卸报警',
              key: 'shebeichaixiebaojing',
              disabled: true,
              code: ''

            },
            {
              details: 'GPS天线故障报警',
              key: 'tianxianguzhangbaojing',
              disabled: true,
              code: ''

            },
            {
              details: 'GPS无定位报警',
              key: 'wudingweibaojing',

              disabled: true,
              code: ''

            },
            {
              details: 'ACC检测报警',
              key: 'ACCjiancebaojing',
              disabled: true,
              code: ''

            },
            {
              details: '紧急报警',
              key: 'jinjibaojing',
              disabled: true,
              code: ''

            },
            {
              details: '自定义报警',
              key: 'zidingyibaojing',
              disabled: true,
              code: ''

            },
            {
              details: '终端主电源异常报警',
              key: 'dianyuanyichangbaojing',
              disabled: true,
              code: ''

            },
            {
              details: '车辆状态报警',
              key: 'zhuangtaibaojing',
              disabled: true,
              code: ''

            },
            {
              details: '电子围栏检测报警',
              key: 'dzwlbaojing',
              disabled: true,
              code: '6'

            },
            {
              details: '原地设防检测报警',
              key: 'ydsfbaojing',
              disabled: true,
              code: '5'

            }
          ]
        }
        // {
        //   listType: 6,
        //   listTit: '地图设置',
        //   listContentArr: [
        //     {
        //       details: '只显示工具图标'
        //     }
        //   ]
        // }
      ],
      /* end */
      /* 设置列表里面展开收缩 */
      openSetCls: '', // 箭头旋转cls
      rotateSetIcon: '', // 详情展开收缩cls
      /* end */
      workShow: false, // 工作交接默认隐藏
      workType: '1', // 工作类型 白班或者夜班
      handoverCustomer: '1', // 交接客户
      arrowState: false, // 箭头旋转
      /* 交接的客户列表 */
      CustomerNmaeList: [
        {
          name: '张一'
        },
        {
          name: '张二'
        },
        {
          name: '张三'
        }
      ],
      /* end */
      /* 交接的客户列表 */
      CustomerFnList: [
        {
          name: '车辆报警'
        },
        {
          name: '电子围栏'
        },
        {
          name: '历史轨迹'
        },
        {
          name: '原地设防'
        },
        {
          name: '常去地点'
        }
      ],
      /* end */
      handoverFn: '1,' // 交接功能
    }
  },
  methods: {
    vpsAbout () {
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'taskNotice'
      })
    },
    // 退出登录
    outLogin () {
      localStorage.removeItem('uid');
      this.$router.replace('/');
    },
    updateData () {
      let result = window.confirm('是否要更新本地数据库?')
      if (result) {
        let user = this.$store.getters.user;
        localStorage.setItem('isupdate', 1)
        localStorage.setItem('isupdate2', 1)
        this.$indexedDB.indexedDB.deleteDatabase('vpsdb' + user.userid);
        window.location.reload()
      }
    },
    // 重新连接mQtt
    resetConnect () {
      this.$mqtt.mqttConnect(this.$store);
    },
    // 点击头像事件操作
    headPortraitClick (e) {
      let i = this.setListArr.IndexOf(3, d => d.listType)
      let _this = this
      // 获取公司组
      let corpData = this.setListArr[i].listContentArr
      if (corpData.length === 0) {
        _this.$indexedDB.getDataAll('company', function (res) {
          if (res.data.length > 0) {
            _this.setListArr[i].listContentArr = res.data.map(d => {
              return {details: d.corpname, disabeld: true, key: d.corpid}
            })
          } else {
            _this.setListArr[i].listContentArr = []
          }
        });
      }

      let taskNoticeData = this.$store.getters.taskNoticeData
      if (taskNoticeData.length === 0) {
        getTaskNotice({index: 0, pagesize: 10})
          .then(res => {
            if (res.data.result.code === 0) {
              let data = res.data.data.map((d, i) => {
                return res.data.data[res.data.data.length - i - 1]
              })

              data = data.map(versions => {
                let dstr = 'ddff'
                let hstr = 'ttff'
                let obj = {}
                obj.version = versions.remark;
                obj.date = versions.createdate.split('T')[0]
                obj.data = versions.content.split(dstr).map((list, index) => {
                  // 临时解决方案：
                  // title问题
                  let _title = {0: '计划完成', 1: '实际完成', 2: '已解决bug'}
                  // let _key = {0: 'realList', 1: 'bugList', 2: 'planList'}
                  let title = _title[index]
                  let _list = list.split(hstr)
                  // obj[_key[index]] = {title, list: _list}
                  return {title,list:_list}
                })
                return obj
              })
              console.debug(data)
              // 多加几个测试数据
              // let test = [1, 2, 3, 4, 5]
              // test.forEach(d => {
              //   data.push(data[0])
              // })
              _this.$store.dispatch('setTaskNoticeData', data)
            }
          })
      }

      this.current === '' ? (this.current = 'animationDownHeight') : (this.current = '');
    },
    // 地图主题样式刷新
    mapThemeRefresh (enName, e) {
      this.$emit('mapThemeRefresh', enName);
      $(e.target).parent().addClass('cur').siblings('p.themeSelect').removeClass('cur');
    },
    // 检查当前主题 默认选择当前主题
    curThemeIcon () {
      let theme = this.$store.getters.theme;
      this.$nextTick(function () {
        $("p[themename='" + theme + "']").addClass('cur');
      });
    },
    // 展开
    openSet (type) {
      if (type === 'work') {
        this.workShow = true;
      } else {
        this.setInfo = !this.setInfo;
      }
    },
    // 关闭
    closeSet (type) {
      if (type == 'work') {
        this.workShow = false;
      } else {
        this.setInfo = false;
      }
    },
    // 展开和关闭设置信息
    closeOrOpen (index, e) {
      let _this = this
      let $this = $(e.target); let $p = $this.parent('p');
      if (e.currentTarget === e.target) {
        $this.find('.rotatejiantouOriginal').toggleClass('rotatejiantou');
        $this.next().slideToggle(200);
      } else {
        $p.find('.rotatejiantouOriginal').toggleClass('rotatejiantou');
        $p.next().slideToggle(200);
      }
    },
    // 展开和收缩工作交接详情信息
    openDeaslit () {
      let _this = this;
      $('.handoverContent').slideToggle(200);
      _this.arrowState = !_this.arrowState;
    },
    changeCorp (key, bool) {
      let str = this.$store.getters.screenCorp
      let arr = str.split(',')
      if (arr[0].length === 0)arr.pop()

      if (arr.indexOf(key) === -1) {
        if (!bool) {
          arr.push(key)
          let newStr = arr.toString(',')
          this.$store.dispatch('screenCorp', newStr)
        }
      } else {
        if (bool) {
          let newArr = arr.filter(d => {
            return d !== key
          });
          let newStr = newArr.toString(',')
          this.$store.dispatch('screenCorp', newStr)
        }
      }
      this.$tree.filter()
    },
    changePolice (key, bool) {
      // let police = this.$store.ge
      let obj = {}
      obj[key] = bool
      this.$store.dispatch('changeSettingPolice', { type: 'police', ...obj })
      if (!bool) {
        this.$store.dispatch('setSoundAbnormal', false)
        this.$store.dispatch('setSoundPolice', false)
      }
      if (key === 'savePolice' && bool === false) {
        this.$notify.close()
      }
    }
  },
  created () {
    this.curThemeIcon();
  }
}
</script>
