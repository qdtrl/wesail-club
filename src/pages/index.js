import { lazy } from "react";

const Login = lazy(() => import("./Visitors/Login"));
const Register = lazy(() => import("./Visitors/Register"));
const NoMatch = lazy(() => import("./NoMatch"));
const ForgotPassword = lazy(() => import("./Visitors/ForgotPassword"));

const Home = lazy(() => import("./Home/show"));
const Layout = lazy(() => import("./Layout"));

export {
    Layout,
    Home,
    Login,
    Register,
    ForgotPassword,
    NoMatch,
}