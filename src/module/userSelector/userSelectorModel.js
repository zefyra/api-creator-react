import { TableSelectModeEnum } from "enum/Table";
import StateModel from "model/StateModel";
import TableHeader from "util/TableHeader";

const getUserTableHeader = function (t) {
    return new TableHeader({
        rowSelect: {
            // mode: 'singleSelect', // 代表只能單選
            mode: TableSelectModeEnum.multi,
        },
        header: [{
            label: '',
            key: '__rowSelect', // '__rowSelect'==>代表和 __rowSelect 連動
            type: 'checkBox',
            // mode: 'singleSelect', // checkBox已和 '__rowSelect' 掛鉤的情況下，這邊的mode沒有效果
            width: '57px',
        }, {
            label: 'ID',
            key: 'accountId',
            type: 'text',
            fetch: 'accountId',
            width: '113px',
        }, {
            label: t('portrait'), // 頭像
            key: 'portraitUrl',
            type: 'img',
            width: '120px',
            imgStyle: { // 用來設定圖像的style
                width: '50px',
                height: '50px',
            },
            fetch: 'portraitUrl',
            // clickable: true,
        }, {
            label: t('name'), //  '名稱',
            key: 'name',
            type: 'text',
            // fetch: 'account.username',
            // }, {
            //     label: t('account'), //  '帳號',
            //     key: 'account',
            //     type: 'text',
            //     // fetch: 'account.email',
            fetch: 'name',
            width: '113px',
        }, {
            label: t('userState'), //  '用戶狀態',
            key: 'userState',
            type: 'text',
            fetch: 'userState',
            width: '113px',
        }],
    });
}

export class UserSelectorModel extends StateModel {
    data(initObj = {}) {
        // t: ('social', keyPrefix: 'userSelectTable')
        return {
            tagList: [],
            userTableLoading: false,
            tableHeader: getUserTableHeader(initObj.t || (val => val)),
            t: initObj.t,
            searchName: '',
            userSelectModal: null, // ref
        }
    }
    // sight() {
    //     return {
    //         tagList: {}
    //     }
    // }
    // watch() {
    //     return {
    //         tagList(tagList) {
    //             console.log('tagList', tagList);
    //         }
    //     }
    // }
    addTag(cellInfo) {
        // console.log(`addTag`, cellInfo);

        // cellInfo: [get]user-select
        const row = cellInfo.getRow();

        let tagList = this.getState('tagList');
        const existIndex = tagList.findIndex((eachTag) => {
            return eachTag.accountId === row.accountId;
        });

        tagList = tagList.map(val => val);

        if (existIndex >= 0) {
            // 代表相同的accountId已經存在，不加入
            return;
        }

        tagList.push({
            label: row.name,
            accountId: row.accountId,
            row: row,
        });

        this.setState('tagList', tagList);


        // console.log(`addTag`, this.getState('tagList'));
    }
    removeTag(accountId) {

        let tagList = this.getState('tagList');

        const existIndex = tagList.findIndex((eachTag) => {
            return accountId === eachTag.accountId;
        });
        if (existIndex < 0) {
            return;
        }

        tagList = tagList.map(val => val);
        tagList.splice(existIndex, 1);

        this.setState('tagList', tagList);
    }
}