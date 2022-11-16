import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import ApiConnectModel from "fragment/ApiConnect";
import ApiJsonModel from "fragment/ApiJson";
import ApiManageModel, { AddApiDocModel, AddApiModel, AddBodyModel, AddQueryModel, AddResModel, AddTagModel, EditAttrModel, EditTagModel } from "fragment/ApiManage";
import FileSaver from 'file-saver';
import uniqid from 'uniqid';

export class ApiManageControl extends Control {
    circuit() {
        return {
            confirm: true,
            tip: true,
            notify: true,
        }
    }

    frame() {
        return {
            apiDoc: ApiConnectModel.name,
            apiManage: ApiManageModel.name,
            addTag: AddTagModel.name,
            addApi: AddApiModel.name,
            editTag: EditTagModel.name,
            addBody: AddBodyModel.name,
            addRes: AddResModel.name,
            editAttr: EditAttrModel.name,
            addApiDoc: AddApiDocModel.name,
            apiJson: ApiJsonModel.name,
            addQuery: AddQueryModel.name
        }
    }

    fetchJson() {
        const vm = this;

        const jsonPath = this.fetchModel('apiManage').getState('jsonPath');
        // console.log('jsonPath', jsonPath);
        return fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {

                const docType = vm.fetchModel('apiManage').getState('docType');

                vm.fetchModel('apiJson').saveJsonDoc(json); // ps.順序要在前面，否則因為saveApiDoc的程序，會把attributes等欄位塞進去，導致多出不必要的欄位
                vm.fetchModel('apiDoc').saveApiDoc(json, docType);
            })
            .catch(new ApiError(function (error, next) {
                console.error(error);
                next(`apiDoc json fetch fail`);
            }).catchErrorMsg());
    }

    onClickAddTag() {
        console.log('onClickAddTag');

        // const tagList = this.fetchModel('apiDoc').getState('tagList');
        // tagList.push({

        // });

        const addTagModalRef = this.fetchModel('apiManage').getState('addTagModalRef');
        // console.log('addTagModalRef', addTagModalRef)
        if (addTagModalRef) {
            addTagModalRef.openModal();
        }
    }


    onCancelAddTag() {
        const addTagModalRef = this.fetchModel('apiManage').getState('addTagModalRef');
        // console.log('addTagModalRef', addTagModalRef)
        if (addTagModalRef) {
            addTagModalRef.closeModal();
        }
    }

    async onConfirmAddTag() {
        const vm = this;
        const addTagModel = this.fetchModel('addTag');

        const apiParam = {
            name: addTagModel.getState('name'),
            description: addTagModel.getState('description'),
            groupName: addTagModel.getState('groupName'),
            fileName: this.fetchModel('apiManage').getState('fileName'),
        };

        await ApiSender.sendApi(`[post]/addTag`, apiParam).catch(new ApiError().catchAlertMsg())

        const addTagModalRef = this.fetchModel('apiManage').getState('addTagModalRef');

        if (addTagModalRef) {
            addTagModalRef.closeModal();
        }

        vm.fetchJson();
    }

    onClickRemoveTag(tagName) {
        console.log('onClickRemoveTag', tagName);
        const vm = this;

        const apiParam = {
            fileName: vm.fetchModel('apiManage').getState('fileName'),
            name: tagName,
        };

        this.fetchControl('confirm').confirm(`是否刪除 ${tagName} 標籤？`).then((action) => {

            if (action === 'confirm') {
                ApiSender.sendApi('[post]/removeTag', apiParam).then(() => {
                    return vm.fetchControl('tip').tip('刪除成功');
                }).then(() => {
                    vm.fetchJson();
                }).catch(new ApiError().catchAlertMsg());
            }
        });
    }

    onClickTagEdit(tagData) {
        console.log(`onClickTagEdit`, tagData);
        /* tagData: {
            apiList: [{…}, {…}, {…}, {…}]
            description: "friend description"
            groupName: "friend groupName"
            name: "friend"
        } */

        this.fetchModel('editTag').setState('tagName', tagData.name);
        this.fetchModel('editTag').setState('summary', tagData.groupName);

        const editTagModalRef = this.fetchModel('apiManage').getState('editTagModalRef');
        if (editTagModalRef) {
            editTagModalRef.openModal();
        }
    }
    onCancelEditTag() {
        const editTagModalRef = this.fetchModel('apiManage').getState('editTagModalRef');
        if (editTagModalRef) {
            editTagModalRef.closeModal();
        }
    }
    onConfirmEditTag() {
        const vm = this;
        const apiParam = {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            tagName: this.fetchModel('editTag').getState('tagName'),
            // edit---------------------------------------
            summary: this.fetchModel('editTag').getState('summary'),
        }

        ApiSender.sendApi('[post]/editTag', apiParam).then(() => {

            const editTagModalRef = vm.fetchModel('apiManage').getState('editTagModalRef');
            if (editTagModalRef) {
                editTagModalRef.closeModal();
            }

            vm.fetchJson();
        }).catch(new ApiError().catchAlertMsg());
    }

    onEditTagName() {
        const vm = this;

        /*
        const apiParam = {
            fileName: vm.fetchModel('apiManage').getState('fileName'),
            name: tagName,
        };

        this.fetchControl('confirm').confirm(`是否刪除 ${tagName} 標籤？`).then((action) => {

            if (action === 'confirm') {
                ApiSender.sendApi('[post]/removeTag', apiParam).then(() => {
                    return vm.fetchControl('tip').tip('刪除成功');
                }).then(() => {
                    vm.fetchJson();
                }).catch(new ApiError().catchAlertMsg());
            }
        });*/
    }


    onClickAddApi(tagData) {
        // console.log('onClickAddApi', JSON.stringify(tagData))
        /* tagData: {
            "name": "friend",
            "description": "friend description",
            "groupName": "friend groupName",
            "apiList": [ .. ]
        } */

        // console.log('onClickAddApi tag', [tagData.name])
        this.fetchModel('addApi').setState('tags', [tagData.name])

        const addApiModalRef = this.fetchModel('apiManage').getState('addApiModalRef');
        if (addApiModalRef) {
            addApiModalRef.openModal();
        }
    }

    onCancelAddApi() {
        const addApiModalRef = this.fetchModel('apiManage').getState('addApiModalRef');

        if (addApiModalRef) {
            addApiModalRef.closeModal();
        }
    }

    async onConfirmAddApi() {
        const vm = this;
        const addApiModel = this.fetchModel('addApi');

        const apiParam = {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            summary: addApiModel.getState('summary'),
            apiRoute: addApiModel.getState('apiRoute'),
            apiType: addApiModel.getState('apiType'),
            tags: addApiModel.getState('tags'),
        };

        // console.log('apiParam', apiParam)

        await ApiSender.sendApi(`[post]/addApi`, apiParam).catch(new ApiError().catchAlertMsg())

        const addApiModalRef = this.fetchModel('apiManage').getState('addApiModalRef');

        if (addApiModalRef) {
            addApiModalRef.closeModal();
        }

        vm.fetchJson();
    }

    /* 暫不使用: 因無法逆向把body轉成gql格式
    getBody(apiData) {
        console.log('parameters', apiData.apiData.parameters);

        let bodyObj = '';
        if (apiData.apiData.parameters) {
            const bodyPayload = apiData.apiData.parameters.find(paramObj => (paramObj.in === 'body'));

            if (bodyPayload) {
                console.log('bodyPayload', JSON.stringify(bodyPayload));

                bodyObj = bodyPayload.schema;
                //  {
                //     "description": "Payload",
                //     "name": "Body",
                //     "in": "body",
                //     "required": true,
                //     "schema": {
                //         "type": "object",
                //         "properties": {
                //         "id": {
                //             "type": "integer",
                //             "description": ""
                //         },
                //         "enabled": {
                //             "type": "boolean",
                //             "description": "",
                //             "default": true
                //         },
                //         "name": {
                //             "type": "string",
                //             "description": ""
                //         },
                //         "email": {
                //             "type": "string",
                //             "description": ""
                //         },
                //         "like": {
                //             "type": "float",
                //             "description": "",
                //             "default": 1.5
                //         }
                //         },
                //         "required": [
                //             "id",
                //             "enabled"
                //         ],
                //         "attributes": [
                //             {
                //                 "type": "integer",
                //                 "description": "",
                //                 "name": "id",
                //                 "required": false
                //             },
                //             {
                //                 "type": "boolean",
                //                 "description": "",
                //                 "default": true,
                //                 "name": "enabled",
                //                 "required": false
                //             },
                //             {
                //                 "type": "string",
                //                 "description": "",
                //                 "name": "name",
                //                 "required": false
                //             },
                //             {
                //                 "type": "string",
                //                 "description": "",
                //                 "name": "email",
                //                 "required": false
                //             },
                //             {
                //                 "type": "float",
                //                 "description": "",
                //                 "default": 1.5,
                //                 "name": "like",
                //                 "required": false
                //             }
                //         ]
                //     }
            }
        }

        return bodyObj;
    } */

    onClickAddBody(apiData) {
        // console.log('onClickAddBody apiData', JSON.stringify(apiData))
        /* apiData: {
            "path": "/api/friend",
            "apiType": "put",
            "apiData": {
                "produces": [
                "application/json"
                ],
                "tags": [
                "friend"
                ],
                "summary": "1-2.Edit Friend",
                "parameters": [

                ],
                "responses": {

                }
            }
        } */


        this.fetchModel('addBody').setState('apiRoute', apiData.path);
        this.fetchModel('addBody').setState('apiType', apiData.apiType);

        const addBodyModalRef = this.fetchModel('apiManage').getState('addBodyModalRef');
        if (addBodyModalRef) {
            addBodyModalRef.openModal();
        }
    }

    onCancelAddBody() {
        const addBodyModalRef = this.fetchModel('apiManage').getState('addBodyModalRef');

        if (addBodyModalRef) {
            addBodyModalRef.closeModal();
        }
    }

    async onConfirmAddBody() {
        const vm = this;
        const addBodyModel = this.fetchModel('addBody');

        const apiParam = {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            apiRoute: addBodyModel.getState('apiRoute'),
            apiType: addBodyModel.getState('apiType'),
            rootType: addBodyModel.getState('rootType'),
            schema: addBodyModel.getState('schema'),
        };

        // console.log('onConfirmAddBody apiParam', apiParam)

        await ApiSender.sendApi(`[post]/addBody`, apiParam).catch(new ApiError().catchAlertMsg())

        const addBodyModalRef = this.fetchModel('apiManage').getState('addBodyModalRef');

        if (addBodyModalRef) {
            addBodyModalRef.closeModal();
        }

        vm.fetchJson();
    }

    onGqlJsonSrcUpdate(json) {
        console.log('onGqlJsonSrcUpdate', json)

        let jsonObj;
        try {
            jsonObj = JSON.parse(json);
        } catch (e) {
            // 代表json parse失敗
            console.error(e);
            return;
        }

        // const addBodyModel = this.fetchModel('addBody');

        const convertGql = function (jsonObj) {

            const qid = uniqid().toUpperCase();

            let json = `input TYPE_${qid} {\n`;
            Object.keys(jsonObj).forEach((key) => {
                const val = jsonObj[key];

                // const typeMap = {
                //     // <js type>: <gql type>
                //     'string': 'String',
                //     'Int'
                //     ''
                // };

                let valType = typeof val;
                let fieldType;
                if (valType === 'string') {
                    fieldType = 'String';
                } else if (valType === 'number' && Number.isInteger(val)) {
                    fieldType = 'Int';
                } else if (valType === 'boolean') {
                    fieldType = 'Boolean';
                } else {
                    fieldType = 'Unknown';
                }

                json += `   ${key}: ${fieldType}!\n`;
            });
            json += '}';
            return json;
        };

        // 不儲存，直接回傳數值
        return convertGql(jsonObj);
        // addBodyModel.setState('schema', convertGql(jsonObj) + addBodyModel.getState('schema'));
    }


    onAddGqlToAddBody(gqlStr) {
        // console.log('onAddGqlToAddBody', gqlStr);

        const addBodyModel = this.fetchModel('addBody');
        addBodyModel.setState('schema', gqlStr + addBodyModel.getState('schema'));
    }

    onAddGqlToAddRes(gqlStr) {
        const model = this.fetchModel('addRes');
        model.setState('schema', gqlStr + model.getState('schema'));
    }

    onClickAddQueryParam(apiData) {
        // console.log('onClickAddQueryParam', apiData)

        this.fetchModel('addQuery').setState('apiRoute', apiData.path);
        this.fetchModel('addQuery').setState('apiType', apiData.apiType);

        const addQueryModalRef = this.fetchModel('apiManage').getState('addQueryModalRef');
        if (addQueryModalRef) {
            addQueryModalRef.openModal();
        }
    }

    onCancelAddQuery() {
        const addQueryModalRef = this.fetchModel('apiManage').getState('addQueryModalRef');

        if (addQueryModalRef) {
            addQueryModalRef.closeModal();
        }
    }

    async onConfirmAddQuery() {
        const addQueryModel = this.fetchModel('addQuery');

        let isErr = false;

        const enumStr = addQueryModel.getState('enum');
        let enumVal;
        if (enumStr) {
            try {
                enumVal = JSON.parse(enumStr);
            } catch (e) {
                console.error('onConfirmAddQuery: enum is not json');
                console.error(e);
                isErr = true;
            }
        }
        if (isErr) return;

        await ApiSender.sendApi('[post]/api/addQuery', {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            apiRoute: addQueryModel.getState('apiRoute'),
            apiType: addQueryModel.getState('apiType'),
            type: addQueryModel.getState('type'),
            name: addQueryModel.getState('name'),
            in: addQueryModel.getState('in'),
            default: addQueryModel.getState('default'),
            description: addQueryModel.getState('description'),
            enum: enumVal,
        }).catch(new ApiError(function (err, next) {
            isErr = true;
            next(err);
        }).catchAlertMsg());
        if (isErr) return;

        this.fetchJson();

        const addQueryModalRef = this.fetchModel('apiManage').getState('addQueryModalRef');

        if (addQueryModalRef) {
            addQueryModalRef.closeModal();
        }
    }

    onClickAddRes(apiData) {
        // console.log('onClickAddBody apiData', JSON.stringify(apiData))
        /* apiData: {
            "path": "/api/friend",
            "apiType": "put",
            "apiData": {
                "produces": [
                "application/json"
                ],
                "tags": [
                "friend"
                ],
                "summary": "1-2.Edit Friend",
                "parameters": [
    
                ],
                "responses": {
    
                }
            }
        } */

        console.log('this.onClickAddRes', apiData)


        this.fetchModel('addRes').setState('apiRoute', apiData.path);
        this.fetchModel('addRes').setState('apiType', apiData.apiType);

        const addResModalRef = this.fetchModel('apiManage').getState('addResModalRef');
        if (addResModalRef) {
            addResModalRef.openModal();
        }
    }

    onCancelAddRes() {
        const addResModalRef = this.fetchModel('apiManage').getState('addResModalRef');

        if (addResModalRef) {
            addResModalRef.closeModal();
        }
    }

    async onConfirmAddRes() {
        const vm = this;
        const addResModel = this.fetchModel('addRes');

        const apiParam = {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            apiRoute: addResModel.getState('apiRoute'),
            apiType: addResModel.getState('apiType'),
            rootType: addResModel.getState('rootType'),
            schema: addResModel.getState('schema'),
            resType: addResModel.getState('resType'),
            description: addResModel.getState('description'),
        };

        console.log('onConfirmAddBody apiParam', apiParam)

        await ApiSender.sendApi(`[post]/addResponse`, apiParam).catch(new ApiError().catchAlertMsg())

        const addResModalRef = this.fetchModel('apiManage').getState('addResModalRef');
        if (addResModalRef) {
            addResModalRef.closeModal();
        }

        vm.fetchJson();
    }

    onClickEditAttr(apiData, attributeData, attrSrc) {
        // console.log('onClickEditAttributeDescription attributeData', attributeData);
        /* attributeData: { // 代表是一般的body上的參數
            default: 0
            description: "好友ID"
            name: "id"
            required: false
            type: "integer"
            layerPath: ['error', 'path', 'path']
            attrRequired: false,
        }*/

        /* attributeData: { // paramType === 'urlQuery'
            default: "10"
            description: ""
            in: "query" // 代表是URL上的query參數
            name: "pageSize"
            type: "string"

            ===>缺以下2個參數
            layerPath
            attrRequired
        } */

        console.log('apiData', apiData, attributeData, attrSrc)

        const getBoolean = function (value) {
            if (typeof value !== 'boolean') {
                return 'false';
            }

            return value ? 'true' : 'false';
        }

        const editAttrModel = this.fetchModel('editAttr');

        if (attributeData.in === 'query') { // URL query參數的情況
            editAttrModel.setState('paramType', 'urlQuery');
        } else {
            editAttrModel.setState('paramType', 'bodyJson');
        }

        // 查詢參數
        editAttrModel.setState('apiType', apiData.apiType);
        editAttrModel.setState('apiRoute', apiData.path);
        editAttrModel.setState('tags', apiData.apiData.tags);
        editAttrModel.setState('attrName', attributeData.name);
        editAttrModel.setState('layerPath', attributeData.layerPath);
        editAttrModel.setState('attrSrc', attrSrc);

        // 修改參數
        editAttrModel.setState('newAttrName', attributeData.name || '');
        editAttrModel.setState('defaultValue', attributeData.default || '');
        editAttrModel.setState('valueType', attributeData.type || '');
        editAttrModel.setState('description', attributeData.description || '');
        editAttrModel.setState('required', getBoolean(attributeData.attrRequired));

        // 原始參數
        editAttrModel.setState('originAttrName', attributeData.name || '');
        editAttrModel.setState('originDefaultValue', attributeData.default || '');
        editAttrModel.setState('originValueType', attributeData.type || '');
        editAttrModel.setState('originDescription', attributeData.description || '');
        editAttrModel.setState('originRequired', getBoolean(attributeData.attrRequired));

        // console.log('requ', editAttrModel.getState('required'), editAttrModel.getState('originRequired'))
        // console.log('rrrr', attributeData.required)


        const editAttrModalRef = this.fetchModel('apiManage').getState('editAttrModalRef');
        if (editAttrModalRef) {
            editAttrModalRef.openModal();
        }
    }
    async onConfirmEditAttr() {

        const editAttrModel = this.fetchModel('editAttr');


        const noUpdateCheck = function (val, originKey) {
            // 與原始數值相同
            return val === editAttrModel.getState(originKey);
        }
        const getNoUpdateCheckVal = function (key, originKey) {
            let value = editAttrModel.getState(key);
            if (noUpdateCheck(description, originKey)) {
                value = null;
            }
            return value;
        }

        let attrName = editAttrModel.getState('newAttrName');
        if (noUpdateCheck(attrName, 'originAttrName')) {
            attrName = null;
        }

        let defaultValue = editAttrModel.getState('defaultValue');
        if (noUpdateCheck(defaultValue, 'originDefaultValue')) {
            defaultValue = null;
        }

        let valueType = editAttrModel.getState('valueType');
        if (noUpdateCheck(valueType, 'originValueType')) {
            valueType = null;
        }

        let description = editAttrModel.getState('description');
        if (noUpdateCheck(description, 'originDescription')) {
            description = null;
        }

        // console.log('required bb', editAttrModel.getState('required'), editAttrModel.getState('originRequired'));

        let required = getNoUpdateCheckVal('required', 'originRequired');

        // console.log('required cc', required)

        required = required === 'true'; // 將字串轉回boolean


        if (defaultValue !== null) {
            const nowValueType = editAttrModel.getState('valueType');
            if (nowValueType === 'integer') {
                defaultValue = Number(defaultValue);
            } else if (nowValueType === 'boolean') {
                defaultValue = defaultValue === 'true';
            }
        }

        const apiParam = {
            fileName: this.fetchModel('apiManage').getState('fileName'),
            apiType: editAttrModel.getState('apiType'),
            apiRoute: editAttrModel.getState('apiRoute'),
            tags: editAttrModel.getState('tags'),
            attrName: editAttrModel.getState('attrName'),
            layerPath: editAttrModel.getState('layerPath'),
            attrSrc: editAttrModel.getState('attrSrc'),
            // -----------------------------------------------
            attrData: {
                attrName: attrName,
                defaultValue: defaultValue,
                valueType: valueType,
                description: description,
                required: required,
            },
        };
        // console.log('onConfirmEditAttr', apiParam);

        const paramType = editAttrModel.getState('paramType');
        if (paramType === 'urlQuery') {
            await ApiSender.sendApi(`[put]/api/editQueryParam`, apiParam).catch(new ApiError().catchAlertMsg())
        } else if (paramType === 'bodyJson') {
            await ApiSender.sendApi(`[post]/editAttr`, apiParam).catch(new ApiError().catchAlertMsg());
        }

        // await ApiSender.sendApi(`[post]/editAttr`, apiParam).catch(new ApiError().catchAlertMsg())

        const editAttrModalRef = this.fetchModel('apiManage').getState('editAttrModalRef');
        if (editAttrModalRef) {
            editAttrModalRef.closeModal();
        }

        this.fetchJson();
    }
    onCancelEditAttr() {
        const editAttrModalRef = this.fetchModel('apiManage').getState('editAttrModalRef');
        if (editAttrModalRef) {
            editAttrModalRef.closeModal();
        }
    }

    onClickCreateApiDoc() {
        console.log('onClickCreateApiDoc');

        const addApiDocModalRef = this.fetchModel('apiManage').getState('addApiDocModalRef');
        if (addApiDocModalRef) {
            addApiDocModalRef.openModal();
        }
    }
    onCancelAddApiDoc() {

        const addApiDocModalRef = this.fetchModel('apiManage').getState('addApiDocModalRef');
        if (addApiDocModalRef) {
            addApiDocModalRef.closeModal();
        }
    }
    async onConfirmAddApiDoc() {
        let error;

        const addApiDocModel = this.fetchModel('addApiDoc');

        // LocalAccessor.setItem('apiDocList', [{
        //     fileName: addApiDocModel.getState('fileName'),
        // }]);

        const apiParam = {
            fileName: addApiDocModel.getState('fileName'),
            title: addApiDocModel.getState('title'),
            host: addApiDocModel.getState('host'),
        }

        await ApiSender.sendApi('[post]/genSwagger', apiParam).catch(err => (error = err));
        if (error) return Promise.reject(error);

        const addApiDocModalRef = this.fetchModel('apiManage').getState('addApiDocModalRef');
        if (addApiDocModalRef) {
            addApiDocModalRef.closeModal();
        }
    }

    async onClickClientSaveJsonFile() {
        // console.log('onClickClientSaveJsonFile');

        const jsonStr = this.fetchModel('apiJson').getState('json')
        var blob = new Blob([jsonStr], { type: "text/plain;charset=utf-8" });

        let fileName = this.fetchModel('apiManage').getState('fileName') || 'swagger';
        fileName = `${fileName}.json`;

        await this.saveFile(blob, fileName);
    }
    async onClickUpdateJsonFile() {
        const vm = this;
        const jsonStr = this.fetchModel('apiJson').getState('json');

        let fileName = this.fetchModel('apiManage').getState('fileName');

        if (!fileName) {
            console.error(`onClickUpdateJsonFile: no fileName`);
            return;
        }

        console.log(`onClickUpdateJsonFile`, fileName);

        try {
            JSON.parse(jsonStr);
        } catch (error) {
            console.error(`onClickUpdateJsonFile error`, error);
            new ApiError().runErrorAlert(`json parse fail`);

            return Promise.reject(error);
        }

        ApiSender.sendApi('[post]/doc/updateJson', {
            fileName: fileName,
            json: jsonStr,
        }).then(() => {
            this.fetchJson();
            return vm.fetchControl('notify').notify('json has update');
        }).catch(new ApiError().catchAlertMsg())
    }


    saveFile(blob, fileFullName) {
        FileSaver.saveAs(blob, fileFullName);
        console.log(`saveFile: Document ${fileFullName} has been saved!`);

        return Promise.resolve();
        // https://www.npmjs.com/package/file-saver

        // 文字檔
        // var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
        // FileSaver.saveAs(blob, "hello world.txt");

        // 儲存canvas快照
        // var canvas = document.getElementById("my-canvas");
        // canvas.toBlob(function(blob) {
        //     saveAs(blob, "pretty image.png");
        // });
    }
}