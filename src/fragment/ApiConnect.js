import StateModel from "model/StateModel";

/* 
原本是巢狀object測試，dataCollection.json要替換回去

"$ref": "#/definitions/null.Bool"



"type": "boolean",
"default": true,
"description": "帳號是否已激活"
*/


export class AttributeComposition {
    attributeData = null;
    constructor(attributeData) {
        this.attributeData = attributeData;
    }
}


export class ApiComposition {
    tagData = null;
    constructor(apiData) {
        /*  tagData: {
                apiList: [{ // <apiData>
                    apiData: { // <apiInfo>
                        consumes: ['application/json']
                        description: "這個是1-2.API的詳細描述"
                        parameters: [{
                            description: "payload"
                            in: "body"
                            name: "Body"
                            required: true
                            schema: {
                                additionalProperties: false
                                maxProperties: 12
                                minProperties: 3
                                properties: {activated: {…}, createdAt: {…}, email: {…}, enabled: {…}, id: {…}, …}
                                required: (3) ['email', 'id', 'role']
                                type: "object"
                                attributes: (12) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
                                // <---attributes插入在這裡
                            }
                        }]
                        produces: ['application/json']
                        responses: {200: {…}, 500: {…}}
                        summary: "1-2.用ID取得子用戶(API名稱)"
                        tags: ['accounts']
                    }
                    apiType: "post"
                    path: "/accounts/{id}/sub-accounts"
                }]
                description: "Crossbot account-entities"
                externalDocs: {description: 'Find out more about our store', url: 'http://swagger.io'}
                groupName: "1.帳號"
                name: "accounts"
        } */
        // this.tagData = tagData;

        this.apiData = apiData;
    }
    checkApiDataField(key) {

        const apiInfo = this.apiData.apiData;

        if (key === 'consumesContentType') {
            return apiInfo.consumes ? (apiInfo.consumes[0] != null) : false;
        } else if (key === 'producesContentType') {
            return apiInfo.produces ? (apiInfo.produces[0] != null) : false;
        } else if (key === 'requestAttributes') {
            const parameterItem = apiInfo.parameters.find((parameterItem) => {
                return parameterItem.in === 'body';
            });

            if (!parameterItem) {
                return false;
            }

            return parameterItem.schema ? parameterItem.schema.attributes != null : false;
        } else if (key === 'requestQueryAttributes') {
            return this.getApiDataField(key).length !== 0;
            // return apiInfo.parameters ? (apiInfo.parameters.filter(item => item.in === 'query')) : [];
        } else if (key === 'responseAttributes') {
            return this.getApiDataField(key).length !== 0;
        } else if (key === 'requestUrlAttributes') {
            return this.getApiDataField(key).length !== 0;
        } else if (key === 'requestHeaderAttributes') {
            return this.getApiDataField(key).length !== 0;
        }
        return false;
    }
    getApiDataField(key) {

        const apiInfo = this.apiData.apiData;

        if (key === 'apiTitle') {
            return apiInfo.summary || '';
        } else if (key === 'apiType') {
            return this.apiData.apiType || '';
        } else if (key === 'path') {
            return this.apiData.path || '';
        } else if (key === 'apiDescription') {
            return this.apiData.apiData ? (this.apiData.apiData.description || '') : '';
        } else if (key === 'consumesContentType') {
            return apiInfo.consumes ? (apiInfo.consumes[0] || '') : '';
        } else if (key === 'producesContentType') {
            return apiInfo.produces ? (apiInfo.produces[0] || '') : '';
        } else if (key === 'requestAttributes') {
            // return apiInfo.attributes ? apiInfo.attributes : [];
            // return apiData.apiData ? (apiData.apiData.description || '') : '';
            const parameterItem = apiInfo.parameters.find((parameterItem) => {
                return parameterItem.in === 'body';
            });

            if (!parameterItem) {
                return [];
            }

            return parameterItem.schema.attributes;
        } else if (key === 'responseAttributes') {
            /* apiInfo: {
                responses: {
                    '200': {
                        description: "OK(200回應的描述)"
                        schema: <schema>
                    }
                }
            }*/
            const responseItem = apiInfo.responses['200'];

            if (!responseItem) {
                return [];
            }

            // console.log('responseItem', responseItem)

            return responseItem.schema.attributes;

        } else if (key === 'requestQueryAttributes') {
            return apiInfo.parameters ? (apiInfo.parameters.filter(item => item.in === 'query')) : [];
        } else if (key === 'requestUrlAttributes') {
            return apiInfo.parameters ? (apiInfo.parameters.filter(item => item.in === 'path')) : [];
        } else if (key === 'requestHeaderAttributes') {
            return apiInfo.parameters ? (apiInfo.parameters.filter(item => item.in === 'header')) : [];
            // } else if (key === 'apiDescription') {
            //     return apiData.apiData ? (apiData.apiData.description || '') : '';
        } else {
            return '';
        }
    }
}

