import Control from "./Control";

import StateModel from "model/StateModel";

class SelectStateModel extends StateModel {
    data() {
        return {
            selectedLabel: '',
            dropdownOpen: false,
        };
    }
}



export default class SelectControl extends Control {
    controlName = 'SelectControl';

    stateModel = null;

    actDropdownOpen = null;

    constructor(stateRef) {
        super();

        this.stateModel = new SelectStateModel(stateRef);
    }

    bindDropdownSetter(setDropdownOpen) {
        this.actDropdownOpen = this.stateModel.reactive('dropdownOpen', this.controlName, setDropdownOpen);
        return this.actDropdownOpen;
    }

    onSelectChanged(val) {
        // console.log(`onSelectChanged`, val);
        this.stateModel.setState('selectedLabel', val);
    }

    actDropdown() {
        const dropdownOpen = this.stateModel.getState('dropdownOpen');

        // console.log('dropdownOpen', dropdownOpen)
        this.stateModel.setState('dropdownOpen', !dropdownOpen);
    }
    getStateModel() {
        return this.stateModel;
    }
}