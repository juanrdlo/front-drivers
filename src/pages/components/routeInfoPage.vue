<script>
import { api } from 'boot/axios'
import { get } from 'lodash'

export default {
  props: ['info', 'type'],
  name: 'routeInfoPage',
  data () {
    return {
      localInfo: this.info ? this.info : {
        id: null,
        driver_info: null,
        notes: null
      },
      date: get(this.info, 'date'),
      columns: [
        { name: 'index', field: 'index', label: '#' },
        { name: 'id', field: 'id', label: 'Orden', align: 'center' },
        { name: 'value', field: 'value', label: 'Valor', align: 'center' },
        { name: 'priority', field: 'priority', label: 'Prioritario', align: 'center' }
      ],
      rows: get(this.info, 'orders') ? this.info.orders.map((o, index) => ({
        ...o,
        priority: Boolean(o.priority),
        index: index + 1
      })) : [],
      total: get(this.info, 'orders') ? this.info.orders.map(o => o.value).reduce((a, b) => a + b, 0) : 0,
      drivers: [],
      loading: false
    }
  },
  watch: {
    type (value) {
      if (value === 'add') {
        this.localInfo = {
          id: null,
          driver_info: null,
          notes: null
        }
        this.rows = []
        this.total = 0
      }
    },
    info (value) {
      if (value) {
        this.localInfo = value
        this.rows = value.orders.map((o, index) => ({
          ...o,
          priority: Boolean(o.priority),
          index: index + 1
        }))
        this.total = value.orders.map(o => o.value).reduce((a, b) => a + b, 0)
      }
    }
  },
  mounted () {
    this.getAllDrivers()
  },
  methods: {
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
    },
    create () {
      this.$q.loading.show()
      this.loading = true

      api.post('routes', {
        driver_id: this.localInfo.driver_info.id,
        id: Number(this.localInfo.id),
        notes: this.localInfo.notes,
        date: this.date
      }).then((payload) => {
        this.$q.notify({
          message: payload.data.message,
          type: 'positive',
          position: 'top'
        })
        this.loading = false
        this.$q.loading.hide()
        // redirect
        this.$router.push({ name: 'view', params: { id: Number(this.localInfo.id) } })
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
          <q-input outlined v-model="date" readonly label="Fecha" dense dark>
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
          <q-btn v-if="type === 'add'" :disable="!localInfo.driver_info || !date || !localInfo.notes" @click="create()" color="primary" label="Crear nueva ruta"/>
        </div>
      </div>
    </div>
    <div v-if="type !== 'add'" class="flex w-full">
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
            <q-checkbox disable dark v-model="props.row.priority"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <div v-if="type !== 'add'" class="flex justify-end">
      <div class="flex flex-col">
        <span class="text-xl">Valor total</span>
        <div class="flex justify-end">
          <span class="font-bold">${{ total }}</span>
        </div>
      </div>
    </div>
    <div v-if="type !== 'add'" class="flex justify-end">
      <q-btn @click="updateBtn()" color="primary" label="Guardar"/>
    </div>
  </div>
</template>

<style scoped>

</style>
