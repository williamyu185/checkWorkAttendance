<style lang="less" module="a">
.entry {
    width: 100%;
    height: 100%;
    font-size: 15px;
    overflow-y: auto;
    .mainContent {
        overflow-y: auto;
        overflow-x: hidden;
    }
    .personalAttendance,
    .attendanceDate {
        height: 30px;
        text-align: center;
        line-height: 30px;
    }
    .attendanceTable {
        width: 100%;
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        border: 0;
        box-sizing: border-box;
        .attendanceAllDate,
        .attendanceTimeList {
            height: 100%;
            & > div {
                border-bottom: 0.5px solid #cad9ea;
                word-break: break-all;
                white-space: pre-wrap;
            }
            & > div:last-of-type {
                border-bottom: 0;
            }
        }
        .attendanceDateList {
            & > div:first-of-type {
                width: 50%;
                padding: 0 4px;
                border-right: 1px solid #cad9ea;
            }
            & > div:last-of-type {

            }
        }
        .attendanceTimeList {
            width: 100%;
        }
        th,
        td {
            margin: 0;
            border: 1px solid #cad9ea;
            color: #666;
            height: 30px;
            text-align: center;
            vertical-align: middle;
            box-sizing: border-box;
        }
        th {
            background-color: #CCE8EB;
        }
        thead {
            th {
                padding: 0 4px;
            }
            th:first-of-type {
                border-left: 0;
            }
            th:last-of-type {
                border-right: 0;
                padding: 0;
            }
            .theadColspan {
                & > div {
                    width: 50%;
                    text-align: center;
                }
            }
        }
        tbody {
            tr:nth-child(odd) {
                background: white;
            }
            tr:nth-child(even) {
                background: #F5FAFA;
            }
            tr {
                td:first-of-type {
                    border-left: 0;
                }
                td:last-of-type {
                    border-left: 0;
                }
            }
        }
    }
    .mask {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, .3);
    }
    .dataSelect {
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        border-top: 1px solid #ebedf0;
        color: #000;
    }
    .datetimePicker {
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
    }
}
</style>
<style lang="less" module="b">
:global {
    html,
    body {
        width: 100%;
        height: 100%;
        font-size: 12px;
        background: white;
    }
}
</style>
<template>
<div :class="[a.entry]" class="coordination-cli-flex coordination-cli-flex-v">
    <div :class="[a.mainContent]" class="coordination-cli-flex-1">
        <div :class="[a.personalAttendance]">个人考勤信息表</div>
        <div :class="[a.attendanceDate]">期间：{{filterDate.cn}}</div>
        <table :class="[a.attendanceTable]">
            <thead>
                <tr>
                    <th width="15%">姓名</th>
                    <th width="22%">组织</th>
                    <th width="20%">部门</th>
                    <th  colspan="2" class="theadColspan">
                        <div class="coordination-cli-flex">
                            <div class="coordination-cli-flex-1">考勤日期</div>
                            <div class="coordination-cli-flex-1">考勤时间</div>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in tableData">
                    <td>{{item.userName}}</td>
                    <td>{{item.orgName}}</td>
                    <td>{{item.deptName}}</td>
                    <td colspan="2">
                        <div :class="[a.attendanceAllDate]" class="coordination-cli-flex coordination-cli-flex-v">
                            <div :class="[a.attendanceDateList]" class="coordination-cli-flex" v-for="(itemA, indexA) in item.attendance">
                                <div class="coordination-cli-flex coordination-cli-flex-align-center coordination-cli-flex-pack-center coordination-cli-flex-1">{{itemA.attendanceDate}}</div>
                                <div :class="[a.attendanceTimeList]" class="coordination-cli-flex coordination-cli-flex-v coordination-cli-flex-1 coordination-cli-flex-pack-center">
                                    <div class="coordination-cli-flex coordination-cli-flex-align-center coordination-cli-flex-pack-center" v-for="(itemB, indexB) in itemA.attendanceTime">{{itemB.calendartime}}</div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div :class="[a.dataSelect]" @click.stop="calendarShow">选择日期</div>
    <div :class="[a.mask]" v-if="isCalendarShow" @click.stop="calendarShow(false)"></div>
    <div :class="[a.datetimePicker]" v-if="isCalendarShow">
        <van-datetime-picker
            v-model="currentDate"
            type="year-month"
            title="请选择日期"
            :formatter="formatter"
            @confirm="dateConfirm"
        />
    </div>
</div>
</template>
<script>
import { Toast } from 'vant';
import URLSearchParams from 'url-search-params';
import configHost from '../config/config';

window.globalYonyouCoordinationCliTopLevelObj = window.globalYonyouCoordinationCliTopLevelObj || {};
let globalYonyouCoordinationCliTopLevelObj = window.globalYonyouCoordinationCliTopLevelObj;
// 任何全局变量在各文件中使用前，必须在此文件和globalYonyouCoordinationCliTopLevelObj进行初始化注册
// 严禁在未在此文件和globalYonyouCoordinationCliTopLevelObj对象注册的情况下，在其他文件中直接初始化并使用全局变量
globalYonyouCoordinationCliTopLevelObj = {
    ...globalYonyouCoordinationCliTopLevelObj,
    isSmallProgram: /smallProgram/ig.test(__ENV__)
};

