<template>
  <div class="container">
    <div class="echarts-box" ref="stockRef"></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      myCharts: null,
      allData: null,
      currentIndex: 0,
      timer: null
    };
  },
  mounted() {
    this.init();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    init() {
      this.myCharts = this.$echarts.init(this.$refs.stockRef, this.theme);
      const initOption = {
        title: {
          text: "库存销量分析",
          top: 20,
          left: 20
        }
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
      const { data: res } = await this.$http.get("stock");
      this.allData = res;
      this.update();
      this.startInterval();
    },
    update() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"]
      ];
      const colorArr = [
        ["#4FF778", "#0BA82C"],
        ["#E5DD45", "#E8B11C"],
        ["#E8821C", "#E55455"],
        ["#5052EE", "#AB6EE5"],
        ["#23E5E5", "#2E72BF"]
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      let showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          center: centerArr[index],
          hoverAnimation: false,
          labelLine: {
            show: false
          },
          label: {
            position: "center",
            color: colorArr[index]
          },
          data: [
            {
              name: item.name + "/n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: "pink"
                  },
                  {
                    offset: 1,
                    color: "skyblue"
                  }
                ])
              }
            },
            {
              value: item.stock,
              name: item.name + "\n\n" + item.sales,
              color: "#000"
            }
          ]
        };
      });
      const dataOption = {
        series: seriesArr
      };
      this.myCharts.setOption(dataOption);
    },
    startInterval() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.currentIndex++;
        if (this.currentIndex > 1) {
          this.currentIndex = 0;
        }
        this.update();
      }, 3000);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6;
      const innerRadius = titleFontSize * 3;
      const outerRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: "pie",
            radius: [outerRadius, innerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      };
      this.myCharts.setOption(adapterOption);
      this.myCharts.resize();
    }
  },
  computed: {
    ...mapState(["theme"])
  },
  watch: {
    theme() {
      this.myCharts.dispose();
      this.init();
      this.screenAdapter();
      this.update();
    }
  }
};
</script>
