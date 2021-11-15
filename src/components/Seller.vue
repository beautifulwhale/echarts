<template>
  <div class="container">
    <div class="echarts-box" ref="sellerRef"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      myCharts: null,
      allData: [],
      totalPage: 0,
      currentPage: 1,
      timer: null
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
      this.myCharts = this.$echarts.init(this.$refs.sellerRef, "chalk");
      const initOption = {
        title: {
          text: "商家销售列表",
          textStyle: {
            fontSize: 60
          },
          left: 20,
          top: 20
        },
        xAxis: {
          type: "value"
        },
        yAxis: {
          type: "category"
        },
        grid: {
          top: "20%",
          left: "10%",
          right: "6%",
          bottom: "10%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            lineStyle: {
              width: 60,
              color: "#2D3443"
            },
            z: 0
          }
        },
        series: [
          {
            type: "bar",
            barWidth: 60,
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white"
              }
            },
            itemStyle: {
              barBorderRadius: [0, 30, 30, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "red"
                },
                {
                  offset: 1,
                  color: "#bfa"
                }
              ])
            }
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
      const { data: result } = await this.$http.get("/seller");
      this.allData = result;
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      this.totalPage =
        this.allData.length % 5 == 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateCharts();
      this.startInterval();
    },
    updateCharts() {
      let start = (this.currentPage - 1) * 5;
      let end = this.currentPage * 5;
      let showData = this.allData.slice(start, end);
      const numberData = showData.map(item => {
        return item.value;
      });
      const cateData = showData.map(item => {
        return item.name;
      });
      const dataOption = {
        yAxis: {
          data: cateData
        },
        series: [
          {
            data: numberData
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
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateCharts();
      }, 2000);
    },
    screenAdapter() {
      const adapterFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: adapterFontSize
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
              barBorderRadius: [0, adapterFontSize / 2, adapterFontSize / 2, 0]
            }
          }
        ]
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    }
  }
};
</script>
<style></style>
