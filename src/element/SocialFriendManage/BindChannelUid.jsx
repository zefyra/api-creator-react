/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import Button from "component/Button"
import CheckBox from 'component/CheckBox';
import { useSelector, useDispatch, connect } from 'react-redux';

import {
    selectUserCheckList, updateUserCheckList,
    selectUserChecked, // updateUserChecked,
    selectFirstName, updateFirstName,
    selectLastName, updateLastName,
    selectSex, updateSex,
    selectPhone, updatePhone,
    selectBirthday, updateBirthday,
    selectJob, updateJob,
    selectCounty, updateCounty,
    selectDistrict, updateDistrict,
    selectRoadName, updateRoadName,
    selectAddress, updateAddress,
    selectRemark, updateRemark,
    selectFamilyChecked, updateFamilyChecked
} from "store/social"
import { useState, useRef, useEffect } from 'react';
import InputText from 'component/InputText';
// import DatePicker from "component/DatePicker"
// import Select from 'component/Select'

// import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';


// import CountyModel from 'model/County'
// import FamilyEnum from 'enum/social/Family';
// import UserCheckEnum from 'enum/social/UserCheck';
import { useTranslation } from 'react-i18next';
import { ModalTabForm, InputRow } from 'vision/TabModal';

export default function BindUserUid({ show, fetchControl }) {

    const [phone, actPhone] = useState('');

    return (
        <ModalTabForm show={show} titleWidth="90px">
            <InputRow title="LINE ID">
                <InputText importStyle={{
                    width: '260px',
                }} value={phone} onUpdate={actPhone}></InputText>
            </InputRow>
            <InputRow title="Facebook ID">
                <InputText importStyle={{
                    width: '260px',
                }} value={phone} onUpdate={actPhone}></InputText>
            </InputRow>
            <InputRow title="Instagram ID">
                <InputText importStyle={{
                    width: '260px',
                }} value={phone} onUpdate={actPhone}></InputText>
            </InputRow>
            <InputRow title="WeChat ID">
                <InputText importStyle={{
                    width: '260px',
                }} value={phone} onUpdate={actPhone}></InputText>
            </InputRow>
            <InputRow type="confirmBtnRow">
                <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={fetchControl('userProfile').bindAct('onSaveUserProfile')}>儲存</Button>
            </InputRow>
        </ModalTabForm>
    )

    // return (
    //     <BindUserUidStyled show={show}>
    //         AA

    //     </BindUserUidStyled>
    // )
}