import Control from "control/Control";
import ApiJsonModel from "fragment/ApiJson";
import ApiManageModel from "fragment/ApiManage";

export class ApiJsonControl extends Control {

    // searchKeywordFunc = null;
    frame() {
        return {
            apiJson: ApiJsonModel.name,
            apiManage: ApiManageModel.name,
        }
    }
    getViewMode() {
        return this.fetchModel('apiManage').getState('viewMode');
    }
    onAsideLinkClick(tagGroupData, apiData) {
        // console.log('onClickApiLink', tagGroupData, apiData)

        /* apiData: {
            apiData: {..}
            apiType: "post",
            path: "/api/editTag"
        } */
        // apiData.path

        const searchKeywordFunc = this.fetchModel('apiJson').getState('searchKeywordFunc');
        searchKeywordFunc(`\"${apiData.path}\"`, 1, -1);
    }

    receiveSearchKeyword(searchKeywordFunc) {
        // this.searchKeywordFunc = searchKeywordFunc;
        this.fetchModel('apiJson').setState('searchKeywordFunc', searchKeywordFunc);
    }


}