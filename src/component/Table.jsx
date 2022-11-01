/** @jsxImportSource @emotion/react */
import { jsx } from '@emotion/react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

// import styled from "styled-components";

import { useState, useEffect, useRef } from 'react';

// import CellFilter from "filter/CellFilter"
import Filter from "filter/Filter"

import CheckBox from "component/CheckBox"
import ToggleSwitch from 'component/ToggleSwitch';
import RenderOnce from 'util/RenderOnce';
import LayoutMixin from 'util/LayoutMixin'

import TableHeaderSelect from 'component/TableHeaderSelect';
import Pagination from 'component/Pagination';
import Button from 'component/Button'
import InputText from 'component/InputText'

import CircularProgress from '@mui/material/CircularProgress';

import { select as themeObject, table as tableThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
import { fetchTheme as getTheme } from 'util/ThemeMixin'

import { ReactComponent as SettingSlidersSvg } from 'assets/svg/settings-sliders.svg'
import { ReactComponent as EditIconSvg } from 'assets/svg/rr-edit.svg'
import { ReactComponent as CheckBoxIconSvg } from 'assets/svg/br-checkbox.svg'
import { ReactComponent as CancelIconSvg } from 'assets/svg/rr-cross-circle.svg'

import CellFilter from 'filter/CellFilter';
import CellInfo from 'util/CellInfo';
import TableData from 'util/TableData';
import LayerMixin from 'util/LayerMixin';

import uniqid from 'uniqid';
import Ref from 'model/Ref';
import { TableSelectModeEnum } from 'enum/Table';
import TableHeader from 'util/TableHeader';

const tableTheme = new ThemeMixin(tableThemeObject);





// const getTheme = ThemeMixin.fetchGetTheme();


const TableHeaderBlock = ({ header, showColMap, upperHeaderMap }) => {

    // console.log('header', header)
    /* header :[{
            label: '',
            key: 'checkBox',
            type: 'checkBox',
        }, {
            label: '用戶名稱',
            key: 'userName',
            type: 'text',
        }, {
            label: '子帳號數',
            key: 'subUserNum',
            type: 'text',
        }, {
            key: 'bindUserNum',
            label: '已綁定用戶數',
            type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        }, {
            label: 'LINE@', // 已綁定用戶數 - LINE@
            key: 'lineAtUserNum',
            type: 'text',
            upperHeaderRef: 'bindUserNum', // 指定上層的欄位
        }, {
            label: '開通/停用',
            key: 'accountEnable',
            type: '',
        }, {
            label: '操作',
            key: 'action',
            type: 'buttonColumn',
        }]
        */

    // 1.先確認是否有upperHeader存在，決定要生成2列還是1列
    const upperHeaderExist = header.upperHeader ? Object.keys(header.upperHeader).length !== 0 : false;

    /* -->移至上層
    // 生成upperHeaderMap
    let upperHeaderMap;
    if (upperHeaderExist) {
        upperHeaderMap = new Map();
        Object.keys(header.upperHeader).forEach((key) => {
            const upperHeaderItem = Object.assign({}, header.upperHeader[key]);
            upperHeaderItem.key = key; // 自動補上key

            let subHeaderColIndexList = [];
            // 自動計算出底下有幾個header
            const lowerHeaderList = header.header.filter((subItem, colIndex) => {
                if (upperHeaderItem.key === subItem.upperHeaderRef) {
                    subHeaderColIndexList.push(colIndex);
                    return true;
                }
                return false;
            });
            upperHeaderItem.subHeaderNum = lowerHeaderList.length;
            upperHeaderItem.lowerHeaderList = lowerHeaderList;
            upperHeaderItem.subHeaderColIndexList = subHeaderColIndexList;

            upperHeaderMap.set(upperHeaderItem.key, upperHeaderItem);
        });
    }
    */

    /*
    upperHeader: {
        bindUserNum: { // <key>
            label: '已綁定用戶數',
            type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
        },
    },
    ====>
    upperHeaderMap: {
        bindUserNum: {
            key: 'bindUserNum',
            label: '已綁定用戶數',
            type: 'upperHeader'// 這個欄位會是上層header，不會被算做資料欄
            subHeaderNum: 3,
            lowerHeaderList: [{
                label: 'LINE@', // 已綁定用戶數 - LINE@
                key: 'lineAtUserNum',
                type: 'text',
                upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            }, {
                label: 'FB',
                key: 'fbUserNum',
                type: 'text',
                upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            }, {
                label: 'IG',
                key: 'igUserNum',
                type: 'text',
                upperHeaderRef: 'bindUserNum', // 指定上層的欄位
            }],
            subHeaderColIndexList: [7, 8, 9],
        },
    }
    */


    // return (<thead>
    //     <tr>
    //         <th colSpan="2">Month</th>
    //         <th rowSpan="2">Savings for holiday!</th>
    //         <th rowSpan="2">Savings</th>
    //     </tr>
    //     <tr>
    //         <th>Month</th>
    //         <th>Savings</th>
    //     </tr>
    // </thead>);

    let upperHeaderList = [];
    let hedderList = [];


    const getThClassName = (thType, colIndex, colLen) => {
        // console.log('getThClassName', thType, colIndex, colLen)

        let classNameStr = '';
        if (thType === 'up') {
            classNameStr += 'th-top ';
        }
        if (thType === 'down') {
            classNameStr += 'th-bottom ';
        }

        if (thType === 'single') {
            classNameStr += 'th-top th-bottom ';
        }
        if (colIndex === 0) {
            classNameStr += 'th-start ';
        }
        if ((colIndex + 1) === colLen) {
            classNameStr += 'th-end ';
        }
        return classNameStr;
    }

    if (upperHeaderExist) {

        header.header.forEach((headerItem, colIndex, colArr) => {
            if (headerItem.upperHeaderRef) {
                // 代表是下層的headerItem

                let showCol = showColMap[colIndex].showCol;

                // 取得上層header
                const upperHeaderItem = upperHeaderMap.get(headerItem.upperHeaderRef);
                // console.log(`get ${headerItem.upperHeaderRef}:`, upperHeaderItem)

                if (upperHeaderItem) {
                    // 有取到，代表上層還未塞過

                    // 處理上層感測連動---------------------------------------------------

                    // 顯示連動
                    // 1.若下層裡，3個有其中一個是關著的，span要自動變成2
                    // 2.若下層全關了，display才可以是none

                    // ===>已由上層做掉

                    // ---------------------------------------------------

                    // 上層塞一個肥的
                    // colSpan={upperHeaderItem.subHeaderNum}
                    upperHeaderList.push(
                        (<th style={{
                            display: upperHeaderItem.showUpperCol ? 'table-cell' : 'none',
                        }} className={getThClassName('up', colIndex, colArr.length)}
                            key={upperHeaderItem.key}
                            colSpan={upperHeaderItem.upperColSpan}>
                            {upperHeaderItem.label}
                        </th>)
                    );

                    // 刪除項目，代表已經完成   
                    upperHeaderMap.delete(headerItem.upperHeaderRef);
                }  // else 代表已塞過，不必塞上層

                // 塞下層
                hedderList.push(
                    (<th style={{
                        display: showCol ? 'table-cell' : 'none',
                        minWidth: headerItem.width ? headerItem.width : undefined,
                    }} className={getThClassName('down', colIndex, colArr.length)} key={headerItem.key}>{headerItem.label}</th>)
                )
            } else {
                // 代表是一般的獨立欄位header

                // console.log('cccc', getThClassName('single', colIndex, colArr.length))
                // console.log(`showColMap[${colIndex}]`, showColMap)

                let showCol = showColMap[colIndex].showCol;

                // 上層塞一個高的
                upperHeaderList.push(
                    (<th style={{
                        display: showCol ? 'table-cell' : 'none',
                        minWidth: headerItem.width ? headerItem.width : undefined,
                    }} className={getThClassName('single', colIndex, colArr.length)} rowSpan="2" key={headerItem.key} >{headerItem.label}</th>)
                );
                // 下層不用塞，因為上層會佔據下層的空間
            }
        });
    } else {
        header.header.forEach((headerItem, colIndex, colArr) => {

            let showCol = showColMap[colIndex].showCol;

            // 全塞下層
            hedderList.push(
                (<th style={{
                    display: showCol ? 'table-cell' : 'none',
                    minWidth: headerItem.width ? headerItem.width : undefined,
                }} className={getThClassName('single', colIndex, colArr.length)} key={headerItem.key}>{headerItem.label}</th>)
            )
        });
    }

    let theadTemplate;
    if (upperHeaderExist) {
        theadTemplate = (
            <thead>
                <tr>
                    {upperHeaderList}
                </tr>
                <tr>
                    {hedderList}
                </tr>
            </thead>
        );
    } else {
        theadTemplate = (
            <thead>
                <tr>
                    {hedderList}
                </tr>
            </thead>
        )
    }

    return (
        theadTemplate
    )


}

const TdTextEditable = ({ tdStyle, tdClassName, row, rowIndex, headerItem, colIndex, outText, onEdit, cellInfo }) => {

    const [showInput, setShowInput] = useState(false);

    const [tdValueOrigin, setTdValueOrigin] = useState(row[headerItem.key]);
    const [tdValue, setTdValue] = useState(row[headerItem.key]);

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    };

    const onClickEdit = () => e => {
        e.stopPropagation();

        setShowInput(true);
    }

    const callEditEvent = function () {
        // console.log(`callEditEvent`, tdValueOrigin, tdValue);
        if (tdValueOrigin !== tdValue) {
            if (onEdit) {
                // setTdValueOrigin(tdValue); // 不用更新origin，上層會自動刷新
                // onEdit(tdValue, headerItem.key, rowIndex);
                onEdit(tdValue, cellInfo);
            }
        }
    }

    const onClickOk = () => e => {
        // console.log('onClickOk')
        e.stopPropagation();
        callEditEvent();
        setShowInput(false);
    }

    const onClickCancel = () => e => {
        e.stopPropagation();
        // callEditEvent();
        setShowInput(false);
    }



    // const onTextInputBlur = () => () => {
    //     // console.log('onTextInputBlur');

    //     callEditEvent();
    //     setShowInput(false);
    // }
    // onBlur={onTextInputBlur()}

    // tdStyle = Object.assign(tdStyle, {
    //     display: 'inline-table',
    // })

    return (<td style={tdStyle} className={`${tdClassName}editable`}>
        <div style={{
            display: !showInput ? 'inline-block' : 'none',
        }} onClick={blockBubble()}>{outText}</div>
        <EditIconSvg style={{
            display: !showInput ? 'inline-block' : 'none',
        }} className="td-editable-icon" fill="#d8e3df" onClick={onClickEdit()} />
        <CancelIconSvg style={{
            display: showInput ? 'inline-block' : 'none',
        }} className="td-cancel-icon" fill="#d8e3df" onClick={onClickCancel()} />
        <InputText type="tableCancel" style={{
            display: showInput ? 'inline-block' : 'none',
        }} pattern="tableCell" value={tdValue} onUpdate={setTdValue}
            onClick={blockBubble()} onEnter={onClickOk()}></InputText>
        <CheckBoxIconSvg style={{
            display: showInput ? 'inline-block' : 'none',
        }} className="td-checked-icon" fill="#d8e3df" onClick={onClickOk()} />
    </td>)
}

