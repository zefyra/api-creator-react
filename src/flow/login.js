import ApiSender, { ApiError } from "apiSender";
import Control from "control/Control";
import { RegistVerifyModel, ResetPasswordModel } from "fragment/Login";
import LocalAccessor from "localAccessor";
// import { useGetter } from "store";
import { selectAccount, selectPassword, updateLogout, updatePassword, updateToken, updateUserPermission, updateUserProfile } from "store/login";
import { resetProfile, selectRole } from "store/profile";
import ProfileControl from "river/Profile";
import { resetIndustry } from "store/industry";


export class LogoutFlow extends Control {
    ref() {
        return {
            navigate: true,
        }
    }
    setup() {
        return {
            dispatch: true,
        }
    }
    onNavBarClickLogout() {
        this.logoutAction();
    }
    logoutAction() {
        // console.log('logoutEvent');

        // const navigate = this.navigate;
        const navigate = this.fetchRef('navigate');

        // 清空
        this.dispatch(updateLogout());

        // 清除localStorage的token，使其無法進入內部頁面
        LocalAccessor.removeItem('token');
        LocalAccessor.removeItem('profile');
        LocalAccessor.removeItem('permission');
        LocalAccessor.removeItem('industry');
        // LocalAccessor.removeItem('systemPermission');

        this.dispatch(resetProfile());
        this.dispatch(resetIndustry());

        navigate('/');
    }
}

export default class LoginFlow extends Control {
    constructor() {
        super();
        this.registControl('profile', new ProfileControl());
    }

    circuit() {
        return {
            profile: ProfileControl.name,
        };
    }

    ref() {
        return {
            noBindAccountModal: true, // 未綁定fb帳號燈箱
            resendEmailModal: true, // 重新發送驗燈箱
        }
    }

    setup() {
        return {
            dispatch: true,
            carry: true,
        };
    }

    // event-----------------------------------------------

    onClickLogin() {
        this.loginAction();
    }

    onPasswordEnter(pageMode) {
        if (pageMode === 'regist') {
            // console.log('onPasswordEnter regist event');
            // loginModuleRef.registEvent().catch(new ApiError().catchAlertMsg());

        } else {
            // console.log('onPasswordEnter login event');

            this.loginAction();
        }
    }

    // 點擊註冊
    onClickRegist(eventCallback) {
        this.registAction().then(() => {
            eventCallback('success')

            // 開啟重新發送驗證Email的燈箱
            this.fetchRef('resendEmailModal').openModal();
        }).catch((error) => {
            eventCallback('error');
        });
    }

    // 點擊重發驗證信
    onClickResendVerifyEmail(eventCallback) {
        // 開啟重新發送驗證Email的燈箱
        this.fetchRef('resendEmailModal').openModal();

        // 發送驗證信
        this.sendVerifyEmailAction().then(() => {
            eventCallback('success');
        }).catch((error) => {
            // error: 底下繼續傳上來的error
            eventCallback('error');
        });
    }

    // 重發驗證信燈箱，點擊「重發」
    onResendVerifyEmailModalClickResend() {
        this.sendVerifyEmailAction();
    }

    // action---------------------------------------

    loginAction() {
        const vm = this;

        const account = this.carry(selectAccount);
        const password = this.carry(selectPassword);

        let token;

        return ApiSender.sendApi('[post]/auth/signin', {
            email: account,
            password: password,
        }).then((apiRes) => {
            // apiRes: {"data":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidCI6ImxvZ2luIiwiZXhwIjoxNjY3MDMyNzEzLCJpc3MiOiJjcm9zc2JvdCJ9.RrcC9Wn9q5cauaU3MXmcioO6R_1GJoUkIzb8mxhgifQ","code":"G0200","msg":"ok"}

            token = apiRes.data;
            // 儲存token: token存入store之後，RouteFilter會自動轉跳進首頁

            // 將token存入store讓API [get]/accounts/profile 可以吃到token
            // vm.saveToken(token);
            vm.dispatch(updateToken(token));
            LocalAccessor.setItem('token', token);

            return vm.fetchControl('profile').autoLoadUserProfile();
        }).then(() => {

            return ApiSender.sendApi('[get]/permissions');
        }).then((apiRes) => {
            const role = vm.carry(selectRole);

            // 更新store內的權限資料
            vm.dispatch(updateUserPermission(apiRes, role));

            // 刪除欄位內的password
            vm.dispatch(updatePassword(''));


            // 不用轉跳，store有token就會自動跳進去
            // navigate('/home');

            return Promise.resolve();
        }).catch(new ApiError().catchAlertMsg());

    }

