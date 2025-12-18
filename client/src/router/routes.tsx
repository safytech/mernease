import { lazy } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import App from "../App";

const SignIn = lazy(() => import("../pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("../pages/AuthPages/SignUp"));
const Recover = lazy(() => import("../pages/AuthPages/Recover"));
const Reset = lazy(() => import("../pages/AuthPages/Reset"));
const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));

const Dashboard = lazy(() => import("../pages/Apps/Dashboard/Index"));

const UserList = lazy(() => import("../pages/Apps/User/Index"));
const UserAdd = lazy(() => import("../pages/Apps/User/Add"));

const Home = lazy(() => import("../pages/Dashboard/Home"));
const UserProfiles = lazy(() => import("../pages/UserProfiles"));
const Calendar = lazy(() => import("../pages/Calendar"));
const Blank = lazy(() => import("../pages/Blank"));
const FormElements = lazy(() => import("../pages/Forms/FormElements"));
const BasicTables = lazy(() => import("../pages/Tables/BasicTables"));
const LineChart = lazy(() => import("../pages/Charts/LineChart"));
const BarChart = lazy(() => import("../pages/Charts/BarChart"));
const Alerts = lazy(() => import("../pages/UiElements/Alerts"));
const Avatars = lazy(() => import("../pages/UiElements/Avatars"));
const Badges = lazy(() => import("../pages/UiElements/Badges"));
const Buttons = lazy(() => import("../pages/UiElements/Buttons"));
const Images = lazy(() => import("../pages/UiElements/Images"));
const Videos = lazy(() => import("../pages/UiElements/Videos"));

function PrivateRoute() {
  const { currentUser } = useSelector((state: any) => state.user);
  return currentUser ? <Outlet /> : <Navigate to="/auth/signin" replace />;
}

const routes = [
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <App />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/users", element: <UserList /> },
          { path: "/users/add", element: <UserAdd />},
          { path: "/users/add/:id", element: <UserAdd /> },
          { path: "/ui-dashboard", element: <Home /> },
          { path: "/profile", element: <UserProfiles /> },
          { path: "/calendar", element: <Calendar /> },
          { path: "/blank", element: <Blank /> },
          { path: "/form-elements", element: <FormElements /> },
          { path: "/basic-tables", element: <BasicTables /> },
          { path: "/line-chart", element: <LineChart /> },
          { path: "/bar-chart", element: <BarChart /> },
          { path: "/alerts", element: <Alerts /> },
          { path: "/avatars", element: <Avatars /> },
          { path: "/badge", element: <Badges /> },
          { path: "/buttons", element: <Buttons /> },
          { path: "/images", element: <Images /> },
          { path: "/videos", element: <Videos /> },
        ],
      },
    ],
  },
  { path: "/auth/signin", element: <SignIn /> },
  { path: "/auth/signup", element: <SignUp /> },
  { path: "/auth/recover", element: <Recover /> },
  { path: "/auth/reset/:token", element: <Reset /> },
  { path: "*", element: <NotFound /> },
];

export { routes, PrivateRoute };
