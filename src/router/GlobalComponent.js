import styled from 'styled-components';

import React, { useState, useRef } from "react";
import AlertModule from 'module/alert'
import Menu from 'module/menu'
import NavBar from 'module/navBar';
import LangModule from 'module/lang';
import ConfirmModule from 'module/confirm'
import TipModule from 'module/tip'

import Notification from "component/Notification"

import { menu as menuTheme } from 'theme/reas'
// import { navBar as navBarTheme } from 'theme/reas'
import { layout as layoutThemeObject } from 'theme/reas'
import ConfirmControl from 'control/Confirm';
import TipControl from 'control/Tip';
import NotifyControl from 'control/Notify';

import FetchControl from 'control/FetchControl';
import LayoutMixin from 'util/LayoutMixin';
import { fetchTheme } from 'util/ThemeMixin';
// import StateModel from 'model/StateModel';




// // v4註冊全域Component
// const withPageContent = (OutterComponnet, WrappedComponent) => {
//     return class extends React.Component {
//         render() {
//             return (
//                 <OutterComponnet>
//                     <WrappedComponent />
//                 </OutterComponnet>
//                 //      <LoginPage>
//                 //      <WrappedComponent />
//                 //  </LoginPage>
//             )
//         }
//     }
// };

// export default withPageContent(AlertModule);


const BackendLayoutStyled = styled.div`
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100vh;

    /* overflow: auto; // Debug用，之後關掉 */
    overflow-x: hidden; // 隱藏content-area右側超出去畫面的部分

    /* .navbar-area {
        display: flex;
        flex-direction: row;
        flex-shrink: 0;
    } */

    .main-area {
        display: flex;
        flex-direction: row;
        flex-grow: 1; // 剩餘的空間都給它

        .menu-area {
            display: flex;
            flex-shrink: 0;

            height: 100%;
        }

        .content-area {
            display: flex;
            flex-grow: 0;

            max-height: calc(100vh - ${LayoutMixin.navBarHeight || '53px'});
            
            /* background-color: #78dfc0; */
            background-color: ${fetchTheme('pageBackground', '#e3edea')};

            overflow-y: auto;
            overflow-x: hidden;

            // 會自動計算剩餘的畫面空間，當page沒擺滿物件時，底層也不會內縮
            // 但缺點是右側有scroll bar出現時，會超出畫面，會由隱藏
            /* min-width: 800px; */
            min-width: calc(100vw - 12rem);
            
            // -->底下接page-layer
            
            // scrollbar---------------------------------------

            /* width */
            &::-webkit-scrollbar {
                width: 20px;
            }

            // 用來幫scrollbar的hover設定感應區塊
            & .content-scrollbar-area {
                /* background-color: blue; */
                position: absolute;
                right: 0;
                
                height: calc(100vh - ${LayoutMixin.navBarHeight});
            }

            /* Track */
            &::-webkit-scrollbar-track {
                /* box-shadow: inset 0 0 5px grey; */
                /* background: #d1d1d1; */
                border-radius: 15px;

                background: transparent;
            }

            /* Handle */
            &::-webkit-scrollbar-thumb {
                /* background: #989898; */
                background-color: ${fetchTheme('scrollbar', '#cdcdcd')};

                border-radius: 60px;
                
                border: 4px solid transparent; // 用來縮小thumb的寬度
                background-clip: content-box;
                /* box-shadow: inset 0 0 5px #282828; */
            }

            /* Handle on hover */
            &::-webkit-scrollbar-thumb:hover {
                /* background: #dedede; */
                background-color: ${fetchTheme('scrollbarHover', '#dedede')};

                border: 3px solid transparent;
                /* border-radius: 9px; */

                background-clip: content-box;
            }
        }

        

        /* @media only screen and (min-width: 1370px) {
            .content-area {
                min-width: 1370px;
            }
        } */
    }
`


