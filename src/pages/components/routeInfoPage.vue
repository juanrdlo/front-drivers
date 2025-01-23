<script>
import { api } from 'boot/axios'

export default {
  props: ['info', 'drivers', 'total', 'rows'],
  name: 'routeInfoPage',
  data () {
    return {
      localInfo: this.info,
      date: this.info.date,
      columns: [
        { name: 'index', field: 'index', label: '#' },
        { name: 'id', field: 'id', label: 'Orden', align: 'center' },
        { name: 'value', field: 'value', label: 'Valor', align: 'center' },
        { name: 'priority', field: 'priority', label: 'Prioritario', align: 'center' }
      ]
    }
  },
  methods: {
    updateBtn () {
      this.$q.loading.show()
      const id = this.$route.params.id
      api.put(`routes/${id}`, {
        driver_id: this.localInfo.driver_info.id,
        notes: this.localInfo.notes,
        date: this.date
      }).then(payload => {
        this.$q.notify({
          message: payload.data.message,
          type: 'positive',
          position: 'top'
        })
        this.$q.loading.hide()
      }).catch(payload => {
        this.$q.notify({
          message: payload.message,
          type: 'negative',
          position: 'top'
        })
        this.$q.loading.hide()
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col space-y-5 w-[80%]">
    <span class="font-bold">Información de la ruta</span>
    <div class="flex justify-center">
      <div class="flex flex-col w-[40%]">
        <div class="flex flex-col space-y-3">
          <q-input outlined v-model="localInfo.id" readonly label="# de ruta" dense dark/>
          <q-select outlined v-model="localInfo.driver_info" option-label="name" :options="drivers" label="Conductor" dense dark/>
          <q-input outlined v-model="date" label="Fecha" dense dark>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat/>
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="localInfo.notes"
            outlined
            dense
            dark
            type="textarea"
          />
        </div>
      </div>
    </div>
    <div class="flex w-full">
      <q-table
        class="w-full"
        dark
        dense
        no-data-label="Por el momento no hay resultados"
        :rows="rows"
        :columns="columns"
        row-key="name"
      >
        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <q-checkbox dark v-model="props.row.priority"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="flex justify-end">
      <div class="flex flex-col">
        <span class="text-xl">Valor total</span>
        <div class="flex justify-end">
          <span class="font-bold">${{ total }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-end">
      <q-btn @click="updateBtn()" color="primary" label="Guardar"/>
    </div>
  </div>
</template>

<style scoped>

</style>
