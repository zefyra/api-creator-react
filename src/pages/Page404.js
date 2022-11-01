// 404頁面，自動轉跳回首頁
import { Navigate } from "react-router-dom";


export default function Page404() { // { children }
    return <Navigate to="/" />;
    // return children;
}