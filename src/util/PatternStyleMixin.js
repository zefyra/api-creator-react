import PatternStyleEnum from "enum/PatternStyle";

const masterPatternStyleMap = {
    formModal: {
        Button: {
            marginBottom: "0rem",
            marginLeft: "0rem",
            marginRight: "0rem",
            marginTop: "0rem",

            height: '2rem',
            paddingH: '1.5rem',
        },
        CheckBox: {
            height: '20px',
            width: '20px',
            left: '6px',
            top: '2px',
            border: '1px solid #cacaca',
        },
        TagInputView: { // <TagSelector>
            width: '18rem',
        },
    },
    panel: { // panel: 是以「使用<FilterPanelTitle>」為前提的作法，因此margin統一加在FilterPanelTitle上面
        uni: { // 共通屬性
            // marginLeft: '1.5rem',
            // marginRight: '0rem',
            marginTop: '0', // '1rem',
            marginBottom: '0', //'1rem',
            height: '2.3rem',
        },
        FilterPanel: {
            padding: '0.5rem 0rem',
            height: 'auto',
        },
        FilterPanelDash: {
            width: '2.3rem',
        },
        FilterPanelTitle: { // 連同title將主體包覆的組件
            height: "2.3rem",
            marginBottom: "0.5rem",
            marginLeft: "1.5rem",
            marginRight: "1.5rem",
            marginTop: "0.5rem",
        },
        InputText: { // <componentType>: <InputText>組件附加屬性
            width: '220px',
        },
        TagInputView: { // <TagSelector>
            minWidth: '220px',
        },
        Button: {
            // marginBottom: "0.5rem",
            // marginTop: "0.5rem",
        },
        FilterPanelTail: {
            height: "2.3rem",
            marginBottom: "0.5rem",
            marginLeft: "1.5rem",
            marginRight: "1.5rem",
            marginTop: "0.5rem",
        }
    },
    query: { // <pattern> 舊版的: 不使用FilterPanelTitle包住
        uni: { // 共通屬性
            marginLeft: '1.5rem',
            marginRight: '0rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            height: '2.3rem',
        },
        InputText: { // <componentType>: <InputText>組件附加屬性
            width: '220px',
        },
        FilterPanelDash: {
            width: '0.5rem',
            // marginLeft: '0rem',
            marginRight: '0rem',
            // height: '2.3rem',
            // margin: '0.5rem',
        },
        FilterPanelComment: {
            // width: '10rem',
            marginRight: '0rem',
        },
        FilterPanelTitle: {
            // marginLeft: '0rem',
            marginRight: '0rem',
        },
        Button: {}, // 用的都是共通
        Select: {

        },
        TagInputView: { // <TagSelector>
            marginRight: '1.5rem',
            height: PatternStyleEnum.cancel,
        },
    },
    tableCell: {
        InputText: { // <componentType>: <InputText>組件附加屬性
            width: 'calc(100% - 3rem)',
        },
    },
    small: {
        Button: {
            height: '2rem',
            paddingH: '1.5rem',
        },
        CheckBox: {
            height: '20px',
            width: '20px',
            left: '6px',
            top: '2px',
        }
    },
    raw: {
        Button: {
            marginBottom: '0',
            marginTop: '0',
            marginLeft: '0',
            marginRight: '0',
        },
    }
};

export default class PatternStyleMixin {
    componentType = '';
    patternStyleMap = '';

    constructor(componentType) {
        this.componentType = componentType; // ex. 'FilterPanelDash' or 'Button'
        const vm = this;

        let patternStyleMap = {};

        Object.keys(masterPatternStyleMap).forEach((pattern) => {
            const patternStyleObject = masterPatternStyleMap[pattern];
            const componentType = vm.componentType;

            let obj = {};
            if (patternStyleObject.uni) {
                obj = Object.assign(obj, patternStyleObject.uni);
            }
            // console.log(`componentType: ${componentType}  pattern: ${pattern}`);

            if (patternStyleObject[componentType]) {
                obj = Object.assign(obj, patternStyleObject[componentType]);

                // console.log(`load componentType: ${componentType}`, patternStyleObject[componentType])
                // console.log(`=>obj`, obj)
            }

            patternStyleMap[pattern] = obj;
        });
        this.patternStyleMap = patternStyleMap;
        /* ===>
        const patternStyleMap = { // 自動生成出<InputText>組件的Map
            query: {
                height: '2.3rem',
                width: '220px',
                marginLeft: '0.5rem',
                marginRight: '0.5rem',
                marginTop: '0.5rem',
                marginBottom: '0.5rem'
            }
        } */
    }

    fetchPatternStyleObj(pattern) {
        const vm = this;
        if (pattern) {

            const hasMultiPattern = /\s/g.test(pattern);

            if (hasMultiPattern) {
                const patternList = pattern.split(' ');
                let patternStyleObj = {};
                patternList.forEach((patternKey) => {
                    if (vm.patternStyleMap[patternKey]) {
                        patternStyleObj = Object.assign(patternStyleObj, vm.patternStyleMap[patternKey]);
                    }
                });
                return patternStyleObj;
            }

            if (this.patternStyleMap[pattern]) {
                // ex. pattern === 'query'
                return this.patternStyleMap[pattern];
            }
        }
        return {};
    }

    filtPatternStyleObj(patternStyleObj) {
        Object.keys(patternStyleObj).forEach((attr) => {
            if (patternStyleObj[attr] === PatternStyleEnum.cancel) {
                // 代表要取消該屬性
                delete patternStyleObj[attr];
            }
        })
        return patternStyleObj;
    }

    getPatternStyle(pattern) {
        const patternStyleObj = this.fetchPatternStyleObj(pattern);
        return this.filtPatternStyleObj(patternStyleObj);
    }

    // const getPatternStyle = function (pattern) {
    //     if (pattern) {
    //         if (patternStyleMap[pattern]) {
    //             // ex. pattern === 'query'
    //             return patternStyleMap[pattern];
    //         }
    //     }
    //     return undefined;
    // }
}