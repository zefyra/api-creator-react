import { useNavigate } from "react-router-dom";
// 專門用來取得navigate函式的Module

export default function NavigateModule(props) {
    let navigate = useNavigate();

    props.navRef(navigate);

    return props.children;
    // return (<div></div>);
}