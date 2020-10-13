Vue.component('over-view', {
  props: ["dataEpidemiologica", "dataHospital"],
  template:
    `<div class="text-center">
  <div>
    <label for="selectDay">Día: {{date}}</label>
    <input type="range" class="custom-range" min="0" :max="days.length - 1" step="1" id="selectDay" v-model="selectDay">
    <div class="mb-2">
      <button class="btn btn-outline-secondary" @click="selectDay--" :disabled="selectDay == 0">-</button>
      <button class="btn btn-outline-secondary" @click="selectDay++" :disabled="selectDay == days.length - 1">+</button>
    </div>
  </*div>
  <table class="table">
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col" colspan="2" class="table-primary">Casos</th>
      <th scope="col" colspan="2">Fallecidos</th>
      <!--<th scope="col" colspan="2">Altas</th>-->
      <th scope="col" colspan="2" class="table-primary" v-if="dataHospital != {}">Hospitalizados</th>
    </tr>
    <tr>
      <th scope="col"></th>
      <th scope="col" class="table-primary">Acumulados</th>
      <th scope="col" class="table-primary">Nuevos</th>
      <th scope="col">Acumulados</th>
      <th scope="col">Nuevos</th>
      <!--<th scope="col">Acumulados</th>
      <th scope="col">Nuevos</th>-->
      <template  v-if="dataHospital != {}">
        <th scope="col" class="table-primary">Total</th>
        <th scope="col" class="table-primary">UCI</th>
      </template>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(province, index) in provinces" :class="{ 'font-weight-bold': index == 0 }">
      <th scope="row" class="text-right">{{province}}</th>
      <td class="table-primary">{{ dataEpidemiologica[province][date].cases.total }}</td>
      <td class="table-primary">{{ dataEpidemiologica[province][date].cases.new }}</td>
      <td>{{ dataEpidemiologica[province][date].deaths.total }}</td>
      <td>{{ dataEpidemiologica[province][date].deaths.new }}</td>
      <!--<td>{{ dataEpidemiologica[province][date].discharged.total }}</td>
      <td>{{ dataEpidemiologica[province][date].discharged.new }}</td>-->
      <template  v-if="dataHospital != {}">
        <td class="table-primary">{{ dataHospital[province][date] ? dataHospital[province][date].total : "-" }}</td>
        <td class="table-primary">{{ dataHospital[province][date] ? dataHospital[province][date].uci : "-" }}</td>
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