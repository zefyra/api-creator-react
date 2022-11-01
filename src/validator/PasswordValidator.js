import PasswordValidEnum from "enum/login/PasswordValid";

export default class PasswordValidator {
    stateModeMap = {
        // [PasswordValidEnum.valid]: {
        //     text: 'passwordFormatMatched',
        //     textKey: 'passwordFormatMatched', // '此為後續登入的密碼',
        //     // className: 'invalid',
        // },
        // Password Error------------------------------------------
        [PasswordValidEnum.isEmpty]: {
            text: 'passwordEmptyIsInvalid',
            textKey: 'passwordEmptyIsInvalid', // 密碼不能為空
            className: 'invalid', // Login.jsx用的
        },
        [PasswordValidEnum.tooShort]: {
            text: 'passwordAtLeast10char',
            textKey: 'passwordAtLeast10char', // 密碼至少10個字元
            className: 'invalid',
        },
        [PasswordValidEnum.tooLong]: {
            text: 'passwordOver50char',
            textKey: 'passwordOver50char', // 密碼不能超過50個字元
            className: 'invalid',
        },
        [PasswordValidEnum.requiredCharLost]: {
            text: 'passwordRequiredCharLost',
            textKey: 'passwordRequiredCharLost', // 密碼必須包含英文大寫、英文小寫、數字
            className: 'invalid',
        },
        [PasswordValidEnum.unknown]: {
            text: 'unknown error',
            textKey: 'unknown error', // '此為後續登入的密碼',
            className: 'invalid',
        },
        //       /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/
    };

    registState(validateState, obj) {
        this.stateModeMap[validateState] = obj;
    }

    // numberInterval = false; // 要是true，才會檢查最大最小值
    constructor(t) {
        // const { t } = useTranslation('login', { keyPrefix: 'regist' });
        if (t) {
            this.applyTranslation(t);
        }
    }

    applyTranslation(t) {
        const vm = this;
        Object.keys(this.stateModeMap).forEach((validKey) => {
            vm.stateModeMap[validKey].text = t(vm.stateModeMap[validKey].textKey);
        });
    }

    getStateModeMap() {
        return this.stateModeMap;
    }

    validate(password) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/.test(password);
    }

    // 取得驗證狀態
    getValidState(password) {
        /*   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/   */

        // 【?=.*】  ==> 代表判斷式成立才會繼續往下判斷，類似於js中的 <boolean> && do();
        // 【.】  ==> 代表任意字元  

        if (!password) { // null or ""
            return PasswordValidEnum.isEmpty;
        } else if (password.length < 10) {
            return PasswordValidEnum.tooShort;
        } else if (password.length > 50) {
            return PasswordValidEnum.tooLong;
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,50}$/.test(password)) {
            return PasswordValidEnum.requiredCharLost;
        }

        return PasswordValidEnum.valid;
    }

    // 取得驗證狀態描述字串
    getValidateComment(password) {
        const validateState = this.getValidState(password);

        const obj = this.stateModeMap[validateState];
        return obj ? obj.text : '';
    }
}

