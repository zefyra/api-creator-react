import ParameterTypeEnum from "enum/apiConnect/ParameterType";
import SwaggerPropertyTypeEnum from "enum/apiConnect/SwaggerPropertyType";
import StateModel from "model/StateModel";

export default class ApiManageModel extends StateModel {
    data(initObj = {}) {
        return {
            viewMode: 'board',
            // ModalRef----------------------------------------
            addTagModalRef: null,
            addApiModalRef: null,
            addBodyModalRef: null,
            editTagModalRef: null,
            addResModalRef: null,
            editAttrModalRef: null,
            addApiDocModalRef: null,
            addQueryModalRef: null,
            addSecurityRef: null,
            apiSettingModalRef: null,
            // json config-----------------------------------------
            fileName: '',
            jsonPath: '', // 'http://localhost:5050/apiDoc/api-creator.json'
            docType: '', // 'swagger2', 'openapi3'
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
            }, {
                label: 'PATCH',
                value: 'patch',
            }],
        }
    }
}


export class AddBodyModel extends StateModel {
    data(initObj = {}) {
        return {
            apiRoute: '',
            apiType: '',
            rootType: '',
            schema: '',
            // aside--------------------------
            gqlJsonSrc: '',
        }
    }
    // filter() {
    //     return {
    //         schema: function (val) {
    //             // console.log('schema filter', val);
    //             // return val + 'C';

    //             if (/[(\r\n|\r|\n)]{2}/g.test(val)) {
    //                 val = val.replace(/[(\r\n|\r|\n)]{2}/g, "\r\n   \r\n");
    //                 console.log('rep', val);
    //             }

    //             return val;
    //         }
    //     }
    // }
}

export class EditTagModel extends StateModel {
    data(initObj = {}) {
        return {
            tagName: '',
            summary: '',
        };
    }
}


export class AddResModel extends StateModel {
    data(initObj = {}) {

        // "fileName": "qore-plus-api",
        // "apiRoute": "/api/friend",
        // "apiType": "post",
        // "rootType": "SYSTEM_FRIEND",
        // "schema": null,
        // "resType": "200",
        // "description": null

        return {
            apiRoute: '',
            apiType: '',
            rootType: '',
            schema: '',
            resType: '200',
            description: '',
            // -------------------------
            resTypeOptionList: [{
                label: '200',
                value: '200',
            }, {
                label: '500',
                value: '500'
            }],
            // aside--------------------------
            gqlJsonSrc: '',
        };
    }
}

export class EditAttrModel extends StateModel {
    data() {
        return {
            // 判別參數類型
            paramType: '',
            // 查詢參數
            apiType: '',
            apiRoute: '',
            tags: [],
            attrName: '',
            layerPath: [],
            attrSrc: '',
            // 可修改的項目
            newAttrName: '',
            defaultValue: '',
            valueType: '',
            valueTypeOptionList: [{
                value: 'string',
                label: 'String',
            }, {
                value: 'integer',
                label: 'Int',
            }, {
                value: 'boolean',
                label: 'Boolean',
            }],
            description: '',
            required: 'true',
            requiredOptionList: [{
                label: 'true',
                value: 'true'
            }, {
                label: 'false',
                value: 'false'
            }],
            // 原始參數
            originAttrName: '',
            originDefaultValue: '',
            originValueType: '',
            originDescription: '',
            originRequired: '',
        }
    }
}

export class AddApiDocModel extends StateModel {
    data() {
        return {
            fileName: '',
            title: '',
            host: '',
            docType: 'openapi3',
            docTypeOptionList: [{
                label: 'OpenAPI 3.0',
                value: 'openapi3'
            }, {
                label: 'Swagger 2.0',
                value: 'swagger2'
            }]
        }
    }
}

export class AddQueryModel extends StateModel {
    data() {
        return {
            apiRoute: '',
            apiType: '',
            //swagger-------------------------------
            type: SwaggerPropertyTypeEnum.string,
            name: '',
            in: ParameterTypeEnum.query,
            default: '',
            description: '',
            enum: '',
        }
    }
}



export class AddSecurityModel extends StateModel {
    data() {
        return {
            securityKey: '', // scheme field name
            key: '', // data key
            type: 'apiKey', // 'apiKey'    other: 'http'
            in: 'header', // 'header'
            description: '',
            securityTypeOptionList: [{
                label: 'apiKey',
                value: 'apiKey',
            }],
            securityInOptionList: [{
                label: 'header',
                value: 'header',
            }],
        }
    }
}


export class ApiSettingModel extends StateModel {
    data() {
        return {
            apiRoute: '',
            apiType: '',
            securityKey: '', // scheme field name
            securityKeyOptionList: [{
                label: 'Token',
                value: 'Token',
            }],
        }
    }
    setSecurityKey(securityList) {
        // this.setState('securityKeyOptionList', json);
        /* securityList: [{
            // <securityKey>: []
            Token: []
        }] */
        if (!securityList) {
            this.setState('securityKey', '');
            return;
        }

        if (securityList.length !== 1) {
            this.setState('securityKey', '');
            return;
        }

        const obj = securityList[0];

        const keyList = Object.keys(obj);
        if (keyList.length !== 1) {
            this.setState('securityKey', '');
            return;
        }
        const securityKey = keyList[0];

        // console.log('securityKey', securityKey);

        this.setState('securityKey', securityKey);
    }

    setSecurityOptionList(securityList) {
        console.log('setSecurityOptionList', securityList);
        /* securityList: [{
            "type": "apiKey",
            "name": "authorization",
            "in": "header",
            "description": "login取得的token"
        }] */

        const securityKeyOptionList = securityList.map((obj) => {
            return {
                label: obj.securityKey,
                value: obj.securityKey,
            }
        });

        this.setState('securityKeyOptionList', securityKeyOptionList);
    }
}
