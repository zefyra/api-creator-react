import ApiSchema from "./ApiSchema";

class DefinitionBuild {
    // definitionMap = {}; // 舊版

    refSchemaMap = {};

    constructor(json) {
        this.json = json;

        if (!this.json) {
            console.error(`DefinitionBuild: json not exist`);
        }

        // $ref: "#/components/schemas/Pet"

        const vm = this;

        // 單純把json中的每塊schemaObj挖出來
        this.buildRefSchemaMap(this.json, function (refKey, schemaObj) {
            vm.refSchemaMap[refKey] = schemaObj;
            // vm.refSchemaMap[refKey] = new ApiSchema(schemaObj, vm, 1).getSchema();
        });

        // 跑每個schemaObj，清掉裡面的$ref
        this.resolveEachRefDefinition(this.refSchemaMap, function (refKey, schemaObj) {
            const outSchemaObj = new ApiSchema(schemaObj, vm, 1).getSchema();
            vm.refSchemaMap[refKey] = outSchemaObj; // 取代掉原本的
        });

        console.log('vm.refSchemaMap', vm.refSchemaMap)


        /*舊版

        // 有可能第一輪會抓不到全部definition，要跑2輪
        // 因為有可能ref參照的definition在後面，尚未生成
        this.definitionMap = this.buildDefinitionMap(json, 1);
        // console.log(`first run ------------------------------`)
        this.definitionMap = this.buildDefinitionMap(json, 2, this.definitionMap);
        */
    }
    resolveEachRefDefinition(refSchemaMap, resolveEach) {
        const vm = this;
        Object.keys(refSchemaMap).forEach((refKey) => {
            const schemaObj = refSchemaMap[refKey];
            resolveEach(refKey, schemaObj);
        });
    }
    buildRefKey(categoryKey, componentType, definitionType) {
        // categoryKey: 'components'
        return `#/${categoryKey}/${componentType}/${definitionType}`;
        // '#/components/schemas/Pet'
    }
    buildRefSchemaMap(json, addRefSchema) {
        if (!json.components) {
            console.warn(`DefinitionBuild: json.components not exist`);
            return;
        }
        const componentMap = json.components;
        //  componentsMap: {
        //     schemas: <componentTypeObj>
        //     requestBodies: <componentTypeObj>
        //     securitySchemes: 不支援 <componentTypeObj>
        // }
        const vm = this;

        Object.keys(componentMap).forEach((componentType) => {
            const validComponentTypeMap = {
                schemas: true,
                requestBodies: true,
                securitySchemes: false, // 不支援
            };
            if (!validComponentTypeMap[componentType]) {
                return;
            }
            const componentTypeObj = componentMap[componentType];

            Object.keys(componentTypeObj).forEach((definitionType) => {
                const definitionTypeObj = componentTypeObj[definitionType];

                const refKey = vm.buildRefKey('components', componentType, definitionType);
                if (componentType === 'schemas') {
                    //  schemas: {
                    //     Order: { // <definitionTypeObj>
                    //         type: "object"
                    //         properties
                    //     }
                    // }
                    addRefSchema(refKey, definitionTypeObj);
                } else if (componentType === 'requestBodies') {
                    //  requestBodies: {
                    //     "Pet": {
                    //         "description": "Pet object that needs to be added to the store",
                    //         "content": {
                    //             "application/json": {
                    //                 "schema": {
                    //                     "$ref": "#/components/schemas/Pet"
                    //                 }
                    //             },
                    //             "application/xml": {
                    //                 "schema": {
                    //                     "$ref": "#/components/schemas/Pet"
                    //                 }
                    //             }
                    //         }
                    //     }
                    // } 
                    const jsonContent = definitionTypeObj.content['application/json']; // 目前先不支援xml等其他格式
                    const schemaObj = jsonContent.schema;
                    addRefSchema(refKey, schemaObj);
                }
            });
        })
    }
    getRefSchema(refKey) {
        return this.refSchemaMap[refKey];
    }
    /*
    getRefSchema(defKey) {
        // defKey: '#/components/requestBodies/Pet'
        // console.log('getRefSchema defKey', defKey)

        const defLayerList = defKey.split('/');
        console.log('defLayerList', defLayerList)
        if (defLayerList[0] !== '#') {
            console.error(`getRefSchema: defKey format error`, defKey);
            return null;
        }
        if (defLayerList[1] !== 'components') {
            console.error(`getRefSchema: defKey format components error`, defKey);
            return null;
        }
        const componentsMap = this.json['components'];
        //  componentsMap: {
        //     schemas: <componentTypeObj>
        //     requestBodies: <componentTypeObj>
        //     securitySchemes: 不支援 <componentTypeObj>
        // }
        if (!componentsMap) {
            console.error(`getRefSchema: componentsMap not exist`);
            return null;
        }

        const componentType = defLayerList[2];
        const validComponentTypeMap = {
            schemas: true,
            requestBodies: true,
            securitySchemes: false,
        };
        if (!validComponentTypeMap[componentType]) {
            console.error(`componentType is not valid`, componentType);
            return null;
        }

        const componentTypeObj = componentsMap[componentType];
        if (!componentTypeObj) {
            console.error(`getRefSchema: componentTypeObj not exist`);
            return null;
        }

        const definitionTypeObj = componentTypeObj[defLayerList[3]];
        if (!definitionTypeObj) {
            console.error(`getRefSchema: definitionTypeObj not exist`);
            return null;
        }

        if(componentType === 'schemas'){
            //  schemas: {
            //     Order: { // <definitionTypeObj>
            //         type: "object"
            //         properties
            //     }
            // }
            return definitionTypeObj;
        }else if (componentType === 'requestBodies'){
            //  requestBodies: {
            //     "Pet": {
            //         "description": "Pet object that needs to be added to the store",
            //         "content": {
            //             "application/json": {
            //                 "schema": {
            //                     "$ref": "#/components/schemas/Pet"
            //                 }
            //             },
            //             "application/xml": {
            //                 "schema": {
            //                     "$ref": "#/components/schemas/Pet"
            //                 }
            //             }
            //         }
            //     }
            // } 

            const jsonContent = definitionTypeObj.content['application/json']; // 目前先不支援xml等其他格式

            const schemaObj = jsonContent.schema;
            return schemaObj;
        }

        console.error(`getRefSchema: Unknown componentType`);
        return null;
    } */
    // 舊版------------------------------------------------
    /*
    getDefinitionMap() {
        return this.definitionMap;
    }
    // 從ApiConnectComposition搬過來的函式
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
    */
}


export default DefinitionBuild;