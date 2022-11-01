/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Ref from 'model/Ref';
import { useEffect, useState } from 'react';
import Button from './Button';
import DatePicker from './DatePicker';
import DateTimePicker from './DateTimePicker';
import InputText from './InputText';
import Modal from './Modal';
import Select from './Select';
import TextArea from './TextArea';
import ToggleSwitch from './ToggleSwitch';



const FormModalStyled = styled.div`
    display: flex;
    flex-direction: column;

    min-width: ${props => props.modalWidth ? `${props.modalWidth}px` : '700px'};
    min-height: ${props => props.modalHeight ? `${props.modalHeight}px` : '660px'};
    
`

const FromModalTitleStyled = styled.div`
    display: flex;
    flex-direction: row;

    justify-content: flex-start;
    width: 100%;

    & .title-block {
        display: flex;
        margin: 1rem 1.5rem;
    }
    
    /* margin-top: 0.5rem; */
`

const FormModalTitleRow = ({ children }) => {
    return (
        <FromModalTitleStyled>
            <div className="title-block">
                {children}
            </div>
        </FromModalTitleStyled>
    )
};

const FormAreaStyled = styled.div`
    width: 100%;
    
    display: flex;
    flex-direction: column;

    justify-content: flex-start;
    align-items: center;

    margin-top: 1.5rem;

    & .form-block {
        display: flex;
        flex-direction: column;

        justify-content: flex-start;
        align-items: center;

        /* margin: 1rem 1.5rem; */

        /* width: ${props => props.modalWidth ? `calc(${props.modalWidth}px - 10rem)` : '100%'}; */
        width: ${props => props.formWidth ? props.formWidth : 'auto'};
    }
`

const FormArea = ({ children, modalWidth, formWidth }) => {
    // modalWidth={modalWidth}
    return (
        <FormAreaStyled formWidth={formWidth}>
            <div className="form-block">
                {children}
            </div>
        </FormAreaStyled>
    )
}

export const FooterArea = styled.div`
    width: 100%;

    display: flex;
    flex-direction: row;

    flex-grow: 1;
    
    justify-content: center;
    align-items: center;
`


const FormItemRowStyled = styled.div`
display: flex;
flex-direction: row;

width: 100%;

margin-bottom: 1.2rem;
position: relative;

    & .item-container {
        display: flex;
        flex-direction: column;
        /* justify-content: flex-start;
        align-items: center; */

        flex-grow: 1;

        /* & .item-comment {

        } */
    }
`

const ItemCommentStyled = styled.div`
display: flex;
flex-direction: row;
width: 100%;
`

const InputButtonRowStyled = styled.div`
    display: flex;
    flex-direction: row;

    height: 2.3rem;
    width: 100%;
    max-width: 400px;

    position: relative;

    & .input-text-block {
        display: flex;
        flex-direction: row;
        
        justify-content: flex-start;
        align-items: center;

        height: 100%;

        /* flex-grow: 1; */

        width: ${props => props.textWidth ? props.textWidth : 'auto'};

        flex-grow: ${props => props.textWidth ? 'auto' : '1'};
    }

    & .input-button-block { // non-flex
        /* position: absolute;
        top: 3px;
        right: 45px; */
        display: flex;
        flex-direction: row;
    }
    
`

