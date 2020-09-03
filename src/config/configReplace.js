(function() {
    var getGlobalObject = function() {
            if (typeof globalThis !== 'undefined') {
                return globalThis; 
            }
            if (typeof self !== 'undefined') {
                return self; 
            }
            if (typeof window !== 'undefined') {
                return window; 
            }
            if (typeof global !== 'undefined') {
                return global; 
            }
            throw new Error('cannot find the global object');
    };
    var globalObj = getGlobalObject();
    globalObj.globalYonyouCoordinationCliTopLevelObj = globalObj.globalYonyouCoordinationCliTopLevelObj || {};
    var globalYonyouCoordinationCliTopLevelObj = globalObj.globalYonyouCoordinationCliTopLevelObj;
    if(!globalYonyouCoordinationCliTopLevelObj.separateYonbipHostFileConfig) {
        let mainHost = 'http://61.191.199.87:7915';
        let userCode = 'https://ys-u8c-daily.yyuap.com/approvecenter';
        globalYonyouCoordinationCliTopLevelObj.separateYonbipHostFileConfig = {
            development: {
                mainHost,
                userCode
            },
            test: {
                mainHost,
                userCode
            },
            daily: {
                mainHost,
                userCode
            },
            prev: {
                mainHost
            },
            production: {
                mainHost,
                userCode: 'https://ys.diwork.com/approvecenter'
            },
            smallProgramTest: {
                mainHost,
                userCode
            },
            yonbip: {
                mainHost,
                userCode
            }
        };
    }
})();
