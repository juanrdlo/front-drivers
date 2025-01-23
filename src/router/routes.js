const routes = [
  { path: '/', component: () => import('pages/IndexPage.vue') },
  { path: '/view/:id', name: 'view', component: () => import('pages/viewPage.vue') },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
