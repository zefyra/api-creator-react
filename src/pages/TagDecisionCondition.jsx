/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { PageTitle } from "module/layout"
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from 'react';

import { ReactComponent as PlusSvg } from "assets/svg/br-plus.svg"
import { ReactComponent as TrashSvg } from "assets/svg/br-trash.svg"

import { useNavigate } from 'react-router-dom';
import { TagDecisionBlockFlow, TagDecisionConditionFlow } from 'flow/tag';
import { DecisionRowModel, TagDecisionBlockModel, TagDecisionConditionModel } from 'fragment/Tag';

import { useSelector, useDispatch } from 'react-redux';

import ThemeMixin, { fetchTheme } from 'util/ThemeMixin'
import { tagDecision as tagDecisionThemeObject } from 'theme/reas'
import { useUrlQuery } from 'util/UrlQuery';
import Select from 'component/Select';
import Button from 'component/Button';
import { t } from 'i18next';
import ArrayModel from 'element/TagDecisionCondition/ArrayModel';

import { tagDecision as tagDecisionObject } from "theme/reas"
import DecisionFiltEnum from 'enum/tag/DecisionFiltEnum';
import InputText from 'component/InputText';

const tagDecisionTheme = new ThemeMixin(tagDecisionObject);

const TagBlockBoardStyled = styled.div`
display: flex;
flex-direction: column;

margin-left: 1.5rem;
margin-right: 1.5rem;
margin-bottom: 1.5rem;

background-color: ${fetchTheme('board', '#cba165')};
border-radius: ${fetchTheme('boardRadius', '5px')};

padding: 1.5rem;

& .header-row {
    display: flex;
    flex-direction: row;
}

& .content-row {
    display: flex;
    flex-direction: row;

    margin-top: 1.5rem;

    & .content-aside {
        display: flex;
        flex-direction: column;

        width: 130px;
        flex-grow: 0;
    }

    & .content-main {
        display: flex;
        flex-direction: column;

        flex-grow: 1;

        & .button-icon {
            width: 1rem;
            height: 1rem;
        }
    }
}
`

const AddButtonBillboardStyled = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`

const DecisionBillboardStyled = styled.div`
/* display: flex;
flex-direction: column; */

& .decision-board {
    display: flex;
    flex-direction: column;
    
    margin: 0 0 1rem 1rem;
    &.tail {
        margin-bottom: 0;
    }

    background-color: ${fetchTheme('decisionBoard', '#FFFFFF')};
    border-radius: ${fetchTheme('boardRadius', '5px')};

    padding: 1rem;
    
    & .header-row {
        display: flex;
        flex-direction: row;

        justify-content: space-between;
        & .header-label {
            /* margin-left: 1rem;
            margin-top: 1rem; */
        }

        & .header-right-side {

        }
    }

    & .decision-content {
        display: flex;
        flex-direction: column;

        /* & .decision-header-row {
            display: flex;
            flex-direction: row;

            justify-content: space-between;
        } */
    }

}
    
