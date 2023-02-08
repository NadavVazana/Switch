import About from "./views/pages/about";
import HomePage from "./views/pages/home-page";
import SignIn from "./views/pages/login";
import SignUp from "./views/pages/sign-up";
import { UserPage } from "./views/pages/user-page";

const routes = [
  {
    path: "/",
    element: <HomePage />,
    label: "🏠",
  },
  {
    path: "/login",
    element: <SignIn />,
    label: "💻",
  },
  {
    path: "/signup",
    element: <SignUp />,
    label: "🖱",
  },
  {
    path: "/user",
    element: <UserPage />,
    label: "👨",
  },
  {
    path: "/about",
    element: <About />,
    label: "👨",
  },
];

export default routes;
