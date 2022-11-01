import Filter from "filter/Filter";
import ApiSender, { ApiError } from "apiSender"; // 載入 /src/apiSender/index.js
import i18n from 'i18next';

const roleNameList = ['admin', 'user', 'subUser', 'premiumUser', 'developer'];

export default class RoleFilter extends Filter {
    roleMap = {};
    // ps.必須在render才能創建物件，不能寫在外部
    // i18n.t的用法，會導致必須要在Componet內部render時才能創建物件，不能寫在外部
    // 因外部在執行時，i18n的資源尚未載入，因此抓不出字串
    constructor(...args) {
        super(...args);

        // console.log(`load roleName: admin => ${i18n.t(`profile:role.admin`)}`);

        const vm = this;
        roleNameList.forEach((roleName) => {
            // console.log(`load roleName: ${roleName} => ${i18n.t(`profile:role.${roleName}`)}`);
            vm.roleMap[roleName] = i18n.t(`profile:role.${roleName}`);
        });
    }
    roleName(roleName) {
        // console.log('roleName', roleName);
        return this.roleMap[roleName];
    }
}