const TdText = ({ tdStyle, tdClassName, row, rowIndex, headerItem, colIndex, onTdEdit, cellInfo }) => {
    // let outText = row[headerItem.key];

    // if (headerItem.filter) {

    //     if (headerItem.filter instanceof Filter) {
    //         // 代表是Filter物件，直接執行該物件
    //         outText = headerItem.filter.filt(outText, row, colIndex);
    //     } else {
    //         // 直接用準備好的filter函式過濾
    //         outText = headerItem.filter(outText, row, colIndex);
    //     }
    // }

    let outText = row[headerItem.key];
    outText = CellFilter.transformCell(headerItem, row, outText);
    outText = CellFilter.filtCell(headerItem, row, outText);

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    };

    const openUrlLink = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();

        // console.log(`openUrlLink: ${headerItem.linkHeaderRef}`, row)

        let linkUrl;
        if (headerItem.linkHeaderRef) {
            linkUrl = row[headerItem.linkHeaderRef];
        }
        if (linkUrl) {// 開新視窗
            window.open(linkUrl, '_blank');
        } else {
            console.error('linkUrl get fail');
        }
    };

    // 將不合法的outText資料格式過濾掉
    if (typeof outText === 'object') {
        if (outText) {
            console.error(`outText invalid: value of header ${headerItem.key} is object`, outText)
            outText = '{}';
        }
    }

    if (headerItem.textType === 'urlLink') {
        return (<td style={tdStyle} className={`${tdClassName}url-link`}>
            <div onClick={openUrlLink()}>{outText}</div>
        </td>)
    }

    // if (headerItem.editable) {
    if (headerItem.textType === 'editable') {
        // 代表該欄位可編輯
        return (<TdTextEditable tdStyle={tdStyle} tdClassName={tdClassName} row={row} rowIndex={rowIndex}
            headerItem={headerItem} colIndex={colIndex} outText={outText} onEdit={onTdEdit} cellInfo={cellInfo}></TdTextEditable>)
    }

    return (<td style={tdStyle} className={tdClassName}>
        <div onClick={blockBubble()}>{outText}</div>
    </td>)
}

// 舊版
const TdCheckBoxOld = ({ tdStyle, className, value, onUpdate, onClick, disabled, onCheckedUpdate }) => {

    // useEffect(function () {
    //     console.log(`TdCheckBox value changed`, value);
    // }, [value]);

    const handleUpdate = () => value => {
        // console.log('TdCheckBox handleUpdate', value);

        if (onUpdate) {
            onUpdate(value);
        }
    }

    return (
        <td style={tdStyle} className={className}>
            <div className="td-container">
                <CheckBox type="table" value={value} onUpdate={handleUpdate()} onClick={onClick} disabled={disabled} />
            </div>
        </td>
    )
}

