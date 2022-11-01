import styled from "styled-components";
import { useState, useEffect } from 'react';

import InputText from "component/InputText";

import { ReactComponent as MenuDotsSvg } from 'assets/svg/menu-dots.svg'
import { ReactComponent as AngleLeftSvg } from 'assets/svg/br-angle-left.svg'
import { ReactComponent as AngleRightSvg } from 'assets/svg/br-angle-right.svg'

import { pagination as paginationThemeObject } from 'theme/reas'
import ThemeMixin, { fetchTheme } from 'util/ThemeMixin'

const paginationTheme = new ThemeMixin(paginationThemeObject);

const PaginationComponet = ({ className, page, setPage, totalPage, pageChangeLock, onChange }) => {

    // const setNowPage = (pageNum) => {
    //     setPage(pageNum);
    // }

    // 文字輸入框的參數
    const [inputTextValue, setInputTextValue] = useState('1');

    // 鎖定用的參數
    const [lock, setLock] = useState(false);
    function endLock() {
        // console.log('endLock');
        setLock(false);
    }
    const startLock = function () {
        // console.log('startLock');
        setLock(true);

        setTimeout(function () {
            // 60秒後自動解除(API timeout為60秒)，避免永久鎖定
            setLock(false);
        }, 60000);
    }


    // 刷新參數入口
    const pageChange = function (pageNum, eventType) {
        // console.log(`pageChange pageNum: ${pageNum} eventType: ${eventType}`)

        if (pageNum === page) {
            // 代表與當前頁數相同，不刷新
            return;
        }

        if (pageChangeLock) {
            // 跳頁鎖定模式: 代表有要使用跳頁鎖定

            if (lock) {
                // 代表正在鎖定當中，禁止跳頁事件
                // console.log('pagination is locked');
                return;
            }

            let unlock = endLock.bind(null);
            startLock();

            // 改數值
            setPage(pageNum);

            // 會呼叫 <TablePagination> 的 pageChangeEvent
            if (onChange) {
                onChange(pageNum, unlock);
            }
            if (eventType !== 'textInput') {
                // 代表是來自其他來源的事件，要順帶刷新輸入框內的參數
                setInputTextValue(pageNum);
            }
        } else {
            // 一般模式，沒鎖定

            // 直接改數值
            setPage(pageNum);

            // 呼叫onChange
            if (onChange) {
                onChange(pageNum);
            }
            if (eventType !== 'textInput') {
                // 代表是來自其他來源的事件，要順帶刷新輸入框內的參數
                setInputTextValue(pageNum);
            }
        }


        /*
                // 會呼叫 <TablePagination> 的 setPageEvent
                setPage(pageNum);
        
                if (eventType !== 'textInput') {
                    // 代表是來自其他來源的事件，要順帶刷新輸入框內的參數
                    setInputTextValue(pageNum);
                }
                */
    };

    // 上下頁icon點擊
    const pageMove = action => () => {
        if (action === 'prev') {
            if ((page - 1) >= 1) {
                pageChange(page - 1, 'moveClick');
            }
        } else if (action === 'later') {
            if ((page + 1) <= totalPage) {
                pageChange(page + 1, 'moveClick');
            }
        }
    }

    // 點擊頁數
    const onPageNumClick = pageNum => () => {
        pageChange(pageNum, 'numClick');
    }

    // 數字輸入框跳頁
    const onPageNumJump = () => pageNum => {
        pageChange(pageNum, 'textInput');
    }

    let pageItemList = [];

    pageItemList.push(
        <div key="arrow-left" className="pagination-item" onClick={pageMove('prev')}>
            <AngleLeftSvg key="arrow-left" className="icon" alt="arrowLeftIcon"
                fill={paginationTheme.getTheme('arrowIcon', '#040404')} />
        </div>
    );

    const pushPageNumItem = function (pageNum) {
        pageItemList.push(
            <div key={pageNum} className={`pagination-item ${pageNum === page ? 'active' : ''}`}
                onClick={onPageNumClick(pageNum)}>{`${pageNum}`}</div>
        );
    }
    const pushDotItem = function (dotKey) {
        pageItemList.push(
            <div key={dotKey} className={`pagination-item transparent`}>
                <MenuDotsSvg className="icon" alt="dotIcon"
                    fill={paginationTheme.getTheme('dotIcon', '#040404')} />
            </div>
        );
    }


    if (totalPage <= 8) {
        // 較短的: 全部顯示
        for (let pageNum = 1; pageNum <= totalPage; pageNum += 1) {
            pushPageNumItem(pageNum);
        }
    } else if (totalPage > 8 && page <= 4) {
        // 前段
        for (let pageNum = 1; pageNum <= 4; pageNum += 1) {
            pushPageNumItem(pageNum);
        }
        pushDotItem('middleDot');
        pushPageNumItem(totalPage);
    } else if (totalPage > 8 && (totalPage - 4) <= page) {
        // 後段: 代表已脫離前段，並且逼近尾段
        pushPageNumItem(1);
        pushDotItem('middleDot');
        for (let pageNum = (totalPage - 4); pageNum <= totalPage; pageNum += 1) {
            pushPageNumItem(pageNum);
        }
    } else {
        // 中段
        pushPageNumItem(1);
        pushDotItem('prevDot');
        for (let pageNum = (page - 2); pageNum < (page + 3); pageNum += 1) {
            pushPageNumItem(pageNum);
        }
        pushDotItem('laterDot');
        pushPageNumItem(totalPage);
    }

    pageItemList.push(
        <div key="arrow-right" className="pagination-item" onClick={pageMove('later')}>
            <AngleRightSvg key="arrow-right" className="icon" alt="arrowRightIcon"
                fill={paginationTheme.getTheme('arrowIcon', '#040404')} />
        </div>
    );

    pageItemList.push(
        <InputText key="pageNumInput" type="pagination" value={inputTextValue} setValue={setInputTextValue} min={1} max={totalPage} onChange={onPageNumJump()}></InputText>
    );

    return (
        <div className={className}>
            {pageItemList}
        </div>
    )
}

const PaginationStyled = styled(PaginationComponet)`
display: flex;
flex-direction: row;

    .pagination-item {
        background-color: ${fetchTheme('item', '#72727F')};
        color: ${fetchTheme('itemText', '#24242e')};
        border-radius: ${fetchTheme('itemRadius', '3px')};
        
        display: flex;
        justify-content: center;
        align-items: center;

        margin: 0.5rem;

        /* padding: 0.5rem 1rem; */

        width: 2.5rem;
        height: 2.5rem;
        box-sizing: border-box;

        cursor: pointer;
        user-select: none;

        .icon {
            width: 1rem;
            height: 1rem;
            transform: translateY(1px);
        }
    }
    .pagination-item.active {
        background-color: ${fetchTheme('itemActive', '#cbcbe0')}; 
        color:  ${fetchTheme('itemTextActive', '#24242e')};
        
        /* border: 2px solid #3e5157; */

        /* box-shadow: inset 0 0 10px #e2f8f8; */
    }
    .pagination-item.transparent {
        background-color: transparent;

        cursor: default;
    }
`

export default function PaginationEx({ type, page, setPage, totalPage, setTotalPage, pageChangeLock, onChange }) {
    if (type === 'table') {
        return (<PaginationStyled page={page} setPage={setPage}
            totalPage={totalPage} setTotalPage={setTotalPage}
            pageChangeLock={pageChangeLock} onChange={onChange}
            theme={paginationThemeObject}>
        </PaginationStyled>);
    }

    return (<PaginationStyled></PaginationStyled>);
}