const InputButtonRow = ({ formItem = {}, srcKey = 'InputButtonRow' }) => {
    /* formItem: {
        label: t('upperCategory'), // 上級分類
        type: 'inputButton', // 可輸入字串的按鈕
        buttonLabel: t('input'),
        inputText: model.fetchRef('upperCategory', `CreateTagCategoryModal_upperCategory`),
        // inputText: '中文中文中文中文中文中文中文中文中文中文中文中文',
        filter: new TextLimitFilter(15, 10),
        onButtonClick: control.bindAct('onUpperCategoryButtonClick'),
    } */

    let initInputText = '';
    if (typeof formItem.inputText === 'string') {

        initInputText = formItem.inputText;
        if (formItem.filter) {
            // 代表有需要使用filter
            initInputText = formItem.filter.filt(initInputText);
        }
    } else if (formItem.inputText instanceof Ref) {
        initInputText = formItem.inputText.getValue();
    }

    const [inputText, setInputText] = useState(initInputText);

    const mutInputText = function (val) {
        if (formItem.filter) {
            val = formItem.filter.filt(val);
        }
        // console.log('mutInputText', val);
        setInputText(val);
    }

    let actInputText = mutInputText;
    if (formItem.inputText instanceof Ref) {
        actInputText = formItem.inputText.reactive(srcKey, mutInputText);
    }
    const onInputButtonRowClick = () => () => {
        if (formItem.onButtonClick) {
            formItem.onButtonClick();
        }
    }

    // let lockBlockDom;
    // // console.log('formItem.lock', formItem.lock)
    // if (formItem.lock !== undefined) {
    //     // console.log('lockBlockDom', formItem.lock)
    //     lockBlockDom = (<LockBlock lock={formItem.lock} srcKey={srcKey}></LockBlock>)
    // }



    return (
        <InputButtonRowStyled textWidth={formItem.textWidth}>
            <div className="input-text-block">
                {inputText}
            </div>
            <div className="input-button-block">
                <Button type="fill" pattern="formModal" onClick={onInputButtonRowClick()}>{formItem.buttonLabel || ''}</Button>
            </div>
            {/* {lockBlockDom} */}
        </InputButtonRowStyled>
    );
}

// const LockBlockStyled = styled.div`
// position: absolute;
// left: 0;
// top: 0;
// width: 100%;
// height: 50px;

// background-color: #00000040;
// `


// const LockBlock = ({ lock: lockItem, srcKey, children }) => {
//     // console.log('lockItem', lockItem)

//     // lock---------------------------------------

//     let initLock = false;
//     if (typeof lockItem === 'boolean') {
//         initLock = lockItem;
//     } else if (lockItem instanceof Ref) {
//         initLock = lockItem.getValue();
//     }
//     const [lock, setLock] = useState(initLock);

//     const mutLock = function (val) {
//         console.log('mutLock', val);
//         setLock(val)
//     }

//     let actLock = mutLock;
//     if (lockItem instanceof Ref) {
//         console.log(`bind lock reactive`)
//         actLock = lockItem.reactive(srcKey, actLock);
//     }

//     if (!lock) {
//         return (
//             <div></div>
//         );
//         // <button onClick={() => actLock(!lock)}>Lock</button>
//     }

//     return (
//         <LockBlockStyled>
//         </LockBlockStyled>
//     )
// }

const TextRow = ({ formItem, srcKey = 'TextRow' }) => {

    // 支援使用Ref
    const value = formItem.value;
    const isRefMode = value instanceof Ref;

    const convertValue = function (value) {
        let initInputText = '';
        if (typeof value === 'string') {
            initInputText = value;
        } else if (isRefMode) {
            initInputText = value.getValue();
        }
        return initInputText;
    }
    const [nowValue, setNowValue] = useState(convertValue(value));

    const mutText = function (val) {
        if (formItem.filter) {
            val = formItem.filter.filt(val);
        }
        setNowValue(val);
    }
    let actText = mutText;
    if (isRefMode) { // 綁定value
        actText = value.reactive(srcKey, actText);
    }

    return (
        <div>{nowValue}</div>
    )
}

const TextAreaRow = ({ formItem, srcKey = 'TextAreaRow' }) => {

    // style={style} className={inputTextClassName} placeholder={placeholder}
    //         value={value} onChange={onChange} disabled={disabled}
    //         onFocus={onFocus} onBlur={onBlur} qid={qid} id={id}
    //         onClick={onClick} onKeyDown={onKeyDown}

    // width="350px" 
    return (
        <TextArea height="100px" value={formItem.value} srcKey={srcKey}></TextArea>
    )
}

