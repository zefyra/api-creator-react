
import serverErrorCode from 'assets/json/serverErrorCode'

export default class ServerCodeFilter {
    filt(code) {
        const errorName = serverErrorCode[code];
        return errorName || code;
    }
}