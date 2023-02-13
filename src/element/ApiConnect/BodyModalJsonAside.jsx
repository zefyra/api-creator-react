/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ReactComponent as SensorAlertSvg } from 'assets/svg/br-sensor-alert.svg'
import Button from 'component/Button';
import TextArea from 'component/TextArea';
import { useEffect, useState } from 'react';

const AsideJsonInputStyled = styled.div`
    display: flex;
    flex-direction: column;

    & .aside-title-row {
        display: flex;
        flex-direction: row;

        & .aside-title {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 0.5rem;
            margin-right: 0.5rem;
        }
        & .icon {
            width: 18px;
            height: 18px;

            transform: translateY(3px);
        }
    }

    padding-right: 1rem;
`

export default function BodyModalJsonAside({ model, control, onGqlOutput, bodyType }) {
    // bodyType="requestBody" , "responseBody"

    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [jsonValid, setJsonValid] = useState(false);

    const [sensorAlertShow, setSensorAlertShow] = useState(false);
    const [converBtnShow, setConverBtnShow] = useState(false);

    useEffect(function () {
        setSensorAlertShow(!jsonValid);
        setConverBtnShow(jsonValid);
    }, [jsonValid]);

    const [json, setJson] = useState(model.getState('gqlJsonSrc'));
    const actJson = model.reactive('gqlJsonSrc', 'AddBodyModal_sensor', setJson);

    const debounce = function (callback) { // 防抖
        clearTimeout(debounceTimeout); // 每次都清掉舊的timeout
        setDebounceTimeout(null);

        // 再創建一個新的timeout，就能確保第一次呼叫後的interval時間內，不會再次呼叫該函式
        setDebounceTimeout(setTimeout(callback, 1500));
    }

    useEffect(function () {
        // control.onGqlJsonSrcUpdate(json);

        // setSensorAlertShow();

        // console.log('json sensor')

        debounce(function () {

            // console.log('parse json');

            let jsonObj;
            let jsonValid = false;
            try {
                jsonObj = JSON.parse(json)
                jsonValid = true;
            } catch (e) {
                // 代表json parse失敗
                jsonValid = false;
            }

            // console.log('jsonValid', jsonValid)

            setJsonValid(jsonValid);
        });
    }, [json]);

    const handleConvertJson = () => () => {
        console.log('handleConvertJson');
        // control.onGqlJsonSrcUpdate(json); // 舊版的
        if (onGqlOutput) {
            onGqlOutput(control.onGqlJsonSrcUpdate(json, bodyType));
        }
    }

    return (
        <AsideJsonInputStyled>
            <div className="aside-title-row">
                <div className="aside-title">
                    JSON
                </div>
                <SensorAlertSvg style={{
                    display: sensorAlertShow ? 'block' : 'none',
                }} className="icon" fill="#ec564e" />
                <Button type="fill" show={converBtnShow} pattern="small"
                    importStyle={{
                        marginTop: '0px', marginRight: '0px',
                        marginBottom: '0px', marginLeft: '0', paddingH: '0.25rem',
                        height: '26px', fixHeight: '26px'
                    }}
                    onClick={handleConvertJson()}>
                    Add TypeDef
                </Button>
            </div>
            <TextArea width="300px" height="300px" value={model.fetchRef('gqlJsonSrc', 'AddBodyModal')}
                srcKey="AddBodyModal"></TextArea>
            {/* onUpdate={control.bindAct('onGqlJsonSrcUpdate')} */}
        </AsideJsonInputStyled>
    )
}