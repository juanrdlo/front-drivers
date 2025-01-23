<script>
import { api } from 'boot/axios'

export default {
  name: 'viewPage',
  data: () => ({
    rows: [],
    columns: [
      { name: 'index', field: 'index', label: '#' },
      { name: 'id', field: 'id', label: 'Orden', align: 'center' },
      { name: 'value', field: 'value', label: 'Valor', align: 'center' },
      { name: 'priority', field: 'priority', label: 'Prioritario', align: 'center' }
    ],
    total: 0,
    info: null,
    drivers: [],
    date: new Date()
  }),
  async mounted () {
    this.rows = []
    this.info = null
    this.drivers = []
    this.total = 0

    await this.getAllDrivers()
    await this.getRouteById()
  },
  methods: {
    getRouteById () {
      this.$q.loading.show()
      const id = this.$route.params.id
      return api.get(`routes/${id}`)
        .then(payload => {
          this.info = payload.data.data
          this.date = payload.data.data.date
          this.rows = payload.data.data.orders.map((o, index) => ({ ...o, priority: Boolean(o.priority), index: index + 1 }))
          this.total = payload.data.data.orders.map(o => o.value).reduce((a, b) => a + b, 0)
          this.$q.loading.hide()
        })
    },
    getAllDrivers () {
      return api.get('drivers')
        .then(payload => {
          this.drivers = payload.data
        })
    },
    updateBtn () {
      this.$q.loading.show()
      const id = this.$route.params.id
      api.put(`routes/${id}`, {
        driver_id: this.info.driver_info.id,
        notes: this.info.notes,
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
<main class="bg-dark h-screen fixed pt-10 w-full overflow-auto">
    <main class="flex flex-col">
      <section class="flex justify-center">
        <main class="flex flex-col w-[850px] text-white space-y-5">
          <div class="flex justify-center">
            <span class="text-2xl">Ver y editar ruta</span>
          </div>
          <div class="flex justify-center">
            <div v-if="info" class="flex flex-col space-y-5 w-[80%]">
              <span class="font-bold">Información de la ruta</span>
              <div class="flex justify-center">
                <div class="flex flex-col w-[40%]">
                  <div class="flex flex-col space-y-3">
                    <q-input outlined v-model="info.id" readonly label="# de ruta" dense dark />
                    <q-select outlined v-model="info.driver_info" option-label="name" :options="drivers" label="Conductor" dense dark />
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
                      v-model="info.notes"
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
                      <q-checkbox dark v-model="props.row.priority" />
                    </q-td>
                  </template>
                </q-table>
              </div>
              <div class="flex justify-end">
                <div class="flex flex-col">
                  <span class="text-xl">Valor total</span>
                  <div class="flex justify-end">
                    <span class="font-bold">${{total}}</span>
                  </div>
                </div>
              </div>
              <div class="flex justify-end">
                <q-btn @click="updateBtn()" color="primary" label="Guardar" />
              </div>
            </div>
          </div>
        </main>
      </section>
    </main>
  </main>
</template>

<style scoped>

</style>
