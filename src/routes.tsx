import React from "react";
import Home from "./components/home/home";
import Service from "./components/service/service";
import { createBrowserRouter, Route, RouteObject, createRoutesFromElements } from "react-router-dom";
import TrackService from "./components/track-services/trackService";
import Login from "./components/login/login";
import Profile from "./components/profile/profile";
import RepairOrder from "./components/backoffice/repairOrder";
import EditUser from "./components/backoffice/editUser";
import EditVehicle from "./components/backoffice/editVehicle";
import EditService from "./components/backoffice/editService";
import EditAppointment from "./components/backoffice/editAppointment";
import Payment from "./components/backoffice/payment";

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
    },
    {
        path:"editVehicle",
        element:<EditVehicle/>
    },
    {
        path:"editService",
        element:<EditService/>
    },
    {
        path:"editAppointment",
        element:<EditAppointment/>
    },
    {
        path:"payment",
        element:<Payment/>
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
