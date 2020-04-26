; (function () {
    var originDom = document.getElementById('originString');
    var newDom = document.getElementById('newString');
    var originDisabledString = document.getElementById('originDisabledString');

    var cameOriginDom = document.getElementById('cameOriginString');
    var cameNewDom = document.getElementById('cameNewString');
    var cameOriginDisabledString = document.getElementById('cameOriginDisabledString');
    var splitModule = document.getElementById('splitModule');
    var cbxNeedClear = document.getElementById('cbxNeedClear');
    var copeOrigin = document.getElementById('copeOrigin');
    var copeCame = document.getElementById('copeCame');

    var lowerToUpper = {};
    var upperToLower = {};
    var lower = 'abcdefghijklmnopqrstuvwxyz';
    var upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    lower.split('').forEach((chart, index) => {
        lowerToUpper[chart] = upper[index];
        upperToLower[upper[index]] = chart;
    });

    originDom.addEventListener('paste', (e) => {
        setTimeout(function () {
            console.log(e.target.value);
            const val = e.target.value;
            newDom.value = val.replace(/[-_]([a-z])/g, (target, wanted) => {
                // console.log(target, wanted);
                return lowerToUpper[wanted] || wanted;
            });
            originDisabledString.value = val;
        }, 0);
    });
    originDom.addEventListener('blur', (e) => {
        console.log('窗口切换，工作台擦除');
        if (cbxNeedClear.value) {
            originDom.value = "";
        }
    });

    cameOriginDom.addEventListener('paste', (e) => {
        setTimeout(function () {
            const val = e.target.value;
            cameNewDom.value = val.replace(/^([A-Z])/, (target, wanted) => {
                console.log(wanted);
                return (upperToLower[wanted] || wanted);
            }).replace(/([A-Z])/g, (target, wanted) => {
                return splitModule.value + (upperToLower[wanted] || wanted);
            });
            cameOriginDisabledString.value = val;
        }, 0);
    });

    cameOriginDom.addEventListener('blur', (e) => {
        console.log('窗口切换，工作台擦除');
        if (cbxNeedClear.value) {
            cameOriginDom.value = "";
        }
    });

    copeOrigin.addEventListener("click", () => {
        copy(newDom);
    });

    copeCame.addEventListener("click", () => {
        copy(cameNewDom);
    });

    function copy(content) {
        content.select();
        document.execCommand('Copy');
        console.log('复制成功');
    }
})()