const BackendLayout = ({ children }) => {

    // const [confirmModalRef, setConfirmModalRef] = useState(null);
    // const [tipModalRef, setTipModalRef] = useState(null);

    const confirmModalRef = useRef(null);
    const setConfirmModalRef = ref => {
        confirmModalRef.current = ref;
    }

    const tipModalRef = useRef(null);
    const setTipModalRef = ref => {
        tipModalRef.current = ref;
    }

    const notifyRef = useRef(null);
    // const setNotifyRef = ref => {
    //     notifyRef.current = ref;
    // };

    /*

    // 將參數傳給到children內
    function fetchControl(key, ...args) {
        // console.log(`fetchControl [${key}]`, this);
        if (key === 'confirm') {
            return new ConfirmControl(confirmModalRef);
        } else if (key === 'tip') {
            return new TipControl(tipModalRef);
        } else if (key === 'notify') {
            return new NotifyControl(notifyRef);
        } else if (key === 'regist') {
            const [controlKey, controlObj] = args;
            let controlMap = this;

            // console.log(`regist ${controlKey} controlMap`, controlMap)

            if (!controlMap) {
                controlMap = {};
            }
            // 註冊一個新的Control進來
            controlMap[controlKey] = controlObj;

            return fetchControl.bind(controlMap);
        } else if (key === 'this') {
            return this;
        } else if (this && this[key]) {
            // 回傳內部註冊的control
            return this[key];
        }

        return null;
    }*/

    const fc = new FetchControl();
    fc.setup('confirm', new ConfirmControl(confirmModalRef));
    fc.setup('tip', new TipControl(tipModalRef));
    fc.setup('notify', new NotifyControl(notifyRef));

    const childrenWithProps = React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        const fetchControl = fc.export('fetchControl');
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { fetchControl });
            // return React.cloneElement(child, {
            //     fetchControl: fetchControl.bind({}),
            // });
        }
        return child;
    });
    // {/* <NavBar layoutClassName="navbar-area" theme={navBarTheme}></NavBar> */}

    return (
        <BackendLayoutStyled theme={layoutThemeObject}>
            <NavBar></NavBar>
            <div className="main-area">
                <Menu layoutClassName="menu-area" theme={menuTheme}></Menu>
                <div className="content-area">
                    {childrenWithProps}
                    {/* <div className="content-scrollbar-area">
                        AA
                    </div> */}
                </div>
            </div>
            <AlertModule />
            <LangModule />
            <ConfirmModule setConfirmModalRef={setConfirmModalRef} />
            <TipModule setConfirmModalRef={setTipModalRef} />
            <Notification openNotifyRef={notifyRef} />
        </BackendLayoutStyled>
    );
}

const OutsideLayout = ({ children }) => {

    // const [confirmModalRef, setConfirmModalRef] = useState(null);
    // const [tipModalRef, setTipModalRef] = useState(null);

    const confirmModalRef = useRef(null);
    const setConfirmModalRef = ref => {
        confirmModalRef.current = ref;
    }

    const tipModalRef = useRef(null);
    const setTipModalRef = ref => {
        tipModalRef.current = ref;
    }

    const notifyRef = useRef(null);

    const fc = new FetchControl();
    fc.setup('confirm', new ConfirmControl(confirmModalRef));
    fc.setup('tip', new TipControl(tipModalRef));
    fc.setup('notify', new NotifyControl(notifyRef));

    const childrenWithProps = React.Children.map(children, child => {
        // Checking isValidElement is the safe way and avoids a typescript
        // error too.
        const fetchControl = fc.export('fetchControl');
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { fetchControl });
            // return React.cloneElement(child, {
            //     fetchControl: fetchControl.bind({}),
            // });
        }
        return child;
    });
    // {/* <NavBar layoutClassName="navbar-area" theme={navBarTheme}></NavBar> */}

    return (
        <BackendLayoutStyled theme={layoutThemeObject}>
            {childrenWithProps}
            <AlertModule />
            <LangModule />
            <ConfirmModule setConfirmModalRef={setConfirmModalRef} />
            <TipModule setConfirmModalRef={setTipModalRef} />
            <Notification openNotifyRef={notifyRef} />
        </BackendLayoutStyled>
    );
}

const GlobalComponent = ({ layout, children }) => {

    if (layout === 'backend') {
        return <BackendLayout>{children}</BackendLayout>
    }

    if (layout === 'outside') {
        return <OutsideLayout>{children}</OutsideLayout>
    }

    // 一般的全域組件
    return (
        <div className="global-component">
            <AlertModule />
            <LangModule />
        </div>
    );
}


export default GlobalComponent;