    registAction() {
        const account = this.carry(selectAccount);
        const password = this.carry(selectPassword);

        return ApiSender.sendApi('[post]/auth/signup', {
            email: account,
            password: password,
        }).then((responseData) => {
            return Promise.resolve(responseData);
        }).catch(new ApiError(function (error, next) {
            next(error); // 將error繼續往上拋
        }).catchAlertMsg());
    }

    sendVerifyEmailAction(email) {
        email = this.carry(selectAccount);

        // 重新驗證Email的API
        return ApiSender.sendApi('[get]/auth/activate/{email}', null, {
            apiInnerData: {
                email: email,
            }
        }).catch(new ApiError(function (error, next) {
            next(error); // 代表繼續將error往上拋
        }).catchAlertMsg());
    }
}

export class ResetPasswordFlow extends Control {
    circuit() {
        return {
            tip: true,
        }
    }
    frame() {
        return {
            stateModel: ResetPasswordModel.name,
        }
    }
    ref() {
        return {
            // 登入頁--------------------------------------
            passwordResetModal: true,
            // 密碼重置頁--------------------------------------
            navigate: true,
        }
    }
    setup() {
        return {
            carry: true,
        }
    }

    // 登入頁--------------------------------------
    // 點擊忘記密碼，開啟密碼重置燈箱
    onClickForgetPw() {
        const email = this.carry(selectAccount);
        this.fetchModel('stateModel').setState('email', email);

        this.fetchRef('passwordResetModal').openModal();
    }

    // 登入頁>密碼重置燈箱---------------------------------------
    onSendResetPassword(email, eventCallback) {
        // 送出重設的API
        ApiSender.sendApi('[get]/auth/forgot-password/{email}', null, {
            apiInnerData: {
                email: email,
            }
        }).then((data) => {
            eventCallback('success');
        }).catch(new ApiError(function (error, next) {
            /* error: {
                code: 7
                data: null
                msg: "fail"
            } */
            if (error.code === '00007') {
                eventCallback('emailNotFound');
                return next();
            }
            // 執行next代表要開啟燈箱
            return next();
        }).catchAlertMsg());
    }

    // 密碼重置頁--------------------------------------

    onResetPasswordClick(token) {
        this.sendResetPassword(token);
    }

    sendResetPassword(token) {
        const vm = this;
        const stateModel = this.fetchModel('stateModel');
        const password = stateModel.getState('password');

        const t = stateModel.getState('resetPasswordT');

        ApiSender.sendApi('[put]/auth/reset-password/{token}', {
            password: password,
        }, {
            apiInnerData: {
                token: token,
            }
        }).then(() => {

            // 您的密碼已成功重置，即將轉跳至登入頁
            vm.fetchControl('tip').tip(t('resetPasswordSuccess'));

            setTimeout(function () {
                vm.fetchRef('navigate')('/login');
            }, 1500);
        });
    }

}

export class RegistVerifyFlow extends Control {
    ref() {
        return {
            navigate: true,
            registVerifyT: true,
        }
    }
    frame() {
        return {
            stateModel: RegistVerifyModel.name,
        }
    }
    circuit() {
        return {
            tip: true,
        }
    }
    onPageMount(token) {
        const t = this.fetchRef('registVerifyT');
        const vm = this;

        ApiSender.sendApi('[put]/auth/activate/{token}', {}, {
            apiInnerData: {
                token: token,
            }
        }).then((data) => {
            // 驗證成功，重新導向到登入頁

            // 關閉Loading
            vm.fetchModel('stateModel').setState('loadingHide', true);

            // 開啟轉跳提示
            vm.fetchControl('tip').tip(t('verifySucessMessage')).then((action) => {
                // console.log('action', action)
                if (!action !== 'confirm') {
                    return;
                }
            });

            // 自動轉跳到登入頁
            setTimeout(function () {
                vm.fetchRef('navigate')("/login");
            }, 1500);


            vm.fetchModel('stateModel').setState('loadingHide', true);
        }).catch(new ApiError().catchAlertMsg());

    }
}