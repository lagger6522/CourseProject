import { Home } from "./components/Home";
import { RegisterPage } from "./components/authentication/RegisterPage";
import { LoginPage } from "./components/authentication/LoginPage";

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
];

export default AppRoutes;
