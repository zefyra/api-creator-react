import i18n, { t } from 'i18next';
import CategoryEnum from 'enum/Category'
import RoleEnum from 'enum/Role'
import { selectGetPermission } from 'store/login';
import { selectRole } from 'store/profile';
import { useGetter } from 'store';


let menuItemList = [{ // 系統管理
    icon: 'users',
    nameSrc: 'system.accountList',
    category: CategoryEnum.system,
    // iconComponent: <UsersSvg className="menu-item-icon" alt="logo" fill={iconColor} />,
    subItemList: [{
        nameSrc: 'subItem.users', // '用戶帳號',
        path: '/users',
        resourceName: 'users',
    }, {
        nameSrc: 'subItem.subUsers', // '用戶子帳號',
        resourceName: 'subUsers',
    }],
    isMenu: true,
}, {
    icon: 'document',
    // iconComponent: <DocumentSvg className="menu-item-icon" alt="logo" fill={iconColor} />,
    nameSrc: 'system.logRecord',
    category: CategoryEnum.system, // 'systemManage',
    resourceName: 'logHistory', // 差異 Record => History
    isMenu: true,
    // }, {
    //     icon: 'shoppingcart',
    //     nameSrc: 'system.moduleShop', // 模組商店
    //     category: CategoryEnum.system,
    //     resourceName: 'moduleShop',
    //     isMenu: true,
    // }, {
    //     icon: 'cube',
    //     nameSrc: 'system.moduleManage',
    //     category: CategoryEnum.system,
    //     resourceName: 'moduleManage',
    //     isMenu: true,
    // }, {
    //     icon: 'cube',
    //     nameSrc: 'system.purchasedModule', // 已購模組
    //     category: CategoryEnum.system,
    //     resourceName: 'purchasedModule',
    //     isMenu: true,
}, {
    icon: 'brdollar',
    nameSrc: 'system.quotaRankManage', // 用量級距管理
    category: CategoryEnum.system,
    path: '/quotaRankManage',
    resourceName: 'quotaRangeManage', // 差異 Rank => Range
    isMenu: true,
}, {
    icon: 'moneycheckedit',
    nameSrc: 'system.myOrder', // 我的訂單
    category: CategoryEnum.system,
    resourceName: 'myOrder',
    isMenu: true,
    path: '/myOrder',
}, {
    icon: 'key',
    nameSrc: 'system.platformPreference',
    category: CategoryEnum.system,
    path: '/platformPreference',
    resourceName: 'platformPerference', // 錯字 Pre => Per
    isMenu: true,
}, {
    icon: 'datatransfer',
    nameSrc: 'system.dataExchange',
    category: CategoryEnum.system,
    resourceName: 'dataExchange',
    isMenu: true,
}, {
    icon: 'gear',
    nameSrc: 'system.developDocumentation', // 開發文件
    category: CategoryEnum.system,
    subItemList: [{
        nameSrc: 'subItem.apiConnectDataCollection', // 'API介接',
        path: '/apiConnect',
        // searchParams: {
        //     category: 'dataCollection'
        // },
        queryString: 'category=dataCollection',
        resourceName: 'apiConnect',
        // }, {
        //     nameSrc: 'subItem.moduleDevelop', // '模組開發',
        //     // path: '/moduleDevelop',
        //     resourceName: 'defaultAuth',
    }],
    isMenu: true,
}, {
    icon: 'gear',
    nameSrc: 'system.setting',
    category: CategoryEnum.system,
    subItemList: [{
        nameSrc: 'subItem.payRelated', // '支付相關',
        path: '/payRelated',
        resourceName: 'payRelated',
    }, {
        nameSrc: 'subItem.defaultAuth', // '預設權限',
        path: '/defaultAuth',
        resourceName: 'defaultAuth',
    }, {
        nameSrc: 'subItem.otherSetting', // '其他設定',
        path: '/otherSetting',
        resourceName: 'otherSetting',
    }],
    isMenu: true,
}, { // 社群管理 ---------------------------------------------
    icon: 'addressbook',
    nameSrc: 'social.socialFriendManage',
    category: CategoryEnum.social,
    path: '/socialFriendManage',
    isMenu: true,
}, {
    icon: 'comments',
    nameSrc: 'social.chatRoom',
    category: CategoryEnum.social,
    isMenu: true,
}, {
    icon: 'envelope',
    nameSrc: 'social.messageBroadcast', // 訊息推播
    path: '/messageBroadcast',
    category: CategoryEnum.social,
    isMenu: true,
}, {
    icon: 'tags',
    nameSrc: 'social.tagManage',
    category: CategoryEnum.social,
    // path: '/tagManage',
    subItemList: [{
        nameSrc: 'subItem.tagCategory', // '標籤分類',
        path: '/tagCategory',
        resourceName: 'tagCategory',
    }, {
        nameSrc: 'subItem.tagList', // '標籤列表',
        path: '/tagList',
        resourceName: 'tagList',
    }],
    isMenu: true,
}, {
    icon: 'robot',
    nameSrc: 'social.robotManage', // 機器人觀禮
    category: CategoryEnum.social,
    isMenu: true,
    subItemList: [{
        nameSrc: 'subItem.scriptList', // '腳本清單',
        // path: '/scriptList',
        resourceName: 'scriptList',
    // }, {
    //     nameSrc: 'subItem.topologyGraph', // 拓樸圖測試 (測試用頁面，之後隱藏)
    //     path: '/topologyGraph',
    //     resourceName: 'topologyGraph',
    }],
}, {
    icon: 'book',
    nameSrc: 'social.knowledgeBase',
    category: CategoryEnum.social,
    subItemList: [{
        nameSrc: 'subItem.categoryList', // '分類列表',
        // path: '/payRelated',
        resourceName: 'payRelated',
    }, {
        nameSrc: 'subItem.articleList', // '文章列表',
        // path: '/defaultAuth',
        resourceName: 'defaultAuth',
    }],
    isMenu: true,
    // }, { // 報表管理(不用做)------------------------------------------
    //     icon: 'ballot',
    //     nameSrc: 'report.behaviorFeature',
    //     category: CategoryEnum.report,
    //     isMenu: true,
    // }, {
    //     icon: 'ballot',
    //     nameSrc: 'report.RFMAnalyze',
    //     category: CategoryEnum.report,
    //     isMenu: true,
    // }, {
    //     icon: 'ballot',
    //     nameSrc: 'report.NESAnalyze',
    //     category: CategoryEnum.report,
    //     isMenu: true,
    // }, {
    //     icon: 'ballot',
    //     nameSrc: 'report.accountingReport',
    //     category: CategoryEnum.report,
    //     isMenu: true,
}, { // 數據集 -------------------------------------------
    icon: 'ballot',
    nameSrc: 'data.customData',
    category: CategoryEnum.data,
    isMenu: true,
    path: '/customData',
    // resourceName: 'platformPerference',
}, {
    icon: 'ballot',
    nameSrc: 'data.sharedData',
    category: CategoryEnum.data,
    isMenu: true,
    path: '/sharedData',
    // queryString: 'category=sharedData',
    // resourceName: 'platformPerference',
}, { // 非Menu頁面 -----------------------------------------------
    path: '/subscribeQuotaPlan',
    nameSrc: 'hide.subscribeQuotaPlan', // 訂閱用戶級距方案
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.system,
    // resourceName: 'subscribeQuotaPlan', // 只要有註冊resourceName，就會在resourceInfoMap註冊
}, {
    path: '/upgradeQuotaPlan',
    nameSrc: 'hide.upgradeQuotaPlan', // 訂閱用戶級距升級
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.system,
    // resourceName: 'upgradeQuotaPlan',
}, {
    path: '/profile',
    nameSrc: 'hide.profile', // 帳號設定
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.system,
    // resourceName: 'subscribeQuotaPlan', // 只要有註冊resourceName，就會在resourceInfoMap註冊
}, {
    path: '/home',
    // nameSrc: 'hide.upgradeQuotaPlan', // 訂閱用戶級距升級
    isMenu: false,
    category: CategoryEnum.system,
    // resourceName: 'upgradeQuotaPlan',
}, {
    path: '/tagDecisionCondition',
    nameSrc: 'social.tagDecisionCondition', // 標籤判斷條件
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.social,
    // resourceName: 'upgradeQuotaPlan',
}, {
    path: '/tagConditionList',
    nameSrc: 'social.tagConditionList', // 標籤判斷條件(標籤條件列表)
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.social,
    // resourceName: 'upgradeQuotaPlan',
}];

