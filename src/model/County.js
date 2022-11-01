import StateModel from './StateModel';
import countyDistrictList from 'assets/json/countyDistrictList.json';

export default class CountyModel extends StateModel {

    constructor(...args) {
        super(...args);

        // countyDistrictList.forEach(()=>{
        //     [code]
        // })

        this.loadCountyOptionList();
        this.loadDistrictOptionList();
    }
    data() {
        return {
            // countyDistrictList: [],
            // countyDistrictMap: [],
            countyOptionMap: {},
            /* {
                'A': '臺北市',
            } */
            countyOptionList: [],
            /* [{
                key: 'A',
                label: '臺北市',
            }] */
            districtMap: {},
            /* districtMap: {
                <countyCode>: {
                    <code>: {
                        "code": "AA03",
                        "countyName": "臺北市",
                        "countyCode": "A",
                        "landOfficeName": "古亭",
                        "districtCode": "AA",
                        "districtName": "中正區"
                    }
                }
            } */
            districtOptionListMap: {},
            /* districtMap: {
                <countyCode>: [{
                    key: districtItem.code, // "AA03"
                    label: districtItem.districtName, // "中正區"
                }]
            } */
        };
    }

    // getters() {

    loadCountyOptionList() {
        /* [ {
              "code": "AA03",
              "countyName": "臺北市",
              "countyCode": "A",
              "landOfficeName": "古亭",
              "districtCode": "AA",
              "districtName": "中正區"
            }, ... ] */

        const countyOptionMap = {};
        const countyOptionList = [];

        countyDistrictList.forEach((districtItem) => {
            if (countyOptionMap[districtItem.countyCode]) {
                return;
            }
            // 代表該縣市還沒存過
            const countyObj = {
                key: districtItem.countyCode,
                label: districtItem.countyName,
            };
            countyOptionMap[districtItem.countyCode] = countyObj;
            countyOptionList.push(countyObj);
        });


        this.setState('countyOptionMap', countyOptionMap);
        this.setState('countyOptionList', countyOptionList);
    }
    loadDistrictOptionList() {
        const districtMap = {};
        const districtOptionListMap = {};

        countyDistrictList.forEach((districtItem) => {
            // // 代表該縣市還沒存過
            // const districtObj = {
            //     key: districtItem.code,
            //     label: districtItem.districtName,
            // };
            // districtMap[districtItem.code] = districtObj;


            if (!districtMap[districtItem.countyCode]) {
                // 代表該縣市還沒註冊過，新增一個Map
                districtMap[districtItem.countyCode] = {};
            }
            if (!districtOptionListMap[districtItem.countyCode]) {
                // 代表該縣市還沒註冊過，新增一個Map
                districtOptionListMap[districtItem.countyCode] = [];
            }

            const districtObj = {
                key: districtItem.code,
                label: districtItem.districtName,
            }

            districtMap[districtItem.countyCode][districtItem.code] = districtItem;
            districtOptionListMap[districtItem.countyCode].push(districtObj);
        });

        this.setState('districtMap', districtMap);
        this.setState('districtOptionListMap', districtOptionListMap);
    }
    getDistrictOptionList(countyCode) {
        console.log(`getDistrictOptionList`, countyCode);

        const districtOptionListMap = this.getState('districtOptionListMap');
        return districtOptionListMap[countyCode] || [];
    }
}