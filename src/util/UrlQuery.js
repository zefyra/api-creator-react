import qs from 'qs'
import { useLocation, useNavigate } from 'react-router-dom'
import TableData from "util/TableData"

const tryParseInt = value => {
    const result = parseInt(value)
    return isNaN(result) ? value : result
}

const parseObjectValues = (obj = {}) => {
    Object.keys(obj).forEach(k => {
        obj[k] = tryParseInt(obj[k])
    })

    return obj
}


export default class UrlQuery {
    location = null;
    /* location: {
        hash: ""
        key: "uhvbyftu"
        pathname: "/users"
        search: "?page=3&pageSize=15"
        state: null
    } */
    constructor(location, navigate) {
        this.location = location;
        this.navigate = navigate;

        this.value = parseObjectValues(
            qs.parse(location.search, { ignoreQueryPrefix: true }) || {}
        )
    }
    set(params) {
        this.navigate({
            // pathname: '/posts',
            // search: `?page=2&pageSize=15`,
            pathname: this.location.pathname,
            search: qs.stringify({ ...this.value, ...parseObjectValues(params) })
        });
    }
    applyTableData(tableData) {
        if (!(tableData instanceof TableData)) {
            console.error('UrlQuery: applyTableData fail, tableData is invalid');
            return;
        }
        const page = tableData.getNowPage();
        const pageSize = tableData.getPageSize();

        this.set({
            page: page,
            pageSize: pageSize,
        });
    }
    get() {
        return this.value;
    }
    nav(path, params) {
        this.navigate({
            // pathname: '/posts',
            // search: `?page=2&pageSize=15`,
            pathname: path,
            search: qs.stringify({ ...parseObjectValues(params) })
        });
    }
}


export const useUrlQuery = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return new UrlQuery(location, navigate);
}



/*
export const useUrlQuery = () => {
    const location = useLocation()
    // location: {
    //     hash: ""
    //     key: "uhvbyftu"
    //     pathname: "/users"
    //     search: "?page=3&pageSize=15"
    //     state: null
    // }

    // const history = useHistory() // v5寫法，無法使用
    const navigate = useNavigate()
    const value = parseObjectValues(
        qs.parse(location.search, { ignoreQueryPrefix: true }) || {}
    )

    return {
        value,
        set: params => {
            // console.log('params', params);
            // console.log('parseObjectValues', parseObjectValues(params))

            // v1 測試用
            // const testVal = {
            //     page: '3',
            //     pageSize: '15',
            // }

            // const qstring = qs.stringify({ ...testVal, ...parseObjectValues(params) })
            // console.log('qstring', qstring);

            // navigate({
            //     pathname: location.pathname,
            //     search: qs.stringify({ ...testVal, ...parseObjectValues(params) })
            // });

            navigate({
                // pathname: '/posts',
                // search: `?page=2&pageSize=15`,
                pathname: location.pathname,
                search: qs.stringify({ ...value, ...parseObjectValues(params) })
            });
        },
        // 原版   https://medium.com/itsoktomakemistakes/react-%E4%B8%AD%E5%84%AA%E9%9B%85%E4%BD%BF%E7%94%A8%E7%B6%B2%E5%9D%80%E5%8F%83%E6%95%B8-query-string-540bacd08486
        // set: params =>
        //     history.push({
        //         pathname: location.pathname,
        //         search: qs.stringify({ ...value, ...parseObjectValues(params) })
        //     })
    }
}

*/