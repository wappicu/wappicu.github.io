Vue.component('line-chart', {
  props: ["id", "data", "axis"],
  extends: VueChartJs.Line,
  methods: {
    drawBar() {
      const options = {
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            id: 'yAxisRightID',
            position: 'right',
            ticks: {
              fontColor: "rgba(240, 52, 52, 0.75)",
              max: this.axis,
              min: 0,
            },
            scaleLabel: {
              display: true,
              fontColor: "rgba(240, 52, 52, 1)",
              labelString: `Nº de hospitalizados en planta`
            }
          }, {
            id: 'yAxisLeftID',
            position: 'left',
            ticks: {
              fontColor: 'rgba(44, 130, 201, 0.75)',
              max: this.axis,
              min: 0
            },
            scaleLabel: {
              display: true,
              fontColor: 'rgba(44, 130, 201, 1)',
              labelString: `Nº de hospitalizados en UCI`
            }
          }]
        },
        responsive: true,
        maintainAspectRatio: false
      };
      this.renderChart({
        labels: Object.keys(this.data).map(o => o.slice(5)),
        datasets: [{
          yAxisID: 'yAxisRightID',
          lineTension: 0,
          fill: false,
          borderColor: 'rgba(44, 130, 201, 1)',
          data: Object.values(this.data).map(o => o.plant)
        }, {
          yAxisID: 'yAxisLeftID',
          lineTension: 0,
          fill: false,
          backgroundColor: 'rgba(240, 52, 52, 1)',
          data: Object.values(this.data).map(o => o.uci)
        }]
      }, options);
    }
  },
  mounted() {
    this.drawBar();
  }
});