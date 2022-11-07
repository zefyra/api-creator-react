import StateModel from "model/StateModel";
// const { format: formatJSON } = require('json-string-formatter');
import { format as formatJSON } from "json-string-formatter";

export default class ApiJsonModel extends StateModel {
    data() {
        return {
            json: '',
            searchKeywordFunc: null,
        };
    }
    saveJsonDoc(jsonObj) {
        const jsonStr = JSON.stringify(jsonObj);
        this.setState('json', formatJSON(jsonStr));
    }
}