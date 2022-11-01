import { TagDecisionBlockFlow } from "flow/tag"
import { TagDecisionBlockModel, TagDecisionConditionModel } from "fragment/Tag"




export class TagDecisionBlockEntity {
    model = null;
    control = null;
    constructor(stateModel, modelInitObj) {
        // stateModel: <TagDecisionConditionModel>
        if (!(stateModel instanceof TagDecisionConditionModel)) {
            console.error(`TagDecisionBlockEntity: stateModel is invalid`);
            return;
        }
        /* modelInitObj: {
            tagName: '',
            tagId: '',
            tagConfigId: '',
            hasModify: true,
        } */

        modelInitObj = {
            ...modelInitObj,
            tagDecisionConditionT: stateModel.getState('tagDecisionConditionT'),
            dataCollectionT: stateModel.getState('dataCollectionT'),
        }

        this.model = new TagDecisionBlockModel(modelInitObj);
        this.control = new TagDecisionBlockFlow();
        this.control.registModel('tagDecision', this.model);
        // this.control.registControl('parent', stateModel);

        this.model.registTagDecisionBlockFlow(this.control);
    }
    getModel() {
        return this.model;
    }
    getControl() {
        return this.control;
    }
}