import { useRoutes, Routes, Route, Navigate, useLocation } from "react-router-dom";
// 路由守衛
import { FilterRoute } from "./ProtectedRoute";

// 全域組件&Layout
import GlobalComponent from "./GlobalComponent";


import { Suspense, lazy } from "react";

// 404頁面(找不到頁面)
import Page404 from "pages/Page404"

import Login from "pages/Login" // 登入/註冊
import RegistVerify from "pages/RegistVerify" // 註冊驗證
import ResetPassword from "pages/ResetPassword" // 重置密碼

// Auth Page-----------------------------------------------------
import Home from "pages/Home" // 首頁
import Profile from "pages/Profile" // 基本資料設定

// 系統管理-----------------------------------------------------
const Users = lazy(() => import('pages/Users')); // 用戶列表
const PayRelated = lazy(() => import('pages/PayRelated')); // 10-1.設定>支付相關
const DefaultAuth = lazy(() => import('pages/DefaultAuth')); // 10-2.設定>預設權限
const PlatformPreference = lazy(() => import('pages/PlatformPreference')); // 9-1.平台參數
const QuotaRankManage = lazy(() => import('pages/QuotaRankManage')); // 6-1.用量級距管理: 訂閱用戶級距方案
const SubscribeQuotaPlan = lazy(() => import('pages/SubscribeQuotaPlan')); // 1-3.1-4.用量級距管理: 訂閱用戶升級方案
const MyOrder = lazy(() => import('pages/MyOrder')); // 8-1.我的訂單
const ApiConnect = lazy(() => import('pages/ApiConnect')); // 17-1. 開發文件>API介接

// 社群管理-----------------------------------------------------
const SocialFriendManage = lazy(() => import('pages/SocialFriendManage')); // 11-1.社群好友管理
const TagCategory = lazy(() => import('pages/TagCategory')); // 14.標籤管理 - 標籤分類

/* 已棄用，純展示 */const TagDecisionCondition = lazy(() => import('pages/TagDecisionCondition')); // 14.標籤管理 - 標籤分類 - 標籤判斷條件
const TagList = lazy(() => import('pages/TagList')); // 14.標籤管理 - 標籤列表
const TagConditionList = lazy(() => import('pages/TagConditionList')); // 14. 標籤管理 - 標籤列表 - 標籤判斷條件
/* 純測試，需隱藏 */const TopologyGraph = lazy(() => import('pages/TopologyGraph')); // 機器人管理 - 拓樸圖測試
const MessageBroadcast = lazy(() => import('pages/MessageBroadcast')); // 13. 訊息推播

