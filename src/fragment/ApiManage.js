import StateModel from "model/StateModel";

export default class ApiManageModel extends StateModel {
    data(initObj = {}) {
        return {
            // ModalRef----------------------------------------
            addTagModalRef: null,
            addApiModalRef: null,
            // json config-----------------------------------------
            fileName: '',
            jsonPath: '',
        }
    }
    bindModalRef(srcKey, ref) {
        // srcKey: 'addTagModal'
        const vm = this;

        // console.log('bindModalRef', ref)

        if (srcKey === 'addTagModal') {
            vm.setState('addTagModalRef', ref);
        }
    }
}

export class AddTagModel extends StateModel {
    data(initObj = {}) {
        return {
            // AddTagModal----------------------------------------
            name: '',
            description: '',
            groupName: '',
        }
    }
}

export class AddApiModel extends StateModel {
    data(initObj = {}) {
        return {
            summary: '', // API名稱
            apiRoute: '', // API路徑
            tags: [], // 標籤
            apiType: '', // request類別
            // "apiRoute": "/api/friend",
            // "apiType": "get",
            // "tags": ["friend"],
            // "summary": "1-1.list friend"
            apiTypeOptionList: [{
                label: 'POST',
                value: 'post',
            }, {
                label: 'GET',
                value: 'get',
            }, {
                label: 'PUT',
                value: 'put',
            }, {
                label: 'DELETE',
                value: 'delete',
            }],
        }
    }
}