const TdCheckBox = ({ tdStyle, className, cellInfo, checkMapMap, onCheckedChange,
    tableData, header }) => {

    const defaultDisabled = false;
    const defaultChecked = cellInfo.getRowChecked();

    const headerItem = cellInfo.getHeaderItem();
    const rowIndex = cellInfo.getRowIndex();
    const row = cellInfo.getRow();

    // 自動取得checkMap(若沒有，則自動生成)
    let checkMap = checkMapMap.autoGetCheckMap(headerItem.key);

    // 自動生成checkBox用的state參數
    const [checked, setChecked] = useState(defaultChecked);

    // 當tableData改變時，檢查該列的選取參數，更新到checked參數內
    useEffect(function () {
        const row = tableData.getRow(rowIndex);

        if (!row) {
            // console.error(`TdCheckBox: rowIndex not exist`, rowIndex, row);
            return;
        }

        // console.log(`chb tableData changed, [${rowIndex}] ->`, row.__rowSelect);
        setChecked(row.__rowSelect === true);
    }, [tableData])

    // 生成checkBox的disabled
    const [disabled, setDisabled] = useState(defaultDisabled);






    checkMap.set(rowIndex, { // 將參數註冊進去
        checked: checked,
        setChecked: (() => { }), // setCheckedFunc,
        disabled: disabled,
        setDisabled,
    });

    // ----------------------------------------------------------

    const value = checked;

    const handleUpdate = () => value => {
        setChecked(value);

        // 暫時處理: 將這次異動要勾起的項目，直接設定數值，預測最後輸出的參數
        const cm = new CellMap(checkMap, tableData, headerItem);
        cm.setIndexChecked(rowIndex, value);

        if (onCheckedChange) {
            onCheckedChange(value,
                new CellInfo(headerItem, row, rowIndex), cm);
        }
    }

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    };

    return (
        <td style={tdStyle} className={className}>
            <div className="td-container">
                <CheckBox type="table" value={value} onUpdate={handleUpdate()}
                    onClick={blockBubble()} disabled={disabled} />
            </div>
        </td>
    )
}

const TdToggleSwitch = ({ tdStyle, cellInfo, tdClassName, value, onUpdate, onCheckedUpdate }) => {

    const onTogggleUpdate = () => value => {
        if (onUpdate) {
            onUpdate(value);
        }
        if (onCheckedUpdate) {
            onCheckedUpdate(value);
        }
    }

    const headerItem = cellInfo.getHeaderItem();

    const row = cellInfo.getRow();

    const rowIndex = cellInfo.getRowIndex();

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    };

    return (<td style={tdStyle} className={tdClassName}>
        <ToggleSwitch value={value} onUpdate={onTogggleUpdate()} onClick={blockBubble()} />
    </td>);
}


