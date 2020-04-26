var app = new Vue({
  el: '#app',
  data() {
    return {
      name: "",
      provincesName: [],
      epidemiologicalData: {},
      hospitalData: {},
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

          if (acc.aux.axis.cases.new < acc.res[state][fecha].cases.total)
            acc.aux.axis.cases.new = acc.res[state][fecha].cases.total;

          if (acc.aux.axis.discharged.new < acc.res[state][fecha].discharged.total)
            acc.aux.axis.discharged.new = acc.res[state][fecha].discharged.total;

          if (acc.aux.axis.deaths.new < acc.res[state][fecha].deaths.total)
            acc.aux.axis.deaths.new = acc.res[state][fecha].deaths.total;

          return acc;
        }, structure);

      return { provincesName, data: data.res, axisMax: data.aux.axis };
    },
    formatHospital(stateName, hospitalData) {
      var provincesName = hospitalData.facet_groups.find(o => o.name === "provincia").facets.map(o => o.name).sort(Intl.Collator().compare);

      var aux = { state: 0, province: 0 };//{ state: { uci: 0, plant: 0, total: 0 }, province: { uci: 0, plant: 0, total: 0 } };
      var res = {};
      res[stateName] = {};

      provincesName.forEach(name => {
        res[name] = {};
      });
      //console.log(`Res: ${provincesName}`)
      var data = [...hospitalData.records]
        .reverse()
        .reduce((acc,
          { fields: { fecha,
            provincia: state,
            hospitalizados_uci,
            hospitalizados_planta } }) => {
          if (acc.res[state][fecha]) {
            acc.res[state][fecha].uci += hospitalizados_uci;
            acc.res[state][fecha].plant += hospitalizados_planta;
            acc.res[state][fecha].total += hospitalizados_planta + hospitalizados_uci;
          }
          else {
            acc.res[state][fecha] = {
              uci: hospitalizados_uci,
              plant: hospitalizados_planta,
              total: hospitalizados_uci + hospitalizados_planta
            };
          }

          if (acc.res[stateName][fecha]) {
            acc.res[stateName][fecha].uci += hospitalizados_uci;
            acc.res[stateName][fecha].plant += hospitalizados_planta;
            acc.res[stateName][fecha].total += hospitalizados_planta + hospitalizados_uci;
          }
          else {
            acc.res[stateName][fecha] = {
              uci: hospitalizados_uci,
              plant: hospitalizados_planta,
              total: hospitalizados_planta + hospitalizados_uci
            };
          }
          if (acc.aux.state < acc.res[stateName][fecha].total)
            acc.aux.state = acc.res[stateName][fecha].total
          if (acc.aux.province < acc.res[state][fecha].total)
            acc.aux.province = acc.res[state][fecha].total

          return acc;
        }, { res, aux });

      return { provincesName, data: data.res, axis: data.aux };
    },
    formatData(stateName, epidemiologicalData, hospitalData) {
      var { provincesName, data, axisMax } = this.formateEpidemiological(stateName, epidemiologicalData);
      //console.log("correct epidemiological")
      var { provincesName: pN2, data: dataHospital, error, axis: axisHospital } = this.formatHospital(stateName, hospitalData);
      //console.log("correct hostial")
      if ((JSON.stringify(provincesName) != JSON.stringify(pN2))) {
        throw new Error("Provinces are diferent")
      }

      Object.keys(axisMax).forEach(k => {
        axisMax[k].state = {
          total: this.calculate(axisMax[k].total, 1.05),
          low: this.calculate(axisMax[k].total, 1 / 6)
        };
        axisMax[k].province = {
          total: this.calculate(axisMax[k].new, 1.05),
          low: this.calculate(axisMax[k].new, 1 / 6)
        };
      });
      console.log("correct keys")
      this.viewData = {
        stateName,
        axisMax,
        types: [
          { en: "Cases", es: "Casos", default: "cases" },
          { en: "Deaths", es: "Fallecidos", default: "deaths" },
          { en: "Discharged", es: "Altas", default: "discharged" }
        ], value: "cases"
      };
      console.log("correct view data")
      if (!error) {
        this.hospitalData = dataHospital;
        this.viewData.axisMax.hospital = {
          state: this.calculate(axisHospital.state, 1.05),
          province: this.calculate(axisHospital.province, 1.05)
        };
        this.viewData.types.unshift({ en: "Hospital", es: "Hospitalizados", default: "hospital" });
        this.viewData.value = "hospital";
      }
      console.log("correct error hospial")
      this.provincesName = provincesName;
      this.epidemiologicalData = data;
      this.name = stateName;
      console.log("correct name")
      this.correctTransform = 0;
    },
    queryEpidemiological() {
      return axios({
        method: "GET",
        url: "https://data.opendatasoft.com/api/records/1.0/search/?dataset=situacion-epidemiologica-coronavirus-en-castilla-y-leon%40jcyl&rows=-1&sort=fecha&facet=provincia",
        headers: {
          "Accept": "application/json"
        }
      });
    },
    queryHospitalized() {
      return axios({
        method: "GET",
        url: "https://data.opendatasoft.com/api/records/1.0/search/?dataset=situacion-de-hospitalizados-por-coronavirus-en-castilla-y-leon%40jcyl&rows=-1&sort=fecha&facet=provincia",
        headers: {
          "Accept": "application/json"
        }
      });
    },
    loadData() {
      Promise.allSettled([this.queryEpidemiological(), this.queryHospitalized()])
        .then(resolve => {
          //console.log(resolve);
          var epidemiologicalData = resolve[0].status == 'fulfilled' ? resolve[0].value.data : undefined;
          var hospitalizedData = resolve[1].status == 'fulfilled' ? resolve[1].value.data : undefined;
          /*
          console.log("Castilla y León");
          console.log(JSON.stringify(epidemiologicalResponse));
          console.log(JSON.stringify(hospitalizedResponse));
          */
          this.formatData("Castilla y León", epidemiologicalData, hospitalizedData);
        })
        .catch(error => console.log(`Error: ${error}`));
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
  computed: {
    viewHospital() {
      return this.viewData.value == "hospital";
    },
    loadedHostial() {
      return this.viewData.value.indexOf("hospital") != -1;
    }
  },
  mounted() {
    console.log("on load")
    this.loadData();
  }
})
