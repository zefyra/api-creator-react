import Control from "control/Control";
import ApiConnectModel from "fragment/ApiConnect";
import ApiManageModel from "fragment/ApiManage";

export default class DocxControl extends Control {
    frame() {
        return {
            apiManage: ApiManageModel.name,
            apiDoc: ApiConnectModel.name,
        }
    }
    onClickSave() {
        console.log('onClickSave')

        const apiDocModel = this.fetchModel('apiDoc');
        const docJson = apiDocModel.getState('docJson');

        console.log('docJson', docJson)


        // docJson.tags

        
    }
}