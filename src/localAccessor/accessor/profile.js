export default class Profile {
    static getter() {
        const profileStr = localStorage.getItem('profile');
        return profileStr ? JSON.parse(profileStr) : {};
    }

    // static setter(apiRes) {
    //     /*
    //     apiRes {
    //         activated: null
    //         createdAt: null
    //         email: "thomaswang@reas.com.tw"
    //         enabled: null
    //         entityID: 1
    //         id: 1
    //         lastLoginAt: null
    //         parentID: null
    //         phoneNumber: null
    //         role: "admin"
    //         updatedAt: null
    //         username: null
    //     } */

    //     // email
    //     // entityID
    //     // id
    //     // phoneNumber
    //     // role
    //     // username

    //     return localStorage.setItem('profile', apiRes);
    // }
}