Vue.component("line-chart", {
  props: ["id", "data", "viewData"],
  extends: VueChartJs.Line,
  methods: {
    draw() {
      if (this.viewData.value != "hospital") {
        return;
      }
      const options = {
        scales: {
          yAxes: [
            {
              id: "yAxisRightID",
              position: "right",
              ticks: {
                display: false,
                fontColor: "rgba(0, 0, 0, 1)",
                max: this.viewData.axisMax[this.viewData.value][
                  this.id == this.viewData.stateName ? "state" : "province"
                ] / 1.4,
                min: 0,
              },
              scaleLabel: {
                display: false,
                fontColor: "rgba(0, 0, 0, 1)",
              },
            },
            {
              id: "yAxisLeftID",
              position: "left",
              ticks: {
                fontColor: "rgba(0, 0, 0, 1)",
                max: this.viewData.axisMax[this.viewData.value][
                  this.id == this.viewData.stateName ? "state" : "province"
                ] / 1.3,
                min: 0,
              },
              scaleLabel: {
                display: true,
                fontColor: "rgba(0, 0, 0, 1)",
                labelString: `Nº de hospitalizados`,
              },
            },
          ],
        },
        responsive: true,
        maintainAspectRatio: false,
      };
      this.renderChart(
        {
          labels: Object.keys(this.data).map((o) => o.slice(5)),
          datasets: [
            {
              yAxisID: "yAxisRightID",
              label: "Total",
              lineTension: 0,
              fill: false,
              borderColor: "rgba(240, 52, 52, 1)",
              backgroundColor: "rgba(240, 52, 52, 1)",
              data: Object.values(this.data).map((o) => o.total),
            },
            {
              yAxisID: "yAxisLeftID",
              label: "UCI",
              lineTension: 0,
              fill: false,
              backgroundColor: "rgba(44, 130, 201, 1)",
              borderColor: "rgba(44, 130, 201, 1)",
              data: Object.values(this.data).map((o) => o.uci),
            },
          ],
        },
        options
      );
    },
  },
  watch: {
    viewData: {
      deep: true,
      handler() {
        //console.log("watch line")
        this.draw();
      },
    },
  },
  mounted() {
    //console.log("Mounted line");
    this.draw();
  },
});
