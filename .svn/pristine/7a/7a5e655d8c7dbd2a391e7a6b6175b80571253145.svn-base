<template>
    <section id="addCarFrame">
        <div id="bigBox">
          <!--  bounce-enter-active -->
            <div id="box" class="box">
                <div style="padding: 10px 18px 0px 18px; font-size:15px;">
                <div class="left-top"></div>
                <div class="right-top"></div>
                <div class="let-bottom"></div>
                <div class="right-bottom"></div>
                <com-frame-box @closeState="closeState" :boxTit="addCarDatas.boxTit">
                    {{"（"+ fenceInfo.EfenceName+"）"}}
                </com-frame-box>
                <hr class="hrColor">
                <div id="Content" class="Content clear">
                    <div class="leftBox">
                        <p>组织架构</p>
                        <div class="searchBox clear" style="margin: 15px 0 0 10px;background-color: transparent;">
                            <el-input
                                placeholder="请输入关键字进行搜索"
                                v-model="filterText"
                                :disabled = "loading"
                            >
                            </el-input>
                        </div>
                        <section id="addCarTree-left"
                            v-loading="loading"
                        >


                        <el-tree
                            :data="searchAddCarData"
                            ref="searchAddCartree"
                            :props="defaultProps"
                            node-key='key'
                            :default-checked-keys="arrAddCarTreeCheck"
                            default-expand-all
                            show-checkbox
                            check-strictly
                            :renderContent="renderContent"
                            @check-change="handleCheck"
                        >
                        </el-tree>
                        </section>
                    </div>
                    <div class="rightBox">
                        <p>已选车辆</p>
                        <div id='addCar-right-list-wrapper'>
                        <ul class="listBox" v-for="(item,index) in arrListForAddCar" :key="index">

                            <li>
                                <span>
                                <i v-if="!item.isold" class="iconfont icon-tubiaozuixin01"></i>
                                {{item.label}}
                                </span>
                                <span id="closeIcon" class="el-icon-close" style="float:right;" @click="delCarToFence(index)"></span></li>
                        </ul>

                        </div>
                    </div>
                </div>
                <hr class="hrColor">
                </div>
                <div id="confirmBox" class="clear">
                    <div id="setBtn" class="Btn" @click="OnConfirm">
                        <span>设 置</span>
                    </div>
                    <!-- <div id="cancelBtn" class="Btn" @click="cancel">
                        <span>取 消</span>
                    </div> -->
                </div>
            </div>
            <div style="clear:both;"></div>
        </div>
    </section>
</template>

