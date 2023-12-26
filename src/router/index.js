import { useRoutes, Routes, Route, Navigate, useLocation } from "react-router-dom";
// 路由守衛
import { FilterRoute } from "./ProtectedRoute";

// 全域組件&Layout
import GlobalComponent from "./GlobalComponent";


import { Suspense, lazy } from "react";

// 404頁面(找不到頁面)
import Page404 from "pages/Page404"

// Auth Page-----------------------------------------------------
import Home from "pages/Home" // 首頁
import Profile from "pages/Profile" // 基本資料設定

// 系統管理-----------------------------------------------------
const Users = lazy(() => import('pages/Users')); // 用戶列表
const ApiConnect = lazy(() => import('pages/ApiConnect')); // 17-1. 開發文件>API介接
const ChartTest = lazy(() => import('pages/ChartTest'));

// 自動將pathname尾端的 '/' 拔掉
export const RemoveTrailingSlash = ({ ...rest }) => {
    const location = useLocation()

    // If the last character of the url is '/'
    if (location.pathname.match('/.*/$')) {

        // console.log(`slash is detected`, location.pathname);

        return <Navigate replace {...rest} to={{
            pathname: location.pathname.replace(/\/+$/, ""),
            search: location.search
        }} />
    } else return null
}

// 路由
export default function CrossbotRouter() {

    const routePageList = [
        // Auth Page-----------------------------------------------

        {
            path: "/",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <Home />
                    </GlobalComponent>
                </FilterRoute>
        },
        {
            path: "/home",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <Home />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 基本資料設定
            path: "/profile",
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <Profile />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 用戶帳號
            path: "/users",
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <Users />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 開發文件>API介接
            path: '/apiConnect',
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <ApiConnect />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 開發文件>API管理
            path: '/apiManage',
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <ApiConnect mode="edit" />
                    </GlobalComponent>
                </FilterRoute>
        },

        
        { // 測試頁
            path: '/chartTest',
            element:
                <FilterRoute mode="free">
                    <GlobalComponent layout="backend">
                        <ChartTest />
                    </GlobalComponent>
                </FilterRoute>
        },


        {
            path: "*",
            element: <Page404 />
        }
    ];

    const routeList = routePageList.map((pageItem, index) => {
        return (
            (<Route key={`route_${index}`} path={pageItem.path} element={pageItem.element} />)
        )
    });

    const routes = (
        <Suspense fallback={<p> Loading...</p>}>
            <RemoveTrailingSlash />
            <Routes>
                {routeList}
            </Routes>
        </Suspense>
    );

    return routes;
};