class ApiSchema {


    name = '';
    silent = false;
    schema = null;
    definitionMap = {};
    layer = 1;
    constructor(schema, definitionMap, layer, { silent } = { silent: false }) {
        if (layer) {
            this.layer = layer;
        }
        if (layer > 8) {
            console.error(`ApiSchema layer over 8`, this);
        }
        this.definitionMap = definitionMap;
        this.name = schema.name;
        this.silent = silent;
        // 將$ref內定義的物件替換進去
        this.schema = this.buildSchema(schema);
        // 將 'object' 類型的物件增加attributes欄位
        this.schema = this.buildAttributes(this.schema);
    }
    // buildSchema--------------------------------------------------

    getDefinitionData(defKey) {
        if (!this.definitionMap[defKey]) {
            if (!this.silent) { // ps.寧靜模式下不報錯
                console.error(`definition ${defKey} not exist`);
            }
        }
        return this.definitionMap[defKey];
    }
    getDefKey(ref) {
        if (!/^\#\/definitions\//.test(ref)) {
            // definition識別失敗
            console.error(`definition ref validate fail, unknown $ref ${ref}`);
            return;
        }

        const defKey = ref.replace(/^\#\/definitions\//, "");
        return defKey;
    }
    // 組建API時，取得schema用的
    buildSchema(schema) {
        // console.log(`buildSchema`, schema)
        if (typeof schema !== 'object') {
            // 目前只支援物件
            console.error(`getSchema: schema is not object`, schema);
            return schema;
        }

        schema = this.replaceAllOf(schema);

        schema = this.replaceRefDefinition(schema);

        schema = this.replaceObjectRefDefinition(schema);

        return schema;
    }
    // 若allOf存在，則將definition替換進來
    replaceAllOf(schema) {
        /* responses: {
            200: {
                description: "OK(200回應的描述)"
                schema: {
                    allOf: [{
                        $ref: "#/definitions/app.Response"
                    }, {
                        type: "object"
                        data: {
                            $ref: "#/definitions/models.Account"
                        }
                    }] // ==> 要將這個allOf替換成合併後的schema
                }
            }
            500: {
                description: "Internal Server Error"
                schema: {
                    $ref: "#/definitions/app.Response"
                    // ==> 這個要將definition替代進去
                }
            }
        } */
        const vm = this;


        if (!schema['allOf']) {
            return schema;
        }

        // 代表有allOf陣列要處理

        let allOfSchemaList = schema['allOf'].map(val => val);

        allOfSchemaList = allOfSchemaList.map((eachSchema) => {
            // console.log(`before getSchema`, eachSchema);
            // console.log(`getSchema`, new ApiSchema(eachSchema, vm.definitionMap, vm.layer + 1).getSchema());
            return new ApiSchema(eachSchema, vm.definitionMap, vm.layer + 1).getSchema();

        });
        // console.log('allOfSchemaList', allOfSchemaList)

        let mergedSchema = null;
        // 將allOfSchemaList所有的schema合併
        allOfSchemaList.forEach((eachSchema) => {
            if (!mergedSchema) {
                mergedSchema = Object.assign({}, eachSchema);
                return;
            }

            if (eachSchema.type !== 'object') {
                console.error(`allOf merge fail: schema.type is not object`, eachSchema);
                return;
            }
            Object.keys(eachSchema.properties).forEach((propKey) => {
                // 取代掉mergedSchema當中的properties的欄位
                mergedSchema.properties[propKey] = eachSchema.properties[propKey];
            });
        })
        if (mergedSchema) {
            // 代表有成功合併
            return mergedSchema;
        }

        return schema;

    }
    // 若$ref存在，則將definition替換進來
    replaceRefDefinition(schema) {
        if (!schema['$ref']) {
            return schema;
        }

        // 代表有$ref，要處理巢狀的$ref

        const defKey = this.getDefKey(schema['$ref']);
        if (!defKey) {
            return schema;
        }
        const definitionData = this.getDefinitionData(defKey);
        if (!definitionData) {
            // 代表沒抓到，直接回傳原始schema
            return schema;
        }
        return definitionData;
    }
    // 負責檢查object型態當中的所有properties，若其中有$ref，則取代掉
    replaceObjectRefDefinition(schema) {
        if (schema.type !== 'object') {
            return schema;
        }
        /* schema: {
            type: "object"
            properties: {
                data: {
                    $ref: "#/definitions/models.Account"
                }
            }     
        }*/
        if (!schema.properties) {
            return schema;
        }

        // console.log(`replaceObjectRefDefinition`, schema)

        // 這個檢查只跑第一層，不遞迴
        Object.keys(schema.properties).forEach((propKey) => {
            // propKey: 'data'
            const propSchema = schema.properties[propKey];
            if (!propSchema) {
                // console.error(`prop '${propKey}' propSchema is null`, schema, propSchema);
                return;
            }

            if (propSchema['$ref']) {
                schema.properties[propKey] = this.replaceRefDefinition(propSchema);
            }
        });
        return schema;
    }
    // buildAttributes----------------------------------------------------
    buildAttributes(schema, layer = 1) {
        // 避免修改到原本的schema那個樹狀結構內的物件，否則attributes和schema就只是入口不同，但底下的物件都相同
        schema = Object.assign({}, schema);

        if (!schema) {
            console.error('buildAttributes: schema not exist');
            return schema;
        }
        if (layer > 8) {
            console.error(`buildAttributes layer over 8`);
            return schema;
        }
        const vm = this;

        let schemaPack = {};
        if (schema.type === 'object') {
            if (!schema.properties) {
                console.error(`shema object not have properties`);
                return schema;
            }

            schemaPack = schema.properties;
        } else if (schema.type === 'array') {
            // 代表這是一個陣列，要檢查陣列內的元素型態，決定要怎麼組件schemaPack
            if (!schema.items) {
                console.error(`shema array not have items`);
                return schema;
            } else if (schema.items.type !== 'object' && schema.items.type !== 'array') {
                // 代表可能是string, integer...也就是單純的數值陣列
                schemaPack = {
                    '[array-item]': schema.items,
                };
            } else if (schema.items.type === 'object') {
                /* schema.items: {
                    "type": "object",
                    "minProperties": 2,
                    "maxProperties": 2,
                    "additionalProperties": false,
                    "properties": {
                        "serial": {
                            "type": "string",
                            "minLength": 0,
                            "maxLength": 80
                        },
                        "time": {
                            "type": "string",
                            "minLength": 0,
                            "maxLength": 30
                        }
                    },
                    "required": [
                        "serial",
                        "time"
                    ]
                }, */

                // 修改type: 'array' -> 'object-array'
                // schema.type = 'object-array';

                if (!schema.items.properties) {
                    console.error(`array schema item object not have properties`);
                    return schema;
                }

                schemaPack = schema.items.properties;
            } else if (schema.items.type === 'array') {
                schemaPack = {
                    '[array-item]': schema.items,
                };
            } else {
                console.error(`schema.items.type ${schema.items.type} not support`);
                return schema;
            }
        }


        // 以下負責拆包物件型schema的properties----------------------

        let attributeList = [];
        // schemaPack: schema.properties
        Object.keys(schemaPack).forEach((key) => {
            let attributeData = schemaPack[key];

            let required = false;
            if (schema.required) {
                if (Array.isArray(schema.required)) {
                    schema.required.forEach((key) => {
                        if (key === vm.name) {
                            required = true;
                        }
                    });
                }
            }

            // console.log(`${propName}`, attributeData)
            attributeData = Object.assign({}, attributeData);
            attributeData.name = key; // 將name加上去
            attributeData.required = required;

            // 檢查是否有需要遞迴-----------------------------------------
            if (attributeData.type === 'object' ||
                attributeData.type === 'array') { // recursiveCheck(attributeData)
                // 進行遞迴
                attributeData = vm.buildAttributes(attributeData, layer + 1);
            }

            attributeList.push(attributeData);
        });
        schema.attributes = attributeList;

        return schema;
    }

    // [public]------------------------------------
    getSchema() {
        return this.schema;
    }

    getDefinitionMap() {
        return this.definitionMap;
    }
}

class ApiConnectComposition {
    json = null;
    definitionMap = {};

