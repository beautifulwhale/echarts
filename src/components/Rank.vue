<template>
  <div class="container">
    <div class="echarts-box" ref="sellerRef"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      myCharts: null,
      allData: [],
      totalPage: 0,
      currentPage: 1,
      timer: null,
      start: 0,
      end: 8
    };
  },
  mounted() {
    this.initCharts();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.sellerRef, this.theme);
      const initOption = {
        title: {
          text: "商家排行列表",
          left: 20,
          top: 10
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          type: "value"
        },
        grid: {
          top: "20%",
          left: "10%",
          right: "6%",
          bottom: "10%",
          containLabel: true
        },
        series: [
          {
            type: "bar"
          }
        ]
      };
      this.myCharts.setOption(initOption);
      this.myCharts.on("mouseover", () => {
        clearInterval(this.timer);
      });
      this.myCharts.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getData() {
      const { data: result } = await this.$http.get("/rank");
      this.allData = result;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updateCharts();
      this.startInterval();
    },
    updateCharts() {
      const baseColor = [
        ["pink", "green"],
        ["tomato", "purple"],
        ["yellow", "blue"]
      ];
      const numberData = this.allData.map(item => {
        return item.value;
      });
      const cateData = this.allData.map(item => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: cateData
        },
        dataZoom: {
          show: false,
          startValue: this.start,
          endValue: this.end
        },
        series: [
          {
            data: numberData,
            itemStyle: {
              color: arg => {
                let currentColor = null;
                if (arg.data > 250) {
                  currentColor = baseColor[0];
                } else if (arg.data > 150 && arg.data <= 250) {
                  currentColor = baseColor[1];
                } else {
                  currentColor = baseColor[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: currentColor[0]
                  },
                  {
                    offset: 1,
                    color: currentColor[1]
                  }
                ]);
              }
            }
          }
        ]
      };
      this.myCharts.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.start++;
        this.end++;
        if (this.end > this.allData.length - 1) {
          this.start = 0;
          this.end = 8;
        }
        this.updateCharts();
      }, 2000);
    },
    screenAdapter() {
      const adapterFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: adapterFontSize / 1.5
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: adapterFontSize
            }
          }
        },
        series: [
          {
            barWidth: adapterFontSize,
            itemStyle: {
              barBorderRadius: [adapterFontSize / 2, adapterFontSize / 2, 0, 0]
            }
          }
        ]
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    }
  },
  computed:{
    ...mapState(['theme'])
  },
  watch: {
    theme() {
      this.myCharts.dispose();
      this.initCharts();
      this.screenAdapter();
      this.updateCharts();
    }
  }
};
</script>
