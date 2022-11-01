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
import DatePicker from "component/DatePicker"
import Select from 'component/Select'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import ThemeMixin, { fetchTheme } from 'util/ThemeMixin';
import { tagSelector as tagSelectorThemeObject } from 'theme/reas';

import CountyModel from 'model/County'
import FamilyEnum from 'enum/social/Family';
import UserCheckEnum from 'enum/social/UserCheck';
import { useTranslation } from 'react-i18next';
import { ModalTabForm, InputRow, CheckBoxItem } from 'vision/TabModal';


const UserProfileFormCss = css`
    & .row.user-check-row {
        flex-direction: row;

        /* height: 3rem; */
        /* justify-content: space-around; */
        justify-content: center;

        /* padding-top: 1.5rem;
        padding-bottom:  1.5rem; */

        margin-top: 0.5rem;
        margin-bottom: 0.5rem;

        & .check-box-board {
            display: flex;
            
            justify-content: space-around;
            /* align-items: center; */

            width: 100%;
            
            background-color: #b3c2bf;
            
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;

            border-radius: 5px;

            /* box-shadow: inset 0px 0px 5px #798683; */

            & .check-box-block {
                display: flex;
                align-items: center;
            }
        }
    }
    & .row.sex-row{
        flex-direction: row;
        justify-content: center;
    }
`


const RadioItem = ({ label, value }) => {
    return (
        <FormControlLabel
            value={value} label={label}
            // value={tagCategoryItem.value} label={tagCategoryItem.label}
            sx={{
                width: '90px',
                userSelect: 'none',
                // color: '#3fc08c',
                // color: '#759186',
                color: '#3d4442',
                // color: labelColor,
            }}
            control={<Radio sx={{
                color: '#759186',
                '&.Mui-checked': {
                    color: '#3fc08c',
                },
                // color: tagSelectorTheme.getTheme('radioButton', '#2e2e2e'),
                // '&.Mui-checked': {
                //     color: tagSelectorTheme.getTheme('radioActive', '#2e2e2e'),
                // },
            }} />}
        />
    )
}

const FamilyCheckBoxItem = ({ familyKey, label }) => {
    // console.log(`FamilyCheckBoxItem familyKey`, familyKey)

    const dispatch = useDispatch();

    const familyChecked = useSelector(selectFamilyChecked);

    const onFamilyMemberChecked = familyKey => val => {
        // console.log('onFamilyMemberChecked', familyKey, val);

        dispatch(updateFamilyChecked(familyKey, val));
    }

    // return (
    //     <div className="check-item">
    //         <div className="check-box-block">
    //             <CheckBox type="small" value={familyChecked(familyKey)} onUpdate={onFamilyMemberChecked(familyKey)} />
    //         </div>
    //         <div className="item-label">
    //             {label}
    //         </div>
    //     </div>
    // );

    return (
        <CheckBoxItem label={label} value={familyChecked(familyKey)} onUpdate={onFamilyMemberChecked(familyKey)}>
        </CheckBoxItem>
    )
}



const CheckLabelItem = ({ label, checkKey }) => {
    const userChecked = useSelector(selectUserChecked);
    return (
        <CheckLabelItemStyled>
            <div className="check-box-block">
                <CheckBox type="small" value={userChecked(checkKey)} />
            </div>
            <div className="item-label">{label}</div>
        </CheckLabelItemStyled>
    )
}

const CheckLabelItemStyled = styled.div`
    display: flex;
    flex-direction: row;

    & .item-label {
        display: flex;

        align-items: center;
        justify-content: flex-start;

        margin: 0 0.45rem;
    }
`