    constructor(json) {
        this.json = json;

        /* json: {
            "definitions": {
                "service.AccountWrap": <definitionData>
            }
        } */

        // 有可能第一輪會抓不到全部definition，要跑2輪
        // 因為有可能ref參照的definition在後面，尚未生成
        this.definitionMap = this.buildDefinitionMap(json, 1);
        // console.log(`first run ------------------------------`)
        this.definitionMap = this.buildDefinitionMap(json, 2, this.definitionMap);

        // this.definitionMap = Object.assign({}, json.definitions);
    }

    // definitionMapRun = 0;
    buildDefinitionMap(json, run, definitionMap = {}) {
        // const vm = this;
        const silentMode = run === 1; // 當第一run時，開啟silentMode

        const definitions = json.definitions || {};

        Object.keys(definitions).forEach((definitionKey) => {
            let definitionData = Object.assign({}, json.definitions[definitionKey]);
            // 預先將definition的shema build出來，解決裡面巢狀schema的問題
            // definitionData = vm.buildSchema(definitionData);
            definitionData = new ApiSchema(definitionData, definitionMap, null, {
                silent: silentMode,
            }).getSchema();
            definitionMap[definitionKey] = definitionData;
        });
        // this.definitionMap = definitionMap;
        return definitionMap;
    }