// npm install --sava url-search-params
let URLSearchParamsAdd = function(params) {
    if (params instanceof Object) {
        for (let key in params) {
            this.delete(key);
            this.append(key, params[key]);
        }
    }
};

if(!window.URLSearchParams) {
    URLSearchParams.prototype.add = URLSearchParamsAdd;
    window.URLSearchParams = URLSearchParams;
}else {
    window.URLSearchParams.prototype.add = URLSearchParamsAdd;
}

export default {
    data() {
        return {
            urlParams: {},
            isCalendarShow: false,
            filterDate: {
                cn: '',
                en: ''
            },
            currentDate: new Date(),
            tableData: [],
            userMsg: {}
        };
    },
    methods: {
        codeGetMemidAndQzid() {
            return new Promise((reslove, reject) => {
                this.$http.get(configHost.userCode + '/api/qz/user', {
                    params: {
                        esnCode: this.urlParams.code,
                        siteType: 'm',
                    }
                }).then((response) => {
                    if(response.flag != '0') {
                        Toast.fail(response.desc);
                        return;
                    }
                    this.userMsg = response.data;
                    reslove();
                });
            });
        },
        loadData() {
            let urlParams = this.urlParams;
            let enDateArr = this.filterDate.en.split('-');
            let params = new URLSearchParams();
            params.add({
                message: JSON.stringify({
                    // userCode: urlParams.userCode || '',
                    phoneNum: urlParams.mobile || this.userMsg.mobile,
                    year: urlParams.year || enDateArr[0],
                    month: urlParams.month || enDateArr[1],
                })
            });
            this.$http.post('/service/NC_KQ_Information', params).then((response) => {
                // let response = {"data":{"attendanceRecord":[{"attendance":[{"attendanceDate":"2020/07/21","attendanceTime":[{"calendartime":"08:14"},{"calendartime":"12:09"},{"calendartime":"13:57"},{"calendartime":"14:26"},{"calendartime":"17:32"}]},{"attendanceDate":"2020/07/22","attendanceTime":[{"calendartime":"08:01"},{"calendartime":"12:01"},{"calendartime":"14:34"},{"calendartime":"17:25"}]},{"attendanceDate":"2020/07/23","attendanceTime":[{"calendartime":"08:03"},{"calendartime":"12:03"},{"calendartime":"14:23"},{"calendartime":"17:18"}]},{"attendanceDate":"2020/07/24","attendanceTime":[{"calendartime":"08:18"},{"calendartime":"12:07"},{"calendartime":"13:26"},{"calendartime":"17:24"}]},{"attendanceDate":"2020/07/27","attendanceTime":[{"calendartime":"08:16"},{"calendartime":"12:00"},{"calendartime":"14:22"},{"calendartime":"17:55"}]},{"attendanceDate":"2020/07/28","attendanceTime":[{"calendartime":"08:19"},{"calendartime":"12:56"},{"calendartime":"14:06"},{"calendartime":"17:25"}]},{"attendanceDate":"2020/07/29","attendanceTime":[{"calendartime":"08:11"},{"calendartime":"12:02"},{"calendartime":"13:34"},{"calendartime":"17:23"}]},{"attendanceDate":"2020/07/30","attendanceTime":[{"calendartime":"08:10"},{"calendartime":"12:01"},{"calendartime":"14:17"},{"calendartime":"17:27"}]},{"attendanceDate":"2020/07/31","attendanceTime":[{"calendartime":"08:16"},{"calendartime":"12:03"},{"calendartime":"14:26"},{"calendartime":"17:22"}]}],"deptName":"集团工会","orgName":"安徽省信用担保集团有限公司","userName":"汤闽"}]},"message":"555","result":true}
                if(response.result) {
                    this.tableData = response.data.attendanceRecord;
                }else {
                    Toast.fail(response.massage);
                }
            });
        },
        formatter(type, val) {
            if(type === 'year') {
                return `${val}年`;
            }else if (type === 'month') {
                return `${val}月`;
            }
            return val;
        },
        calendarShow(flag = true) {
            this.isCalendarShow = flag;
        },
        formatDate(date) {
            let mouth = (date.getMonth() + 1).toString();
            (mouth.length == 1) && (mouth = '0' + mouth);
            let mouthDay = date.getDate().toString();
            (mouthDay.length == 1) && (mouthDay = '0' + mouthDay);
            return {
                cn: `${date.getFullYear()}年${mouth}月`,
                en: `${date.getFullYear()}-${mouth}`
            };
        },
        dateConfirm(date) {
            this.isCalendarShow = false;
            this.filterDate = this.formatDate(date);
            this.loadData();
        },
        getUrlParams(params) {
            let obj = {};
            if(!params) {
                return obj;
            }
            let arr = params.split('&');
            arr.forEach((item, index) => {
                let temp = item.split('=');
                obj[temp[0]] = window.decodeURIComponent(temp[1]);
            });
            return obj;
        },
    },
    created() {
        this.tableData = this.tableData.concat(this.tableData).concat(this.tableData); 
        let hrefArr = window.location.href.split('?');
        this.urlParams = hrefArr[1] ? this.getUrlParams(hrefArr[1].replace(/#\/.*$/g, '')) : {};
        this.filterDate = this.formatDate(this.currentDate);
        this.codeGetMemidAndQzid().then(() => {
            this.loadData();
        });
    },
    mounted() {

    },
};
</script>
        