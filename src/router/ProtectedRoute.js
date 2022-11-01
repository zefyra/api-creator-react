import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch, connect } from 'react-redux';
import { selectPermissionCheck, selectToken, updateToken } from 'store/login';
import LocalAccessor from "localAccessor";
import RouteManager from "./RouteManager";
import { useEffect, useState } from "react";


// 路由守衛
const RouteFilter = ({ children, mode }) => {
    const location = useLocation();
    // if (location.pathname === '/') {
    //     return <Navigate to="/home" />;
    // }

    // console.log('location.pathname', location.pathname)


    // 無異狀，可正常進入頁面
    return children;
};

export const FilterRoute = RouteFilter;

// export const FreeRoute = ({ children }) => {
//     return (<RouteFilter mode="free">{children}</RouteFilter>);
// };