    // --------------------------------------------------------------

    getJson() {
        return this.json;
    }

    /*
    // 處理definition內部的巢狀$ref的schema問題
    buildSchema(schema, layer = 1) {
        // console.log(`buildSchema layer `, layer);
        if (layer > 3) {
            console.error(`buildSchema over 3 layer`); // 不能超過3層
            return schema;
        }
        const vm = this;

        if (schema.type !== 'object') {
            return schema;
        }

        if (!schema.properties) {
            return schema;
        }

        // 將properties物件整個換新
        schema.properties = Object.assign({}, schema.properties);

        Object.keys(schema.properties).forEach((key) => {

            // console.log(`check layer ${layer} - ${key}`);

            const propData = schema.properties[key];
            if (typeof propData === 'object') {
                if (propData['$ref']) {
                    // 代表還有巢狀schema要往下走

                    // console.log(`definition $ref `, propData['$ref']);
                    const defKey = vm.getDefKey(propData['$ref']);

                    // console.log(`definition defKey `, defKey);

                    const definitionData = vm.getDefinitionData(defKey);

                    // console.log(`definitionData `, definitionData);

                    if (definitionData) {
                        // 代表有成功抓到definitionData，才可以往下一層走
                        schema.properties[key] = vm.buildSchema(definitionData, layer + 1);
                    } else {
                        console.error(`definition ${defKey} not exist`);
                    }
                }
            }
        });

        return schema;
    }*/

    getDefinitionData(defKey) {
        return this.definitionMap[defKey];
    }

    getDefKey(ref) {
        if (!/^\#\/definitions\//.test(ref)) {
            // definition識別失敗
            console.error(`definition ref validate fail, unknown $ref ${ref}`);
            return;
        }

        const defKey = ref.replace(/^\#\/definitions\//, "");
        return defKey;
    }

    // 跑指定的項目
    buildParameters(parameters, callback, paramIn = 'body') { // , attributeCallback
        const vm = this;
        if (!parameters) {
            return undefined;
        }

        if (!Array.isArray(parameters)) {
            console.log(`apiData.parameters not is array`);
            return;
        }
        return parameters.map((parameterItem) => {

            if (parameterItem.in === paramIn) {
                parameterItem = callback(parameterItem);
            }
            return parameterItem;
        });
    }

    buildApiData(apiData) {
        const vm = this;
        /* apiData: {
            parameters: [
                {
                    "type": "integer",
                    "description": "Account id",
                    "name": "id",
                    "in": "path",
                    "required": true
                },
                {
                    "description": "payload",
                    "name": "Body",
                    "in": "body",
                    "required": true,
                    "schema": {
                        "$ref": "#/definitions/service.AccountWrap"
                        // ==> 這個要將definition替代進去
                    }
                    ====> 替換後的schema物件
                    "schema": {
                        type: "object"
                        attributes: [{..}], // 這個是自己額外增加的
                    }
                }
            ],
            responses: {
                200: {
                    description: "OK(200回應的描述)"
                    schema: {
                        allOf: [{
                            $ref: "#/definitions/app.Response"
                        }, {
                            type: "object"
                            data: {
                                $ref: "#/definitions/models.Account"
                            }
                        }] // ==> 這個要將definition替代進去
                    }
                }
                500: {
                    description: "Internal Server Error"
                    schema: {
                        $ref: "#/definitions/app.Response"
                        // ==> 這個要將definition替代進去
                    }
                }
            }
        } */

        apiData = Object.assign({}, apiData);
        // 處理parameter，將實際的parameters參數組建出來-------------------------------------

        apiData.parameters = this.buildParameters(apiData.parameters, function (parameterItem) {
            // 要判斷是否有$ref欄位
            const apiSchema = new ApiSchema(parameterItem.schema, vm.definitionMap)
            parameterItem.schema = apiSchema.getSchema();
            return parameterItem;
        }, 'body');

        // 跑每個response
        Object.keys(apiData.responses).forEach((code) => {
            // code: '200'

            const responseItem = apiData.responses[code];
            responseItem.schema = new ApiSchema(responseItem.schema, vm.definitionMap).getSchema();

            // 將所有response的schema更新
            apiData.responses[code] = responseItem;
        });

        return apiData;
    }

    buildResponse(json) {

    }
}


export default class ApiConnectModel extends StateModel {
    data(initObj = {}) {
        return {
            docJson: null,
            tagList: [],
            jumpTagList: [], // 右邊側邊欄用來生成連結用的
            pageMode: initObj.pageMode || '',
        }
    }

