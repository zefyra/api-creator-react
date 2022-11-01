
// 若要使用TableModal Component，就需要實作這些class
export default class Interface {
    constructor(interfaceObj) {
        if (!interfaceObj.implements) {
            console.error(`${interfaceObj.constructor.name}: implements not exist`);
        }

        const impFuncNameMap = interfaceObj.implements()

        const impFuncNameList = [];
        const optionalFuncNameList = [];
        Object.keys(impFuncNameMap).forEach((key) => {
            if (impFuncNameMap[key] === true) {
                impFuncNameList.push(key)
            } else if (impFuncNameMap[key] === 'optional') {
                optionalFuncNameList.push(key);
            }

        });

        // console.log('impFuncNameList', impFuncNameList)
        // console.log('optionalFuncNameList', optionalFuncNameList)

        const vm = interfaceObj;

        impFuncNameList.forEach((funcName) => {
            if (!interfaceObj[funcName]) {
                console.error(`Interface: \`${funcName}\` should be impement in ${vm.constructor.name}`);
            }
            // console.error(`bindMount should be implement`);
        });
    }
}