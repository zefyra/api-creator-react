import ApiSchema from "./ApiSchema";
import DefinitionBuild from "./DefinitionBuild";

class ApiProfile {
    apiData = null;
    /*  tagData: { ===> 之後會交給ApiComposition進行解析，才顯示在View上
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
    defBuildObj = null;
    constructor(rawApiInfo, apiRoute, apiType, defBuildObj) {
        if (!(defBuildObj instanceof DefinitionBuild)) {
            console.error(`ApiProfile: defBuildObj is not DefinitionBuild`);
            return;
        }
        this.defBuildObj = defBuildObj; // DefinitionBuild
        let apiInfo = this.addParameterBody(rawApiInfo); // 將Parameter內的body項目加回去，讓它可以顯示
        apiInfo = this.responsesAddAttributes(apiInfo); // 在responses增加attributes，之後view會判斷docType讀取openapi3格式

        this.apiData = {
            apiData: apiInfo,
            apiType: apiType,
            path: apiRoute,
        };
    }
    getApiData() {
        return this.apiData;
    }
    responsesAddAttributes(apiInfo) {
        const responses = apiInfo.responses || {};
        Object.keys(responses).forEach((code) => { // code: '200'
            const responseItem = apiInfo.responses[code];

            if (!responseItem.content) return;
            if (!responseItem.content['application/json']) return;
            if (!responseItem.content['application/json'].schema) return;

            const schemaObj = responseItem.content['application/json'].schema;
            const newSchemaObj = new ApiSchema(schemaObj, this.defBuildObj).getSchema();

            responseItem.content['application/json'].schema = newSchemaObj;
            apiInfo.responses[code] = responseItem;
        });

        return apiInfo;
    }
    addParameterBody(apiData) {
        /* apiData: { // <原始OpenAPI的apiData格式>
            "tags": [
                "pet"
            ],
            "summary": "Add a new pet to the store",
            "description": "",
            "operationId": "addPet",
            "responses": {
                "405": {
                    "description": "Invalid input"
                }
            },
            "security": [
                {
                    "petstore_auth": [
                        "write:pets",
                        "read:pets"
                    ]
                }
            ],
            "requestBody": {
                "$ref": "#/components/requestBodies/Pet"
            },
            "parameters": [
                { // <---這個是要生出來的swag2.0格式
                    description: "Payload"
                    in: "body"
                    name: "Body"
                    required: true
                    schema: {
                        attributes: [{
                            attrRequired: true
                            description: ""
                            layerPath: []
                            name: "email"
                            type: "string"
                        },{
                            attrRequired: true
                            description: ""
                            layerPath: []
                            name: "password"
                            type: "string"
                        }]
                        properties: {
                            email: {type: 'string', description: ''}
                            password: {type: 'string', description: ''}
                        }
                        required: ["email", "password"]
                        type: "object"
                    }
                },
                {
                    "description": "Payload",
                    "name": "Body",
                    "in": "body",
                    "required": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "fileName": {
                                "type": "string",
                                "description": "fileName_bbbbb",
                                "default": "api-creator"
                            }
                        },
                        "required": [
                            "fileName"
                        ],
                        "attributes": [
                            {
                                "type": "string",
                                "description": "fileName_bbbbb",
                                "default": "api-creator",
                                "name": "fileName",
                                "attrRequired": true,
                                "layerPath": [

                                ]
                            }
                        ]
                    }
                }
                {
                    "name": "status",
                    "in": "query",
                    "description": "Status values that need to be considered for filter",
                    "required": true,
                    "explode": true,
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": [
                                "available",
                                "pending",
                                "sold"
                            ],
                            "default": "available"
                        }
                    }
                },
                {
                    "name": "tags",
                    "in": "query",
                    "description": "Tags to filter by",
                    "required": true,
                    "explode": true,
                    "schema": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        }
                    }
                },
                {
                    "name": "petId",
                    "in": "path",
                    "description": "ID of pet to return",
                    "required": true,
                    "schema": {
                        "type": "integer",
                        "format": "int64"
                    }
                },
                {
                    "name": "api_key",
                    "in": "header",
                    "required": false,
                    "schema": {
                        "type": "string"
                    }
                }
            ]
        }
        */


        // apiData.requestBody

        // ApiSchema

        // if (!this.definitionMap) {
        //     console.error('ApiBuilder addParameterBody: definitionMap not exist')
        //     return;
        // }

        if (!this.defBuildObj) {
            console.error('ApiBuilder addParameterBody: defBuildObj not exist')
            return apiData;
        }

        // const apiSchema = new ApiSchema(parameterItem.schema, vm.definitionMap)

        if (!apiData.requestBody) {
            // 代表沒有設定requestBody，不需要建構parameter
            return apiData;
        }

        // console.log('apiData.requestBody', apiData.requestBody);

        // 取得schemaObj
        let schemaObj;
        if (apiData.requestBody['$ref']) { // '#/components/requestBodies/Pet'
            // 直接參照requestBodies

            const apiSchema = new ApiSchema(apiData.requestBody, this.defBuildObj);
            schemaObj = apiSchema.getSchema();
        } else if (apiData.requestBody['content']) {
            const jsonContent = apiData.requestBody['content']['application/json'];
            if (!jsonContent) { // 代表沒有設定'application/json'格式的request body
                return apiData;
            }
            let contentSchemaObj = jsonContent.schema;

            if (contentSchemaObj['type']) { // 代表是普通的
                schemaObj = contentSchemaObj
            } else if (contentSchemaObj['$ref']) {
                const apiSchema = new ApiSchema(contentSchemaObj, this.defBuildObj);
                schemaObj = apiSchema.getSchema();
            } else {
                console.error(`Unknown contentSchemaObj`);
                return apiData;
            }
        } else {
            console.error(`requestBody format unkown`);
            return apiData;
        }

        if (!schemaObj) {
            return apiData;
        }

        const bodyParameterObj = {
            description: "Payload",
            in: "body",
            name: "Body",
            required: true,
            schema: new ApiSchema(schemaObj, this.defBuildObj).getSchema(), // 要經過一層ApiSchema處理，才會附加attributes欄位上
            // schema: schemaObj,
        }
        if (!bodyParameterObj.schema.type) {
            // console.log('`addParameterBody: body schema is invalid`)
            console.log(`addParameterBody: body schema is invalid`, apiData);
            return apiData;
        }

        const addParameter = function (obj) {
            if (!apiData.parameters) {
                apiData.parameters = [];
            }
            apiData.parameters.push(obj);
        }

        addParameter(bodyParameterObj);

        return apiData;
    }
}

export default ApiProfile;