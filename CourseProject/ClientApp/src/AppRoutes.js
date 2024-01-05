import { Home } from "./components/Home";

import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";

import { AdminPage } from "./components/administrator/AdminPage";

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/authentication/RegisterPage',
    element: <RegisterPage />
  },
  {
    path: '/authentication/LoginPage',
    element: <LoginPage />
    },
    {
        path: '/administrator/AdminPage',
        element: <AdminPage />
    },
];

export default AppRoutes;
