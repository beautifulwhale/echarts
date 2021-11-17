<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headSrc" alt="" />
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" />
      </span>
      <span class="title">电商平台数据大屏实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="changeTheme" />
        <span class="datetime">{{ timeValue }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <!-- 销量趋势图表 -->
          <Trend ref="trend" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('trend')" style="color:red">>></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <!-- 商家销售金额图表 -->
          <Seller ref="seller" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('seller')" style="color:red">>></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <!-- 商家分布图表 -->
          <ChinaMap ref="map" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('map')" style="color:red">>></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <!-- 地区销量排行图表 -->
          <Rank ref="rank" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('rank')" style="color:red">>></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <hot ref="hot" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('hot')" style="color:red">>></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <!-- 库存销量分析图表 -->
          <Stock ref="stock" />
          <div class="resize">
            <!-- icon-compress-alt -->
            <span @click="changeSize('stock')" style="color:red">>></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
import Hot from "@/components/Hot.vue";
import ChinaMap from "@/components/ChinaMap";
import Rank from "@/components/Rank.vue";
import Seller from "@/components/Seller.vue";
import Stock from "@/components/Stock.vue";
import Trend from "@/components/Trend.vue";
import { getThemeValue } from "../utils/theme_utils";
import { mapState } from "vuex";
export default {
  components: {
    Hot,
    ChinaMap,
    Rank,
    Seller,
    Stock,
    Trend
  },
  data() {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      },
      timeValue: "",
      timer: null
    };
  },
  created() {
    this.$socket.registerCallBack("fullScreen", this.receiveData);
    this.displayTime();
  },
  destroyed() {
    this.$socket.unRegister("fullScreen");
    clearInterval(this.timer);
  },
  mounted() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.displayTime, 1000);
  },
  methods: {
    displayTime() {
      //获取系统当前的年、月、日、小时、分钟、毫秒
      let date, year, month, day, h, m, s;
      date = new Date();
      year = date.getFullYear();
      month = date.getMonth() + 1;
      day = date.getDate();
      h = date.getHours();
      m = date.getMinutes();
      s = date.getSeconds();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return (this.timeValue =
        year + "-" + month + "-" + day + "  " + h + ":" + m + ":" + s);
    },
    changeSize(type) {
      this.fullScreenStatus[type] = !this.fullScreenStatus[type];
      this.$nextTick(() => {
        this.$refs[type].screenAdapter();
      });
      /**
       * 这里WebSocket失效了不能向后端成功的发送数据了
       */
      const targetValue = !this.fullScreenStatus[type];
      this.$socket.send({
        action: "fullScreen",
        sockType: "fullScreen",
        chartName: type,
        value: targetValue
      });
    },
    receiveData(data) {
      console.log(data);
      const type = data.chartName;
      const value = data.value;
      this.fullScreenStatus[type] = value;
      this.$nextTick(() => {
        this.$refs[type].screenAdapter();
      });
    },
    changeTheme() {
      this.$store.commit("changeTheme");
    }
  },
  computed: {
    ...mapState(["theme"]),
    headSrc() {
      return "../../static/img/" + getThemeValue(this.theme).headerBorderSrc;
    },
    logoSrc() {
      return "../../static/img/" + getThemeValue(this.theme).logoSrc;
    },
    themeSrc() {
      return "../../static/img/" + getThemeValue(this.theme).themeSrc;
    },
    containerStyle() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor,
        color: getThemeValue(this.theme).titleColor
      };
    }
  }
};
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #2e2e2f;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-65%);
    img {
      height: 35px;
      width: 154px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
