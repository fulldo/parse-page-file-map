const PATH_USER = "/user";
const PATH_ABOUT = "/about";
export const routes = [
  {
    path: PATH_USER,
    load: () => import("./pages/user"),
  },
  {
    path: PATH_ABOUT,
    load: () => import("./pages/about"),
  },
];
