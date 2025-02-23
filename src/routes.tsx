import React from "react";
import Home from "./components/home/home";
import Service from "./components/service/service";
import { createBrowserRouter, Route, RouteObject, createRoutesFromElements } from "react-router-dom";
import TrackService from "./components/track-services/trackService";
import Login from "./components/login/login";
import RepairOrder from "./components/backoffice/repairOrder";
import EditUser from "./components/backoffice/editUser";
import Profile from "./components/profile/profile";
export const routeConfig = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/services",
        element: <Service />,

    },
    {
        path: "/TrackServices",
        element: <TrackService />,
    },
    {
        path: "/Login",
        element: <Login />,
    },
    {
        path: "repairOrder",
        element: <RepairOrder />,
    },
    {
        path: "profile",
        element: <Profile />,
    },
    {
        path: "editUser",
        element: <EditUser/>,
    }
]


export const router = createBrowserRouter(
    createRoutesFromElements(
        // <Route key={path} element=<Layouts/> />
        <Route>
            {routeConfig.map(({ path, element }) => (
                <Route path={path} key={path} element={element} />
            ))}
        </Route>
    )
);
