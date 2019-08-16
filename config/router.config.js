export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login/Login' },
      { path: '/user/register', name: 'register', component: './Login/Register' },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      { path: '/', redirect: '/home' },
      // home
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home/Home',
      },
      // system
      {
        path: '/system',
        name: 'system',
        icon: 'setting',
        dynamic: true,
        routes: [
          {
            path: '/system/users',
            name: 'user',
            component: './System/User',
            dynamic: true,
          },
          {
            path: '/system/roles',
            name: 'role',
            component: './System/Role',
            dynamic: true,
          },
          {
            path: '/system/menus',
            name: 'menu',
            component: './System/Menu',
            dynamic: true,
          },
          {
            path: '/system/interfaces',
            name: 'interface',
            component: './System/Interface',
            dynamic: true,
          },
          {
            path: '/system/dictionaries',
            name: 'dictionary',
            dynamic: true,
            routes: [
              {
                path: '/system/dictionaries',
                component: './System/Dict',
              },
              {
                path: '/system/dictionaries/:id',
                hideInMenu: true,
                component: './System/Dict',
              },
            ],
          },
        ],
      },
      // exception
      {
        path: '/exception',
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        routes: [
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
