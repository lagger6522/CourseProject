import { Home } from "./components/Home";
import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";
import UserProfilePage from "./components/user/UserProfilePage";
import { AdminPage } from "./components/administrator/AdminPage";
import { AdminPolyPage } from "./components/administrator/AdminPolyPage";
import { AdminCDocPage } from "./components/administrator/AdminCDocPage"
import { PolyAdd } from "./components/administrator/PolyAdd";
import { PolyList } from "./components/administrator/PolyList";
import { PolyAlt } from "./components/administrator/PolyAlt";
import { CDocAdd } from "./components/administrator/CDocAdd";
import { CDocSel } from "./components/administrator/CDocSel";
import { CDocAlt } from "./components/administrator/CDocAlt";
import { DocAdd } from "./components/chief/DocAdd";
import { DoctorList } from "./components/chief/DoctorList";
import { ChiefPage } from "./components/chief/ChiefPage";

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
    path: '/chief/DocAdd',
    element: <DocAdd />
},
{
    path: '/chief/DoctorList',
    element: <DoctorList />
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
    path: '/administrator/PolyList',
    element: <PolyList />
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
{
    path: '/chief/ChiefPage',
    element: <ChiefPage />
},
];

export default AppRoutes;