const TableRow = ({ rowIndex, row, rowHoverIndex, setRowHoverIndex, header,
    onCheckedChange, headerItemList, rowArr, showColMap,
    checkMapMap, trMouseLeaveTimeoutRef, onButtonClick, onTdEdit, onImageClick,
    tableData }) => {

    // 當checked狀態改變時
    function onCheckedUpdate(value) {
        const { headerItem, row, rowIndex, checkMap } = this;

        // 暫時處理: 將這次異動要勾起的項目，直接設定數值，預測最後輸出的參數
        // ps.目前尚未使用MVVM模式，來輸出異動後的參數
        const cm = new CellMap(checkMap, tableData, headerItem);
        cm.setIndexChecked(rowIndex, value);

        console.log('cm', cm)

        if (onCheckedChange) {
            onCheckedChange(value,
                new CellInfo(headerItem, row, rowIndex)); // , cm
        }

        /*
        // 暫時處理: 由於這時候所有checked還沒刷新，因此要先停一下
        setTimeout(function () {
            const cm = new CellMap(checkMap, tableData, headerItem)
            // console.log('cm', cm)
            if (onCheckedChange) {
                onCheckedChange(value, new CellInfo(headerItem, row, rowIndex),
                    cm);
            }
        }, 500);
        */
    }

    let rowSelectChecked = false;


    function getTdClassName(colIndex, colLen, rowIndex, rowLen, headerItemType) {

        let classNameStr = '';

        if (rowHoverIndex === rowIndex) {
            classNameStr += 'row-hover ';
        }
        if (rowSelectChecked) {
            classNameStr += 'row-select ';
        }
        if (rowIndex === 0) {
            classNameStr += 'tr-start ';
        } else if ((rowIndex + 1) === rowLen) {
            classNameStr += 'tr-end ';
        }

        // 原本表格不會變動的版本
        if (colIndex === 0) {
            classNameStr += 'td-start ';
        } else if ((colIndex + 1) === colLen) {
            classNameStr += 'td-end ';
        }

        if (headerItemType === 'text') {
            classNameStr += 'td-text ';
        } else if (headerItemType === 'checkBox') {
            classNameStr += 'td-checkbox ';
        } else if (headerItemType === 'toggleSwitch') {
            classNameStr += 'td-toggle-switch ';
        } else if (headerItemType === 'buttonColumn') {
            classNameStr += 'td-button-column ';
        } else {
            classNameStr += 'td-blank ';
        }

        return classNameStr;
    }


    // 點選該列非文字部分，代表選取該列
    const onRowClick = (row, rowIndex, onCheckedUpdate) => () => {
        if (!header.checkRowSelectEnable()) {
            // 代表沒有設定勾選欄，點選列不需要有反應
            return;
        }


        // 列點擊時，會自動抓'_rowSelect'欄位的checkMap來操作
        let rowSelectCheckMap = checkMapMap.getDefaultRowSelectCheckMap();

        if (rowSelectCheckMap.getRowDisabled(rowIndex)) {
            return; // 代表項目已鎖定，不動作
        }

        const newChecked = !rowSelectCheckMap.getRowChecked(rowIndex);
        rowSelectCheckMap.setRowChecked(rowIndex, newChecked);

        // 呼叫上層事件
        if (onCheckedUpdate) {
            onCheckedUpdate(newChecked);
        }
    }

    const handleTrHover = (type, rowIndex) => () => {

        if (type === 'enter') {
            setRowHoverIndex(rowIndex);

            if (trMouseLeaveTimeoutRef.current) {
                clearTimeout(trMouseLeaveTimeoutRef.current);
                trMouseLeaveTimeoutRef.current = null;
            }
        } else if (type === 'leave') {

            if (trMouseLeaveTimeoutRef.current) {
                return;
            }

            function handleTrHoverTimeout(rowIndex) {
                setRowHoverIndex(-1)
                trMouseLeaveTimeoutRef.current = null;
            }

            let timeoutCallback;

            timeoutCallback = handleTrHoverTimeout.bind(null, rowIndex);
            trMouseLeaveTimeoutRef.current = setTimeout(timeoutCallback, 70)
        }
    }


    // 建構所有col----------------------------------------------------------

    let colList = [];

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    };

    const genCheckedState = (headerItem, row, rowIndex, defaultChecked = false, defaultDisabled = false) => {
        // console.log('genCheckedState defaultChecked', defaultChecked)

        // 自動取得checkMap(若沒有，則自動生成)
        let checkMap = checkMapMap.autoGetCheckMap(headerItem.key);

        // 自動生成checkBox用的state參數
        const [checked, setChecked] = useState(defaultChecked);

        // 生成checkBox的disabled
        const [disabled, setDisabled] = useState(defaultDisabled);

        function handleSetChecked(headerItem, checkMap, setChecked, rowIndex, val) {
            // console.log(`setCheckedFunc [${rowIndex}]:`, val);

            if (headerItem.selectMode === TableSelectModeEnum.single) { // 單選模式

                checkMap.excludeSetDisabled(rowIndex, val); // 選取=>鎖定其他的；取消=>其他都解鎖
                setChecked(val);
            } else { // 多選模式
                setChecked(val);
            }
        }

        const setCheckedFunc = handleSetChecked.bind(null, headerItem, checkMap, setChecked, rowIndex);

        // checkMap[rowIndex] = { // 將參數註冊進去
        //     checked: checked,
        //     setChecked: setCheckedFunc,
        //     disabled: disabled,
        //     setDisabled,
        // };
        checkMap.set(rowIndex, { // 將參數註冊進去
            checked: checked,
            setChecked: setCheckedFunc,
            disabled: disabled,
            setDisabled,
        });

        // const mountCounterRef = useRef(0);

        // 綁定感測器
        // useEffect(onCheckedUpdate(mountCounterRef, headerItem, row, rowIndex, checked, checkMap), [checked]);

        const checkedUpdateFunc = onCheckedUpdate.bind({
            headerItem, row, rowIndex, checkMap
        });

        return [checked, setCheckedFunc, disabled, setDisabled, checkedUpdateFunc]; // setRerenderChecked
    }

    const handleButtonClick = (buttonItem, cellInfo) => e => {
        e.stopPropagation();

        if (!onButtonClick) {
            return;
        }
        onButtonClick(buttonItem.event, cellInfo);
    }


    // 生出一個__rowSelct 的 checkedUpdateFunc------------------------------

    const defaultRowSelectHeaderItem = header.getDefaultRowSelectHeaderItem();
    let rowSelectCheckedUpdateFunc;

    if (defaultRowSelectHeaderItem) {
        let rowSelectCheckMap = checkMapMap.autoGetCheckMap('__rowSelect');
        rowSelectCheckedUpdateFunc = onCheckedUpdate.bind({
            headerItem: defaultRowSelectHeaderItem, row, rowIndex, checkMap: rowSelectCheckMap
        });
    }

    // ----------------------------------------------------------------

    // 跑每一個欄位
    headerItemList.forEach((headerItem, colIndex, colArr) => {

        const tdClassNameGenFunc = getTdClassName.bind(null, colIndex, colArr.length, rowIndex, rowArr.length, headerItem.type);

        let showCol = showColMap[colIndex].showCol;
        let tdStyle = {
            display: showCol ? 'table-cell' : 'none',
        };

        let cellInfo = new CellInfo(headerItem, row, rowIndex, colIndex);

        // console.log(`build header cellInfo , row`, row)

        // 載入style相關參數----------------------------

        if (headerItem.width) {
            tdStyle.minWidth = headerItem.width;
        }

        if (headerItem.type === 'text') {
            colList.push(
                <TdText tdStyle={tdStyle} tdClassName={tdClassNameGenFunc()}
                    key={`row_${rowIndex}_col_${colIndex}`} row={row} rowIndex={rowIndex} headerItem={headerItem}
                    colIndex={colIndex} onTdEdit={onTdEdit} cellInfo={cellInfo}
                ></TdText>
            );
        } else if (headerItem.type === 'checkBox') {
            colList.push(
                (<TdCheckBox key={`row_${rowIndex}_col_${colIndex}`}
                    tdStyle={tdStyle} className={tdClassNameGenFunc()}
                    cellInfo={cellInfo} checkMapMap={checkMapMap}
                    onCheckedChange={onCheckedChange} tableData={tableData}
                    header={header}
                />)
            );
        } else if (headerItem.type === 'img') {

            const imgUrl = row[headerItem.key];

            const onImgClick = cellInfo => e => {
                e.stopPropagation(); // 防止泡泡事件
                if (headerItem.clickable) {
                    if (onImageClick) {
                        onImageClick(cellInfo);
                    }
                }
            }

            colList.push(
                (<td style={tdStyle} className={tdClassNameGenFunc()} key={`row_${rowIndex}_col_${colIndex}`}>
                    <img style={headerItem.imgStyle} src={imgUrl} alt="td_img"
                        className={headerItem.clickable ? 'image-link' : ''}
                        onClick={onImgClick(cellInfo)}
                    ></img>
                </td>)
            );
        } else if (headerItem.type === 'toggleSwitch') {

            const [checked, setChecked, disabled, setDisabled, checkedUpdateFunc] = genCheckedState(headerItem, row, rowIndex, cellInfo.getCellValue());

            colList.push(
                (<TdToggleSwitch key={`row_${rowIndex}_col_${colIndex}`}
                    tdStyle={tdStyle} cellInfo={cellInfo}
                    tdClassName={tdClassNameGenFunc()}
                    value={checked}
                    onUpdate={setChecked}
                    onCheckedUpdate={checkedUpdateFunc}
                />)
            );
        } else if (headerItem.type === 'buttonColumn') {
            /* buttonColumn: { // in header
                action: { // buttonColumnConfig
                    buttonItemList: [{ // buttonItem
                        type: 'button',
                        label: t('bindedUserNum'), // '編輯',
                        event: 'edit',
                        buttonType: 'fill',
                        buttonMode: 'primary',
                        buttonPattern: 'table',
                        visibleChecker: function (rowData) {
                            return true;
                        },
                    }, {
                        type: 'button',
                        label: t('bindedUserNum'), // '模組',
                        event: 'module',
                        buttonType: 'fill',
                        buttonMode: 'primary',
                        buttonPattern: 'table',
                    }],
                }
            }, */

            let buttonItemList;
            let buttonColumnConfig;
            let btnList = [];

            if (header.buttonColumn) {
                if (header.buttonColumn[headerItem.key]) {
                    buttonColumnConfig = header.buttonColumn[headerItem.key];

                    buttonItemList = buttonColumnConfig.buttonItemList.map(item => (item));
                }
            }

            if (buttonItemList) {
                buttonItemList.forEach((buttonItem, index) => {
                    btnList.push(
                        (
                            <Button key={`buttonColumn_${rowIndex}_${index}`} type={buttonItem.buttonType} mode={buttonItem.buttonMode}
                                pattern={buttonItem.buttonPattern}
                                onClick={handleButtonClick(buttonItem, cellInfo)}>
                                {buttonItem.label}
                            </Button>
                        )
                    );
                })
            }

            colList.push(
                (<td style={tdStyle} className={tdClassNameGenFunc()} key={`row_${rowIndex}_col_${colIndex}`}>
                    {btnList}
                </td>)
            );
        } else {
            // 無法辨識type，空一格
            colList.push(
                (<td style={tdStyle} className={tdClassNameGenFunc()} key={`row_${rowIndex}_col_${colIndex}`}></td>)
            );
        }
    })



    return (<tr onClick={onRowClick(row, rowIndex, rowSelectCheckedUpdateFunc)}
        onMouseEnter={handleTrHover('enter', rowIndex)}
        onMouseLeave={handleTrHover('leave', rowIndex)}
    >
        {colList}
    </tr>);
}




// 輸出用onCheckedChange的介面