    pageUnitAuth(unitKey) { // 取得元件權限
        const unitAuthMap = {
            // <unitKey>: <pageMode>
            addTagButton: 'edit', // 新增tag按鈕
            removeTagButton: 'edit', // 移除tag按鈕
        }

        const unitAuth = unitAuthMap[unitKey];
        if (!unitAuth) {
            return true;
        }

        const pageMode = this.getState('pageMode');

        return unitAuth === pageMode;
    }

    saveApiDoc(json) {
        this.setState('docJson', json);

        // console.log('saveApiDoc json', json.tags)

        const tagList = this.buildTagBlockDataList(new ApiConnectComposition(json));

        this.setState('tagList', tagList);

        this.buildJumpLinkList(tagList);
    }
    buildJumpLinkList(tagList) {
        tagList = tagList.map(val => val);

        this.setState('jumpTagList', tagList);
    }
    buildTagBlockDataList(apiCompConnectData) {
        if (!(apiCompConnectData instanceof ApiConnectComposition)) {
            console.error(`buildTagBlockDataList: apiCompConnectData not ApiConnectComposition`);
            return;
        }

        const json = apiCompConnectData.getJson();

        const apiMap = this.buildApiMapFromJson(apiCompConnectData);
        // console.log('apiMap', apiMap)
        /* apiMap: {
            <tag>: [ <apiInfo>, <apiInfo2>... ]
        } 
        <apiInfo> : {
            path: "/accounts/{id}/sub-accounts"
            apiType: "post"
            apiData: <apiData>
        } */
        const getApiList = function (tagName) {
            return apiMap[tagName] || [];
        }

        const tags = json.tags || [];

        return tags.map((tagData) => {
            /* tagData: {
                "name": "accounts",
                "description": "Crossbot account-entities",
                "externalDocs": {
                    "description": "Find out more about our store",
                    "url": "http://swagger.io"
                },
                "groupName": "1.帳號"
            } */

            tagData = Object.assign({}, tagData);
            // 加入apiList，從path當中找出所有登記在此Tag的API
            tagData.apiList = getApiList(tagData.name);
            return tagData;
        });
    }
    buildApiMapFromJson(apiCompConnectData) {
        if (!(apiCompConnectData instanceof ApiConnectComposition)) {
            console.error(`buildApiMapFromJson: apiCompConnectData not ApiConnectComposition`);
            return;
        }
        const json = apiCompConnectData.getJson();

        const vm = this;
        /* json: {
            "info": {}
            "tags": []
            "paths": {
                "/accounts/{id}/sub-accounts": {
                    "post": <API資料>
                }
            }
        }*/

        if (!json.paths) {
            console.error(`json.paths not exist`);
            return;
        }

        const apiMap = {};
        /* apiMap: {
            <tag>: [ <apiInfo>, <apiInfo2>... ]
        } 
        <apiInfo> : {
            path: "/accounts/{id}/sub-accounts"
            apiType: "post"
            apiData: <apiData>
        } */
        const registApiDataInTag = function (tag, path, apiType, apiData) {
            if (!apiMap[tag]) {
                apiMap[tag] = [];
            }

            apiMap[tag].push({
                path,
                apiType,
                apiData: apiCompConnectData.buildApiData(apiData),
            });
        }

        // each path
        Object.keys(json.paths).forEach((path) => {
            // each apiType(post)
            Object.keys(json.paths[path]).forEach((apiType) => {
                const apiData = json.paths[path][apiType];
                if (!apiData.tags) {
                    console.error(`api [${apiType}] ${path} not have tags`);
                    return;
                }
                apiData.tags.forEach((tag) => {
                    registApiDataInTag(tag, path, apiType, apiData);
                });
            });
        });

        return apiMap;
    }
}