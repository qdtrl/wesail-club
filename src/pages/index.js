import { lazy } from "react";

const Login = lazy(() => import("./Visitors/Login"));
const Register = lazy(() => import("./Visitors/Register"));
const NoMatch = lazy(() => import("./NoMatch"));
const ForgotPassword = lazy(() => import("./Visitors/ForgotPassword"));

export {
    Login,
    Register,
    ForgotPassword,
    NoMatch,
}