// const hidePageList = [{
//     path: '/subscribeQuotaPlan',
//     
//     category: 'systemManage',
//     // resourceName: 'subscribeQuotaPlan',
// }, {
//     path: '/upgradeQuotaPlan',
//     nameSrc: 'hide.upgradeQuotaPlan',
//     category: 'systemManage',
//     // resourceName: 'upgradeQuotaPlan',
// }]

export default class RouteManager {
    pathInfoMap = {}
    /*
    pathMap: {
        '/users': {
            nameSrc: 'subItem.users', // '用戶帳號',
            path: '/users',
            resourceName: 'users',
        }
    } */
    resourceInfoMap = {};
    /* resourceInfoMap: {
        <resourceName>: {

        }
    } */
    constructor() {
        // ps.必須在render才能創建物件，不能寫在外部
        // i18n.t的用法，會導致必須要在Componet內部render時才能創建物件，不能寫在外部
        // 因外部在執行時，i18n的資源尚未載入，因此抓不出字串

        // const vm = this;

        const newPathInfoMap = {};
        const newResourceInfoMap = {};

        const addPathInfo = function (uniItem) {
            // 製作pathMap
            if (uniItem.path) {
                newPathInfoMap[uniItem.path] = uniItem;
            }
        }

        const addResourceInfo = function (item, subItem) {
            let resourceInfo = Object.assign({}, subItem ? subItem : item);

            // resourceInfo

            if (resourceInfo.resourceName) {
                newResourceInfoMap[resourceInfo.resourceName] = resourceInfo;
            }
        }

        this.menuItemList = menuItemList.map((item) => {
            const newItem = Object.assign({}, item);
            newItem.name = i18n.t(`menu:${item.nameSrc}`);

            if (newItem.subItemList) {
                newItem.subItemList = newItem.subItemList.map((subItem) => {
                    subItem = Object.assign({}, subItem);
                    subItem.name = i18n.t(`menu:${subItem.nameSrc}`);
                    // console.log(`subItem: ${subItem.nameSrc}`, subItem);

                    subItem.category = newItem.category;

                    addPathInfo(subItem);
                    addResourceInfo(newItem, subItem)

                    return subItem;
                });
            }

            addPathInfo(newItem); // 製作pathMap
            addResourceInfo(newItem);

            return newItem;
        }).filter((item) => {
            // 將隱藏頁面篩掉
            return item.isMenu === true;
        });

        this.pathInfoMap = newPathInfoMap;
        this.resourceInfoMap = newResourceInfoMap;
    }

