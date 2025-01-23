<script>
import { api } from 'boot/axios'

export default {
  name: 'addRoutePage',
  data: () => ({
    search: null
  }),
  methods: {
    getRoute () {
      this.$q.loading.show()
      api.get(`routes/${this.search}`)
        .then((payload) => {
          console.log(payload)
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
            <span class="text-2xl">Añadir ruta</span>
          </div>
          <div class="flex items-center gap-5">
            <q-input dark color="grey-3" dense outlined v-model="search" label="# de ruta" class="w-[350px]">
              <template v-slot:prepend>
                <q-icon name="mdi-magnify"/>
              </template>
            </q-input>
            <q-btn @click="getRoute()" :disable="!search" color="primary" label="Cargar ruta" />
          </div>
        </main>
      </section>
    </main>
  </main>
</template>

<style scoped>

</style>
