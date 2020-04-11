Vue.component('line-chart', {
  props: ["id", "data", "viewData"],
  extends: VueChartJs.Line,
  methods: {
    drawLine() {

      const options = {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            id: 'yAxisRightID',
            position: 'right',
            gridLines: {
              color: "rgba(240, 52, 52, 0.25)"
            },
            ticks: {
              fontColor: "rgba(240, 52, 52, 0.75)",
              max: this.id == this.viewData.stateName ? this.viewData.axisMax[this.viewData.value].new : this.viewData.axisMax[this.viewData.value].low,
              min: 0,
            },
            scaleLabel: {
              display: true,
              rotation: 180,
              fontColor: "rgba(240, 52, 52, 1)",
              labelString: `Nº de ${this.viewData.types.find(o => o.default == this.viewData.value).es} nuevos`
            }
          }, {
            id: 'yAxisLeftID',
            position: 'left',
            gridLines: {
              color: "rgba(44, 130, 201, 0.25)"
            },
            ticks: {
              fontColor: 'rgba(44, 130, 201, 0.75)',
              max: this.id == this.viewData.stateName ? this.viewData.axisMax[this.viewData.value].total : this.viewData.axisMax[this.viewData.value].new,
              min: 0
            },
            scaleLabel: {
              fontColor: 'rgba(44, 130, 201, 1)',
              display: true,
              labelString: `Nº de ${this.viewData.types.find(o => o.default == this.viewData.value).es} acumulados`
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      };
      console.log(JSON.stringify(Object.values(this.data).map(o => o.uci)))
      this.renderChart({
        labels: Object.keys(this.data),
        datasets: [{
          yAxisID: 'yAxisLeftID',
          label: `${this.id}`,
          lineTension: 0,
          data: Object.values(this.data).map(o => o.uci),
        }, {
          yAxisID: 'yAxisRightID',
          label: `${this.id}`,
          lineTension: 0,
          data: Object.values(this.data).map(o => o.plant),
        }]
      }, options);
    }
  },
  watch: {
    selection: {
      deep: true,
      handler() {
        this.drawLine();
      }
    }
  },
  mounted() {
    this.drawLine();
  }
});
