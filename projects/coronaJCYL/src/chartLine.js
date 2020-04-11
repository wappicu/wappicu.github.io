Vue.component('line-chart', {
  props: ["id", "data", "selection"],
  extends: VueChartJs.Line,
  methods: {
    drawLine() {
      this.renderChart({
        labels: Object.keys(this.data),
        datasets: [{
          yAxisID: 'yAxisID',
          label: `${this.id}`,
          lineTension: 0,
          data: Object.values(this.data).map(o => o[this.selection.group][this.selection.type]),
        }]
      }, {
        scales: {
          yAxes: [{
            id: 'yAxisID',
            position: 'left',
            ticks: {
              min: 0
            },
            scaleLabel: {
              display: true,
              labelString: `Nº of ${this.selection.group} ${this.selection.type}`
            }
          }]
        }
      });
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