// 現在的constructor為暫定，未來若要把CheckMap拔掉，則還要改
class CellMap {
    cellList = [];
    length = 0;
    constructor(checkMapObj, tableData, headerItem) {
        if (!(checkMapObj instanceof CheckMap)) {
            console.error(`CheckCellMap: obj is not CheckMap`);
            return
        }
        if (!(tableData instanceof TableData)) {
            console.error(`CheckCellMap: tableData is not TableData`);
            return
        }
        // <CheckMap> constructor: 跑每一列的checked狀態
        this.length = checkMapObj.length;
        this.cellList = checkMapObj.map((checkObj, i) => {
            // console.log(`checkMapObj[${i}]`, checkObj);
            // checkObj: {
            //     checked: true,
            //     disabled: false,
            //     setChecked: f()
            //     setDisabled: f()
            // }
            const row = tableData.getRow(i);
            if (!row) {
                console.error('CellMap: row not exist')
                return null;
            }
            // console.log(`i[${i}]`, checkObj.checked)
            return new CellInfo(headerItem, row, i, null, checkObj.checked);
        });
    }
    setIndexChecked(rowIndex, checked) {
        const cellInfoObj = this.get(rowIndex);
        cellInfoObj.setRowChecked(checked);
    }
    [Symbol.iterator]() {
        let index = -1;
        let data = this.cellList;

        return {
            next: () => ({ value: data[++index], done: !(index in data) })
        };
    }

    get(i) {
        return this.cellList[i];
    }
    set(i) {
        return this.cellList[i];
    }
    // getCellList() {
    //     return this.cellList;
    // }

}


class CheckMap {
    // checkObjMap = {};
    // checkObjMap = new Map();

    /* class Iterator
    _data = {};

    constructor() {
        this._data = [1, 2, 3, 4];
    }

    [Symbol.iterator]() {
        var index = -1;
        var data = this._data;

        return {
            next: () => ({ value: data[++index], done: !(index in data) })
        };
    };
    */
    checkObjMap = {};
    /* {
        0: ..
        1: ..
    } */
    length = 0;
    [Symbol.iterator]() {
        let index = -1;
        let data = this.checkObjMap;

        // return {
        //     next: () => ({ value: data[++index], done: !(index in data) })
        // };


        return {
            next: function () {
                // console.log('export', data[index + 1]);
                // console.log(`next`, index);
                // console.log(`done`, !(index in data));
                // ps.由於index++會導致index先被丟進data，才執行+1，因此++要放前面
                // (index in data) 代表的是「檢查index是否為data的key」，可使用在array或是object上
                return { value: data[++index], done: !(index in data) };
            }
        };
    };

    /*
    checkObjMap = {
        data: {},
        length: 0,
        [Symbol.iterator]: function () {
            const self = this;
            const length = Object.keys(self.data).length;

            let index = 0;
            return {
                next: function () {
                    if (index < length) {
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    }
                    return { value: undefined, done: true };
                }
            }
        },
        set(key, val) {
            this.data[key] = val;
        },
        get(key) {
            return this.data[key];
        }
    }
    */
    /* 物件型迭代器
    testMap = {
        data: ['name:前端小鹿', 'age:18', 'sex:男'],
        [Symbol.iterator]: function () {
            const self = this
            let index = 0;
            return {
                next: function () {
                    if (index < self.data.length) {
                        return {
                            value: self.data[index++],
                            done: false
                        };
                    }
                    return { value: undefined, done: true };
                }
            }
        }
    }*/

    set(key, checkObj) {
        this.checkObjMap[key] = checkObj;
        // this.checkObjMap.set(key, checkObj);
        this.length = Object.keys(this.checkObjMap).length;
    }
    get(key) {
        // this.checkObjMap.get(key);
        return this.checkObjMap[key];
    }

    getRowDisabled(key) {
        const checkObj = this.get(key);
        return checkObj.disabled;
        /* { checked, setChecked, disabled, setDisabled } */
    }
    getRowChecked(key) {
        const checkObj = this.get(key);
        return checkObj.checked;
    }
    setRowChecked(key, value) {
        // console.log('setRowChecked', value)
        const checkObj = this.get(key);

        // 修改顯示UI上的勾勾狀態
        checkObj.setChecked(value);
    }
    map(filterFunc) {

        // 自製的enumerate來同步輸出index
        function* enumerate(iterable) {
            let i = -1;

            for (const val of iterable) {
                // 取出可迭代的容器內的數值val
                yield [++i, val]; // yield: 產出，每次執行
                // i++;
            }
        }

        // console.log(`map `, this.length);

        let arr = Array(this.length)
        for (const [i, obj] of enumerate(this)) {
            // console.log(`yield[${i}]`, obj);
            arr[i] = filterFunc(obj, i);
        }
        return arr;
        /* const aa = enumerate(this);
        // 執行next()會得到
        aa.next() ===> { value: .. , done: false } */
    }
    runCheckMapExcludeSelfIndex(selfIndex, callback) {
        const checkMap = this.checkObjMap;

        Object.keys(checkMap).forEach((checkMapRowIndex) => {
            if (checkMapRowIndex === `${selfIndex}`) {
                // 只有自己不跑
                return;
            }

            callback(checkMap, checkMapRowIndex);
        });
    };
    excludeSetDisabled(rowIndex, val) {
        this.runCheckMapExcludeSelfIndex(rowIndex, function (checkMap, checkMapRowIndex) {
            // console.log(`checkMapRowIndex: ${checkMapRowIndex}  val: ${val}`)
            checkMap[checkMapRowIndex].setDisabled(val);  // 選取=>鎖定其他的；取消=>其他都解鎖
        });
    }
    resetAllChecked() {
        for (const eachCheckMap of this) {
            /* {
                checked: false,
                disabled: false,
                setChecked: () => { },
                setDisabled: () => { },
            } */
            // console.log('aa checkMap', checkMap)
            eachCheckMap.setChecked(false);
        }
    }
}

class CheckMapMap {
    checkMapMap = new Map();
    // checkMapMap.autoGetCheckMap('__rowSelect');
    autoGetCheckMap(headerKey) {
        let checkMap = this.checkMapMap.get(headerKey);
        if (!checkMap) {
            // let newCheckMap = {};
            let newCheckMap = new CheckMap();
            this.checkMapMap.set(headerKey, newCheckMap);
            return newCheckMap;
        }
        return checkMap;
    }
    resetAllCheckMap() {
        this.checkMapMap.forEach((checkMap) => {
            // console.log(`checkMapMap forEach`, checkMap)

            checkMap.resetAllChecked();
        });
    }
    getDefaultRowSelectCheckMap() {
        // 取得 '__rowSelect' 欄的checkMap
        return this.autoGetCheckMap('__rowSelect');
    }
}

const LoadingStyled = styled.div`
height: 300px;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;

`

const TableLoading = ({ loading }) => {
    return (
        <tbody>
            {/* <tr>
                {loading}
            </tr> */}

            {/* <tr>
                <td>January</td>
                <td>$100</td>
            </tr> */}
            <tr >
                <td rowSpan="10" colSpan="100">
                    <LoadingStyled>
                        <CircularProgress sx={{ color: tableTheme.getTheme('loading', '#477c68') }} />
                    </LoadingStyled>
                </td>
            </tr>
        </tbody>
    )
}

