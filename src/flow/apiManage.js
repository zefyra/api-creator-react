import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import ApiConnectModel from "fragment/ApiConnect";
import ApiManageModel, { AddApiModel, AddTagModel } from "fragment/ApiManage";

export class ApiManageControl extends Control {
    // constructor(){

    // }

    circuit() {
        return {
            confirm: true,
            tip: true,
        }
    }

    frame() {
        return {
            apiDoc: ApiConnectModel.name,
            apiManage: ApiManageModel.name,
            addTag: AddTagModel.name,
            addApi: AddApiModel.name,
        }
    }

    fetchJson() {
        const vm = this;

        const jsonPath = this.fetchModel('apiManage').getState('jsonPath');
        console.log(`fetchJson`, jsonPath);
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(json => {
                vm.fetchModel('apiDoc').saveApiDoc(json);
                // console.log('get apiDoc', json);
            })
            .catch(function (error) {
                console.error(error);
                // this.dataError = true;
            });
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


    onClickAddApi(tagData) {
        // console.log('onClickAddApi', JSON.stringify(tagData))
        /* tagData: {
            "name": "friend",
            "description": "friend description",
            "groupName": "friend groupName",
            "apiList": [ .. ]
        } */

        console.log('onClickAddApi tag', [tagData.name])
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

        console.log('apiParam', apiParam)

        await ApiSender.sendApi(`[post]/addApi`, apiParam).catch(new ApiError().catchAlertMsg())

        const addApiModalRef = this.fetchModel('apiManage').getState('addApiModalRef');

        if (addApiModalRef) {
            addApiModalRef.closeModal();
        }

        vm.fetchJson();
    }

    onClickAddBody(apiData) {
        /* apiData: {
        } */
        console.log('onClickAddBody apiData', JSON.stringify(apiData))
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

        // 寫到這裡

        // this.fetchModel('addApi').setState('tags', [tagData.name])

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
            // summary: addBodyModel.getState('summary'),
        };

        console.log('onConfirmAddBody apiParam', apiParam)

        // await ApiSender.sendApi(`[post]/addBody`, apiParam).catch(new ApiError().catchAlertMsg())

        // const addBodyModalRef = this.fetchModel('apiManage').getState('addBodyModalRef');

        // if (addBodyModalRef) {
        //     addBodyModalRef.closeModal();
        // }

        // vm.fetchJson();
    }
}