export default function UserProfile({ show, fetchControl }) {
    const { t } = useTranslation('social', { keyPrefix: 'userProfile' })

    const dispatch = useDispatch();

    // const userCheckList = useSelector(selectUserCheckList);
    const firstName = useSelector(selectFirstName);
    const lastName = useSelector(selectLastName);
    const sex = useSelector(selectSex);
    const phone = useSelector(selectPhone);
    const birthday = useSelector(selectBirthday);
    const job = useSelector(selectJob);
    const county = useSelector(selectCounty);
    const district = useSelector(selectDistrict);
    const roadName = useSelector(selectRoadName);
    const address = useSelector(selectAddress);
    // const familyMemberList = useSelector(selectFamilyMemberList);
    const remark = useSelector(selectRemark);

    const actFirstName = val => dispatch(updateFirstName(val));
    const actLastName = val => dispatch(updateLastName(val));
    const actSex = val => dispatch(updateSex(val));
    const actPhone = val => dispatch(updatePhone(val));
    const actBirthday = val => dispatch(updateBirthday(val));
    const actJob = val => dispatch(updateJob(val));
    const actCounty = val => dispatch(updateCounty(val));
    const actDistrict = val => dispatch(updateDistrict(val));
    const actRoadName = val => dispatch(updateRoadName(val));
    const actAddress = val => dispatch(updateAddress(val));
    // const actFamilyMemberList = val => dispatch(updateFamilyMemberList(val));
    const actRemark = val => dispatch(updateRemark(val));


    // 縣市optionList資料控制------------------------------------

    // 註冊Model
    const countyModel = new CountyModel(useRef(null));
    // 在fetchControl註冊Model
    fetchControl('entity').setupModel('countyModel', countyModel);

    // 縣市列表(靜態)
    const countyOptionList = countyModel.getState('countyOptionList');
    // 區域鄉鎮列表(動態的)
    const [districtOptionList, setDistrictOptionList] = useState([]);

    useEffect(function () {
        if (!county) {
            setDistrictOptionList([]);
            return;
        }

        actDistrict(''); // 將區域的值洗掉
        setDistrictOptionList(countyModel.getDistrictOptionList(county));
    }, [county]);

    // ---------------------------------------------

    const onSexChange = () => e => {
        // console.log('onSexChange', e.target.value);
        actSex(e.target.value);
    }

    // render------------------------------------

    let userCheckListDom = [];

    const initCheckList = UserCheckEnum.getCheckItemList(t);
    initCheckList.forEach((userCheckItem, index) => {
        userCheckListDom.push(
            (
                <CheckLabelItem key={`userCheckItem_${index}`} label={userCheckItem.label} checkKey={userCheckItem.key}></CheckLabelItem>
            )
        )
    });

    const familyList = FamilyEnum.getCheckItemList();
    // console.log('familyList', familyList)
    let familyListDom = [];
    familyList.forEach((familyItem, index) => {
        familyListDom.push(
            (
                <FamilyCheckBoxItem key={`familyItem_${index}`} familyKey={familyItem.value}
                    label={familyItem.label}
                ></FamilyCheckBoxItem>
            )
        );
    });

    return (
        <ModalTabForm show={show} importCss={UserProfileFormCss}>
            <div className="row user-check-row">
                <div className="check-box-board">
                    {userCheckListDom}
                </div>
            </div>
            <InputRow title="姓名">
                <InputText importStyle={{
                    width: '160px',
                }} placeholder="名子" value={firstName} onUpdate={actFirstName}></InputText>
                <InputText importStyle={{
                    width: '100px',
                }} placeholder="姓氏" value={lastName} onUpdate={actLastName}></InputText>
            </InputRow>
            <InputRow title="性別" className="sex-row">
                <RadioGroup
                    aria-labelledby="sex-radio-buttons-group"
                    name="sex-radio-buttons-group"
                    value={sex}
                    onChange={onSexChange()}
                    sx={{
                        'flexDirection': 'row',
                        'alignItems': 'flex-start',
                        'position': 'relative',
                    }}
                >
                    <RadioItem label="男" value={'male'} />
                    <RadioItem label="女" value={'female'} />
                    <RadioItem label="其他" value={'other'} />
                </RadioGroup>
            </InputRow>
            <InputRow title="手機號碼">
                <InputText importStyle={{
                    width: '260px',
                }} placeholder="請輸入手機號碼" value={phone} onUpdate={actPhone}></InputText>
            </InputRow>
            <InputRow title="生日">
                <DatePicker importStyle={{
                    width: '260px'
                }} placeholder="請輸入生日" value={birthday} onUpdate={actBirthday}></DatePicker>
            </InputRow>
            <InputRow title="職業">
                <InputText importStyle={{
                    width: '260px',
                }} placeholder="請輸入職業" value={job} onUpdate={actJob}></InputText>
            </InputRow>
            <InputRow title="居住地區">
                <Select importStyle={{
                    width: '160px',
                    marginRight: '0.5rem',
                }} value={county} optionList={countyOptionList} onUpdate={actCounty}></Select>
                <Select importStyle={{
                    width: '160px'
                }} value={district} optionList={districtOptionList} onUpdate={actDistrict}></Select>
            </InputRow>
            <InputRow title="">
                <InputText importStyle={{
                    width: '260px',
                }} placeholder="請輸入路名" value={roadName} onUpdate={actRoadName}></InputText>
            </InputRow>
            <InputRow title="家族成員" type="checkBoxGroup">
                {familyListDom}
            </InputRow>
            <InputRow type="confirmBtnRow">
                <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={fetchControl('userProfile').bindAct('onSaveUserProfile')}>儲存</Button>
            </InputRow>
        </ModalTabForm>
    )


    /*
    return (
        <UserProfileStyled show={show}>
            <div className="row user-check-row">
                <div className="check-box-board">
                    {userCheckListDom}
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        姓名
                    </div>
                    <InputText importStyle={{
                        width: '160px',
                    }} placeholder="名子" value={firstName} onUpdate={actFirstName}></InputText>
                    <InputText importStyle={{
                        width: '100px',
                    }} placeholder="姓氏" value={lastName} onUpdate={actLastName}></InputText>
                </div>
            </div>
            <div className="row sex-row">
                <div className="form-item">
                    <div className="title">
                        性別
                    </div>
                    <RadioGroup
                        aria-labelledby="sex-radio-buttons-group"
                        name="sex-radio-buttons-group"
                        value={sex}
                        onChange={onSexChange()}
                        sx={{
                            'flexDirection': 'row',
                            'alignItems': 'flex-start',
                            'position': 'relative',
                        }}
                    >
                        <RadioItem label="男" value={'male'} />
                        <RadioItem label="女" value={'female'} />
                        <RadioItem label="其他" value={'other'} />
                    </RadioGroup>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        手機號碼
                    </div>
                    <InputText importStyle={{
                        width: '260px',
                    }} placeholder="請輸入手機號碼" value={phone} onUpdate={actPhone}></InputText>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        生日
                    </div>
                    <DatePicker importStyle={{
                        width: '260px'
                    }} placeholder="請輸入生日" value={birthday} onUpdate={() => { }}></DatePicker>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        職業
                    </div>
                    <InputText importStyle={{
                        width: '260px',
                    }} placeholder="請輸入職業" value={job} onUpdate={actJob}></InputText>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        居住地區
                    </div>
                    <Select importStyle={{
                        width: '160px'
                    }} value={county} optionList={countyOptionList} onUpdate={actCounty}></Select>
                    <Select importStyle={{
                        width: '160px'
                    }} value={district} optionList={districtOptionList} onUpdate={actDistrict}></Select>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        
                    </div>
                    <InputText importStyle={{
                        width: '260px',
                    }} placeholder="請輸入路名" value={roadName} onUpdate={actRoadName}></InputText>
                </div>
            </div>
            <div className="row input-row">
                <div className="form-item">
                    <div className="title">
                        家族成員
                    </div>
                    <div className="check-box-container">
                        {familyListDom}
                    </div>
                </div>
            </div>
            <div className="confirm-button-row">
                <Button type="fill" importStyle={{
                    marginRight: '1.5rem',
                    marginBottom: '1.5rem',
                }} onClick={fetchControl('userProfile').bindAct('onSaveUserProfile')}>儲存</Button>
            </div>
        </UserProfileStyled >
    )

*/

    // return (
    //     <UserPreferenceStyled show={show}>
    //         <div className="aa-row">AAA</div>
    //         <div className="aa-row">BBB</div>
    //         <div className="bb-row">CCC</div>
    //     </UserPreferenceStyled>
    // )
}