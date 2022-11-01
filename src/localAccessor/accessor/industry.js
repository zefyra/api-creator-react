export default class Profile {
    static getter() {
        const profileStr = localStorage.getItem('industry');
        return profileStr ? JSON.parse(profileStr) : null;
        // const profileStr = localStorage.getItem('profile');
        // return profileStr ? JSON.parse(profileStr) : {};
    }

    // static setter() {
    //     return localStorage.setItem('profile', apiRes);
    // }
}