const TableBody = ({ header, data, onCheckedChange, showColMap, onButtonClick, onTdEdit, onImageClick, loading = false, checkMapMap }) => {
    // data: <TableData> ==> util/TableData.js
    if (!(data instanceof TableData)) {
        console.error(`TableBody: data is not TableData`);
        return (<div></div>)
    }

    // 自動加入filter函式
    let headerItemList = header.header.map((headerItem) => {
        headerItem = Object.assign({}, headerItem);

        // // 自動生成filter ===> 已整合至CellFilter.filtCell
        // if (typeof headerItem.filter === 'string') {
        //     headerItem.filter = CellFilter.getFilter(headerItem.filter);
        // }

        return headerItem;
    });

    // const checkMapMap = new CheckMapMap();

    // 表格預設的列點擊多選-------------------------------------

    const [rowHoverIndex, setRowHoverIndex] = useState(-1);
    let trMouseLeaveTimeoutRef = useRef(null);

    let rowList = [];

    // let tableData = data.getTableData();
    const [tableData, setTableData] = useState(data.getTableData());

    useEffect(function () {
        // console.log('data changed', data);
        setTableData(data.getTableData());
    }, [data]);

    tableData.forEach((row, rowIndex, rowArr) => {
        rowList.push(
            (
                <TableRow key={`row_${rowIndex}`} rowIndex={rowIndex} row={row}
                    rowHoverIndex={rowHoverIndex}
                    setRowHoverIndex={setRowHoverIndex}
                    header={header}
                    onCheckedChange={onCheckedChange}
                    headerItemList={headerItemList}
                    rowArr={rowArr} showColMap={showColMap}
                    checkMapMap={checkMapMap}
                    trMouseLeaveTimeoutRef={trMouseLeaveTimeoutRef}
                    onButtonClick={onButtonClick} onTdEdit={onTdEdit}
                    onImageClick={onImageClick}
                    tableData={data}
                ></TableRow>
            )
        );
    });

    // loading----------------------------------------------

    const convertLoading = function (loading) {
        if (loading instanceof Ref) {
            return loading.getValue();
        }
        return loading;
    }

    const [nowLoading, setLoading] = useState(convertLoading(loading))
    let actLoading = setLoading;
    if (loading instanceof Ref) {
        actLoading = loading.reactive('TableBody', setLoading);
    }
    useEffect(function () {
        actLoading(convertLoading(loading));
    }, [loading]); // 綁上感測器: 上層的loading動作時，要進行連動

    // render-----------------------------------------------------------

    if (nowLoading) { // loading
        return (
            <TableLoading loading={loading} />
        )
    }

    return (<tbody>
        {rowList}
    </tbody>);
}

const TablePagination = ({ onChange, pageChangeLock, data }) => {
    // data: <TableData> ==> util/TableData.js

    const [nowPage, setNowPage] = useState(data.getNowPage());
    const [totalPage, setTotalPage] = useState(data.getTotalPage());

    // 上層刷新data時，要連帶刷新Pagination內的參數
    useEffect(function () {
        // console.log(`TablePagination on data change  nowPage: ${data.getNowPage()}   totalPage:${data.getTotalPage()}  `);

        setNowPage(data.getNowPage());
        setTotalPage(data.getTotalPage());
    }, [data])

    const pageChangeEvent = () => (pageNum, unlock) => {
        if (onChange) {
            // 跳onChange事件，通知刷新頁面
            onChange(pageNum, unlock);
        }
    }

    return (
        <div className="table-pagination-row">
            <Pagination type="table" page={nowPage} setPage={setNowPage} onChange={pageChangeEvent()} totalPage={totalPage} setTotalPage={setTotalPage} pageChangeLock={pageChangeLock}></Pagination>
        </div>
    );
}


