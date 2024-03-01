import { lazy } from "react";

// Auth
const Login = lazy(() => import("./Visitors/Login"));
const Register = lazy(() => import("./Visitors/Register"));
const NoMatch = lazy(() => import("./NoMatch"));
const ForgotPassword = lazy(() => import("./Visitors/ForgotPassword"));


const Layout = lazy(() => import("./Layout"));
const Home = lazy(() => import("./Home/show"));

// Events
const Events = lazy(() => import("./Events"));
const Event = lazy(() => import("./Events/show"));
const CreateEvent = lazy(() => import("./Events/create"));
const UpdateEvent = lazy(() => import("./Events/update"));

// Clubs
const Clubs = lazy(() => import("./Clubs"));
const Club = lazy(() => import("./Clubs/show"));

// Dashboard
const Account = lazy(() => import("./Dashboard/account"));
const ClubManagement = lazy(() => import("./Dashboard/club_management"));

export {
    Login,
    Register,
    ForgotPassword,
    NoMatch,
    Layout,
    Home,
    Events,
    Event,
    CreateEvent,
    UpdateEvent,
    Clubs,
    Club,
    Account,
    ClubManagement,
}