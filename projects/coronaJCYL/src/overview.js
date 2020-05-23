Vue.component('over-view', {
  props: ["dataEpidemiologica", "dataHospital"],
  template:
    `<div class="text-center">
  <div>
    <label for="selectDay">Día: {{date}}</label>
    <input type="range" class="custom-range" min="0" :max="days.length - 1" step="1" id="selectDay" v-model="selectDay">
  </div>
  <table class="table table-hover">
  <thead>
    <tr>
      <th scope="col" class="bg-light"></th>
      <th scope="col" colspan="2">Casos</th>
      <th scope="col" colspan="2" class="bg-light">Fallecidos</th>
      <th scope="col" colspan="2">Altas</th>
      <th scope="col" colspan="2" class="bg-light" v-if="dataHospital != {}">Hospitalizados</th>
    </tr>
    <tr>
      <th scope="col" class="bg-light"></th>
      <th scope="col">Acumulados</th>
      <th scope="col">Nuevos</th>
      <th scope="col" class="bg-light">Acumulados</th>
      <th scope="col" class="bg-light">Nuevos</th>
      <th scope="col">Acumulados</th>
      <th scope="col">Nuevos</th>
      <template  v-if="dataHospital != {}">
        <th scope="col" class="bg-light">Total</th>
        <th scope="col" class="bg-light">UCI</th>
      </template>
    </tr>
  </thead>
  <tbody>
    <tr v-for="province in provinces">
      <th scope="row" class="text-right">{{province}}</th>
      <td>{{ dataEpidemiologica[province][date].cases.total }}</td>
      <td>{{ dataEpidemiologica[province][date].cases.new }}</td>
      <td>{{ dataEpidemiologica[province][date].deaths.total }}</td>
      <td>{{ dataEpidemiologica[province][date].deaths.new }}</td>
      <td>{{ dataEpidemiologica[province][date].discharged.total }}</td>
      <td>{{ dataEpidemiologica[province][date].discharged.new }}</td>
      <template  v-if="dataHospital != {}">
        <td class="bg-light">{{ dataHospital[province][date] ? dataHospital[province][date].total : "-" }}</td>
        <td class="bg-light">{{ dataHospital[province][date] ? dataHospital[province][date].uci : "-" }}</td>
      </template>
    </tr>
  </tbody>
</table>
</div>`,
  data() {
    return {
      provinces: [],
      days: [],
      selectDay: 0
    }
  },
  computed: {
      date(){
        return this.days[this.selectDay];
    }
  },
  mounted() {
    this.provinces = Object.keys(this.dataEpidemiologica);
    this.days = Object.keys(this.dataEpidemiologica[this.provinces[0]]);
    this.selectDay = this.days.length - 1;
  }
})