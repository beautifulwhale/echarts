<template>
  <div class="container" @dblclick="reverseMap">
    <div class="echarts-box" ref="mapRef"></div>
  </div>
</template>
<script>
import axios from "axios";
import { getProvinceMapInfo } from "../utils/map_utils";
import { mapState } from "vuex";
export default {
  data() {
    return {
      myCharts: null,
      allData: null,
      titleFontSize: 0,
      provinceList: {}
    };
  },
  computed: {
    ...mapState(["theme"])
  },
  created() {
    /**
     * 本图使用的websocket 其余图表并没有更改 可自行更改
     */
    this.$socket.registerCallBack("mapData", this.getData);
  },
  mounted() {
    this.initCharts();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
    this.$socket.send({
      action: "getData",
      chartName: "map",
      sockType: "mapData",
      value: ""
    });
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    this.$socket.unRegister("mapData");
  },
  methods: {
    async initCharts() {
      this.myCharts = this.$echarts.init(this.$refs.mapRef, this.theme);
      //获取中国地图
      const result = await axios.get(
        "http://localhost:8080/static/map/china.json"
      );
      this.$echarts.registerMap("china", result.data);
      const initOption = {
        title: {
          text: "中国地图",
          left: 20,
          top: 20
        },
        geo: {
          type: "map",
          map: "china",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333"
          }
        },
        legend: {
          left: "5%",
          bottom: "10%",
          orient: "vertical"
        }
      };
      this.myCharts.setOption(initOption);
      this.myCharts.on("click", async event => {
        const provinceInfo = getProvinceMapInfo(event.name);
        if (!this.provinceList[provinceInfo.key]) {
          const { data: provinceData } = await axios.get(
            "http://localhost:8080" + provinceInfo.path
          );
          this.provinceList[provinceInfo.key] = provinceData;
          this.$echarts.registerMap(provinceInfo.key, provinceData);
        }
        const provinceOption = {
          geo: {
            type: "map",
            map: provinceInfo.key
          }
        };
        this.myCharts.setOption(provinceOption);
      });
    },
    getData(result) {
      // const { data: result } = await this.$http.get("/map");
      this.allData = result;
      this.updateData();
    },
    updateData() {
      const seriesArr = this.allData.map(item => {
        return {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: item.children,
          name: item.name,
          rippleEffect: {
            scale: 8,
            brushType: "stroke"
          }
        };
      });
      const legendArr = this.allData.map(item => {
        return item.name;
      });
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      };
      this.myCharts.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
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
    },
    reverseMap() {
      const reverseOption = {
        geo: {
          map: "china"
        }
      };
      this.myCharts.setOption(reverseOption);
    }
  },
  watch: {
    theme() {
      this.myCharts.dispose();
      this.initCharts();
      this.screenAdapter();
      this.updateData();
    }
  }
};
</script>
<style></style>
