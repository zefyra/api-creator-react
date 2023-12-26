import i18n, { t } from 'i18next';
import CategoryEnum from 'enum/Category'
import RoleEnum from 'enum/Role'
import { selectGetPermission } from 'store/login';
import { selectRole } from 'store/profile';
import { useGetter } from 'store';
import LocalAccessor from 'localAccessor';
import ApiSender, { ApiError } from 'apiSender';


let menuItemList = [{ // 系統管理
    icon: 'users',
    nameSrc: 'system.accountList',
    category: CategoryEnum.system,
    // iconComponent: <UsersSvg className="menu-item-icon" alt="logo" fill={iconColor} />,
    subItemList: [{
        nameSrc: 'subItem.users', // '用戶帳號',
        path: '/users',
        resourceName: 'users',
    }],
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
    }, {
        nameSrc: 'subItem.apiConnectDataCollection', // 'API介接',
        path: '/apiManage',
        // searchParams: {
        //     category: 'dataCollection'
        // },
        queryString: 'category=dataCollection',
        resourceName: 'apiConnect',
    }],
    isMenu: true,
}, {
    icon: 'gear',
    nameSrc: 'system.setting',
    category: CategoryEnum.system,
    subItemList: [{
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
}, { // 數據集 -------------------------------------------
    icon: 'ballot',
    nameSrc: 'data.customData',
    category: CategoryEnum.data,
    isMenu: true,
    path: '/customData',
    // resourceName: 'platformPerference',
}, {
    path: '/profile',
    nameSrc: 'hide.profile', // 帳號設定
    isMenu: false, // 代表是隱藏頁
    category: CategoryEnum.system,
    // resourceName: 'subscribeQuotaPlan', // 只要有註冊resourceName，就會在resourceInfoMap註冊
}, {
    path: '/home',
    // nameSrc: 'hide.upgradeQuotaPlan', // 首頁
    isMenu: false,
    category: CategoryEnum.system,
    // resourceName: 'upgradeQuotaPlan',
}, {
    path: '/',
    // nameSrc: 'hide.upgradeQuotaPlan', // 首頁
    isMenu: false,
    category: CategoryEnum.system,
    // resourceName: 'upgradeQuotaPlan',
}, {
    path: '/chartTest',
    // nameSrc: 'hide.upgradeQuotaPlan', // 測試用
    isMenu: false,
    category: CategoryEnum.system,
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




        // system
        let menuList = [
            {
                "icon": "users",
                "nameSrc": "system.accountList",
                "category": "system",
                "subItemList": [
                    {
                        "nameSrc": "subItem.users",
                        "path": "/users",
                        "resourceName": "users",
                        "name": "用戶帳號",
                        "category": "system"
                    }
                ],
                "isMenu": true,
                "name": "帳號列表"
            },
            {
                "icon": "gear",
                "nameSrc": "system.developDocumentation",
                "category": "system",
                "subItemList": [
                    {
                        "nameSrc": "subItem.apiConnectDataCollection",
                        "path": "/apiConnect",
                        "queryString": "category=dataCollection",
                        "resourceName": "apiConnect",
                        "name": "API介接 - 數據集",
                        "category": "system"
                    },
                    {
                        "nameSrc": "subItem.apiConnectShakuApi",
                        "path": "/apiManage",
                        "queryString": "category=shakuApi",
                        "resourceName": "apiConnect",
                        "name": "API介接 - ShakuAPI",
                        "category": "system"
                    }
                ],
                "isMenu": true,
                "name": "開發文件"
            },
            {
                "icon": "gear",
                "nameSrc": "system.setting",
                "category": "system",
                "subItemList": [
                    {
                        "nameSrc": "subItem.otherSetting",
                        // "path": "/otherSetting",
                        "resourceName": "otherSetting",
                        "name": "其他設定",
                        "category": "system"
                    }
                ],
                "isMenu": true,
                "name": "設定"
            }
        ];

        let apiDocList = LocalAccessor.getItem('apiDocList');

        const customApiDocSubMenuList = apiDocList.filter((apiDocItem) => {
            // console.log('apiDocItem', apiDocItem)
            return true;
        }).map((apiDocItem) => {
            return {
                // "nameSrc": "subItem.cccccc",
                "path": "/apiManage",
                // "queryString": "category=shakuApi",
                "queryString": `fileName=${apiDocItem.fileName}`,
                "resourceName": "apiConnect",
                "name": apiDocItem.fileName,
                "category": "system"
            };
            // return {
            //     "nameSrc": "subItem.apiConnectShakuApi",
            //     "path": "/apiManage",
            //     "queryString": "category=shakuApi",
            //     "resourceName": "apiConnect",
            //     "name": "API介接 - ShakuAPI",
            //     "category": "system"
            // }
        });

        const customMenuList = [{
            "icon": "gear",
            "nameSrc": "system.developDocumentation",
            "category": "system",
            "subItemList": customApiDocSubMenuList,
            "isMenu": true,
            "name": "自訂API文件"
        }];
        menuList = menuList.concat(customMenuList)



        return menuList;


        // system
        // return [{ "icon": "users", "nameSrc": "system.accountList", "category": "system", "subItemList": [{ "nameSrc": "subItem.users", "path": "/users", "resourceName": "users", "name": "用戶帳號", "category": "system" }, { "nameSrc": "subItem.subUsers", "resourceName": "subUsers", "name": "用戶子帳號", "category": "system" }], "isMenu": true, "name": "帳號列表" }, { "icon": "document", "nameSrc": "system.logRecord", "category": "system", "resourceName": "logHistory", "isMenu": true, "name": "log紀錄" }, { "icon": "brdollar", "nameSrc": "system.quotaRankManage", "category": "system", "path": "/quotaRankManage", "resourceName": "quotaRangeManage", "isMenu": true, "name": "用量級距管理" }, { "icon": "moneycheckedit", "nameSrc": "system.myOrder", "category": "system", "resourceName": "myOrder", "isMenu": true, "path": "/myOrder", "name": "我的訂單" }, { "icon": "key", "nameSrc": "system.platformPreference", "category": "system", "path": "/platformPreference", "resourceName": "platformPerference", "isMenu": true, "name": "平台參數" }, { "icon": "datatransfer", "nameSrc": "system.dataExchange", "category": "system", "resourceName": "dataExchange", "isMenu": true, "name": "資料介接" }, { "icon": "gear", "nameSrc": "system.developDocumentation", "category": "system", "subItemList": [{ "nameSrc": "subItem.apiConnectDataCollection", "path": "/apiConnect", "queryString": "category=dataCollection", "resourceName": "apiConnect", "name": "API介接 - 數據集", "category": "system" }], "isMenu": true, "name": "開發文件" }, { "icon": "gear", "nameSrc": "system.setting", "category": "system", "subItemList": [{ "nameSrc": "subItem.payRelated", "path": "/payRelated", "resourceName": "payRelated", "name": "支付相關", "category": "system" }, { "nameSrc": "subItem.defaultAuth", "path": "/defaultAuth", "resourceName": "defaultAuth", "name": "預設權限", "category": "system" }, { "nameSrc": "subItem.otherSetting", "path": "/otherSetting", "resourceName": "otherSetting", "name": "其他設定", "category": "system" }], "isMenu": true, "name": "設定" }];

        // social
        // return [{"icon":"addressbook","nameSrc":"social.socialFriendManage","category":"social","path":"/socialFriendManage","isMenu":true,"name":"社群好友管理"},{"icon":"comments","nameSrc":"social.chatRoom","category":"social","isMenu":true,"name":"即時聊天室"},{"icon":"envelope","nameSrc":"social.messageBroadcast","path":"/messageBroadcast","category":"social","isMenu":true,"name":"訊息推播"},{"icon":"tags","nameSrc":"social.tagManage","category":"social","subItemList":[{"nameSrc":"subItem.tagCategory","path":"/tagCategory","resourceName":"tagCategory","name":"標籤分類","category":"social"},{"nameSrc":"subItem.tagList","path":"/tagList","resourceName":"tagList","name":"標籤列表","category":"social"}],"isMenu":true,"name":"標籤管理"},{"icon":"robot","nameSrc":"social.robotManage","category":"social","isMenu":true,"subItemList":[{"nameSrc":"subItem.scriptList","resourceName":"scriptList","name":"腳本清單","category":"social"}],"name":"機器人管理"},{"icon":"book","nameSrc":"social.knowledgeBase","category":"social","subItemList":[{"nameSrc":"subItem.categoryList","resourceName":"payRelated","name":"分類列表","category":"social"},{"nameSrc":"subItem.articleList","resourceName":"defaultAuth","name":"文章列表","category":"social"}],"isMenu":true,"name":"知識庫"}];

        // dataCollection
        // return [{"icon":"ballot","nameSrc":"data.customData","category":"data","isMenu":true,"path":"/customData","name":"自訂數據"},{"icon":"ballot","nameSrc":"data.sharedData","category":"data","isMenu":true,"path":"/sharedData","name":"共用數據"}]
        /*
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
        */
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