// 用來顯示警告訊息的Module
import { useState } from "react"
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector, connect } from 'react-redux';
import styled from 'styled-components';
import Modal from "component/Modal"
// import EngineWarningSvg from 'assets/svg/engine-warning.svg';
import { ReactComponent as EngineWarningSvg } from 'assets/svg/engine-warning.svg'
// 將SVG包成ReactComponent就可以使用fill, stroke等屬性

import {
    selectAlertModalShow, selectAlertContent, selectAlertTitle,
    updateAlertModalShow
} from 'store/alert';
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import LayerMixin from 'util/LayerMixin';


// alert燈箱

// let alertModalRef; // 已改用useState

const AlertModuleStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    width: 460px;
    height: 320px;

    /* background-color: aquamarine; */

    .engine-warning-icon {
        width: 50px;
        height: 50px;
    }
`


export default function AlertModule(props) {
    // let navigate = useNavigate();

    const [alertModalRef, setAlertModalRef] = useState(null);

    // props.navRef(navigate);
    // const handleAlert = () => () => {
    //     // console.log('alertModalRef', alertModalRef);
    //     // alertModalRef.openModal();

    //     alertModalRef.openModal();
    // }

    const bindAlertModalRef = () => ref => {
        //  失敗
        // dispatch(updateAlertModalRef('aaaaaaa'));

        // props.registRef('alertModal', ref);

        setAlertModalRef(ref);
    };

    const dispatch = useDispatch();
    // const dispatchFunc = useDispatch();
    // const dispatch = useCallback(dispatchFunc, [dispatchFunc]);


    const alertModalShow = useSelector(selectAlertModalShow);
    const alertTitle = useSelector(selectAlertTitle);
    const alertContent = useSelector(selectAlertContent);

    useEffect(() => {
        if (alertModalRef) {
            if (alertModalShow === 'open') {

                // 執行openModal的指令
                alertModalRef.openModal();
                // 將指令設回去
                dispatch(updateAlertModalShow('none'));
            }
        } else {
            // console.error('<AlertModule> alertModalRef is not exist')
        }
    }, [alertModalShow, dispatch, alertModalRef])


    // const darkTheme = useSelector(state => state.darkTheme);

    // useEffect(() => {
    //     if (darkTheme) {
    //         document.body.style.backgroundColor = "rgba(0,0,0,0.5)";
    //     } else {
    //         document.body.style.backgroundColor = "white";
    //     }
    // }, [darkTheme]);

    return (
        <div>
            {/* <button onClick={handleAlert()}>Alert</button> */}
            {/* 原本的綁法 childRef={ref => (alertModalRef = ref)} */}
            <Modal childRef={bindAlertModalRef()}
                modalWidth={460} modalHeight={320} layer={LayerMixin.alert}>
                <AlertModuleStyled>
                    <div>
                        <EngineWarningSvg className="engine-warning-icon" alt="logo" fill="#eaa42c"></EngineWarningSvg>
                        {/* <img src={EngineWarningSvg} className="engine-warning-logo" alt="logo" /> */}
                    </div>
                    <div>
                        {alertTitle}
                    </div>
                    <div>
                        {alertContent}
                    </div>
                    {/* <div>
                        您的帳號已被停用中
                    </div> */}
                </AlertModuleStyled>
            </Modal>
        </div>
    );
}