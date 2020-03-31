var app = new Vue({
  el: '#app',
  data: {
    title: `Datos de la API de la Junta de Castilla y León a fecha de ${new Date().toLocaleString()}`,
    tableSelected: "Salamanca",
    canvasData: {
      state: "Salamanca",
      type: ""
    },
    provincesForSelects: [],
    data: []
  },
  methods: {
    draw() {
      console.log("Hola")
      var ctx = document.getElementById('myChart').getContext('2d');
      var values = [...this.data[this.canvasData.state]].reverse();
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: values.map(o => o.fecha),
          datasets: [{
            label: this.canvasData.type,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: values.map(o => o[this.canvasData.type])
          }]
        },

        // Configuration options go here
        options: {}
      });
    },
    correctResponse(response) {
      this.data = this.orderData(response.data.records);

      this.canvasData.type = "altas"
    },
    dateOrder(a, b) {
      var d1 = new Date(a.fecha);
      var d2 = new Date(b.fecha);;
      if (d1.getFullYear() <= d2.getFullYear()) {
        if (d1.getMonth() <= d2.getFullYear()) {
          if (d1.getDate() <= d2.getDate()) {
            return 1;
          }
        }
      }
      return -1;
    },
    orderData(data) {
      var grouped = [...data]
        .reduce((r, { fields }) => {
          r[fields.provincia] = [...r[fields.provincia] || [], fields];
          return r;
        }, {});

      for (let key of Object.keys(grouped)) {
        this.provincesForSelects.push(key);
        var list = grouped[key]
          .sort(this.dateOrder);

        list.map((item, index, arr) => {
          if (index != arr.length - 1) {
            item["nuevas_altas"] = item.altas - arr[index + 1].altas;
            item["nuevos_fallecimientos"] = item.fallecimientos - arr[index + 1].fallecimientos;
            item["nuevos_nuevos_positivos"] = item.nuevos_positivos - arr[index + 1].nuevos_positivos;
          }
          else {
            item["nuevas_altas"] = item.altas;
            item["nuevos_fallecimientos"] = item.fallecimientos;
            item["nuevos_nuevos_positivos"] = item.nuevos_positivos;
          }
        });
      }
      return grouped;
    }
  },
  watch: {
    canvasData: {
      handler(val) {
        this.draw();
      },
      deep: true
    }
  },
  mounted() {
    let url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=situacion-epidemiologica-coronavirus-en-castilla-y-leon%40jcyl&rows=-1';

    axios({
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      url,
    })
      .then(this.correctResponse)
      .catch((error) => {
        console.log(error);
      });
  }
})