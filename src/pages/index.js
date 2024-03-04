import { lazy } from "react";

// Auth
const Login = lazy(() => import("./Visitors/Login"));
const Register = lazy(() => import("./Visitors/Register"));
const ForgotPassword = lazy(() => import("./Visitors/ForgotPassword"));

const Home = lazy(() => import("./Home/show"));

// Events
const Events = lazy(() => import("./Events"));
const Event = lazy(() => import("./Events/show"));
const CreateEvent = lazy(() => import("./Events/create"));
const UpdateEvent = lazy(() => import("./Events/update"));

// Conversations
const Conversations = lazy(() => import("./Conversations"));
const Conversation = lazy(() => import("./Conversations/show"));
const CreateConversation = lazy(() => import("./Conversations/create"));

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
    Home,
    Events,
    Event,
    CreateEvent,
    UpdateEvent,
    Conversations,
    Conversation,
    CreateConversation,
    Clubs,
    Club,
    Account,
    ClubManagement,
}