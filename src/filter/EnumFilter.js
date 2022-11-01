import { CustomFilter } from './Filter'

export default class EnumFilter extends CustomFilter {
    enumClass = null;
    t = null;
    constructor(enumClass, t) {
        super();
        this.enumClass = enumClass;

        this.t = t;
    }
    filt(key) {
        // console.log(`EnumFilter filt`, key, this.enumClass[key])
        // if (!this.enumClass) {
        //     return '';
        // }
        // if (typeof this.enumClass[key] !== 'string') {
        //     console.error(`enum field is not string`);
        //     return '';
        // }
        // return this.enumClass[key];

        if (!key) {
            return '';
        }
        console.log(`EnumFilter filt f`, this.t(key));

        return this.t(key);
    }
}