    // 使用資源名稱取資料時，使用pathInfoMap
    getResourceInfo(resourceName) {
        return this.resourceInfoMap[resourceName];
    }

    // removeTailSlash(path) {
    //     if (path !== '') {
    //         if (path[path.length - 1] === '/') {
    //             // console.log(`getPathInfo path`, path)

    //             /* {
    //                 hash: ""
    //                 key: "default"
    //                 pathname: "/apiConnect/" // <--要自動將接尾的 '/' 切掉
    //                 search: "?category=dataCollection"
    //                 state: null
    //             } */

    //             // 自動將接尾的 '/' 切掉
    //             path = path.slice(0, path.length - 1);
    //         }
    //     }
    //     return path;
    // }

    // 使用路由取資料時，使用pathInfoMap
    getPathInfo(path) {
        path = this.removeTrailingSlash(path);
        if (path !== '') {
            if (path[path.length - 1] === '/') {
                // console.log(`getPathInfo path`, path)

                /* {
                    hash: ""
                    key: "default"
                    pathname: "/apiConnect/" // <--要自動將接尾的 '/' 切掉
                    search: "?category=dataCollection"
                    state: null
                } */

                // 自動將接尾的 '/' 切掉
                path = path.slice(0, path.length - 1);
            }
        }

        const pathInfo = this.pathInfoMap[path];
        if (!pathInfo) {
            console.error(`RouteManager getPathInfo: path \`${path}\` pathInfo not exist`, this.pathInfoMap)
        }
        // console.log(`getPathInfo path`, path)
        // console.log(`getPathInfo pathInfoMap`, this.pathInfoMap)
        // console.log(`getPathInfo pathInfoMap[${path}]`, this.pathInfoMap[path])
        return pathInfo;
    }