const TableBlock = ({ header, data, onCheckedChange, onPageChange,
    pageChangeLock, children, onButtonClick, footerSlot, onTdEdit, view = {},
    onImageClick, importStyle, loading }) => {
    // data: <TableData> ==> util/TableData.js

    if (!data) {
        console.error(`TableBlock: data not exist`);
    }

    if (!(header instanceof TableHeader)) {
        console.error('TableBlock: header is invalid');
    }

    const showColList = header.header.map((headerItem, colIndex) => {

        return {
            key: headerItem.key,
            label: headerItem.label,
            value: true, // 之後要從這裡對接，自動取localStorage
            colIndex: colIndex, // 先將colIndex存下來，避免後面的程序遺失
            headerItem: headerItem,
        };
    })

    let headerSelectItemList = showColList.filter((item) => {
        const headerItem = item.headerItem;
        if (headerItem.type === 'checkBox' && headerItem.key === '__rowSelect') {
            // 代表是綁定rowSelect的checkBox，不列入選項
            return false;
        }

        return true;
    }).map((item) => {
        /* item: {
            colIndex: 10
            key: "channelUidWechat"
            label: "Wechat"
            value: true
            headerItem: {
                key: "channelUidWechat"
                label: "Wechat"
                type: "text"
                upperHeaderRef: "channelUid"
                width: "120px"
            }
        } */

        if (!item.headerItem) {
            return item;
        }
        if (!item.headerItem.upperHeaderRef) {
            return item;
        }
        if (!header.upperHeader) {
            return item;
        }

        let label = item.label;
        // console.log(`upperHeaderRef: ${item.headerItem.upperHeaderRef}`, header.upperHeader);
        const upperHeader = header.upperHeader[item.headerItem.upperHeaderRef] || {};
        label = `${label}(${upperHeader.label})`;

        return Object.assign(item, {
            label: label,
        });
    });
    // build showColMap------------------------------------------------------
    const showColMap = {};
    showColList.forEach((showColItem) => {
        const [showCol, setShowCol] = useState(showColItem.value);
        showColMap[showColItem.colIndex] = {
            showCol: showCol,
            setShowCol: setShowCol,
        };
    })

    const onDropdownItemChanged = () => (item, itemIndex, val) => {
        // console.log(`dropdown item ${item.key} colIndex[${item.colIndex}] changed: ${val}`, item);

        // 要連動控制欄位顯示/關閉
        const showColObj = showColMap[item.colIndex];
        showColObj.setShowCol(val);
    }

    // build upperHeaderMap---------------------------------------------------

    // 1.先確認是否有upperHeader存在，決定要生成2列還是1列
    const upperHeaderExist = header.upperHeader ? Object.keys(header.upperHeader).length !== 0 : false;

    // 生成upperHeaderMap
    let upperHeaderMap;
    if (upperHeaderExist) {
        upperHeaderMap = new Map();
        Object.keys(header.upperHeader).forEach((key) => {
            const upperHeaderItem = Object.assign({}, header.upperHeader[key]);
            upperHeaderItem.key = key; // 自動補上key

            let subHeaderColIndexList = [];
            // 自動計算出底下有幾個header
            const lowerHeaderList = header.header.filter((subItem, colIndex) => {
                if (upperHeaderItem.key === subItem.upperHeaderRef) {
                    subHeaderColIndexList.push(colIndex);
                    return true;
                }
                return false;
            });
            upperHeaderItem.subHeaderNum = lowerHeaderList.length;
            upperHeaderItem.subHeaderColIndexList = subHeaderColIndexList;

            upperHeaderMap.set(upperHeaderItem.key, upperHeaderItem);
        });
    }

    // upperHeaderMap add (showUpperCol, upperColSpan)---------------------------------------------------------------

    if (upperHeaderMap) {
        upperHeaderMap.forEach((upperHeaderItem, key) => {

            const [showUpperCol, setShowUpperCol] = useState(true);
            const [upperColSpan, setUpperColSpan] = useState(upperHeaderItem.subHeaderNum);

            // 生成更新的函式
            function handleSetShowUpperCol(setShowUpperCol, setUpperColSpan, upperHeaderItem, showColMap, updateColIndex, updateShowCol) {
                // updateColIndex, updateShowCol 這二個參數是setShowColCascadeUpper傳下來的

                // 跑每個下層，確認是否存在
                let upperShow = false;

                // console.log(updateColIndex, updateColShow);

                let upperSpanCount = 0;

                upperHeaderItem.subHeaderColIndexList.forEach((colIndex) => {

                    if (colIndex === updateColIndex) {
                        // 代表是這次更新的項目，不使用舊資料，用新資料計算
                        if (updateShowCol) {
                            // 只要有一個還顯示著，就會存在
                            upperShow = true;
                            // 上層有幾個，代表有幾格span
                            upperSpanCount += 1;
                        }
                    } else if (showColMap[colIndex].showCol) {
                        // 只要有一個還顯示著，就會存在
                        upperShow = true;
                        // 上層有幾個，代表有幾格span
                        upperSpanCount += 1;
                    }
                });

                setShowUpperCol(upperShow);
                setUpperColSpan(upperSpanCount);
            }

            // 將刷新函式存進去
            upperHeaderItem.refreshShowUpperColFunc = handleSetShowUpperCol.bind(null,
                setShowUpperCol, setUpperColSpan, upperHeaderItem, showColMap);

            // 存下連動的參數
            upperHeaderItem.showUpperCol = showUpperCol;
            upperHeaderItem.setShowUpperCol = setShowUpperCol;
            upperHeaderItem.upperColSpan = upperColSpan;
            upperHeaderItem.setUpperColSpan = setUpperColSpan;

            // 存回去
            upperHeaderMap.set(key, upperHeaderItem);


            // 二次加工下層的setShowCol函式，跑所有下層，對setShowCol再包一層，達成連動呼叫
            upperHeaderItem.subHeaderColIndexList.forEach((colIndex) => {

                function setShowColCascadeUpper(setShowCol, refreshShowUpperColFunc, updateColIndex, updateShowCol) {
                    // 將原本的setShowCol包起來的函式
                    refreshShowUpperColFunc(updateColIndex, updateShowCol);
                    setShowCol(updateShowCol);
                }

                showColMap[colIndex].setShowCol = setShowColCascadeUpper.bind(null,
                    showColMap[colIndex].setShowCol, upperHeaderItem.refreshShowUpperColFunc, colIndex);
            });
        });
    }

    let tablePaginationRow;

    const checkMapMap = new CheckMapMap();

    const handlePageChange = () => (...args) => {
        // console.log('handlePageChange args', args);
        // console.log('handlePageChange checkMapMap', checkMapMap);
        checkMapMap.resetAllCheckMap();

        if (onPageChange) {
            onPageChange(...args);
        }
    }

    if (data.getPaginationShow()) {
        tablePaginationRow = (<TablePagination onChange={handlePageChange()} data={data}
            pageChangeLock={pageChangeLock}></TablePagination>);
    }

    const getDisplay = (blockName, defaultVal) => {
        if (view[blockName] === undefined) {
            return defaultVal;
        }

        return view[blockName] ? defaultVal : 'none';
    }

    // <div className={`${className} table-container`}>

    // const importStyle = {
    //     borderRadius: '0px 5px 5px 5px',
    //     marginTop: '0px',
    // }

    const [tableHeaderSelectShow, setTableHeaderSelectShow] = useState(false);
    // useEffect(function () {
    //     console.log(`tableHeaderSelectShow`, tableHeaderSelectShow);
    // }, [tableHeaderSelectShow])

    const onHeaderSelectButtonClick = () => () => {
        // console.log('onHeaderSelectButtonClick', tableHeaderSelectShow);
        setTableHeaderSelectShow(!tableHeaderSelectShow);
        // () => setTableHeaderSelectShow(!tableHeaderSelectShow)
    }
    const onHeaderSelectShowUpdate = () => show => {
        // console.log('onHeaderSelectShowUpdate');
        setTableHeaderSelectShow(show);
    }

    return (
        <TableStyled className="table-container" theme={tableThemeObject} style={importStyle}>
            <div style={{
                display: getDisplay('panel', 'flex'),
            }} className="table-panel">
                {/* importStyle={{
                    marginLeft: '0px',
                    marginTop: '0px',
                    marginBottom: '0px',
                }} */}
                {/* onClick={onDropdownSelectClick()} */}
                {/* 外面放一個參考位置用的div */}
                <div className="table-header-select-block">
                    <TableHeaderSelect
                        itemList={headerSelectItemList} onItemChanged={onDropdownItemChanged()}
                        layer={LayerMixin.tableDropdown} show={tableHeaderSelectShow} onShowUpdate={onHeaderSelectShowUpdate()}>
                        <Button type="table" mode="default" onClick={onHeaderSelectButtonClick()} importClass="table-header-select-button">
                            <SettingSlidersSvg className="column-setting-icon" fill={tableTheme.getTheme('columnSettingIcon', '#a1a1a1')} />
                        </Button>
                    </TableHeaderSelect>
                </div>
                {children}
            </div>
            <div className="table-responsive">
                <table>
                    {/* <colgroup>
                        <col span="2" style={{
                            backgroundColor: 'red',
                        }} />
                        <col style={{
                            backgroundColor: 'yellow',
                        }} />
                    </colgroup> */}
                    <TableHeaderBlock header={header} showColMap={showColMap} upperHeaderMap={upperHeaderMap}></TableHeaderBlock>
                    <TableBody header={header} data={data} onCheckedChange={onCheckedChange}
                        showColMap={showColMap} onButtonClick={onButtonClick} onTdEdit={onTdEdit}
                        onImageClick={onImageClick} loading={loading} checkMapMap={checkMapMap}></TableBody>
                </table>
            </div>
            {tablePaginationRow}
            {/* <TablePagination onChange={onPageChange} data={data} pageChangeLock={pageChangeLock}></TablePagination> */}
            {footerSlot}
        </TableStyled>
    )
}
const TableStyled = styled.div`
// table-container------------------------------------
display: block;

margin-top: 1.5rem;
margin-left: 1.5rem;
margin-bottom: 1.5rem;

// width: calc(100% - 8rem)
width: ${() => LayoutMixin.getPageBoardWidth()};

background-color: ${getTheme('tableContainer', '#cba165')};
border-radius: ${getTheme('tableContainerRadius', '5px')};

/* background-color: #cb6582; */

.table-panel{
    /* width: 100%; */
    /* width: calc(100% - 3rem); */
    /* margin: 0.5rem auto; */
    margin: 1.5rem;

    /* background-color: aquamarine; */

    display: flex;
    flex-direction: row;

    .column-setting-icon {
        width: 1rem;
        height: 1rem;
    }

    & .table-header-select-block {
        position: relative;
    }
}

.table-responsive {

    /* display: flex;
    flex-direction: column; */

    width: calc(100% - 3rem); // 表格寬度從底板向內縮3rem

    /* max-width: 80%; */

    overflow: auto;

    margin: 1rem auto; // 上下1.5rem間格 左右置中

    /* max-width: 100%; */

    table {
        display: table;
        border-collapse: separate;
        box-sizing: border-box;
        text-indent: initial;
        border-spacing: 0px; // border之間的間距
        /* border-color: grey; */

        /* min-width: 90vw; */

        /* width: 1200px; */

        /* overflow: auto; */


        table-layout: auto;

        /* // 最外層
        border: 1px solid #96D4D4; */

        thead {

            tr {
                th {
                    color: ${getTheme('tableBorder', '#000000')};
                    font-weight: 500;
                    border-left: 1px solid ${getTheme('tableBorder', '#96D4D4')};

                    /* min-width: 80px; */
                }
                th.th-start {
                    /* border-right: 1px solid #96D4D4; */
                }
                th.th-end {
                    border-right: 1px solid ${getTheme('tableBorder', '#96D4D4')};
                }
                th.th-top {
                    border-top: 1px solid ${getTheme('tableBorder', '#96D4D4')};
                }
                th.th-bottom {
                    border-top: 1px solid ${getTheme('tableBorder', '#96D4D4')};
                    border-bottom: 1px solid ${getTheme('tableBorder', '#96D4D4')};
                }

            }
        }
        
        tbody {
    
            tr {
                /* border: 1px solid white; */
                td {
                    /* border: 1px solid #96D4D4; */

                    border-left: 1px solid ${getTheme('tableBorder', '#96D4D4')};
                    border-bottom: 1px solid ${getTheme('tableBorder', '#96D4D4')};

                    background-color: ${getTheme('table', '#3e5157')};

                    /* display: flex;
                    align-items: center;
                    justify-content: center; */

                    /* min-width: 200px; */
                    padding: 0rem 1rem;
                    height: 3rem;

                    display: table-cell;
                    text-align: center;
                    vertical-align: middle;

                    .td-container { // checkBox用的
                        display: flex;
                        width: 100%;
                        height: 100%;

                        justify-content: center;
                        align-items: center;
                    }
                    .td-editable-icon { // TdTextEditable
                        width: 1rem;
                        height: 1rem;

                        cursor: pointer;

                        float: right; // 置右

                        transform: translateY(4px);
                    }
                    .td-cancel-icon { // TdTextEditable
                        width: 1rem;
                        height: 1rem;

                        cursor: pointer;

                        float: left; // 置右

                        transform: translateY(12px);
                    }
                    .td-checked-icon { // TdTextEditable
                        width: 1rem;
                        height: 1rem;

                        cursor: pointer;

                        float: right; // 置右

                        transform: translateY(12px);
                    }

                    & .image-link { // 代表是可點擊的圖片
                        cursor: pointer;
                    }
                }
                td.editable {
                    display: flex;
                    flex-direction: row;
                }
                td.row-select {
                    background-color: ${getTheme('rowSelectHighlight', '#37bde2')};
                }
                td.row-hover { // 優先權比.row-select高，會後蓋前
                    background-color: ${getTheme('rowHoverHighlight', '#37bde2')};
                }
                td.tr-start {
                    border-top: none;
                }
                td.tr-end {
                    border-bottom: none;
                }
                td.td-start {
                    border-left: none;
                    /* background-color: #37bde2; */
                }
                td.td-end {
                    border-right: none;
                    /* background-color: #37bde2; */
                }
                td.td-text {
                    min-width: 80px;
                    color: ${getTheme('tableText', '#000000')}; // 預設的字顏色
                }
                td.row-select.td-text {
                    color: ${getTheme('tableTextSelect', '#37bde2')}; // 列選取時的顏色
                }
                td.row-hover.td-text {
                    color: ${getTheme('tableTextHover', '#37bde2')}; // 列選取時的顏色
                }
                /* td.td-text:hover{
                    color: ${getTheme('tableTextHover', '#37bde2')};
                } */
                td.td-checkbox {
                    
                }
                td.td-toggle-switch {
                    
                }
                td.td-button-column {
                    min-width: 80px;

                    /* width: 300px; */
                    display: flex;
                    flex-direction: row;

                    /* display: inline-block; */
                }
                td.td-blank {
                    
                }
                td.row-select.url-link, td.row-hover.url-link, td.url-link {
                    color: ${getTheme('tableTextLink', 'blue')};
                    cursor: pointer;
                }
            }
        }
    }
}

/* width */
.table-responsive::-webkit-scrollbar {
    width: 14px;
}

/* Track */
.table-responsive::-webkit-scrollbar-track {
    /* box-shadow: inset 0 0 5px grey; */
    /* background: #d1d1d1; */
    border-radius: 15px;

    background: transparent;
}

/* Handle */
.table-responsive::-webkit-scrollbar-thumb {
    /* background: #989898; */
    background-color: ${getTheme('scrollbar', '#cdcdcd')};

    border-radius: 30px;
    
    border: 3px solid transparent; // 用來縮小thumb的寬度
    background-clip: content-box;
    /* box-shadow: inset 0 0 5px #282828; */
}

/* Handle on hover */
.table-responsive::-webkit-scrollbar-thumb:hover {
    /* background: #dedede; */
    background-color: ${getTheme('scrollbarHover', '#dedede')};
    border: 3px solid transparent; // 用來縮小thumb的寬度
    background-clip: content-box;
}

.table-pagination-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin: 1rem 0 1rem 0;
}
`

