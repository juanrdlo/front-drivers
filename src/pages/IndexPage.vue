<template>
  <main class="bg-dark h-screen pt-10">
    <main class="flex flex-col">
      <section class="flex justify-center">
        <main class="flex flex-col w-[850px] text-white space-y-5">
          <div class="flex justify-center">
            <span class="text-2xl">Listado de rutas</span>
          </div>
          <div class="flex w-full">
            <q-table
              class="w-full"
              dark
              no-data-label="Por el momento no hay resultados"
              :rows="rows"
              :columns="columns"
              v-model:pagination="pagination"
              row-key="name"
              :rows-per-page-options="[5,15,25]"
              @request="paginationUpdate"
              :loading="loading"
            >
              <template v-slot:body-cell-option="props">
                <q-td :props="props">
                  <q-btn :to="{ name: 'view', params: { id: props.row.id }}" flat color="white" label="Ver" dense size="md" class="text-capitalize" />
                </q-td>
              </template>
            </q-table>
          </div>
        </main>
      </section>
    </main>
  </main>
</template>

<script>
import { api } from 'boot/axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'IndexPage',
  data: () => ({
    rows: [],
    columns: [
      { name: 'id', field: 'id', label: 'Rutas' },
      { name: 'driver_info', field: row => row.driver_info.name, label: 'Conductor' },
      { name: 'date', field: 'date', label: 'Fecha', align: 'center' },
      { name: 'option', field: 'option', label: '', align: 'center' }
    ],
    pagination: null,
    loading: false
  }),
  mounted () {
    this.getAllRoutes(1)
  },
  methods: {
    getAllRoutes (page) {
      this.loading = true
      api.get(`routes?page=${page}`)
        .then(payload => {
          this.rows = payload.data.data
          this.pagination = {
            rowsNumber: payload.data.meta.total,
            page: payload.data.meta.current_page
          }
          this.loading = false
        })
    },
    paginationUpdate (value) {
      this.pagination.page = value.pagination.page
      this.getAllRoutes(value.pagination.page)
    }
  }
})
</script>
