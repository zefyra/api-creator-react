
// 原版: 會連絕對路徑都篩出來
// const AccessorObj = require.context('./accessor', true, /\/[A-Za-z0-9-_,.\s]+\.js$/i);

// 限定只篩入 './' 開頭的.js路由
const Accessor = require.context('./accessor', true, /\.\/[A-Za-z0-9-_,.\s]+\.js$/i);

// console.log('aaaa', aaaa )

let accessorMap = new Map();

Accessor.keys().forEach(fileName => {
    // fileName: './lang.js',
    // console.log(`AccessorObj fileName=${fileName}`);

    const fileObj = Accessor(fileName);

    let fileKey = fileName.replace(/^\.\//, ""); // 去除開頭的'./'
    fileKey = fileKey.replace(/\.js$/, ""); // 去除結尾的'.js'

    // console.log(`Accessor fileKey=${fileKey}`);

    accessorMap.set(fileKey, fileObj);
});

export default class LocalAccessor {
    accessor = null;
    // constructor(key){ // 尚未用到
    //     let AccessorClass = accessorMap.get(key);

    //     // new一個物件出來
    //     this.accessorObj = new AccessorClass.default();
    // }
    constructor(key) {
        //         import PermissionAccessor from 'localAccessor/accessor/permission'
        // new PermissionAccessor()
        let AccessorClassObj = accessorMap.get(key);
        let AccessorClass = AccessorClassObj ? AccessorClassObj.default : null;

        if (!AccessorClass) {
            console.error(`AccessorClass not exist`);
            return;
        }

        this.accessor = new AccessorClass();
    }
    getAcceor() {
        return this.accessor;
    }
    static setItem(key, data) {
        let AccessorClass = accessorMap.get(key);
        if (AccessorClass && AccessorClass.default.setter) {
            // 直接使用static函式
            AccessorClass.default.setter(data);
            return;
        }

        let dataStr;
        if (typeof data === 'string') {
            dataStr = data;
        } else {
            dataStr = JSON.stringify(data);
        }
        localStorage.setItem(key, dataStr);
    }
    static getItem(key) {

        let AccessorClass = accessorMap.get(key);

        if (!AccessorClass) {
            // 代表沒有設定accessor，直接回傳
            return localStorage.getItem(key);
        }

        // if (this.accessorObj) {
        //     // 有使用constructor的情況

        //     // [目前不支援]
        //     return localStorage.getItem(key);
        // }

        // 直接使用static函式
        if (!AccessorClass.default.getter) {
            // 代表沒有設定getter，直接回傳
            return localStorage.getItem(key);
        }

        return AccessorClass.default.getter();
    }
    static removeItem(key) {
        let AccessorClass = accessorMap.get(key);
        if (AccessorClass && AccessorClass.default.remover) {
            // 直接使用static函式
            AccessorClass.default.remover();
            return;
        }
        localStorage.removeItem(key);
    }
    // // 非同步
    // static async getItemAsync (){

    // }

    // static async setItemAsync (){

    // }
}