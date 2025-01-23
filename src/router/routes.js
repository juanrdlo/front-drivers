const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/add-route', name: 'add-route', component: () => import('pages/addRoutePage.vue') },
  { path: '/view/:id', name: 'view', component: () => import('pages/viewPage.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
