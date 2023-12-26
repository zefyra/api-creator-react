import styled from 'styled-components';
import React, { useEffect, useState, useRef } from "react";
import { createRoot } from 'react-dom/client';

// import { ReactComponent as PictureSvg } from 'assets/svg/picture.svg'
import { ReactComponent as PortraitSvg } from 'assets/svg/portrait.svg'
import { ReactComponent as GlobeSvg } from 'assets/svg/globe.svg'

import { ReactComponent as SettingsSvg } from 'assets/svg/settings.svg'
import { ReactComponent as SocialSvg } from 'assets/svg/social.svg'
import { ReactComponent as ChartHistogramSvg } from 'assets/svg/chart-histogram.svg'
import { ReactComponent as DataTransferSvg } from 'assets/svg/data-transfer.svg'

import { useSelector, useDispatch, connect } from 'react-redux';
import {
    selectCategory, updateCategory
} from 'store/login'; // selectCategory,

import { getLangItemList } from 'module/lang';
// import { ReactComponent as UserSvg } from 'assets/svg/user.svg'

import { useLocation, useNavigate } from 'react-router-dom';

import { navBar as navBarThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
import { useTranslation } from 'react-i18next';
import LayerMixin from 'util/LayerMixin'
import RenderOnce from "util/RenderOnce";
import OuterCaller, { OuterReminder } from 'util/OuterCaller';
import uniqid from 'uniqid';

import OuterInvoker from 'module/outerInvoker'
import CategoryEnum from 'enum/Category';
import LayoutMixin from 'util/LayoutMixin';
import RouteManager from 'router/RouteManager';

const getTheme = ThemeMixin.fetchGetTheme();

const navBarTheme = new ThemeMixin(navBarThemeObject);


const navBarHeight = LayoutMixin.navBarHeight || '53px';

const NavDropdown = ({ show, setShow, getShow, right, top, subItemList, closeEvent, qid, className }) => {

    const location = useLocation()
    const navigate = useNavigate();

    const subItemComponentList = subItemList.map((subItem, index) => {
        const handleSubItemClick = () => e => {
            // 阻擋泡泡事件: 避免觸發
            e.stopPropagation();

            // console.log('handleSubItemClick');
            if (subItem.path) {
                // 有路徑
                if (location.pathname !== subItem.path) {
                    navigate(subItem.path);

                    // 跳頁後關閉SubItem
                    closeEvent();
                }
            } else if (subItem.event) {
                // event的模式
                subItem.event(subItem);

                // 關閉SubItem
                closeEvent();
            }
        };

        return <div qid={qid} key={index} className="nav-sub-item" onClick={handleSubItemClick()}>{subItem.name}</div>
    });


    // ------------------------------------------------------------

    // let mountCountRef = useRef(0);
    // let outerCallerRef = useRef(null);

    // // 第一層: 避免每次render都重跑一次regist
    // useEffect(function () {
    //     // 第二層: 用來擋嚴格模式2次render造成的qid不一致問題，統一只跑第二次
    //     RenderOnce.runOnlyAtMmount(mountCountRef, function () {
    //         console.log(`inner OuterInvoker: ${qid}`);
    //         // 第三層: 把相同的qid過濾掉，避免相同qid重複call
    //         outerCallerRef.current = new OuterReminder(qid, getShow, setShow);
    //     });
    // }, []);
    // if (outerCallerRef.current) {
    //     outerCallerRef.current.updateShowState(getShow, setShow);
    // }

    // ------------------------------------------------------------

    const blockBubble = () => e => {
        // 阻擋泡泡事件
        e.stopPropagation();
    }

    const subBoardId = `nav-sub-board_${qid}`;
    // useEffect(function () {
    //     const element = document.getElementById(subBoardId);
    //     console.log('eeeeee', element);

    //     var rect = element.getBoundingClientRect();
    //     console.log(rect.top, rect.right);
    // }, []);



    // 未完成: 無法偵測右側是否有scrollbar卡到sub-board
    // let rightOffset = 0;
    // useEffect(function () {
    //     // console.log('show', show);
    //     if (!show) {
    //         return;
    //     }
    //     const element = document.getElementById(subBoardId);
    //     // console.log('eeeeee', element);
    //     var rect = element.getBoundingClientRect();
    //     // console.log(rect);
    //     // console.log(`window.innerWidth`, window.innerWidth)
    // }, [show])

    return (<div id={subBoardId} className={`nav-sub-board ${className}`} style={{
        'display': show ? 'block' : 'none',
        // right: rightOffset,
    }} onClick={blockBubble()} qid={qid}>
        {subItemComponentList}
        <OuterInvoker qkey="NavDropdown" qid={qid} getShow={getShow} setShow={setShow} />
    </div>);
}

const NavDropdownStyled = styled(NavDropdown)`
position: absolute;
/* position: fixed; */
right: 0;
/* top: 0; */
top: ${navBarHeight};

z-index: ${LayerMixin.navbarDropdown};
width: 8rem;

background-color: ${getTheme('subBoard', '#7fffd4')};
color: ${getTheme('subBoardText', '#000000')};

.nav-sub-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
}
`

const CategoryItem = ({ category, textSrc }) => {

    const { t } = useTranslation('navBar', { keyPrefix: 'category' });

    const currentCategory = useSelector(selectCategory);


    const dispatch = useDispatch();

    const handleCategoryClick = type => () => {
        // navigate(`/${type}`);

        dispatch(updateCategory(type));
    }

    const location = useLocation();
    useEffect(function () {

        let routeManager = new RouteManager();
        const category = routeManager.findCategory(location.pathname);
        // console.log(`category`, category)
        dispatch(updateCategory(category));
    }, [])

    const getSvgFill = function (category) {
        if (currentCategory === category) {
            return navBarTheme.getTheme('iconActive', '#FFFFFF')
        }
        return navBarTheme.getTheme('icon', '#FFFFFF');
    }

    return (
        <div className="category-item" onClick={handleCategoryClick(category)}>
            <SettingsSvg className="category-icon" alt="category-icon"
                fill={getSvgFill(category)} />
            <div className={`category-item-text ${category === currentCategory ? 'active' : ''}`}>
                {t(textSrc)}
                {/* {t('systemManage')} */}
            </div>
        </div>
    );
}


const Category = function () {
    // const navigate = useNavigate();

    return (<div className="category-container">
        {/* 系統管理 */}
        <CategoryItem category={CategoryEnum.system} textSrc="systemManage"></CategoryItem>
        {/* <div className="category-item" onClick={handleCategoryClick(CategoryEnum.system)}>
            <SettingsSvg className="category-icon" alt="category-icon"
                fill={getSvgFill(CategoryEnum.system)} />
            <div className="category-item-text">
                {t('systemManage')}
            </div>
        </div> */}
        {/* 社群管理 */}
        <CategoryItem category={CategoryEnum.social} textSrc="socialManage"></CategoryItem>
        {/* <div className="category-item" onClick={handleCategoryClick(CategoryEnum.social)}>
            <SocialSvg className="category-icon" alt="category-icon" fill={getSvgFill(CategoryEnum.social)} />
            <div className="category-item-text">
                {t('socialManage')}
            </div>
        </div> */}
        {/* 報表管理(不必做了) */}
        {/* <div className="category-item" onClick={handleCategoryClick('reportManage')}>
            <ChartHistogramSvg className="category-icon" alt="category-icon" fill={fillgetSvgFill(CategoryEnum.report)} />
            <div className="category-item-text">
                {t('reportManage')}
            </div>
        </div> */}
        {/* 數據集 */}
        <CategoryItem category={CategoryEnum.data} textSrc="dataCollection"></CategoryItem>
        {/* <div className="category-item" onClick={handleCategoryClick(CategoryEnum.data)}>
            <DataTransferSvg className="category-icon" alt="category-icon" fill={getSvgFill(CategoryEnum.data)} />
            <div className="category-item-text">
                {t('dataCollection')}
            </div>
        </div> */}
    </div>);
}

const NavBar = function ({ className, layoutClassName }) {

    const navigate = useNavigate();

    const { t } = useTranslation('navBar');
    // const { i18n } = useTranslation();
    const [accountCustomShow, setAccountCustomShow] = useState(false);
    const [languageListShow, setLanguageListShow] = useState(false);

    // accountCustom ---------------------------------

    const handleDropdownClick = type => e => {
        e.stopPropagation();
        const eventList = [{
            type: 'languageIcon',
            refVal: languageListShow,
            updateFunc: setLanguageListShow,
        }, {
            type: 'accountPortrait',
            refVal: accountCustomShow,
            updateFunc: setAccountCustomShow,
        }];

        eventList.forEach((eventObj) => {
            if (eventObj.type === type) {
                eventObj.updateFunc(!eventObj.refVal);
            } else {
                // 關閉其他的
                if (eventObj.refVal) {
                    eventObj.updateFunc(false);
                }
            }
        });
    }

    // 給底層關閉該
    const closeAccountCustomList = () => () => {
        setAccountCustomShow(false);
    }

    const accountCustomSubItemList = [{
        name: t('account.profile'), // 帳號設定
        path: '/profile',
    }, {
        name: t('account.logout'), // 登出
        event: function () {
            console.log('logoutEvent');
        },
    }];

    // language--------------------------------------------


    // const translationLang = useTranslation('lang', { keyPrefix: 'lang' });
    // const langT = translationLang.t;

    // function changeLang(subItem) {
    //     // console.log(`changeLang: ${subItem.lang}`);

    //     // 變更語系
    //     i18n.changeLanguage(subItem.lang);

    //     localStorage.setItem('lang', subItem.lang);
    // }

    // const { t } = useTranslation('lang');
    // const langTranslation = useTranslation('langxxx');
    // const langT = langTranslation.t;

    // const languageSubItemList = [{
    //     name: langT('zh-tw'), // 繁體中文
    //     lang: 'zh-tw',
    //     event: changeLang.bind(null),
    // }, {
    //     name: langT('en'), // 英文
    //     lang: 'en',
    //     event: changeLang.bind(null),
    // }];

    const languageSubItemList = getLangItemList(useTranslation('lang', { keyPrefix: 'lang' }));

    const closeLanguageList = () => () => {
        setLanguageListShow(false);
    };

    // category-----------------------------------------

    const categoryList = <Category></Category>


    const getAccountCustomShow = () => () => {
        return accountCustomShow;
    }

    const getLanguageListShow = () => () => {
        return languageListShow;
    }

    const accountCustomQid = uniqid();
    const languageListQid = uniqid();

    return (
        <div className={`${className} ${layoutClassName}`}>
            {/* <LoginModule childRef={ref => (loginModuleRef = ref)} /> */}

            {/* AccountCustom */}
            {/* <NavDropdownStyled qid={accountCustomQid} show={accountCustomShow}
                getShow={getAccountCustomShow()} setShow={setAccountCustomShow}
                subItemList={accountCustomSubItemList} closeEvent={closeAccountCustomList()}
                theme={navBarThemeObject}
            ></NavDropdownStyled> */}

            {/* Language */}
            {/* <NavDropdownStyled qid={languageListQid} show={languageListShow}
                getShow={getLanguageListShow()} setShow={setLanguageListShow}
                subItemList={languageSubItemList} closeEvent={closeLanguageList()}
                theme={navBarThemeObject}
            ></NavDropdownStyled> */}

            <div className="start-container">
                <div className="logo-container" onClick={() => { navigate('/home') }}>
                    <img src="/creator_banner.png" alt="logo"></img>
                </div>
                {categoryList}
            </div>
            <div className="personalize-container">
                <div qid={languageListQid} className="language-icon-container" onClick={handleDropdownClick('languageIcon')}>
                    <GlobeSvg className="language-icon" alt="languageIcon" fill={navBarTheme.getTheme('icon', '#FFFFFF')} />
                    <NavDropdownStyled qid={languageListQid} show={languageListShow}
                        getShow={getLanguageListShow()} setShow={setLanguageListShow}
                        subItemList={languageSubItemList} closeEvent={closeLanguageList()}
                        theme={navBarThemeObject}
                    ></NavDropdownStyled>
                </div>
                <div qid={accountCustomQid} className="account-icon-container" >
                    <div className="account-icon-background" onClick={handleDropdownClick('accountPortrait')}>
                        <PortraitSvg className="account-icon" alt="accountIcon" fill={navBarTheme.getTheme('icon', '#FFFFFF')} />
                    </div>
                    <NavDropdownStyled qid={accountCustomQid} show={accountCustomShow}
                        getShow={getAccountCustomShow()} setShow={setAccountCustomShow}
                        subItemList={accountCustomSubItemList} closeEvent={closeAccountCustomList()}
                        theme={navBarThemeObject}
                    ></NavDropdownStyled>
                </div>
            </div>
        </div>
    );
};

const NavBarSpace = styled.div`
    background-color: ${getTheme('main', '#4e649b')};
    width: 100%;
    min-height: ${navBarHeight};
`

const NavBarStyled = styled(NavBar)`
    /* background-color: #d65959; */
    background-color: ${getTheme('main', '#4e649b')};

    width: 100%;
    height: ${navBarHeight};

    display: flex;
    justify-content: space-between;

    position: absolute;

    .start-container {
        display: flex;

        .logo-container {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            cursor: pointer;

                img {
                    width: auto;
                    max-height: 4.5vh;

                    margin: 0 1rem;
                }
        }

        .category-container {
            display: flex;
            flex-direction: row;

            margin-left: 4.5rem;

            .category-item {
                display: flex;
                flex-direction: row;

                justify-content: center;
                align-items: center;

                margin-right: 1.5rem;

                cursor: pointer;

                .category-icon {
                    width: 1.25rem;
                    height: 1.25rem;

                    margin-right: 0.25rem;
                }

                .category-item-text {
                    color: ${getTheme('categoryItemText', '#000000')};
                }
                .category-item-text.active {
                    color: ${getTheme('categoryItemTextActive', '#000000')};
                }
            }
        }
    }

    .personalize-container {
        display: flex;
        flex-direction: row;

        .language-icon-container {
            display: flex;
            justify-content: center;
            align-items: center;

            height: 100%;

            cursor: pointer;

            position: relative; // 用來提供給下層的NavDropdownStyled的position: absolute參考位置
            
            .language-icon {
                /* width: 1.15rem;
                height: 1.15rem; */
                width: 1.75rem;
                height: 1.75rem;

                margin: 0 0.5rem;
            }
        }

        .account-icon-container {
            /* background-color: #877979; */
            display: flex;
            justify-content: center;
            align-items: center;

            height: 100%;

            position: relative; // 用來提供給下層的NavDropdownStyled的position: absolute參考位置
            
            .account-icon-background {
                display: flex;
                justify-content: center;
                align-items: center;

                background-color: ${getTheme('iconBackground', '#b17a7a')};
                width: 2.75rem;
                height: 2.75rem;

                border-radius: 200px;

                margin: 0 0.75rem;

                cursor: pointer;

                .account-icon {
                    width: 1.15rem;
                    height: 1.15rem;
                }
            }
        }
    }
`

// export default NavBarStyled;
export default function NavBarExport() {

    const navigate = useNavigate();

    return (
        <div>
            <NavBarSpace theme={navBarThemeObject}>
                <NavBarStyled theme={navBarThemeObject}></NavBarStyled>
            </NavBarSpace>
        </div>
    );
}