

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

    constructor(json) {
        super();
        this.json = json;

        // const tagList = this.buildTagBlockDataList(new ApiConnectComposition(json));

        // console.log('tagList', tagList);

        // this.tagList = tagList;

        this.tagList = this.buildTagList();
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