<script>
import comFrameBox from '@/components/MessageBox/comFrameBox'; // 弹框公用头部
import { getCorpList, searchVEbyefenceid, getefencebyid, vehicledetail, addVehicleefence, deleteVehicleefence } from '@/Api/mapApi.js'
import utils from '@/utils/tool';
export default {
  name: 'addCarBox',
  components: {
    comFrameBox
  },
  props: ['frameProp'],
  data () {
    return {
      addCarDatas: this.frameProp,
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      time: 500,
      timer: null,
      timeLoading: 1000,
      timerLoading: null,
      value: '',
      arrListForAddCar: [],
      arrAddCarTreeChecks: ['532572', '509969'],
      isCommitSuccess: true,
      loading: false
    };
  },
  watch: {
    filterText (val) {
      this.value = val;
      let _this = this
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        _this.$store.commit('clearDataForAddCarTree', 'all')
        if (val === '') return
        _this.loading = true
        _this.$indexedDB.getDataAll('company', function (res) {
          if (res.data.length > 0) {
            res.data.forEach(company => {
              _this.$indexedDB
                .getDataBySearchLike(
                  'cveh' + company.corpid, 'label', val,
                  res1 => {
                    if (res1.data.length > 0) {
                      let index = _this.$store.getters.arrDataForAddCarTree.IndexOf(company.corpid, d => d.corpid)
                      _this.timerLoading && clearTimeout(_this.timerLoading)
                      _this.timerLoading = setTimeout(() => {
                        clearTimeout(_this.timerLoading)
                        _this.loading = false
                      }, _this.timeLoading);
                      if (index === -1) return
                      let data = res1.data.map(cell => {
                        cell.disabled = false
                        cell.key = cell.vehicleid + ''
                        let index = _this.arrAddCarTreeCheck.indexOf(cell.key)
                        if (index !== -1) {
                        }
                        return cell
                      })
                      _this.$store.commit('pushDataForAddCarTree', {data, index})
                    } else {
                      _this.loading = false
                    }
                  }
                )
            })
          }
        })
      }, this.time);
    } },
  computed: {
    fenceInfo () {
      return this.$store.getters.fenceInfoForAddCar;
    },
    arrAddCarTreeCheck () {
      let arr = this.arrListForAddCar.map(veh => {
        return veh.vehicleid
      });
      return arr
    },
    searchAddCarData () {
      if (this.value.length > 0) {
        return this.$store.getters.arrDataForAddCarTree.filter(d => {
          return d.children && d.children.length > 0
        })
      } else {
        return this.$store.getters.arrDataForAddCarTree
      }
    }

  },
  methods: {
    // 删除车辆
    delCarToFence (index) {
      let carInfo = this.arrListForAddCar[index]
      // 老旧数据
      if (carInfo.isold) {
        let isDelete = confirm('是否从电子围栏(' + this.fenceInfo.EfenceName + ')中删除该车辆')
        if (isDelete) {
          this.deleteEfenceForCar(this.arrListForAddCar[index], index)
        }
      } else {
        this.arrListForAddCar.splice(index, 1)
        this.$refs.searchAddCartree.setCheckedKeys(this.arrAddCarTreeCheck)
        // this.$message.success('删除未提交数据成功')
      }
    },
    // 勾选事件
    handleCheck (data, ischeck, cischeck) {
      let _this = this
      if (ischeck) {
        vehicledetail({id: data.vehicleid})
          .then(res => {
            if (res.data.result.code === 0) {
              if (res.data.data) {
                res.data.data.basicdata.label = res.data.data.basicdata.carno + '/' +
                    res.data.data.basicdata.ownername
                res.data.data.basicdata.isold = 0
                let index = this.arrListForAddCar.IndexOf(data.vehicleid, d => d.vehicleid)
                index === -1 && _this.arrListForAddCar.push(res.data.data.basicdata)
                // _self.$store.commit('pushDataForAddCarTree', res.data.data.basicdata)
                setTimeout(() => {
                  document.getElementById('addCar-right-list-wrapper').scrollTo(0, 10000)
                }, 500);
              }
            }
          })
      } else {
        let index = this.arrListForAddCar.IndexOf(data.vehicleid, d => d.vehicleid)
        if (index !== -1) {
          _this.delCarToFence(index)
        }
      }
    },
    // 左侧树渲染函数
    renderContent (h, {node, data, store}) {
      if (node.level === 1) {
        return (<span>{node.data.corpname}</span>)
      } else {
        return (<span vue doubleClick='test'>{node.data.name + '/' + node.data.ownername}</span>)
      }
    },
    // 关闭弹框
    closeState () {
      this.arrAddCarTreeCheck.length = 0
      this.$store.commit('carBoxOpenOrClose', { $closeClass: 'addCar' });
    },
    // 取消事件
    cancel () {
      this.closeState()
    },
    // 提交事件
    OnConfirm () {
      let arr = this.arrListForAddCar.filter(car => {
        return !car.isold
      })
      if (arr.length === 0) {
        this.$message.warning('未添加车辆')
      } else {
        arr.forEach(car => {
          if (!car.isold) {
            this.joinEfenceForCar(car)
            if (this.isCommitSuccess) {
              let content = this.arrListForAddCar.length > 1 ? '批量添加电子围栏成功' : '添加电子围栏成功'
              let content1 = this.arrListForAddCar.length > 1 ? '批量关注成功' : '关注成功'
              this.$message.success(content)
              setTimeout(() => {
                this.$message.success(content1)
              }, 1000);
            }
          }
        })
      }
    },
    deleteEfenceForCar (car, index) {
      let params = {
        condition: car.vehicleid + '@' + this.fenceInfo.ID,
        userid: this.$store.getters.user.userid
      }
      deleteVehicleefence(params)
        .then(res => {
          if (res.data.result.code === 0) {
            this.$message.success('移除成功')
            this.arrListForAddCar.splice(index, 1)
            this.$refs.searchAddCartree.setCheckedKeys(this.arrAddCarTreeCheck)
            this.$request.follow.delete([car.vehicleid, 350])
          }
        })
        .catch(error => {
          if (error) {}
        })
    },
    // 加入电子围栏
    joinEfenceForCar (car) {
      let _this = this
      let paras = {VehicleId: car.vehicleid}
      paras.ID = -1;
      paras.EfenceId = this.fenceInfo.ID
      paras.IsDelete = 0;
      paras.Remarks = '';
      paras.CreateDate = utils.formatDate.formatTime(new Date().getTime());
      paras.CreateBy = this.$store.state.user.userid;
      paras.UpdateDate = '';
      paras.UpdateBy = this.$store.state.user.userid;
      addVehicleefence(paras).then(res => {
        if (res.data.result.code === 0) {
          car.isold = 1
          _this.isCommitSuccess = _this.isCommitSuccess & 1
          _this.$request.follow.add({vehicleid: car.vehicleid, Groupid: '350', remark: '电子围栏'})
            .then(res => {
              if (res.data.result.code === 0) {
                _this.$request.follow.update()
              }
            })
            .catch(error => {
              if (error) {
                _this.$message({
                  message: '关注失败！',
                  type: 'error'
                })
              }
            })
        } else {
          _this.isCommitSuccess = _this.isCommitSuccess & 0
        }
      })
    },
    // 获取右侧列表数据
    getInitList () {
      this.$store.commit('clearDataForAddCarTree')
      let _self = this
      let params2 = {
        condition: this.fenceInfo.ID,
        userid: this.$store.getters.user.userid
      }
      searchVEbyefenceid(params2)
        .then(res => {
          if (res.data.result.code === 0) {
            res.data.data.forEach(veh => {
              vehicledetail({id: veh.VehicleId})
                .then(res => {
                  if (res.data.result.code === 0) {
                    if (res.data.data) {
                      res.data.data.basicdata.label = res.data.data.basicdata.carno + '/' +
                    res.data.data.basicdata.ownername
                      res.data.data.basicdata.isold = 1
                      _self.arrListForAddCar.push(res.data.data.basicdata)
                    }
                  }
                })
            })
          }
        })
        .catch(error => {
          if (error) {}
        })
    }

  },
  created () {
    let params = { id: this.$store.getters.user.userid };
    let _self = this;
    // this.searchAddCarData.length = 0
    this.arrListForAddCar.length = 0
    getCorpList(params).then(function (response) {
      let results = response.data;
      if (results.data == null) {
        _self.$message({
          message: '数据库异常',
          type: 'error',
          center: true
        });
        _self.$store.commit('clearDataForAddCarTree')
        return;
      }
      if (results.result.code === 0 && results.data.length > 0) {
        let obj = results.data.map(d => {
          d.children = []
          d.disabled = true
          return d
        })
        _self.$store.commit('pushDataForAddCarTree', {data: obj})
      }
    });
    this.getInitList()
  },
  mounted () {
  }
};
</script>
<style scope>
#addCarFrame #bigBox{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(97, 142, 187, 0.5);
    z-index: 99;
}
#addCarFrame #box {
  width: 668px !important;
}
#addCarFrame .el-tree .is-current.is-focusable{
    background-color: none;
}
#addCarFrame .el-tree{
   background-color: transparent;
   height: 190px;
   padding: 5px;
}
.Content .rightBox .listBox {
  margin: 5px 10px;
}
.Content .rightBox .listBox li {
  /* margin-bottom: 5px; */
  overflow: hidden;
}
.Content .rightBox .listBox li span:first-of-type{
     display:inline-block;
     white-space: nowrap;

}
.Content .rightBox .listBox li span#closeIcon:hover{
     color:red;
}
.Content {
  margin: 15px 0 15px 0;
  padding: 10px;
}
.Content > div {
  width: 276px;;
  height: 300px;
  border: 1px solid;
  border-radius: 10px;
  float: left;
  margin: 0 15px;
  /* overflow: auto; */
  overflow: hidden;
}
#addCar-right-list-wrapper{
  height: 275px;
  overflow: auto;
}
.Content > div p {
  text-align: center;
  font-size: 16px;
  border-bottom: solid 1px;
}
.clear:after {
  content: "";
  width: 0;
  height: 0;
  display: block;
  clear: both;
}
.vps-custom-default .Content .leftBox .searchBox input {
  width: 218px;
  background-color: transparent;
  color: #fff;
  border: solid 1px #fff;
  margin-bottom: 10px;
}
.vps-custom-normal .Content .leftBox .searchBox input {
  width: 218px;
  background-color: transparent;
  color: #000;
  border: solid 1px #000;
  margin-bottom: 10px;
}

#confirmBox {
  position: relative;
}
#confirmBox {
  height: 35px;
  font-size: 15px;
  margin: 10px 6px 10px 6px;
}
#confirmBox .Btn {
  width: 50px;
  height: 30px;
  float: left;
  text-align: center;
  line-height: 30px;
  background-color: rgba(0, 111, 230, 0.8);
  margin: 0 15px 0 15px;
}
.vps-custom-normal #confirmBox .Btn{
    color: #fff;
}
#confirmBox .Btn#setBtn {
  /* margin-left: 236px; */
  margin-left: 50%;
    transform: translate(-50%, 0%);
}
.vps-custom-default .el-tree-node__content:hover{
    background-color: rgb(10, 37, 66)!important;
}
#addCarFrame .el-tree {
    overflow: auto;
}
.vps-custom-default .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(10, 37, 66)!important;
}
#addCarFrame .rightBox .icon-tubiaozuixin01{
  color:red;
}
</style>