`

const AddButtonBillboard = ({ index, onButtonClick, showMap = {} }) => {

    const { t } = useTranslation('tag', { keyPrefix: 'tagDecisionCondition' });

    let addTagFiltButtonDom;

    if (showMap[DecisionFiltEnum.tag]) {
        addTagFiltButtonDom = (
            <Button type="fill" mode="default" pattern="raw"
                onClick={onButtonClick(index, DecisionFiltEnum.tag)}>
                {/* <PlusSvg className="button-icon" fill={tagDecisionTheme.getTheme('addIcon', '#000000')}></PlusSvg> */}
                {t('addTagFilt')}
            </Button>
        )
    }
    let addFieldButtonDom;
    if (showMap[DecisionFiltEnum.field]) {
        addFieldButtonDom = (
            <Button type="fill" mode="default" pattern="raw"
                onClick={onButtonClick(index, DecisionFiltEnum.field)}
                importStyle={{
                    marginLeft: '30px',
                }}>
                {t('addFieldFilt')}
            </Button>
        )
    }

    return (
        <AddButtonBillboardStyled className="add-button-billboard">
            {addTagFiltButtonDom}
            {addFieldButtonDom}
        </AddButtonBillboardStyled>
    );
}


/*
const DecisionBillboardTag = ({ srcKey, docModel, model, type, title, index, isTail }) => {
    srcKey = srcKey || '';
    srcKey = `${srcKey}_DecisionBillboardTag`;

    return (
        <DecisionBillboardStyled theme={tagDecisionThemeObject}>
            <div className={`decision-board${isTail ? ' tail' : ''}`}>
                <div className="header-row">
                    <div className="header-label">
                        {title}{isTail}
                    </div>
                </div>
                <div className="header-row">
                    <div className="header-row">

                    </div>

                    <div className="header-row">

                    </div>
                </div>
            </div>
        </DecisionBillboardStyled>
    )
}

const DecisionBillboardField = ({ srcKey, docModel, model, type, title }) => {
    srcKey = srcKey || '';
    srcKey = `${srcKey}_DecisionBillboardField`;

    return (
    )
}
*/


const DecisionBillboardTemplate = ({ title, isTail, model, docModel, srcKey, decisionHeaderSlot, decisionMainSlot }) => {
    return (
        <DecisionBillboardStyled theme={tagDecisionThemeObject}>
            <div className={`decision-board${isTail ? ' tail' : ''}`}>
                <div className="header-row">
                    <div className="header-label">
                        {title}
                    </div>
                    <div className="header-right-side">

                    </div>
                </div>
                <div className="decision-content">
                    {decisionHeaderSlot}
                    {/* <DecisionHeaderRowStyled> */}
                    {decisionMainSlot}
                    {/* <DecisionMainStyled> */}
                </div>
            </div>
        </DecisionBillboardStyled>
    )
}

const DecisionHeaderRowStyled = styled.div`
display: flex;
flex-direction: row;

justify-content: space-between;
flex-wrap: wrap;

margin-bottom: 0.5rem;

    & .date-select-block {
        display: flex;
        flex-direction: row;
    }

`

const DecisionMainStyled = styled.div`
display: flex;
flex-direction: column;

    & .decision-row {
        display: flex;
        flex-direction: row;

        margin-bottom: 0.5rem;

        & .decision-row-container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            background-color: ${fetchTheme('decisionRow', '#FFFFFF')};
            border-radius: ${fetchTheme('boardRadius', '5px')};

            padding: 0.5rem 0.5rem;

            flex-grow: 1;

            & .trash-icon {
                width: 1.5rem;
                height: 1.5rem;
            } 

            & .decision-row-left-side {
                display: flex;
                flex-direction: row;
            }

            & .decision-row-right-side {
                
            }
        }
        & .decision-row-tail-block {
            display: flex;
            flex-direction: row;

            flex-grow: 0;

            padding-left: 1rem;

            justify-content: center;
            align-items: center;

            /* & .button-container {

                display: flex;
                flex-direction: row;

            } */
            
            & .plus-icon {
                width: 1rem;
                height: 1rem;
            }
        }
    }