const InputTextRow = ({ formItem, srcKey = 'InputTextRow' }) => {
    /* formItem: {
        label: t('tagCategoryZh'), // 標籤分類(中)
        type: 'inputText',
        value: model.fetchRef('tagCategoryZh', `CreateTagCategoryModal_tagCategoryZh`),
    } */

    if (formItem.value instanceof Ref) {
        return (
            <InputText value={formItem.value}
                type={formItem.inputType} max={formItem.max} min={formItem.min}></InputText>
        )
    }
    // value是一般字串，純展示
    const [value, setValue] = useState(formItem.value);

    return (
        <InputText value={value} onUpdate={setValue}
            type={formItem.inputType}></InputText>
    )
}

const SelectRow = ({ formItem, srcKey }) => {
    /* formItem: {
        label: t('tagCreateMethod'), // 標籤建立方式
        type: 'select',
        optionList: CreateMethodEnum.getOptionList(t),
        value: model.fetchRef('tagCreateMethod', `CreateTagCategoryModal_tagCreateMethod`),
    } */

    let initValue = '';
    if (typeof formItem.value === 'string') {
        initValue = formItem.value;
    } else if (formItem.value instanceof Ref) {
        initValue = formItem.value.getValue();
    }
    const [value, setValue] = useState(initValue);

    const mutSelectValue = function (val) {
        // 目前沒用到filter
        // if (formItem.filter) {
        //     val = formItem.filter.filt(val);
        // }
        // console.log('mutInputText', val);
        setValue(val);
    }

    let actSelectValue = mutSelectValue;
    if (formItem.value instanceof Ref) {
        actSelectValue = formItem.value.reactive(srcKey, actSelectValue);
    }

    return (
        <Select value={value} optionList={formItem.optionList} onUpdate={actSelectValue}
            loading={formItem.loading} srcKey={srcKey} placeholder={formItem.placeholder}
        ></Select>
    )
}

const ItemLabelStyled = styled.div`
    /* & .item-label { */
display: flex;
flex-direction: row;
align-items: center;

min-width: 10rem;
`


const ItemLabel = ({ label, srcKey = 'ItemLabel' }) => {
    const isRefMode = label instanceof Ref;

    const convertLabel = function () {
        if (isRefMode) {
            return label.getValue();
        } else {
            return label || ''
        }
    }

    const [nowLabel, setLabel] = useState(convertLabel(label));

    if (isRefMode) { // 使用Ref: 單向綁定輸出
        label.reactive(`${srcKey}_ItemLabel`, setLabel);
    }
    return (
        <ItemLabelStyled>
            {nowLabel}
        </ItemLabelStyled>
    )
}


const LabelToggleSwitchStyled = styled.div`
display: flex;
flex-direction: row;
height: 2.3rem;

    & .boolean-label {
        height: inherit;
        display: flex;
        
        align-items: center;

        padding: 0 1.5rem;
    }

`

const ToggleSwitchRow = ({ formItem, srcKey }) => {


    if (formItem.trueLabel || formItem.falseLabel) {
        return (
            <LabelToggleSwitchStyled>
                <div className="boolean-label">{formItem.falseLabel}</div>
                <ToggleSwitch value={formItem.value} srcKey={srcKey}
                ></ToggleSwitch>
                <div className="boolean-label">{formItem.trueLabel}</div>
            </LabelToggleSwitchStyled>
        )
    }

    return (
        <ToggleSwitch value={formItem.value} srcKey={srcKey}
        ></ToggleSwitch>
    )
}

const DateTimePickerRow = ({ formItem, srcKey }) => {
    // formItem.value

    const onDateUpdate = () => val => {
        console.log('onDateUpdate', val.toISOString())

        // formItem.value
    }

    // 寫到這裡，要重寫DateTimePicker

    return (
        <div>
            <DateTimePicker value={formItem.value} srcKey={srcKey}
                onChange={onDateUpdate()}></DateTimePicker>
        </div>
    )

    // return (
    //     <div>
    //         <DatePicker placeholder="開始日期" onUpdate={onDateUpdate()}></DatePicker>
    //     </div>
    // )
}

