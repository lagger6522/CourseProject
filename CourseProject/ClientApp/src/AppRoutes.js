import { Home } from "./components/Home";

import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";

import { AdminPage } from "./components/administrator/AdminPage";
import { AdminPolyPage } from "./components/administrator/AdminPolyPage";
import { AdminCDocPage } from "./components/administrator/AdminCDocPage"

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
    {
        path: '/administrator/AdminPolyPage',
        element: <AdminPolyPage />
    },
    {
        path: '/administrator/AdminCDocPage',
        element: <AdminCDocPage />
    },
];

export default AppRoutes;
