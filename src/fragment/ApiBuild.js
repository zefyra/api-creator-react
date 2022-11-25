import ApiProfile from "./ApiProfile";
import ApiSchema from "./ApiSchema";
import DefinitionBuild from "./DefinitionBuild";


class ApiDocVersion {
    getTagList() {
        console.error(`ApiDocVersion: \`${this.constructor.name}\` should implement getTagList()`);
    }
}

class ApiComponent {
    outObj() {
        console.error(`ApiComponent: \`${this.constructor.name}\` should implement outObj()`);
        return;
    }
}

class Tag extends ApiComponent {
    name = '';
    description = '';
    groupName = '';
    setName(name) {
        this.name = name
    }
    setDescription(description) {
        this.description = description
    }
    setGroupName(groupName) {
        this.groupName = groupName
    }
    outObj() {
        return {
            name: this.name,
            description: this.description,
            groupName: this.groupName,
            apiList: [],
        }
    }
}

class TagList extends ApiComponent {
    // constructor() {
    //     super();
    // }

    tagList = [];

    outObj() {
        return this.tagList;
    }
    push(tagObj) {
        if (!(tagObj instanceof Tag)) {
            console.error(`not Tag`);
            return;
        }
        this.tagList.push(tagObj.outObj());
    }
}

class OpenApiBuild extends ApiDocVersion { // OpenAPI 3.0
    json = null;
    tagList = [];
    defBuildObj = null;
    // definitionMap = {};

    constructor(json) {
        super();
        this.json = json;

        // const tagList = this.buildTagBlockDataList(new ApiConnectComposition(json));

        // console.log('tagList', tagList);

        // this.tagList = tagList;

        this.defBuildObj = new DefinitionBuild(json);
        // this.definitionMap = this.defBuildObj.getDefinitionMap();

        // console.log('this.definitionMap', this.definitionMap);

        // 生成tag的空殼
        this.tagList = this.buildTagList();

        // 生成tag內的apiList
        this.buildTagApiList();
    }

    // 跑每個tag，將apiList塞進去
    buildTagApiList() {
        /*
        目標格式: 要build成這種格式
        tagList: [{
            apiList: [{
                apiData: { // <swagger的格式>
                    parameters
                    produces
                    responses
                    tags
                }
                apiType: "post"
                path: "/api/provider"
            }]
            "name": "pet",
            "description": "Everything about your Pets",
            "externalDocs": {
                "description": "Find out more",
                "url": "http://swagger.io"
            }
        }] */

        if (!this.json.paths) {
            return;
        }

        const vm = this;

        const tagApiDataMap = {
            // <tagName>: [<apiData>]
        };
        const addTagApiData = function (tagName, apiData) {
            if (!apiData) {
                console.error(`addTagApiData apiData not exist`);
                return;
            }
            if (!tagApiDataMap[tagName]) {
                tagApiDataMap[tagName] = [];
            }
            tagApiDataMap[tagName].push(apiData);
        }
        const getTagApiDataList = function (tagName) {
            if (!tagApiDataMap[tagName]) {
                console.error(`\`${tagName}\` not getTagApiData`);
            }
            return tagApiDataMap[tagName];
        }

        Object.keys(this.json.paths).forEach((apiRoute) => {
            Object.keys(this.json.paths[apiRoute]).forEach((apiType) => {
                let apiData = this.json.paths[apiRoute][apiType];
                const apiTags = apiData.tags;
                if (!apiTags) { // 代表該api尚未設定掛在哪個tag底下
                    return;
                }
                apiData = new ApiProfile(apiData, apiRoute, apiType, vm.defBuildObj).getApiData();
                // apiData = vm.addParameterBody(apiData);

                // ps.這塊要獨立出去

                apiTags.forEach((tagName) => {
                    addTagApiData(tagName, apiData);
                });
            });
        });


        this.tagList = this.tagList.map((tagObj) => {
            let outTagObj = Object.assign({}, tagObj);

            const apiDataList = getTagApiDataList(tagObj.name);
            outTagObj.apiList = apiDataList;

            return outTagObj
        });
    }
    buildTagList() {

        /* "tags": [
            {
                "name": "pet",
                "description": "Everything about your Pets",
                "externalDocs": {
                    "description": "Find out more",
                    "url": "http://swagger.io"
                }
            },
            {
                "name": "store",
                "description": "Access to Petstore orders"
            },
            {
                "name": "user",
                "description": "Operations about user",
                "externalDocs": {
                    "description": "Find out more about our store",
                    "url": "http://swagger.io"
                }
            }
        ], */
        const tagsObj = new TagList();

        const docTags = this.json.tags || [];

        docTags.forEach((docTagItem) => {
            const tagObj = new Tag();

            tagObj.setName(docTagItem.name);
            tagObj.setDescription(docTagItem.name);
            tagObj.setGroupName(docTagItem.name);

            // 寫到這裡
            // tagObj.pushApiList();

            tagsObj.push(tagObj);
        });

        return tagsObj.outObj();
        // return [{
        //     apiList: [],
        //     description: "API的分類標籤",
        //     groupName: "標籤",
        //     name: "tag",
        // }];
    }
    getTagList() {
        return this.tagList;
    }
}


export default class ApiBuild {
    json = null;
    buildObj = null;
    constructor(json, docType) {
        if (!docType) {
            console.error(`ApiBuild: docType not exist`);
            return;
        }
        this.json = json;

        if (docType === 'openapi3') {
            this.buildObj = new OpenApiBuild(json);
        } else {
            console.error(`ApiBuild: docType not support`);
            return;
        }
    }

    getTagList() {
        return this.buildObj.getTagList();
    }
}