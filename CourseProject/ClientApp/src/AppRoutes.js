import { Home } from "./components/Home";
import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";
import UserProfilePage from "./components/user/UserProfilePage";
import { AdminPage } from "./components/administrator/AdminPage";
import { AdminPolyPage } from "./components/administrator/AdminPolyPage";
import { AdminCDocPage } from "./components/administrator/AdminCDocPage"
import { PolyAdd } from "./components/administrator/PolyAdd";
import { PolySel } from "./components/administrator/PolySel";
import { PolyDel } from "./components/administrator/PolyDel";
import { PolyAlt } from "./components/administrator/PolyAlt";
import { CDocAdd } from "./components/administrator/CDocAdd";
import { CDocSel } from "./components/administrator/CDocSel";
import { CDocDel } from "./components/administrator/CDocDel";
import { CDocAlt } from "./components/administrator/CDocAlt";

const AppRoutes = [
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
    path: '/administrator/PolyAdd',
    element: <PolyAdd />
},
{
    path: '/administrator/PolyAlt',
    element: <PolyAlt />
},
{
    path: '/administrator/PolyDel',
    element: <PolyDel />
},
{
    path: '/administrator/PolySel',
    element: <PolySel />
},
{
    path: '/administrator/CDocAdd',
    element: <CDocAdd />
},
{
    path: '/administrator/CDocAlt',
    element: <CDocAlt />
},
{
    path: '/administrator/CDocDel',
    element: <CDocDel />
},
{
    path: '/administrator/CDocSel',
    element: <CDocSel />
},
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
path: '/user/UserProfilePage',
element: <UserProfilePage />
},
];

export default AppRoutes;
