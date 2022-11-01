import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch, connect } from 'react-redux';
import { selectPermissionCheck, selectToken, updateToken } from 'store/login';
import LocalAccessor from "localAccessor";
import RouteManager from "./RouteManager";
import { useEffect, useState } from "react";


// 路由守衛
const RouteFilter = ({ children, mode }) => {

    // return children;

    // 取得token---------------------------------------------
    const dispatch = useDispatch();

    let token = useSelector(selectToken);
    // let storeToken = useSelector(selectToken);
    // const [token, setToken] = useState(storeToken);

    // useEffect(function () {
    //     setToken(storeToken);
    // }, [storeToken])

    // let permissionCheck = useSelector(selectPermissionCheck);

    const location = useLocation();
    // 取得參數----------------------------------------
    const filterMode = mode || 'protected'; // 預設是protected
    // console.log('filterMode', filterMode)

    // 取得頁面key
    // const pageName = children.type.name;
    // console.log(`navigate pageName: ${pageName}`);

    if (filterMode === 'free') {
        // 代表此頁面完全開放，不限制權限
        return children;
    }

    // reload token-------------------------------
    if (!token) {
        // Redux沒撈到，嘗試從localStorage取得token
        // token = LocalAccessor.getItem('token');

        const localAccessorToken = LocalAccessor.getItem('token');

        if (localAccessorToken) { // token
            // 代表localStorage有撈到，回存Redux
            dispatch(updateToken(localAccessorToken)); // token
            token = localAccessorToken;
        }
    }
    // outside page-----------------------------------------

    if (filterMode === 'outside') {
        // 代表為外部頁

        // 自動跳進來的功能
        if (token) {

            // console.log(`outside to home`);

            // 代表已經登入了，直接轉跳到首頁
            return <Navigate to="/home" />;
        } else {
            // console.log(`outside normal`);

            // 可正常進入頁面
            return children;
        }
    } else if (filterMode === 'protected') {
        // 代表為內部需要token的頁面

        if (!token) {
            // console.log(`inside to login`);

            // 沒有該頁面權限，由路由守衛擋下，自動轉跳到登入頁
            return <Navigate to="/" />;
        }
    }

    // parse page auth-----------------------------------------
    /* location: {
        hash: ""
        key: "uhvbyftu"
        pathname: "/users"
        search: "?page=3&pageSize=15"
        state: null
    } */
    let havePageAuth = false;

    const routeManager = new RouteManager();
    // console.log(`location`, location)
    const pathInfo = routeManager.getPathInfo(location.pathname);
    // console.log('pathInfo', pathInfo)
    if (pathInfo) {
        havePageAuth = routeManager.getProtectedRoutePageAuth(pathInfo);
    } else {
        console.error(`ProtectedRoute: '${location.pathname}' pathInfo not exist`);
        console.error(`please add an item to RouteManger.js>>menuItemList that must have 'path' param, it will auto regist to pathInfoMap`)
    }

    if (location.pathname !== '/home') {
        if (!havePageAuth) {
            console.error(`not have page auth`);

            // 代表沒有該頁面的權限，自動轉跳到首頁
            return <Navigate to="/home" />;
        }
    }

    // console.log(`enter page`);

    // 無異狀，可正常進入頁面
    return children;
};

export const FilterRoute = RouteFilter;

// export const FreeRoute = ({ children }) => {
//     return (<RouteFilter mode="free">{children}</RouteFilter>);
// };