`

const DecisionRow = ({ srcKey, model, decisionRowModel, index, arr, control }) => {
    if (!(model instanceof TagDecisionBlockModel)) {
        console.error(`DecisionRow: model is not TagDecisionBlockModel`, model);
        return (<div></div>)
    }
    if (!(control instanceof TagDecisionBlockFlow)) {
        console.error(`DecisionRow: control is not TagDecisionBlockFlow`, control);
        return (<div></div>)
    }
    if (!(decisionRowModel instanceof DecisionRowModel)) {
        console.error(`DecisionRow: decisionRowModel is not DecisionRowModel`, decisionRowModel);
        return (<div></div>)
    }

    const { t } = useTranslation('tag', { keyPrefix: 'tagDecisionCondition' })

    srcKey = `${srcKey}_DecisionRow_${index}`
    // const parentControl = model.getControl(); // <TagDecisionBlockFlow>

    const buttonImportStyle = { height: '2.3rem', fixHeight: '2.3rem', fixWidth: '2.3rem', marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0.5rem', paddingH: '0rem' };

    let trashButtonImportStyle = {
        height: '2.3rem', fixHeight: '2.3rem', fixWidth: '2.3rem', marginTop: '0', marginBottom: '0', marginLeft: '0', marginRight: '0', paddingH: '0rem',
        paddingV: '0.1rem'
    };

    const [conditionShow, setCondiionShow] = useState(decisionRowModel.getState('conditionShow'));
    const [addButtonShow, setAddButtonShow] = useState(decisionRowModel.getState('addButtonShow'));

    let actCondiionShow = decisionRowModel.reactive('conditionShow', srcKey, setCondiionShow);
    let actAddButtonShow = decisionRowModel.reactive('addButtonShow', srcKey, setAddButtonShow);

    useEffect(function () {
        decisionRowModel.clearSetter();

        actCondiionShow = decisionRowModel.reactive('conditionShow', srcKey, setCondiionShow);
        actAddButtonShow = decisionRowModel.reactive('addButtonShow', srcKey, setAddButtonShow);

        actCondiionShow(decisionRowModel.getState('conditionShow'))
        actAddButtonShow(decisionRowModel.getState('addButtonShow'))
    }, [decisionRowModel])


    let conditionDom;
    if (conditionShow) {
        conditionDom = (<div className="decision-row-container">
            <div className="decision-row-left-side">
                {/* 資料欄位 */}
                <Select value={decisionRowModel.fetchRef('fieldKey', `${srcKey}_decisionRow_${index}`)}
                    optionList={model.fetchRef('fieldFieldOptionList', srcKey)}
                    loading={model.fetchRef('fieldFieldOptionListLoading', srcKey)}
                    placeholder={t('dataField')}
                    srcKey={srcKey}
                    importStyle={{
                        width: '200px', marginRight: '10px',
                        height: 'auto', minHeight: '2.3rem'
                    }}
                />
                {/* `${srcKey}_fieldTimeField_Select_${index}` */}
            </div>
            <div className="decision-row-right-side">
                <Button type="fill" pattern="raw" mode="default"
                    importStyle={trashButtonImportStyle}
                    onClick={control.bindAct('onRemoveCondition', index)}
                >
                    <TrashSvg className="trash-icon" fill={tagDecisionTheme.getTheme('addIcon', '#000000')}></TrashSvg>
                </Button>
            </div>
        </div>);
    } else {
        conditionDom = (<div className="decision-row-container">
        </div>)
    }

    let plusButtonDom;

    if (addButtonShow) {
        plusButtonDom = (
            <div className="decision-row-tail-block">
                <Button type="fill" pattern="raw" mode="default"
                    importStyle={buttonImportStyle} onClick={control.bindAct('onAddCondition')}>
                    <PlusSvg className="plus-icon" fill={tagDecisionTheme.getTheme('addIcon', '#000000')}></PlusSvg>
                </Button>
            </div>
        );
    }

    // console.log(`render ${index}`, conditionShow, addButtonShow)

    return (
        <div className="decision-row" key={`decisionRow_${index}`}>
            {/* {`${srcKey}_condition_${index}`} */}
            {conditionDom}
            {plusButtonDom}
        </div>
    )
}

const RecordAmountRow = () => {

    const optionList = [{
        label: '==',
        value: 'eq'
    }, {
        label: '>=',
        value: 'gte'
    }]
    return (
        <div className="decision-row" key={`decisionRow_n`}>
            筆數
            <Select value=""
                optionList={optionList}
                placeholder={t('recordAmount')}
                importStyle={{
                    width: '200px', marginRight: '10px',
                    height: 'auto', minHeight: '2.3rem'
                }}
            />
            {/* 筆數數值 */}
            <InputText type="integer" value={5}
                importStyle={{ width: '60px', marginRight: '10px' }} baseValue={0}
            />
        </div>
    )
}


const DecisionMain = ({ srcKey, model, control, tagBlockModelList, type = 'dataField' }) => {
    if (!(control instanceof TagDecisionBlockFlow)) {
        console.error(`FieldBillboard: control is not TagDecisionBlockFlow`, control);
        return (<div></div>)
    }
    const decisionRowListModel = model.getState('decisionRowList');
    const [decisionRowList, setDecisionRowList] = useState(decisionRowListModel.getState('array'));
    decisionRowListModel.reactive('array', srcKey, setDecisionRowList);

    let decisionRowListDom;

    const getDecisionRowListDom = function () {
        if (type === 'dataField') {
            return decisionRowList.map((decisionRowModel, index, arr) => {
                return <DecisionRow key={`${srcKey}_DecisionRow_${index}`} srcKey={srcKey}
                    model={model} decisionRowModel={decisionRowModel} index={index}
                    arr={arr} control={control}></DecisionRow>
            });
        } else if (type === 'tag') {
            console.log('TagConditionRow')
            return decisionRowList.map((decisionRowModel, index, arr) => {
                return <TagConditionRow key={`${srcKey}_DecisionRow_${index}`} srcKey={srcKey}
                    model={model} decisionRowModel={decisionRowModel} index={index}
                    arr={arr} control={control}></TagConditionRow>
            });
        }
    }
    decisionRowListDom = getDecisionRowListDom();

    useEffect(function () {
        decisionRowListDom = getDecisionRowListDom();
    }, [decisionRowList])

    useEffect(function () {
        // 上層有增加新的標籤設定，要重新綁定
        // console.log(`tagBlockModelList change ggg`);

        const actDecisionRowList = decisionRowListModel.reactive('array', srcKey, setDecisionRowList);

        // console.log(`arr`, decisionRowListModel.getState('array'));

        actDecisionRowList(decisionRowListModel.getState('array'));

        // decisionRowListDom = getDecisionRowListDom();
    }, [tagBlockModelList])

    let recordAmountRowDom;

    if (type === 'dataField') {
        recordAmountRowDom = (
            <RecordAmountRow></RecordAmountRow>
        )
    }

    return (
        <DecisionMainStyled theme={tagDecisionThemeObject}>
            {decisionRowListDom}
            {recordAmountRowDom}
        </DecisionMainStyled>
    );
}




const TagConditionRow = () => {



    const tagOptionList = [{
        label: 'A標籤',
        value: 'atag'
    }, {
        label: 'B標籤',
        value: 'btag'
    }];

    const optionList = [{
        label: '==',
        value: 'eq'
    }, {
        label: '>=',
        value: 'gte'
    }];
    return (
        <div className="decision-row" key={`decisionRow_n`}>
            標籤
            <Select value=""
                optionList={tagOptionList}
                importStyle={{ width: '65px', marginRight: '10px' }}
            />
            <Select value=""
                optionList={optionList}
                placeholder={t('recordAmount')}
                importStyle={{
                    width: '200px', marginRight: '10px',
                    height: 'auto', minHeight: '2.3rem'
                }}
            />
            <InputText type="integer" value={5}
                importStyle={{ width: '60px', marginRight: '10px' }} baseValue={0}
                placeholder="數量"
            />
            筆
        </div>
    )
}

const TagBillboard = ({ srcKey, docModel, model, control, type, index, isTail, title, tagBlockModelList }) => {


    // if (type === DecisionFiltEnum.tag) {
    //     // decisionHeaderSlot = 
    // } else if (type === DecisionFiltEnum.field) {

    //     // console.log(`aaaaa`, model.fetchRef('fieldTimeFieldOptionList', srcKey).getValue());
    //     // optionList={model.fetchRef('fieldTimeFieldOptionList', srcKey)}
    // }


    const decisionHeaderSlot = (<DecisionHeaderRowStyled className="decision-header-row">
        {/* 匹配資料 */}
        <div></div>
        <div className="date-select-block">
            {/* 時間欄位 */}
            <Select value={model.fetchRef('fieldTimeField', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldOptionList', srcKey)}
                loading={model.fetchRef('fieldTimeFieldOptionListLoading', srcKey)}
                placeholder={t('timeField')}
                srcKey={`${srcKey}_fieldTimeField_Select`} importStyle={{ width: '200px', marginRight: '10px' }}
            />
            {/* 運算子 */}
            <Select value={model.fetchRef('fieldTimeFieldOperator', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldOperatorOptionList', srcKey)}
                srcKey={`${srcKey}_fieldTimeFieldOperator_Select`} importStyle={{ width: '65px', marginRight: '10px' }}
            />
            {/* 天/小時的數值 */}
            <InputText type="integer" value={model.fetchRef('fieldTimeFieldUnitValue', srcKey)}
                importStyle={{ width: '60px', marginRight: '10px' }} baseValue={0}
            />
            {/* 時間單位: 天/小時 */}
            <Select value={model.fetchRef('fieldTimeFieldUnitType', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldUnitTypeOptionList', srcKey)}
                srcKey={`${srcKey}_fieldTimeFieldOperator_Select`} importStyle={{ width: '100px' }}
            />
        </div>
    </DecisionHeaderRowStyled>)

    const decisionMainSlot = (
        <DecisionMain srcKey={srcKey} model={model} control={control} tagBlockModelList={tagBlockModelList}
            type="tag"></DecisionMain>
    )

    return (
        <DecisionBillboardTemplate title={title} isTail={isTail}
            model={model} docModel={docModel} srcKey={`${srcKey}_${type}`}
            decisionHeaderSlot={decisionHeaderSlot} decisionMainSlot={decisionMainSlot}
        ></DecisionBillboardTemplate>
    )
}

const FieldBillboard = ({ srcKey, docModel, model, control, type, index, isTail, title, tagBlockModelList }) => {
    if (!(control instanceof TagDecisionBlockFlow)) {
        console.error(`FieldBillboard: control is not TagDecisionBlockFlow`, control);
        return (<div></div>)
    }
    const { t } = useTranslation('tag', { keyPrefix: 'tagDecisionCondition' });

    const matchDataRef = model.fetchRef('matchData', srcKey);

    const [matchData, setMatchData] = useState(matchDataRef.getValue());
    matchDataRef.reactive(srcKey, function (val) {
        // console.log('aaa setMatchData', val)
        setMatchData(val);
    });

    // 由於matchData使用了雙向綁定，因此由Select底層對參數異動的時候，這邊就會感應到
    // 偵測當matchData改變時，要連帶載入fieldTimeFieldOptionList
    useEffect(function () {
        control.onMatchDataChanged(matchData);
    }, [matchData]);

    const decisionHeaderSlot = (<DecisionHeaderRowStyled className="decision-header-row">
        {/* 匹配資料 */}
        <Select value={matchDataRef} optionList={docModel.fetchRef('matchDataOptionList', srcKey)}
            loading={docModel.fetchRef('matchDataOptionListLoading', srcKey)}
            placeholder={t('matchData')} key={`${srcKey}_decisionHeaderSlot_1`} importStyle={{ width: '200px' }}
            srcKey={`${srcKey}_matchData_Select`}
        />
        <div className="date-select-block">
            {/* 時間欄位 */}
            <Select value={model.fetchRef('fieldTimeField', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldOptionList', srcKey)}
                loading={model.fetchRef('fieldTimeFieldOptionListLoading', srcKey)}
                placeholder={t('timeField')}
                srcKey={`${srcKey}_fieldTimeField_Select`} importStyle={{ width: '200px', marginRight: '10px' }}
            />
            {/* 運算子 */}
            <Select value={model.fetchRef('fieldTimeFieldOperator', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldOperatorOptionList', srcKey)}
                srcKey={`${srcKey}_fieldTimeFieldOperator_Select`} importStyle={{ width: '65px', marginRight: '10px' }}
            />
            {/* 天/小時的數值 */}
            <InputText type="integer" value={model.fetchRef('fieldTimeFieldUnitValue', srcKey)}
                importStyle={{ width: '60px', marginRight: '10px' }} baseValue={0}
            />
            {/* 時間單位: 天/小時 */}
            <Select value={model.fetchRef('fieldTimeFieldUnitType', srcKey)}
                optionList={model.fetchRef('fieldTimeFieldUnitTypeOptionList', srcKey)}
                srcKey={`${srcKey}_fieldTimeFieldOperator_Select`} importStyle={{ width: '100px' }}
            />
        </div>
    </DecisionHeaderRowStyled>)

    const decisionMainSlot = (
        <DecisionMain srcKey={srcKey} model={model} control={control} tagBlockModelList={tagBlockModelList}></DecisionMain>
    )

    useEffect(function () {
        console.log('tagBlockModelList change ddd', tagBlockModelList);
    }, [tagBlockModelList])


    return (
        <DecisionBillboardTemplate title={title} isTail={isTail}
            model={model} docModel={docModel} srcKey={`${srcKey}_${type}`}
            decisionHeaderSlot={decisionHeaderSlot} decisionMainSlot={decisionMainSlot}
        ></DecisionBillboardTemplate>
    )
}


const DecisionBillboard = ({ srcKey, docModel, model, type, index, isTail, control, tagBlockModelList }) => {
    if (!(control instanceof TagDecisionBlockFlow)) {
        console.error(`DecisionBillboard: control is not TagDecisionBlockFlow`, control);
        return (<div></div>)
    }
    // type: DecisionFiltEnum

    const getTitle = (type) => {
        // console.log('getTitle', type)
        if (type === DecisionFiltEnum.tag) {
            return t('tagCondition');
        }
        if (type === DecisionFiltEnum.field) {
            return t('fieldCondition');
        }
        return '';
    }

    // useEffect(function () {
    //     console.log('tagBlockModelList change ccc', tagBlockModelList);
    // }, [tagBlockModelList])


    if (type === DecisionFiltEnum.tag) {
        return (
            <TagBillboard srcKey={`${srcKey}_${type}`} type={type} model={model}
                docModel={docModel} control={control} index={index} isTail={isTail}
                title={getTitle(type)} tagBlockModelList={tagBlockModelList}></TagBillboard>
        );
    } else if (type === DecisionFiltEnum.field) {
        return (
            <FieldBillboard srcKey={`${srcKey}_${type}`} type={type} model={model}
                docModel={docModel} control={control} index={index} isTail={isTail}
                tagBlockModelList={tagBlockModelList}></FieldBillboard>
        );
    }

    console.error(`DecisionBillboard type not support`);

    return (<div></div>)
};

const TagDecisionBlock = ({ srcKey, docModel, model, control, tagBlockModelList }) => {
    if (!(control instanceof TagDecisionBlockFlow)) {
        console.error(`TagDecisionBlock: control is not TagDecisionBlockFlow`, control);
        return (<div></div>)
    }

    const logicOptionList = [{
        label: 'AND',
        value: 'and'
    }, {
        label: 'OR',
        value: 'or'
    }];

    // render state--------------------------------------------------------
    const [billboardShowList, setBillboardShowList] = useState([null, null]);


    // useEffect(function () {
    //     console.log('tagBlockModelList change', tagBlockModelList);
    // }, [tagBlockModelList])

    // model--------------------------------------------------------


    const [tagId, setTagId] = useState('');
    const [logic, setLogic] = useState('and');

    let actTagId = model.reactive('tagId', srcKey, setTagId);

    // 偵測到綁定的model有異動，要重新綁定參數
    useEffect(function () {
        // console.log('refresh model', model)
        // console.log(`rebind`, srcKey);

        // 要先清除原本的setterMap，再重新綁定，否則會連出現殘留的setter
        model.clearSetter();
        actTagId = model.reactive('tagId', srcKey, setTagId);
        actTagId(model.getState('tagId'));
    }, [model]);

    // event--------------------------------------------------------

    const onTagIdUpdate = () => val => {
        actTagId(val);
    }


    // render ---------------------------------------------------------

    const onAddBillboardClick = (billboardIndex, decisionFiltType) => () => {
        billboardShowList[billboardIndex] = decisionFiltType; // <DecisionFiltEnum>
        setBillboardShowList(billboardShowList.map(val => val));
    }
    const [billboardDomList, setBillboardDomList] = useState([]);

    const genAddButtonShowMap = function () {
        let showMap = {
            [DecisionFiltEnum.tag]: true,
            [DecisionFiltEnum.field]: true,
        }

        billboardShowList.forEach((showType) => {
            if (showType) {
                showMap[showType] = false; // 代表該類型已經存在，不會出現該類型的新增按鈕
            }
        });
        return showMap;
    }


    useEffect(function () {
        let showEnd = false;

        let newBillboardDomList = billboardShowList.map((showType, index) => {
            if (showEnd) {
                return undefined;
            }
            if (!showType) {
                showEnd = true;
                return (
                    <AddButtonBillboard key={`billboardDom_${index}`}
                        index={index} onButtonClick={onAddBillboardClick}
                        showMap={genAddButtonShowMap()}
                    ></AddButtonBillboard>
                );
            }
            return (
                <DecisionBillboard key={`billboardDom_${index}`} model={model} srcKey={srcKey}
                    type={showType} index={index} isTail={index === (billboardShowList.length - 1)}
                    docModel={docModel} control={control} tagBlockModelList={tagBlockModelList}></DecisionBillboard>
            )
        });

        setBillboardDomList(newBillboardDomList);
    }, [billboardShowList, tagBlockModelList]);

    return (
        <TagBlockBoardStyled theme={tagDecisionThemeObject} className="tag-block-board">
            <div className="header-row">
                <Select value={tagId} optionList={docModel.fetchRef('tagOptionList', srcKey)}
                    onUpdate={onTagIdUpdate()}
                    loading={docModel.fetchRef('tagOptionListLoading', srcKey)} />
            </div>
            <div className="content-row">
                <div className="content-aside">
                    <Select value={logic} optionList={logicOptionList}
                        onUpdate={val => setLogic(val)} importStyle={{ width: '120px' }} />
                </div>
                <div className="content-main">
                    {billboardDomList}
                </div>
            </div>
        </TagBlockBoardStyled>
    )
};

const TagDecisionDocumentStyled = styled.div`
display: flex;
flex-direction: column;

