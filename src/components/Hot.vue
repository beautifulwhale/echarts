<template>
  <div class="container">
    <div class="echarts-box" ref="hotRef"></div>
    <span class="left" @click="toLeft">《</span>
    <span class="right" @click="toRight">》</span>
    <span class="name" :style="comStyle">{{ titleName }}</span>
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
      titleFontSize: 0
    };
  },
  mounted() {
    this.init();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    ...mapState(["theme"]),
    titleName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize / 2 + "px"
      };
    }
  },
  methods: {
    init() {
      this.myCharts = this.$echarts.init(this.$refs.hotRef, this.theme);
      const initOption = {
        title: {
          text: "热销占比图",
          left: 20,
          top: 20
        },
        series: [
          {
            type: "pie"
          }
        ],
        legend: {
          orient: "vertical",
          right: "10%",
          top: "10%",
          icon: "circle"
        }
      };
      this.myCharts.setOption(initOption);
    },
    async getData() {
      const { data: res } = await this.$http.get("/hot");
      this.allData = res;
      this.update();
    },
    update() {
      const seriesArr = this.allData[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        };
      });
      const dataOption = {
        series: [{ data: seriesArr }],
        tooltip: {
          trigger: "item",
          formatter: args => {
            let total = 0;
            args.data.children.forEach(item => {
              total += item.value;
            });
            let str = "";
            args.data.children.forEach(item => {
              str +=
                `${item.name}:${parseInt((item.value / total) * 100) + "%"}` +
                "</br>";
            });
            return str;
          }
        }
      };
      this.myCharts.setOption(dataOption);
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.update();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.update();
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        series: [
          {
            radius: this.titleFontSize * 5,
            center: ["50%", "55%"]
          }
        ],
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
<style>
.left {
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translateY(-50%);
  font-weight: bolder;
  z-index: 10;
  color: red;
}
.right {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  font-weight: bolder;
  color: red;
}
.name {
  position: absolute;
  bottom: 10%;
  right: 15%;
  color: red;
  font-weight: bolder;
}
</style>
