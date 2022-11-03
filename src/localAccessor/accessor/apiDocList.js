export default class ApiDocList {
    static getter() {
        const apiDocList = localStorage.getItem('apiDocList');
        return apiDocList ? JSON.parse(apiDocList) : [];
    }

    // static setter() {
    //     return localStorage.setItem('profile', apiRes);
    // }
}