// 數據集-----------------------------------------------------
const CustomData = lazy(() => import('pages/CustomData')); // 19.數據集 - 資料欄位
const SharedData = lazy(() => import('pages/SharedData')); // 19.數據集 - 共用數據

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

    /*
    const routes = useRoutes([
        // Public Page-----------------------------------------
        {
            path: "/",
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent />
                    <Login />
                </FilterRoute>
        },
        {
            path: "/regist",
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent />
                    <Login mode="regist" />
                </FilterRoute>
        },
        {
            path: "/registVerify",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent />
                    <RegistVerify />
                </FilterRoute>
        },
        // 註冊驗證的URL ===> http://localhost:3000/registVerify?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        {
            path: "/resetPassword",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent />
                    <ResetPassword />
                </FilterRoute>
        },
        // 重置密碼的URL ===> http://localhost:3000/resetPassword?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        // { // 已改用html靜態頁面
        //     path: "/serviceTerms",
        //     element:
        //         <FilterRoute mode="outside">
        //             <ServiceTerms />
        //         </FilterRoute>
        // },
        // {
        //     path: "/privacyPolicy",
        //     element:
        //         <FilterRoute mode="outside">
        //             <PrivacyPolicy />
        //         </FilterRoute>
        // },

        // Auth Page-----------------------------------------------

        {
            path: "/home",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Home />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 基本資料設定
            path: "/profile",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Profile />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 用戶帳號
            path: "/users",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Users />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 平台參數
            path: "/platformPreference",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <PlatformPreference />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 支付相關
            path: "/payRelated",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <PayRelated />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 預設權限
            path: "/defaultAuth",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <DefaultAuth />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 用量級距管理
            path: "/quotaRankManage",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <QuotaRankManage />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 我的訂單
            path: '/myOrder',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <MyOrder />
                    </GlobalComponent>
                </FilterRoute>
        },

        // 社群管理----------------------------------------

        { // 社群好友管理
            path: '/socialFriendManage',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SocialFriendManage />
                    </GlobalComponent>
                </FilterRoute>
        },

        // Hide Page ---------------------------------

        { // 訂閱用戶級距方案
            path: "/subscribeQuotaPlan",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SubscribeQuotaPlan />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 訂閱用戶級距升級
            path: "/upgradeQuotaPlan",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SubscribeQuotaPlan mode="upgrade" />
                    </GlobalComponent>
                </FilterRoute>
        },


        {
            path: "*",
            element: <Page404 />
        }
    ]);
    */


    // const routes = (
    //     <Suspense fallback={<p> Loading...</p>}>
    //         <Routes>
    //             <Route path="/" element={
    //                 <FilterRoute mode="outside">
    //                     <GlobalComponent />
    //                     <Login />
    //                 </FilterRoute>
    //             } />
    //             <Route path="/home" element={
    //                 <FilterRoute mode="protected">
    //                     <GlobalComponent layout="backend">
    //                         <Home />
    //                     </GlobalComponent>
    //                 </FilterRoute>
    //             } />
    //             <Route path="/upgradeQuotaPlan" element={
    //                 <FilterRoute mode="protected">
    //                     <GlobalComponent layout="backend">
    //                         <SubscribeQuotaPlan mode="upgrade" />
    //                     </GlobalComponent>
    //                 </FilterRoute>
    //             }>
    //             </Route>
    //             <Route path="*" element={<Page404 />} />
    //         </Routes>
    //     </Suspense>
    // );

    const routePageList = [
        // Public Page-----------------------------------------
        {
            path: "/",
            element:
                <FilterRoute mode="outside">
                    {/* <GlobalComponent />
                    <Login /> */}
                    <GlobalComponent layout="outside">
                        <Login />
                    </GlobalComponent>
                </FilterRoute>
        },
        {
            path: "/regist",
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent />
                    <Login mode="regist" />
                </FilterRoute>
        },
        {
            path: "/registVerify",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="outside">
                    {/* <GlobalComponent /> */}
                    <GlobalComponent layout="outside">
                        <RegistVerify />
                    </GlobalComponent>
                </FilterRoute>
        },
        // 註冊驗證的URL ===> http://localhost:3000/registVerify?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        {
            path: "/resetPassword",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="outside">
                    <GlobalComponent layout="outside">
                        <ResetPassword />
                    </GlobalComponent>
                </FilterRoute>
        },
        // 重置密碼的URL ===> http://localhost:3000/resetPassword?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        // { // 已改用html靜態頁面
        //     path: "/serviceTerms",
        //     element:
        //         <FilterRoute mode="outside">
        //             <ServiceTerms />
        //         </FilterRoute>
        // },
        // {
        //     path: "/privacyPolicy",
        //     element:
        //         <FilterRoute mode="outside">
        //             <PrivacyPolicy />
        //         </FilterRoute>
        // },

        // Auth Page-----------------------------------------------

        {
            path: "/home",
            // 預設是protected ==> <FilterRoute mode="protected">
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Home />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 基本資料設定
            path: "/profile",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Profile />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 用戶帳號
            path: "/users",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <Users />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 平台參數
            path: "/platformPreference",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <PlatformPreference />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 支付相關
            path: "/payRelated",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <PayRelated />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 預設權限
            path: "/defaultAuth",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <DefaultAuth />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 用量級距管理
            path: "/quotaRankManage",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <QuotaRankManage />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 我的訂單
            path: '/myOrder',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <MyOrder />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 開發文件>API介接
            path: '/apiConnect',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <ApiConnect />
                    </GlobalComponent>
                </FilterRoute>
        },

        // 社群管理----------------------------------------

        { // 社群好友管理
            path: '/socialFriendManage',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SocialFriendManage />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 標籤管理 - 標籤分類
            path: '/tagCategory',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <TagCategory />
                    </GlobalComponent>
                </FilterRoute>
        },
        { // 標籤管理 - 標籤列表
            path: '/tagList',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <TagList />
                    </GlobalComponent>
                </FilterRoute>
        },

        // 數據集----------------------------------------

        { // 自訂數據
            path: '/customData',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <CustomData />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 共用數據
            path: '/sharedData',
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        {/* <CustomData pageMode="sharedData" /> */}
                        <SharedData />
                    </GlobalComponent>
                </FilterRoute>
        },

        // Hide Page ---------------------------------

        { // 訂閱用戶級距方案
            path: "/subscribeQuotaPlan",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SubscribeQuotaPlan />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 訂閱用戶級距升級
            path: "/upgradeQuotaPlan",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <SubscribeQuotaPlan mode="upgrade" />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 14.標籤管理 - 標籤判斷條件(已廢棄，純展示)
            path: "/tagDecisionCondition",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <TagDecisionCondition />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 14.標籤管理 - 標籤列表 - 標籤判斷條件
            path: "/tagConditionList",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <TagConditionList />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 機器人管理 - 拓樸圖測試(純測試)
            path: "/topologyGraph",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <TopologyGraph />
                    </GlobalComponent>
                </FilterRoute>
        },

        { // 13.訊息推播
            path: "/messageBroadcast",
            element:
                <FilterRoute mode="protected">
                    <GlobalComponent layout="backend">
                        <MessageBroadcast />
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