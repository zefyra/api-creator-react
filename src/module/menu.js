import styled from 'styled-components';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, generatePath } from "react-router-dom";

import { useTranslation, withTranslation } from 'react-i18next';
import { ReactComponent as UsersSvg } from 'assets/svg/users.svg'
import { ReactComponent as DocumentSvg } from 'assets/svg/document.svg'
import { ReactComponent as ShoppingCartSvg } from 'assets/svg/shopping-cart.svg'
import { ReactComponent as CubeSvg } from 'assets/svg/cube.svg'
import { ReactComponent as BrDollarSvg } from 'assets/svg/br-dollar.svg'
import { ReactComponent as MoneyCheckEditSvg } from 'assets/svg/money-check-edit.svg'
import { ReactComponent as KeySvg } from 'assets/svg/key.svg'
import { ReactComponent as DataTransferSvg } from 'assets/svg/data-transfer.svg'
import { ReactComponent as GearSvg } from 'assets/svg/gear.svg'
import { ReactComponent as AddressBookSvg } from 'assets/svg/address-book.svg'
import { ReactComponent as CommentsSvg } from 'assets/svg/comments.svg'
import { ReactComponent as EnvelopeSvg } from 'assets/svg/envelope.svg'
import { ReactComponent as TagsSvg } from 'assets/svg/tags.svg'
import { ReactComponent as RobotSvg } from 'assets/svg/robot.svg'
import { ReactComponent as BookSvg } from 'assets/svg/book.svg'
import { ReactComponent as BallotSvg } from 'assets/svg/ballot.svg'

import RouteManager from 'router/RouteManager';

import { useSelector, useDispatch, connect } from 'react-redux';
import {
    selectCategory, // ,  updateCategory
    selectGetPermission
} from 'store/login';

import LayerMixin from 'util/LayerMixin'

import { menu as menuThemeObject } from 'theme/reas'
import ThemeMixin from 'util/ThemeMixin'
import ApiSender, { ApiError } from 'apiSender';
import LocalAccessor from 'localAccessor';
const getTheme = ThemeMixin.fetchGetTheme();

const menuTheme = new ThemeMixin(menuThemeObject);

const svgMap = {
    users: UsersSvg,
    document: DocumentSvg,
    shoppingcart: ShoppingCartSvg,
    cube: CubeSvg,
    brdollar: BrDollarSvg,
    moneycheckedit: MoneyCheckEditSvg,
    key: KeySvg,
    datatransfer: DataTransferSvg,
    gear: GearSvg,
    addressbook: AddressBookSvg,
    comments: CommentsSvg,
    envelope: EnvelopeSvg,
    tags: TagsSvg,
    robot: RobotSvg,
    book: BookSvg,
    ballot: BallotSvg,
};

const MenuSubItem = ({ itemShow, subItemList, item, handleItemClick }) => {

    const location = useLocation();

    let subItemComponentList;

    if (subItemList) {
        subItemComponentList = subItemList.map((subItem, index) => {
            const isActive = subItem.path === location.pathname;
            return <div className={`menu-sub-item ${isActive ? 'active' : ''}`}
                key={index} onClick={handleItemClick(subItem)}>{subItem.name}</div>;
        });
    }

    return (<div className="menu-sub-board" style={{
        'display': itemShow ? 'block' : 'none',
    }}>
        {subItemComponentList}
    </div>);
}

const MenuItem = ({ itemKey, item, subItemList }) => {
    let isActive = false;

    const itemName = item.name;
    const menuItemId = `menu-item_${itemKey}`;

    const [subMenuTimeout, setSubMenuTimeout] = useState(null);

    const baseIconColor = menuTheme.getTheme('itemIcon', '#737373');
    const iconHoverColor = menuTheme.getTheme('itemIconHover', '#737373');

    const [iconColor, setIconColor] = useState(baseIconColor);

    const openSubMenu = () => () => {
        if (!isActive) {
            // 非active狀態，才進入hover狀態的顏色
            setIconColor(iconHoverColor);
        }

        // 開啟SubMenu-----------------------------------------------
        if (!item.subItemList) {
            // console.log('no sub')
            // 代表沒有子列表，不必開啟SubMenu
            return;
        }

        if (subMenuTimeout) {
            // 代表已預定要關閉，取消預定的關閉
            clearTimeout(subMenuTimeout);
        }

        // 開啟子選單
        setSubItemShow(true);

    }

    const closeSubMenu = () => () => {
        // 防抖
        let timeoutCode = setTimeout(function () {
            setSubItemShow(false);
            setSubMenuTimeout(null);
        }, 100);
        setSubMenuTimeout(timeoutCode);
        setIconColor(baseIconColor);
    }

    const [subItemShow, setSubItemShow] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    /* location: {
        hash: ""
        key: "7eer9y16"
        pathname: "/home"
        search: ""
        state: null
    } */

    const handleMenuItemClick = item => e => {
        e.stopPropagation(); // 避免subItem點擊時觸發底下的item

        if (!item.path) {
            console.error('item have no path', item);
            return;
        }
        console.log('item have path', item);

        if (item.path === location.pathname) {
            // 相同路徑禁止重複轉跳
            return;
        }

        let path = item.path;

        if (item.queryString) {
            path = generatePath(":url?:queryString", {
                url: item.path, // subItem.path: '/apiConnect'
                queryString: item.queryString,
            }); // path: '/apiConnect?category=dataCollection'
        }

        navigate(path);
    }

    const iconComponent = React.createElement(svgMap[item.icon], {
        className: 'menu-item-icon',
        alt: 'menuItemIcon',
        fill: iconColor,
    });

    if (subItemList) {
        // 代表有子列表，搜尋子列表是否有包含當前路徑
        isActive = subItemList.some((subItem, index) => {
            return subItem.path === location.pathname;
        });
    } else {
        isActive = item.path === location.pathname;
    }

    return (
        <div id={menuItemId} className={`menu-item ${isActive ? 'active' : ''}`} onMouseEnter={openSubMenu()} onMouseLeave={closeSubMenu()} onClick={handleMenuItemClick(item)}>
            <div className="menu-item-content">
                {iconComponent}
                <div className="menu-item-text">
                    {itemName}
                </div>
            </div>
            <MenuSubItem itemShow={subItemShow} subItemList={subItemList}
                item={item} handleItemClick={handleMenuItemClick}></MenuSubItem>
        </div>
    );
}


