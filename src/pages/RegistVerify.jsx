/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import { useDispatch } from "react-redux";
import { RegistVerifyFlow } from "flow/login";
import { layout, pageMessage } from 'theme/reas';
import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';

import CircularProgress from '@mui/material/CircularProgress';
import { RegistVerifyModel } from 'fragment/Login';
import { useTranslation } from 'react-i18next';

const pageMessageTheme = new ThemeMixin(pageMessage);



// 驗證Email
// http://localhost:3000/registVerify?token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


const RegistVerifyStyled = styled.div`
height: 100vh;
background-color: ${fetchTheme('pageBackground', '#FFFFFF')};
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const LoadingBlockStyled = styled.div`
display: flex;

font-size: 40px;
font-weight: bold;

& .center-message {
    display: flex;

    margin-right: 15px;

    color: ${fetchTheme('text', '#112e23')};

    &.hide {
        display: none;
    }
}

& .progress-block {
    display: flex;

    align-items: center;

    &.hide {
        display: none;
    }
}
`



function RegistVerifyContainer({ control, model }) {

    //     let navigate = useNavigate();

    //     const routeJump = function (navRoute) {
    //         console.log(`routeJump navRoute:${navRoute}`);
    //         navigate(navRoute); // 不要加replace，否則會把history蓋掉
    //     };

    //     const handleLogin = () => () => {
    //         routeJump('/home');
    //     };

    // 取得GET參數
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token");
    // 驗證帳號Email的API
    // console.log('registVerify token:', token);

    const [loadingHide, setLoadingHide] = useState(model.getState('loadingHide'));
    const actLoadingHide = model.reactive('loadingHide', 'RegistVerify', setLoadingHide);

    const navigate = useNavigate();

    useEffect(function () {
        control.onPageMount(token);
        // navigate("/login");
    }, []);

    // ApiSender.sendApi('[put]/auth/activate/{token}', {}, {
    //     apiInnerData: {
    //         token: token,
    //     }
    // }).then((data) => {
    //     // 驗證成功，重新導向到登入頁
    //     navigate("/login")
    // }).catch(new ApiError().catchAlertMsg());

    return (
        <RegistVerifyStyled theme={layout}>
            <LoadingBlockStyled theme={pageMessage}>
                <div className={`center-message${loadingHide ? ' hide' : ''}`}>
                    Loading...
                </div>
                <div className={`progress-block${loadingHide ? ' hide' : ''}`}>
                    <CircularProgress sx={{ color: pageMessageTheme.getTheme('loading', '#477c68') }} />
                </div>
            </LoadingBlockStyled>
            {/* <div className="center-block">
                <div className="center-message" style={{
                    color: pageMessageTheme.getTheme('text', '#477c68'),
                }}>
                    Loading...
                </div>
                <div className="progress-block">
                    <CircularProgress sx={{ color: pageMessageTheme.getTheme('loading', '#477c68') }} />
                </div>
            </div> */}
        </RegistVerifyStyled>
    );
}

const RegistVerify = ({ fetchControl }) => {
    let navigate = useNavigate();

    const { t: registVerifyT } = useTranslation('login', { keyPrefix: 'registVerify' })

    const registVerifyModel = new RegistVerifyModel(useRef(null));
    const registVerifyControl = new RegistVerifyFlow();
    registVerifyControl.registModel('stateModel', registVerifyModel);
    registVerifyControl.registRef('navigate', navigate);
    registVerifyControl.registRef('registVerifyT', registVerifyT);

    registVerifyControl.bindFetchControl(fetchControl);

    return (
        <RegistVerifyContainer model={registVerifyModel} control={registVerifyControl}></RegistVerifyContainer>
    )
}

export default RegistVerify; 