// export default TableStyled;

export default function Table({ header, data, onCheckedChange, onPageChange,
    pageChangeLock, children, onButtonClick, footerSlot, onTdEdit, view, onImageClick,
    importStyle, loading }) {
    // ps.要注意效能問題，可能會重刷太多次TableExport data

    return (<TableBlock header={header} data={data} onCheckedChange={onCheckedChange}
        onPageChange={onPageChange} pageChangeLock={pageChangeLock}
        onButtonClick={onButtonClick} footerSlot={footerSlot} onTdEdit={onTdEdit}
        view={view} onImageClick={onImageClick} importStyle={importStyle}
        loading={loading}
    >{children}</TableBlock>)
}

/*
export const TableTest = () => {
    return (
        <table>
            <colgroup>
                <col span="2" style={{
                    backgroundColor: 'red',
                }} />
                <col style={{
                    backgroundColor: 'yellow',
                }} />
            </colgroup>
            <thead>
                <tr>
                    <th colSpan="2">Month</th>
                    <th rowSpan="2">Savings for holiday!</th>
                    <th rowSpan="2">Savings</th>
                </tr>
                <tr>
                    <th>Month</th>
                    <th>Savings</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>January</td>
                    <td>$100</td>
                    <td>$100</td>
                    <td>$100</td>
                </tr>
                <tr>
                    <td>February</td>
                    <td>$80</td>
                    <td>$100</td>
                    <td>$100</td>
                </tr>
            </tbody>
        </table>
    );
}
*/