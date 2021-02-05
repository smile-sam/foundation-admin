import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" }
      }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "/system/role",
    name: "systemManage",
    meta: { title: "systemManage", icon: "el-icon-s-help" },
    children: [
      {
        path: "role",
        name: "roleManage",
        component: () => import("@/views/system/role/index"),
        meta: { title: "roleManage", icon: "table" }
      },
      {
        path: "user",
        name: "userManage",
        component: () => import("@/views/system/user/index"),
        meta: { title: "userManage", icon: "table" }
      },
      {
        path: "menu",
        name: "menuManage",
        component: () => import("@/views/system/menu/index"),
        meta: { title: "menuManage", icon: "table" }
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/tree/index"),
        meta: { title: "Tree", icon: "tree" }
      }
    ]
  },

  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "el-icon-s-help" },
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/table/index"),
        meta: { title: "Table", icon: "table" }
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/tree/index"),
        meta: { title: "Tree", icon: "tree" }
      }
    ]
  },

  {
    path: "/form",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Form",
        component: () => import("@/views/form/index"),
        meta: { title: "Form", icon: "form" }
      }
    ]
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
      title: "Nested",
      icon: "nested"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/nested/menu1/menu1-1"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" }
          },
          {
            path: "menu1-2",
            component: () => import("@/views/nested/menu1/menu1-2"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [
              {
                path: "menu1-2-1",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-1"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" }
              },
              {
                path: "menu1-2-2",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-2"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" }
              }
            ]
          },
          {
            path: "menu1-3",
            component: () => import("@/views/nested/menu1/menu1-3"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" }
          }
        ]
      },
      {
        path: "menu2",
        component: () => import("@/views/nested/menu2/index"),
        name: "Menu2",
        meta: { title: "menu2" }
      }
    ]
  },
  {
    path: "/flowable",
    component: Layout,
    redirect: "/custom2",
    name: "flowable",
    meta: { title: "flowable", icon: "el-icon-s-help" },
    children: [
      // {
      //   path: "flowable-create",
      //   name: "创建工作流",
      //   component: () => import("@/views/flowable/flowable-create/index"),
      //   meta: { title: "创建工作流", icon: "table" }
      // },
      // {
      //   path: "flowable-init",
      //   name: "编辑工作流",
      //   component: () => import("@/views/flowable/flowable-init/index"),
      //   meta: { title: "编辑工作流", icon: "tree" }
      // },
      // {
      //   path: "flowable-custom",
      //   name: "自定义工作流",
      //   component: () => import("@/views/flowable/flowable-custom/index"),
      //   meta: { title: "自定义工作流", icon: "tree" }
      // },
      {
        path: "custom2",
        name: "custom-flow",
        component: () => import("@/components/Bpmn/index"),
        meta: { title: "custom-flow", icon: "tree" }
      }
    ]
  },
{
    path: "/bpmn",
    component: Layout,
    redirect: "/custom3",
    name: "bpmn",
    meta: { title: "bpmn", icon: "el-icon-s-help" },
    children: [
      {
        path: "custom3",
        name: "bpmn-custom",
        component: () => import("@/components/CustomBpmn/index"),
        // component: () => import("@/views/bpmn/custom/index"),
        meta: { title: "bpmn-custom", icon: "tree" }
      },
        {
        path: "custom4",
        name: "bpmn-custom",
        component: () => import("@/components/CustomBpmn2/custom/index"),
        // component: () => import("@/views/bpmn/custom/index"),
        meta: { title: "bpmn-custom", icon: "tree" }
      }
    ]
  },

  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" }
      }
    ]
  },

  // {
  //   path: "/custom-palette",
  //   component: () => import("./../components/custom-palette")
  // },
  // {
  //   path: "/custom-renderer",
  //   component: () => import("../components/custom-renderer")
  // },
  // {
  //   path: "/custom-modeler",
  //   component: () => import("../components/custom-modeler")
  // },
  // {
  //   path: "/custom-context-pad",
  //   component: () => import("../components/custom-context-pad")
  // },
  // {
  //   path: "/custom-properties-panel",
  //   component: () => import("../components/custom-properties-panel")
  // },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