const Menu = function ({ className, layoutClassName }) {
    const { t } = useTranslation('menu');

    const currentCategory = useSelector(selectCategory);
    const getPermission = useSelector(selectGetPermission);

    let menuItemList = new RouteManager().getMenuItemListByAuth(currentCategory, getPermission);

    const itemComponentList = menuItemList.map((item, index) => {
        return <MenuItem key={index} itemKey={index} item={item} subItemList={item.subItemList}>
        </MenuItem>;
    });

    useEffect(function () {

        const apiDocListStr = localStorage.getItem('apiDocList');

        if (!apiDocListStr) {
            // 裡面是空的，代表需要載入
            ApiSender.sendApi('[post]/listApiDoc').then((apiRes) => {
                LocalAccessor.setItem('apiDocList', apiRes.list);
            }).catch(new ApiError().catchAlertMsg());
        }
    }, [])


    return (
        <div className={`${className} ${layoutClassName}`}>
            <div className="menu-item-list">
                {itemComponentList}
            </div>
        </div>
    );
};

const MenuStyled = styled(Menu)`
    background-color: ${getTheme('menu', '#d68b59')};
    
    display: flex;
    flex-direction: column;

    min-width: 192px;
    /* max-height: 93vh; // 必須要對齊底部 */
    height: 100%;

    /* overflow-x: hidden; */

    .menu-logo-block {
        background-color: #828282;
        height: 130px;
        box-sizing: border-box; 

        display: flex;
        flex-shrink: 0;

        justify-content: center;
        align-items: center;

        padding: 15px;

        .menu-logo {
            background-color: #cbcbcb;
            display: flex;

            width: 100%;
            height: 100%;
            cursor: pointer;
        }
    }

    .menu-item-list {
        display: flex;
        flex-direction: column;

        flex-grow: 1;

        flex-wrap: nowrap;
        /* overflow: auto; */
        overflow: visible; // 要設定顯示，這樣menu-sub-board在框界外顯示時才不會被擋住
        /* overflow-x: hidden; */
        /* overflow-y: auto; */
        
        .menu-item {
            height: 3.75rem;

            display: flex;
            flex-direction: row;
            flex-shrink: 0;
            justify-content: flex-start;
            align-items: center;

            color: ${getTheme('itemText', '#f1f1f1')};

            padding-left: 1.5rem;

            cursor: pointer;

            position: relative;

            .menu-sub-board {
                display: none;
                
                position: absolute; // 利用上一層的position: relative;定位

                left: 192px; // 192px是左側menu的寬度，就可以剛好顯示在menu右側
                top: 0px;

                min-width: 180px;

                background-color: ${getTheme('subMenu', '#828282')};
                color: ${getTheme('subMenuText', '#828282')};

                z-index: ${() => LayerMixin.menuSubBoard};

                .menu-sub-item {
                    padding: 1rem 3rem;
                    cursor: pointer;
                }
                .menu-sub-item:hover {
                    background-color: ${getTheme('subMenuHover', '#bcbcbc')};
                    color: ${getTheme('subMenuTextHover', '#828282')};
                }
                .menu-sub-item.active {
                    background-color: ${getTheme('subMenuActive', '#828282')};
                    color: ${getTheme('subMenuTextActive', '#828282')};
                    /* cursor: not-allowed; */
                }
            }

            .menu-item-content {
                display: flex;
                flex-direction: row;

                .menu-item-icon {
                    display: flex;
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-right: 0.5rem;
                    transform: translateY(1px);
                }
                .menu-item-text {
                    display: flex;
                }
            }
        }
        .menu-item:hover {
            background-color: ${getTheme('itemHover', '#cecece')};
            color: ${getTheme('itemTextHover', '#cecece')};
        }
        .menu-item.active {
            color: ${getTheme('itemTextActive', '#828282')};
            background-color: ${getTheme('itemActive', '#bcbcbc')};
        }
    }
    /* width */
    .menu-item-list::-webkit-scrollbar {
        width: 10px;
    }

    /* Track */
    .menu-item-list::-webkit-scrollbar-track {
        /* box-shadow: inset 0 0 5px grey; */
        border-radius: 15px;

        background: transparent;
    }
    
    /* Handle */
    .menu-item-list::-webkit-scrollbar-thumb {
        background-color: ${getTheme('scrollbar', '#cdcdcd')};

        border-radius: 30px;
        
        border: 2px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
        /* box-shadow: inset 0 0 5px #282828; */
    }

    /* Handle on hover */
    .menu-item-list::-webkit-scrollbar-thumb:hover {
        background-color: ${getTheme('scrollbarHover', '#dedede')};
        border: 2px solid transparent; // 用來縮小thumb的寬度
        background-clip: content-box;
    }
`

export default MenuStyled;