& .add-button-block {
    margin-left: 0.75rem;
    margin-bottom: 0.5rem;
}

`

const TagDecisionDocument = ({ fetchControl, control, model, arrayModel }) => { // 

    const { t } = useTranslation('tag', { keyPrefix: 'tagDecisionCondition' })

    const [tagBlockModelList, setTagBlockModelList] = useState([]);
    // arrayModel.registArraySetter(setTagBlockModelList);


    // const [tagArray, setTagArray] = useState(tagArrayModel.getState('array'));;
    // tagArrayModel.reactive('array', 'TagDecisionCondition', setTagArray)

    // arrayModel.registArraySetter('TagDecisionDocument', setTagBlockModelList);
    arrayModel.registSetter('array', 'TagDecisionDocument', setTagBlockModelList);

    // useEffect(function () {
    //     console.log('tagBlockModelList change', tagBlockModelList);
    // }, [tagBlockModelList])


    const biuldTagBlockListDom = function () {
        return tagBlockModelList.map((tagBlockModel, index) => {
            // tagBlockModel: <TagDecisionBlockModel>
            const srcKey = `TagDecisionBlock_${index}`;

            // console.log(`srcKey: ${srcKey}`)
            // const tagBlockModel = tagBlockEntity.getModel();
            const tagBlockControl = tagBlockModel.getControl();
            return (
                <TagDecisionBlock key={srcKey} srcKey={srcKey}
                    docModel={model} model={tagBlockModel}
                    control={tagBlockControl}
                    tagBlockModelList={tagBlockModelList}
                ></TagDecisionBlock>
            )
        });
    }

    let tagBlockListDom = biuldTagBlockListDom();
    useEffect(function () {
        tagBlockListDom = biuldTagBlockListDom();
    }, [tagBlockModelList]);

    // useEffect(function () {
    //     console.log('tagBlockModelList change', tagBlockModelList)
    // }, [tagBlockModelList]);


    return (
        <TagDecisionDocumentStyled className="tag-decision-document">
            <div className="add-button-block">
                <Button type="fill" mode="default" onClick={control.bindAct('onAddTagDecisionCondition')}>{t('add')}</Button>
            </div>
            {tagBlockListDom}
        </TagDecisionDocumentStyled>
    )
}


export default function TagDecisionCondition({ fetchControl }) {

    const { t: menuT } = useTranslation('menu');
    const { t: tagDecisionConditionT } = useTranslation('tag', { keyPrefix: 'tagDecisionCondition' });
    const { t: dataCollectionT } = useTranslation('dataCollection');

    const tagArrayModel = new ArrayModel(useRef([]));

    const tagDecisionConditionModel = new TagDecisionConditionModel(useRef(null), {
        tagDecisionConditionT: tagDecisionConditionT,
        dataCollectionT: dataCollectionT,
    });
    const tagDecisionConditionFlow = new TagDecisionConditionFlow(tagDecisionConditionModel, tagArrayModel);


    const urlQuery = useUrlQuery();



    useEffect(function () {
        // 初始化tagBlockList
        tagDecisionConditionFlow.onTagDecisionConditionPageMount(urlQuery.get());
    }, [])


    return (
        <PageTitle title={menuT('social.tagDecisionCondition')}>
            <TagDecisionDocument fetchControl={fetchControl}
                control={tagDecisionConditionFlow}
                model={tagDecisionConditionModel}
                arrayModel={tagArrayModel}></TagDecisionDocument>
        </PageTitle>
    )
}
