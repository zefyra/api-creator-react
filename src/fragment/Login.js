import StateModel from "model/StateModel";
import PasswordValidator from "validator/PasswordValidator";

export class ResetPasswordModel extends StateModel {
    data(initObj = {}) {
        return {
            // 登入頁-----------------------------------
            email: '',
            // 密碼重置頁-----------------------------------
            password: '',
            resetPasswordT: initObj.resetPasswordT || null,
            // ------------------------------------
            passwordComment: '',
            passwordValid: true,
            passwordValidator: new PasswordValidator(initObj.resetPasswordT),
        };
    }
    sight() {
        return {
            password: {
                passwordComment: true,
                passwordValid: true,
            }
        }
    }
    watch() {
        return {
            password: function (password) {
                // console.log(`watch password`, password)

                const passwordValidator = this.getState('passwordValidator');

                if (!password) { // 空字串時，代表不改密碼，valid為true
                    this.setState('passwordComment', '');
                    this.setState('passwordValid', true);
                    return;
                }

                const passwordValid = passwordValidator.validate(password);
                this.setState('passwordValid', passwordValid);

                const validateComment = passwordValidator.getValidateComment(password);
                this.setState('passwordComment', validateComment);
            }
        }
    }
}

export class RegistVerifyModel extends StateModel {
    data() {
        return {
            loadingHide: false,
        };
    }
}