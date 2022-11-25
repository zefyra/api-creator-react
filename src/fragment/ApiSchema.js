
// OpenAPI 3.0版的ApiSchema
// ps.將ApiConnect.js內的class ApiSchema直接複製過來改的，和swagger2.0版並沒有統合

import DefinitionBuild from "./DefinitionBuild";


class ApiSchema {
    name = '';
    silent = false;
    schema = null;
    // definitionMap = {};
    layer = 1;
    constructor(schema, defBuildObj, layer, { silent } = { silent: false }) {
        // , definitionMap
        if (!schema) {
            console.error(`ApiSchema: no schema`);
            return;
        }
        if (layer) {
            this.layer = layer;
        }
        if (layer > 8) {
            console.error(`ApiSchema layer over 8`, this);
        }
        if (!(defBuildObj instanceof DefinitionBuild)) {
            console.error(`ApiSchema: defBuildObj is not DefinitionBuild`);
            return;
        }
        this.defBuildObj = defBuildObj;
        // this.definitionMap = definitionMap;
        this.name = schema.name;
        this.silent = silent;
        // 將$ref內定義的物件替換進去
        this.schema = this.buildSchema(schema);
        // 將 'object' 類型的物件增加attributes欄位
        this.schema = this.buildAttributes(this.schema);
    }
    // buildSchema--------------------------------------------------

    // getDefinitionData(defKey) {
    //     if (!this.definitionMap[defKey]) {
    //         if (!this.silent) { // ps.寧靜模式下不報錯
    //             console.error(`getDefinitionData: definition ${defKey} not exist`);
    //         }
    //     }
    //     return this.definitionMap[defKey];
    // }
    getDefKey(ref) {
        // ref: '#/definitions/service.AccountEntityWrap'
        console.log('getDefKey', ref)

        if (!/^\#\/definitions\//.test(ref)) {
            // definition識別失敗
            console.error(`getDefKey: definition ref validate fail, unknown $ref ${ref}`);
            return;
        }

        // 將前綴的 '#/definitions/' 去掉
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

        let haveRef = false;
        allOfSchemaList = allOfSchemaList.map((eachSchema) => {
            // console.log(`before getSchema`, eachSchema);
            // console.log(`getSchema`, new ApiSchema(eachSchema, vm.definitionMap, vm.layer + 1).getSchema());
            const schemaObj = new ApiSchema(eachSchema, vm.defBuildObj, vm.layer + 1).getSchema();
            if (schemaObj['$ref']) {
                // 代表依舊是$ref
                haveRef = true;
            }
            return schemaObj;
            // return new ApiSchema(eachSchema, vm.definitionMap, vm.layer + 1).getSchema();
        });
        if (haveRef) { // 代表還有Ref，暫不處理
            console.error(`still haveRef`);
            return allOfSchemaList;
        }

        // console.log('allOfSchemaList', allOfSchemaList)

        // 合併allOf的List---------------------------------------------------

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
        const refKey = schema['$ref'];
        let defSchemaData = this.defBuildObj.getRefSchema(refKey);
        // console.log('replaceRefDefinition defSchemaData', defSchemaData)

        // defSchemaData:
        // {
        //     $ref: "#/components/schemas/Pet"
        // }

        // defSchemaData = this.defBuildObj.getRefSchema

        if (!defSchemaData) {
            return schema; // 代表沒抓到，直接回傳原始schema
        }
        return defSchemaData;



        // const defKey = this.getDefKey(schema['$ref']);
        // if (!defKey) {
        //     return schema;
        // }
        // const definitionData = this.getDefinitionData(defKey);
        // if (!definitionData) {
        //     // 代表沒抓到，直接回傳原始schema
        //     return schema;
        // }
        // return definitionData;
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

            /*
            if (propSchema.type === 'array') {
                valueSchema = propSchema.items;
            }
            const setPropSchema = function (refSchemaObj) {
                if (propSchema.type === 'array') {
                    propSchema.items = refSchemaObj;
                    schema.properties[propKey] = propSchema;
                } else {
                    schema.properties[propKey] = refSchemaObj;
                }
            }*/


            if (!propSchema) {
                // console.error(`prop '${propKey}' propSchema is null`, schema, propSchema);
                return;
            }

            if (propSchema['$ref']) {
                schema.properties[propKey] = this.replaceRefDefinition(propSchema);
            } else if (propSchema.type === 'array') {
                propSchema.items = this.replaceRefDefinition(propSchema.items);
                schema.properties[propKey] = propSchema;
            }
        });
        return schema;
    }
    // buildAttributes----------------------------------------------------

    layerPathPush(layerPath, layerName) {
        return layerPath.concat([layerName]);
    }
    buildAttributes(schema, layer = 1, layerPath = []) {
        // layerPath: 用來顯示欄位的階層
        // console.log(`layerPath:`, layerPath);

        // console.log('buildAttributes', schema)

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

            // if (key === 'name') {
            //     console.log('name schema', schema, schemaPack)
            // }

            let required = false;

            let requiredArray;
            if (schema.type === 'object') {
                requiredArray = schema.required;
            } else if (schema.type === 'array') {
                requiredArray = schema.items.required;
            }
            // if (requiredArray === undefined){
            //     console.error('requiredArray is not array', schema)
            // }

            if (requiredArray) {

                if (Array.isArray(requiredArray)) {
                    requiredArray.forEach((requiredKey) => {
                        if (key === requiredKey) {
                            required = true;
                        }
                    });
                } else {
                    console.error(`schema.required is not array`, schema);
                }
                // console.log(`build required schema [${key}] required`, schema.required, required)
            }

            // if (schema.required) {
            //     if (Array.isArray(schema.required)) {
            //         schema.required.forEach((requiredKey) => {
            //             if (key === requiredKey) {
            //                 required = true;
            //             }
            //         });
            //     } else {
            //         console.error(`schema.required is not array`);
            //     }
            //     // console.log(`build required schema [${key}] required`, schema.required, required)
            // }

            // console.log(`${propName}`, attributeData)
            attributeData = Object.assign({}, attributeData);
            attributeData.name = key; // 將name加上去


            // if (Array.isArray(attributeData.required)) {
            //     // 代表這個欄位是物件，尚未到底
            //     // console.error('required arr cannot set', JSON.stringify(attributeData.required));
            //     // [BUG]目前無法設定object類型欄位的required，因為會導致下一層取到boolean，原本的array被蓋掉了
            // } else {
            //     attributeData.required = required;
            // }
            attributeData.attrRequired = required; // 要避免與原本物件的required衝突

            // 麵包屑
            attributeData.layerPath = layerPath;

            // 檢查是否有需要遞迴-----------------------------------------
            if (attributeData.type === 'object' ||
                attributeData.type === 'array') { // recursiveCheck(attributeData)

                // if (attributeData.type === 'array') {
                //     console.log('array', attributeData)
                // } else if (attributeData.type === 'object') {
                //     console.log('object', attributeData)
                // }


                // 進行遞迴
                attributeData = vm.buildAttributes(attributeData, layer + 1,
                    vm.layerPathPush(layerPath, attributeData.name));
            }

            // console.log(`[${key}] required`, attributeData)

            attributeList.push(attributeData);
        });
        schema.attributes = attributeList;


        // console.log('buildAttributes end', schema)

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


export default ApiSchema;