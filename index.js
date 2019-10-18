const formateOpt = opt => {
    let temp = "";
    for (let key in opt) {
        temp += `${key}=${opt[key]}&`;
    }
    temp += `callback=jsonpCallback`;
    return temp;
};

const jsonp = (url, opt) => {
    return new Promise((resolve, reject) => {
        if (url.indexOf("?") > -1) {
            url += formateOpt(opt);
        } else {
            url += "?" + formateOpt(opt);
        }
        const ele = document.createElement("script");
        ele.setAttribute("src", url);

        window["jsonpCallback"] = result => {
            delete window["jsonpCallback"];
            document.body.removeChild(ele);
            if (result) {
                resolve(result);
            } else {
                reject("服务器没有返回信息");
            }
        };

        ele.addEventListener("error", () => {
            delete window["jsonpCallback"];
            document.body.removeChild(ele);
            reject("服务器加载失败！");
        });
        document.body.append(ele);
    });
};

function postDataFormat(obj) {
    if (typeof obj != "object") {
        alert("输入的参数必须是对象");
        return;
    }
    // 支持有FormData的浏览器（Firefox 4+ , Safari 5+, Chrome和Android 3+版的Webkit）
    if (typeof FormData == "function") {
        var data = new FormData();
        for (var attr in obj) {
            data.append(attr, obj[attr]);
        }
        return data;
    } else {
        // 不支持FormData的浏览器的处理
        var arr = new Array();
        var i = 0;
        for (var attr in obj) {
            arr[i] =
                encodeURIComponent(attr) + "=" + encodeURIComponent(obj[attr]);
            i++;
        }
        return arr.join("&");
    }
}

// ajax
const request = (url, params = null, type = "GET") => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url);
        if (type === "GET" && params) {
            const hisparams = url.indexOf("?") > -1;
            if (url.indexOf("?") > -1) {
                url += formateOpt(opt);
            } else {
                url += "?" + formateOpt(opt);
            }
            xhr.send(null);
        } else if (type === "POST") {
            xhr.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
            );
            xhr.send(postDataFormat(params));
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error("request failed"));
            }
        };
    });
};
