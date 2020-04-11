Vue.component('buttons-selector', {
  props: ["selection"],
  template: `<div class="row text-center font-weight-light">
        <div class="border rounded mx-md-0 mx-lg-2 p-2 col-md-11 col-lg">
          <p class="font-weight-bold" style="text-decoration: underline;">Casos</p>
          <p>Número de casos.</p>
          <div class="row mx-0">
            <button
              class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('cases', 'total')"
              @click="$emit('changeselection', {group: 'cases', type: 'total'})"
            >Acumulados</button>
            <button
              class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('cases', 'new')"
              @click="$emit('changeselection', {group: 'cases', type: 'new'})"
            >Nuevos</button>
          </div>
        </div>
        <div class="border rounded mx-md-0 mx-lg-2 p-2 col-md-11 col-lg">
          <p class="font-weight-bold" style="text-decoration: underline;">Altas</p>
          <p>Número de altas.</p>
          <div class="row mx-0">
            <button
            class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('discharged', 'total')"
              @click="$emit('changeselection', {group: 'discharged', type: 'total'})"
            >Acumulados</button>
            <button
              class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('discharged', 'new')"
              @click="$emit('changeselection', {group: 'discharged', type: 'new'})"
            >Nuevos</button>
          </div>
        </div>
        <div class="border rounded mx-md-0 mx-lg-2 p-2 col-md-11 col-lg">
          <p class="font-weight-bold" style="text-decoration: underline;">Fallecimientos</p>
          <p>Número de fallecimientos.</p>
          <div class="row mx-0">
            <button
              class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('deaths', 'total')"
              @click="$emit('changeselection', {group: 'deaths', type: 'total'})"
            >Acumulados</button>
            <button
              class="mx-md-0 mx-lg-2 col-md-12 col-lg btn"
              :class="handleButtonClass('deaths', 'new')"
              @click="$emit('changeselection', {group: 'deaths', type: 'new'})"
            >Nuevos</button>
          </div>
        </div>
      </div>`,
  methods: {
    handleButtonClass(group, type) {
      if (type == "total")
        return [this.selection.type == 'total' && this.selection.group == group ? 'btn-primary' : 'btn-outline-primary']
      return [this.selection.type == 'new' && this.selection.group == group ? 'btn-info' : 'btn-outline-info']
    }
  }
})