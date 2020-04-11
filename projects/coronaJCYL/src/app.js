var app = new Vue({
  el: '#app',
  data() {
    return {
      name: "",
      provincesName: [],
      data: {},
      loadedHospital: false,
      viewData: {}
    }
  },
  methods: {
    formateEpidemiological(stateName, epidemiologicalData) {
      var provincesName = epidemiologicalData.facet_groups.find(o => o.name === "provincia").facets.map(o => o.name).sort(Intl.Collator().compare);

      var structure = { res: {}, aux: { axis: { cases: { total: 0, new: 0 }, discharged: { total: 0, new: 0 }, deaths: { total: 0, new: 0 } } } };
      structure.res[stateName] = {};
      structure.aux[stateName] = { deaths: 0, discharged: 0 };

      provincesName.forEach(name => {
        structure.res[name] = {};
        structure.aux[name] = { deaths: 0, discharged: 0 }
      });

      var data = [...epidemiologicalData.records]
        .reverse()
        .reduce((acc,
          { fields: { fecha,
            provincia: state,
            casos_confirmados,
            nuevos_positivos,
            altas,
            fallecimientos } }) => {

          if (acc.res[state][fecha]) {
            throw Error(`On state ${state} the date ${fecha} is repeated`);
          } else {
            acc.res[state][fecha] = {
              cases: {
                total: casos_confirmados,
                new: nuevos_positivos
              },
              discharged: {
                total: altas,
                new: altas - acc.aux[state].discharged
              },
              deaths: {
                total: fallecimientos,
                new: fallecimientos - acc.aux[state].deaths
              }
            };
            acc.aux[state].discharged = altas;
            acc.aux[state].deaths = fallecimientos;
          }

          if (acc.res[stateName][fecha]) {
            acc.res[stateName][fecha].cases.total += casos_confirmados;
            acc.res[stateName][fecha].cases.new += nuevos_positivos;
            acc.res[stateName][fecha].discharged.total += altas;
            acc.res[stateName][fecha].discharged.new += acc.res[state][fecha].discharged.new;
            acc.res[stateName][fecha].deaths.total += fallecimientos;
            acc.res[stateName][fecha].deaths.new += acc.res[state][fecha].deaths.new;
          } else {
            acc.res[stateName][fecha] = {
              cases: {
                total: casos_confirmados,
                new: nuevos_positivos
              },
              discharged: {
                total: altas,
                new: acc.res[state][fecha].discharged.new
              },
              deaths: {
                total: fallecimientos,
                new: acc.res[state][fecha].deaths.new
              }
            };
            acc.aux[stateName].discharged = altas;
            acc.aux[stateName].deaths = fallecimientos;
          }
          //console.log(JSON.stringify(acc.res[stateName].axis));
          if (acc.aux.axis.cases.total < acc.res[stateName][fecha].cases.total)
            acc.aux.axis.cases.total = acc.res[stateName][fecha].cases.total;

          if (acc.aux.axis.discharged.total < acc.res[stateName][fecha].discharged.total)
            acc.aux.axis.discharged.total = acc.res[stateName][fecha].discharged.total;

          if (acc.aux.axis.deaths.total < acc.res[stateName][fecha].deaths.total)
            acc.aux.axis.deaths.total = acc.res[stateName][fecha].deaths.total;

          if (acc.aux.axis.cases.new < acc.res[stateName][fecha].cases.new)
            acc.aux.axis.cases.new = acc.res[stateName][fecha].cases.new;

          if (acc.aux.axis.discharged.new < acc.res[stateName][fecha].discharged.new)
            acc.aux.axis.discharged.new = acc.res[stateName][fecha].discharged.new;

          if (acc.aux.axis.deaths.new < acc.res[stateName][fecha].deaths.new)
            acc.aux.axis.deaths.new = acc.res[stateName][fecha].deaths.new;

          return acc;
        }, structure);

      return { provincesName, data: data.res, axisMax: data.aux.axis };
    },
    formatHospital(stateName, hospitalData) {
      var provincesName = hospitalData.facet_groups.find(o => o.name === "provincia").facets.map(o => o.name).sort(Intl.Collator().compare);

      var res = {};
      res[stateName] = {};

      provincesName.forEach(name => {
        res[name] = {};
      });

      var data = [...hospitalData.records]
        .reverse()
        .reduce((acc,
          { fields: { fecha,
            provincia: state,
            hospitalizados_uci,
            hospitalizados_planta } }) => {

          if (acc[state][fecha]) {
            acc[state][fecha].hospital.uci += hospitalizados_uci;
            acc[state][fecha].hospital.plant += hospitalizados_planta;
          }
          else {
            acc[state][fecha] = {
              hospital: {
                uci: hospitalizados_uci,
                plant: hospitalizados_planta
              }
            };
          }

          if (acc[stateName][fecha]) {
            acc[stateName][fecha].hospital.uci += hospitalizados_uci;
            acc[stateName][fecha].hospital.plant += hospitalizados_planta;
          }
          else {
            acc[stateName][fecha] = {
              hospital: {
                uci: hospitalizados_uci,
                plant: hospitalizados_planta
              }
            };
          }

          return acc;
        }, res);

      return { provincesName, data };
    },
    formatData(stateName, epidemiologicalData, hospitalData) {
      var { provincesName, data, axisMax } = this.formateEpidemiological(stateName, epidemiologicalData);
      // console.log(JSON.stringify(axisMax));

      var { provincesName: pN2, data: dataHospital, error } = this.formatHospital(stateName, hospitalData);

      if (!error && (JSON.stringify(provincesName) == JSON.stringify(pN2))) {
        Object.entries(dataHospital).forEach(([k, v]) => {
          Object.entries(v).forEach(([k1, v2]) => {
            data[k][k1].hospital = v2.hospital;
          });
        });
        this.loadedHospital = true;
      }

      Object.keys(axisMax).forEach(k => {
        axisMax[k].total = this.calculate(axisMax[k].total, 1.1);
        axisMax[k].low = this.calculate(axisMax[k].new, 1 / 2);
        axisMax[k].new = this.calculate(axisMax[k].new, 3);
      });

      this.provincesName = provincesName;
      this.viewData = {
        stateName,
        axisMax,
        types: [
          { en: "Cases", es: "Casos", default: "cases" },
          { en: "Discharged", es: "Altas", default: "discharged" },
          { en: "Deaths", es: "Fallecidos", default: "deaths" },
          { en: "Hospital", es: "Hospitalizados", default: "hospital" }
        ], value: "cases"
      };
      this.data = data;
      this.name = stateName;

      this.correctTransform = 0;
    },
    loadData() {
      let url = 'https://data.opendatasoft.com/api/records/1.0/search/?dataset=situacion-epidemiologica-coronavirus-en-castilla-y-leon%40jcyl&rows=-1';

      axios({
        method: "GET",
        url,
        headers: {
          "Accept": "application/json"
        }
      })
        .then(this.formatData)
        .catch((error) => {
          console.log(error);
        });
    },
    calculate(num, mult) {
      return this.roundedMax(this.roundedMax(num) * mult)
    },
    roundedMax(num) {
      var l = String(num.toFixed(0)).length - 2;
      if (l == -1) {
        return num;
      } else if (l == 0)
        return (num / 10 + 0.5).toFixed(0) * 10;

      var p = Math.pow(10, l);
      return (num / p + 0.5).toFixed(0) * p;
    },
    buttonClass(name) {
      return [this.viewData.value == name ? 'btn-secondary' : 'btn-outline-secondary']
    },
    buttonChange(name) {
      return this.viewData.value = name;
    }
  },
  mounted() {
    // this.loadData();
    this.formatData("Castilla y León", epidemiologicalData, hospitalData);
  }
})
