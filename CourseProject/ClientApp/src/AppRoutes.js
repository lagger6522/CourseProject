import { Home } from "./components/Home";

import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";

import { AdminPage } from "./components/administrator/AdminPage";
import { AdminPolyPage } from "./components/administrator/AdminPolyPage";
import { AdminCDocPage } from "./components/administrator/AdminCDocPage"
import { AddPolyPage } from "./components/administrator/AddPolyPage";
import { SelPolyPage } from "./components/administrator/SelPolyPage";
import { DelPolyPage } from "./components/administrator/DelPolyPage";
import { AltPolyPage } from "./components/administrator/AltPolyPage";
import { AddCDocPage } from "./components/administrator/AddCDocPage";
import { SelCDocPage } from "./components/administrator/SelCDocPage";
import { DelCDocPage } from "./components/administrator/DelCDocPage";
import { AltCDocPage } from "./components/administrator/AltCDocPage";

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
    {
        path: '/administrator/AddPolyPage',
        element: <AddPolyPage />
    },
    {
        path: '/administrator/AltPolyPage',
        element: <AltPolyPage />
    },
    {
        path: '/administrator/DelPolyPage',
        element: <DelPolyPage />
    },
    {
        path: '/administrator/SelPolyPage',
        element: <SelPolyPage />
    },
    {
        path: '/administrator/AddCDocPage',
        element: <AddCDocPage />
    },
    {
        path: '/administrator/AltCDocPage',
        element: <AltCDocPage />
    },
    {
        path: '/administrator/DelCDocPage',
        element: <DelCDocPage />
    },
    {
        path: '/administrator/SelCDocPage',
        element: <SelCDocPage />
    },
];

export default AppRoutes;
