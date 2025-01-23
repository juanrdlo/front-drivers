<script>
import { api } from 'boot/axios'
import RouteInfoPage from 'pages/components/routeInfoPage.vue'

export default {
  name: 'viewPage',
  components: { RouteInfoPage },
  data: () => ({
    rows: [],
    total: 0,
    info: null
  }),
  async mounted () {
    this.rows = []
    this.info = null
    this.drivers = []
    this.total = 0

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
          this.rows = payload.data.data.orders.map((o, index) => ({
            ...o,
            priority: Boolean(o.priority),
            index: index + 1
          }))
          this.total = payload.data.data.orders.map(o => o.value).reduce((a, b) => a + b, 0)
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
            <route-info-page :info="info" :type="info ? 'view': 'add'"/>
          </div>
        </main>
      </section>
    </main>
  </main>
</template>

<style scoped>

</style>
