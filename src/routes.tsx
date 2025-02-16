import React from "react";
import Home from "./components/home/home";
import Service from "./components/service/service";
import { createBrowserRouter, Route, RouteObject, createRoutesFromElements } from "react-router-dom";
import Track from "./components/track-services/track-service";
import Login from "./components/login/login";
import RepairOrder from "./components/backoffice/repairOrder";
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
        element: <Track />,
    },
    {
        path: "/Login",
        element: <Login/>,
    },
    {
        path: "repairOrder",
        element: <RepairOrder/>,
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
