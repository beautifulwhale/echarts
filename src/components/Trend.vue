<template>
  <div class="container">
    <div class="cate">
      <div class="currentType">
        <span :style="fontStyle">{{ currentTitle }}</span>
        <span
          @click="changeType"
          style="font-weight: bolder;color: springgreen;"
          :style="fontStyle"
          >v</span
        >
      </div>
      <div
        class="allType"
        v-for="item in choiceTypeList"
        :key="item.key"
        v-show="showType"
        @click="chooseType(item.key)"
        :style="fontStyle"
      >
        <div class="itemType">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="echarts-box" ref="trendRef"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      myCharts: null,
      allData: null,
      typeList: [],
      currentType: "map",
      showType: false,
      titleFontSize: 0
    };
  },
  computed: {
    choiceTypeList() {
      if (!this.allData) {
        return "";
      }
      return this.typeList.filter(item => {
        return item.key !== this.currentType;
      });
    },
    currentTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentType].title;
      }
    },
    fontStyle() {
      return { fontSize: this.titleFontSize / 2 + "px" };
    }
  },
  mounted() {
    this.initCharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.trendRef, "chalk");
      const initOption = {
        title: {},
        xAxis: {
          type: "category",
          boundaryGap: false
        },
        yAxis: {
          type: "value"
        },
        legend: {
          left: "4%",
          top: "10%",
          icon: "circle"
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "10%",
          bottom: "10%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        }
      };
      this.myCharts.setOption(initOption);
    },
    async getData() {
      const { data: result } = await this.$http.get("/trend");
      this.allData = result;
      this.typeList = this.allData.type;
      this.updateCharts();
    },
    updateCharts() {
      const colorList1 = [
        "rgba(128, 255, 165,0)",
        "rgba(0, 221, 255,0)",
        "rgba(55, 162, 255,0)",
        "rgba(255, 0, 135,0)",
        "rgba(255, 191, 0,0)"
      ];
      const colorList2 = [
        "rgba(1, 191, 236,1)",
        "rgba(77, 119, 255,1)",
        "rgba(116, 21, 219,1)",
        "rgba(135, 0, 157,1)",
        "rgba(224, 62, 76,1)"
      ];
      //月份
      const monthList = this.allData.common.month;
      //图例
      const legendList = this.allData[this.currentType].data.map(item => {
        return item.name;
      });
      //地区销量趋势
      const areaList = this.allData[this.currentType].data.map(
        (item, index) => {
          return {
            name: item.name,
            type: "line",
            data: item.data,
            stack: this.currentType,
            areaStyle: {
              opacity: 0.9,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colorList1[index]
                },
                {
                  offset: 1,
                  color: colorList2[index]
                }
              ])
            }
          };
        }
      );
      const dataOption = {
        xAxis: {
          data: monthList
        },
        legend: {
          data: legendList
        },
        series: areaList
      };
      this.myCharts.setOption(dataOption);
    },
    changeType() {
      this.showType = !this.showType;
    },
    chooseType(type) {
      this.currentType = type;
      this.updateCharts();
      this.showType = false;
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    }
  }
};
</script>
<style>
.cate {
  position: absolute;
  z-index: 10;
  color: white;
  margin-bottom: 10px;
  left: 40px;
  top: 20px;
}
span {
  margin-right: 10px;
}
/* .allType {
  position: absolute;
  color: white;
  z-index: 10;
} */
</style>
