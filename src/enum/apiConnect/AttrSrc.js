export default class AttrSrc {
    static reqBody = 'reqBody';
    static resBody(status) {
        return `resBody.${status}`;
    }
}