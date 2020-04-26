Vue.component('bar-chart', {
  props: ["id", "data", "viewData"],
  extends: VueChartJs.Bar,
  methods: {
    drawBar() {
      const options = {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            id: 'yAxisBarID',
            position: 'right',
            gridLines: {
              color: "rgba(240, 52, 52, 0.25)"
            },
            ticks: {
              fontColor: "rgba(240, 52, 52, 0.75)",
              max: this.viewData.axisMax[this.viewData.value][this.id == this.viewData.stateName ? "state" : "province"].low,
              min: 0,
            },
            scaleLabel: {
              display: true,
              rotation: 180,
              fontColor: "rgba(240, 52, 52, 1)",
              labelString: `Nº de ${this.viewData.types.find(o => o.default == this.viewData.value).es} nuevos`
            }
          }, {
            id: 'yAxisLineID',
            position: 'left',
            gridLines: {
              color: "rgba(44, 130, 201, 0.25)"
            },
            ticks: {
              fontColor: 'rgba(44, 130, 201, 0.75)',
              max: this.viewData.axisMax[this.viewData.value][this.id == this.viewData.stateName ? "state" : "province"].total,
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
      this.renderChart({
        labels: Object.keys(this.data).map(o => o.slice(5)),
        datasets: [{
          yAxisID: 'yAxisLineID',
          label: ``,
          lineTension: 0,
          type: 'line',
          fill: false,
          borderColor: 'rgba(44, 130, 201, 1)',
          data: Object.values(this.data).map(o => o[this.viewData.value].total)
        }, {
          yAxisID: 'yAxisBarID',
          label: `${this.id}`,
          backgroundColor: 'rgba(240, 52, 52, 0.3)',
          data: Object.values(this.data).map(o => o[this.viewData.value].new)
        }]
      }, options);
    }
  },
  watch: {
    viewData: {
      deep: true,
      handler() {
        if (this.viewData.value != "hospital")
          this.drawBar();
      }
    }
  },
  mounted() {
    //console.log("mounted bar")
    if (this.viewData.value != "hospital")
      this.drawBar();
  }
});