const FormItemRow = ({ formItem, srcKey }) => {

    let itemContentDom;

    if (formItem.type === 'inputText') {
        itemContentDom = (
            <InputTextRow formItem={formItem} srcKey={srcKey}></InputTextRow>
        );
    } else if (formItem.type === 'text') {
        itemContentDom = (
            <TextRow formItem={formItem} srcKey={srcKey}></TextRow>
        );
    } else if (formItem.type === 'textArea') {
        itemContentDom = (
            <TextAreaRow formItem={formItem} srcKey={srcKey}></TextAreaRow>
        );
    } else if (formItem.type === 'select') {
        itemContentDom = (
            <SelectRow formItem={formItem} srcKey={srcKey}></SelectRow>
        )
        /*  {
            label: customDataT('srcSystem'), // 來源系統
            type: 'select',
            // 因為optionList的載入會有時間差，因此要丟Ref下去
            optionList: fc.fetchModel('customData').fetchRef('srcSystemOptionList', 'CustomDataPage'),
            loading: fc.fetchModel('customData').fetchRef('srcSystemOptionListLoading', 'CustomDataPage'),
        } */
    } else if (formItem.type === 'toggleSwitch') {
        itemContentDom = (
            <ToggleSwitchRow formItem={formItem} srcKey={srcKey}></ToggleSwitchRow>
        )
    } else if (formItem.type === 'inputButton') {
        itemContentDom = (
            <InputButtonRow formItem={formItem} srcKey={srcKey} />
        );
        /* {
            label: t('upperCategory'), // 上級分類
            type: 'inputButton', // 可輸入字串的按鈕
            buttonLabel: t('input'),
            inputText: '',
        } */
    } else if (formItem.type === 'dateTimePicker') {
        itemContentDom = (
            <DateTimePickerRow formItem={formItem} srcKey={srcKey} />
        );
    } else if (formItem.type === 'slot') {
        itemContentDom = formItem.slot;
    }

    let itemCommentDom;

    if (formItem.comment) {
        itemCommentDom = (
            <ItemCommentStyled>{formItem.comment}</ItemCommentStyled>
        )
    }


    // hide---------------------------------------

    let initHide = false;
    if (typeof formItem.hide === 'boolean') {
        initHide = formItem.hide;
    } else if (formItem.hide instanceof Ref) {
        initHide = formItem.hide.getValue();
    }
    const [hide, setHide] = useState(initHide);

    let actHide = setHide;
    if (formItem.hide instanceof Ref) {
        // console.log(`regist srcKey ${srcKey} setter`);
        actHide = formItem.hide.reactive(srcKey, actHide);
    }

    if (hide) {
        return (
            <div></div>
        );
    }

    return (
        <FormItemRowStyled>
            <ItemLabel label={formItem.label} srcKey={srcKey}></ItemLabel>
            {/* <div className="item-label">
                {formItem.label}
            </div> */}
            <div className="item-container">
                {itemContentDom}
                {itemCommentDom}
            </div>
        </FormItemRowStyled>
    )

    // return (
    //     <FormItemRowStyled>
    //         <div className="item-label">
    //             {formItem.label}
    //         </div>
    //         <div className="item-container">
    //             {itemContentDom}
    //             {itemCommentDom}
    //             {`${srcKey}`}
    //             {`${hide}`}
    //         </div>
    //     </FormItemRowStyled>
    // )
}

export default function FormModal({ modalRef, modalWidth = 700, modalHeight = 660,
    title = '', formItemList = [], footerSlot, srcKey = 'FormModal', formWidth }) {


    const formItemListDom = formItemList.map((formItem, index) => {
        /* formItem: {
            label: 'aaaaa',
        } */
        return (
            <FormItemRow formItem={formItem}
                key={`FormItemRow_${index}`} srcKey={`${srcKey}_FormItemRow_${index}`} />
        )
    });

    return (
        <Modal childRef={modalRef}
            modalWidth={modalWidth} modalHeight={modalHeight} >
            <FormModalStyled modalWidth={modalWidth} modalHeight={modalHeight}>
                <FormModalTitleRow>
                    {title}
                </FormModalTitleRow>
                <FormArea modalWidth={modalWidth} formWidth={formWidth}>
                    {formItemListDom}
                </FormArea>
                {footerSlot}
                {/* {children} */}
                {/* <FooterArea>
                    
                </FooterArea> */}
            </FormModalStyled>
        </Modal>
    );
}