    getMenuItemList() {
        return this.menuItemList;
    }

    // 篩選有權限的menu項目
    getMenuItemListByAuth(category, getPermission) { // 
        // const getPermission = useGetter(selectGetPermission);
        const role = useGetter(selectRole);
        const menuItemList = this.getMenuItemList();

        const permissionItemResult = function (resourceName, permissionItem) {
            if (!permissionItem) {
                // 代表尚未設定該resourceName
                // console.error(`resourceName: ${resourceName} has no permissionItem`);
                return false;
            }

            return permissionItem.enabled === true;
        }

        return menuItemList.filter((menuItem) => {
            if (menuItem.category !== category) {
                return false; // 代表是不同類別，不顯示
            }

            // console.log('menuItem', menuItem);
            // console.log('role', role);

            if (role === RoleEnum.admin) {
                // 暫時打開，adminc會自動顯示所有項目
                return true;
            }

            // 篩選menu項目的權限--------------------------

            if (menuItem.resourceName) {
                // 一般menuItem: 有權限key，直接取
                const permissionItem = getPermission(menuItem.resourceName);


                // console.log('permissionItem', permissionItem);

                return permissionItemResult(menuItem.resourceName, permissionItem);
            }
            // 父級menuItem: 沒有權限key，代表是parent item，要跑所有subItem
            if (menuItem.subItemList) {
                return menuItem.subItemList.some((subItem) => {
                    const permissionItem = getPermission(subItem.resourceName)
                    // console.log(`subItem permission`, permissionItem)

                    return permissionItemResult(menuItem.resourceName, permissionItem);
                });
            }
            return false;
        });
    }

    getProtectedRoutePageAuth(pathInfo) {

        if (!pathInfo.resourceName) {
            // 代表該路由沒有resourceName，屬於隱藏頁面

            // ps.隱藏頁面的權限驗證，現在暫時不做，未來要做權限檢查
            return true;
        }
        const getPermission = useGetter(selectGetPermission);
        const role = useGetter(selectRole);

        if (role === RoleEnum.admin) {
            // 暫時打開，admin會自動顯示所有項目
            return true;
        }

        const permissionItem = getPermission(pathInfo.resourceName)

        if (!permissionItem) {
            return false;
        }
        return permissionItem.enabled === true;
    }
    removeTrailingSlash(path) {
        if (path.match('/.*/$')) {
            return path.replace(/\/+$/, "");
        }
        return path;
    }
    findCategory(path) {
        // '/apiConnect/' => '/apiConnect'
        path = this.removeTrailingSlash(path);

        // console.log(`findCategory`, path, this.pathInfoMap)
        const pathInfo = this.pathInfoMap[path];
        // console.log(`pathInfo`, pathInfo)

        if (!pathInfo) {
            console.error(`RouteManager: path \`${path}\` pathInfo not exist`);
            return '';
        }
        if (!pathInfo.category) {
            console.error(`RouteManager: path \`${path}\` pathInfo have no category`, pathInfo);
            return '';
        }

        return pathInfo.category;
    }
}