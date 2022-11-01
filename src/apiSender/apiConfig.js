
import ApiFake from "./apiFake";
// import get_permissions from "./fakeRes/get_permissions"

const apiConfigMap = {
    // '[put]/auth/activate/{token}': {
    //     header: 'jwtTokenHeader',
    //     errorHandle: { // 統一用來設定error時的處理模式
    //         '404': 'none', // response為 404 時，不執行預設處理
    //     }
    // },

    // auth ------------------------------------------
    '[post]/auth/signin': {}, // 登入
    '[post]/auth/signup': {}, // 註冊
    '[get]/auth/forgot-password/{email}': {}, // 忘記密碼: 送出密碼重置用的email
    '[put]/auth/reset-password/{token}': {}, // 重置密碼: 送出新密碼
    '[get]/auth/activate/{email}': { // 發送驗證信
        // header: 'jwtTokenHeader',
    },
    '[put]/auth/activate/{token}': { // 激活帳號
        // header: 'jwtTokenHeader',
    },
    '[get]/accounts/profile': { // 取得個人資訊
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[get]/industries': { // 產業列表
        header: 'bearerTokenHeader',
        outputType: 'crossbotRows',
    },
    '[get]/permissions': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
        // fakeRes: get_permissions,
        // apiUrl: 'http://localhost:8091/api/permissions', // [之後刪]mock-server，正式API完成後刪除
    },
    '[put]/permissions': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
        // apiUrl: 'http://localhost:8091/api/permissions', // [之後刪]mock-server，正式API完成後刪除
    },
    // [API要補]暫時先跳過permission的API
    // console.warn(`permissions api not exist`);
    // account-entities ---------------------------------------
    // '[post]/users/list': { // 假的: api-mock-server測試表格取API用的
    //     header: 'bearerTokenHeader',
    //     apiUrl: 'http://localhost:8032/api/users/list', // 強制寫入呼叫的apiUrl，用來呼叫mock-server
    //     outputType: 'crossbot', // 資料輸出格式: 預設是'raw'
    // }
    '[get]/account-entities': {
        header: 'bearerTokenHeader',
        outputType: 'crossbotTable',
    },
    '[get]/account-entities/{id}': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[put]/account-entities/{id}': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[post]/account-entities': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[delete]/account-entities/{id}': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[put]/account-entities/{id}/toggle-enabled': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[get]/entities/{entity_id}/platforms': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
        // apiUrl: 'http://localhost:8091/api/entities/22/platforms',
    },
    '[post]/entities/{entity_id}/platforms': { // 目前參數還有問題
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    // account-entities (QuotaRank) ---------------------------------------
    '[get]/price-intervals': {
        header: 'bearerTokenHeader',
        outputType: 'crossbotTable',
    },
    '[post]/price-intervals': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    '[put]/price-intervals/{id}': {
        header: 'bearerTokenHeader',
        outputType: 'crossbot',
    },
    // 測試用的mockserver api(之後刪or改掉)---------------------------------------
    '[get]/message-broadcast': {
        header: 'bearerTokenHeader',
        outputType: 'crossbotTable',
        apiUrl: 'http://localhost:8091/api/message-broadcast',
    },
    '[get]/message-broadcast/detail': {
        header: 'bearerTokenHeader',
        outputType: 'crossbotTable',
        apiUrl: 'http://localhost:8091/api/message-broadcast/detail',
    },
    '[get]/user-select': {
        header: 'bearerTokenHeader',
        outputType: 'crossbotTable',
        apiUrl: 'http://localhost:8091/api/user-select',
    }
};

// const apiConfigExtendMap = {
//     '[put]/auth/activate/{token}': {
//         <=== 新增的欄位
//     },
// };

let apiConfigExtendMap = {};

Object.keys(apiConfigMap).forEach((uniApiKey) => {
    apiConfigExtendMap[uniApiKey] = apiConfigMap[uniApiKey];
});

export default class ApiConfig {
    uniApiKey = ''
    constructor(uniApiKey) {
        this.uniApiKey = uniApiKey;
        this.config = apiConfigExtendMap[uniApiKey];

        if (!this.config) {
            console.error(`${uniApiKey} apiConfig not found`);
        }
    }

    getConfig() {
        return this.config;
    }

    // 取得是否有額外設定的apiUrl
    getApiConfigUrl() {
        return this.config.apiUrl || null;
    }

    getOutputType() {
        return this.config.outputType;
    }
    // // 檢查是否為fakeApi
    // checkFakeApi() {
    //     return ApiFake.checkFakeApi(this);
    // }
}