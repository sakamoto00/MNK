/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: 下午3:16
 */
if (window.MNK == null) {
    window.MNK = {};
}
(function () {
    $.extend(MNK, {
        isEmpty: function (value) {
            // 判断是否为空值
            var result = value === "" || value === null || value === undefined;
            return result;
        },
        /**
         * 封装过的jQuery.ajax()函数，对data参数做了中日韩文编码处理
         * @static
         * @param {Object} options ajax参数
         */
        ajax: function (options) {
            if (options) {
                options.data = MNK.cjkEncodeDO(options.data);
            }

            $.ajax(options);
        },
        cjkEncode: function (text) {
            if (typeof text !== 'string') {
                return text;
            }
            var newText = "";
            for (var i = 0; i < text.length; i++) {
                var code = text.charCodeAt(i);
                if (code >= 128 || code === 91 || code === 93) {//91 is "[", 93 is "]".
                    newText += "[" + code.toString(16) + "]";
                } else {
                    newText += text.charAt(i);
                }
            }
            return newText
        },
        cjkDecode: function (text) {
            if (text == null) {
                return "";
            }
            if (!isNaN(text) || text.indexOf('[') == -1) {
                return text;
            }
            var newText = "";
            for (var i = 0; i < text.length; i++) {
                var ch = text.charAt(i);
                if (ch == '[') {
                    var rightIdx = text.indexOf(']', i + 1);
                    if (rightIdx > i + 1) {
                        var subText = text.substring(i + 1, rightIdx);
                        if (subText.length > 0) {
                            ch = String.fromCharCode(eval("0x" + subText));
                        }

                        i = rightIdx;
                    }
                }
                newText += ch;
            }
            return newText;
        },
        /**
         * 对指定的键值对对象做中日韩文编码处理
         * @static
         * @param {Object} o 键值对对象
         * @return {Object} 经过了中日韩文编码处理的键值对
         */
        cjkEncodeDO: function (o) {
            if ($.isPlainObject(o)) {
                var result = {};
                $.each(o, function (k, v) {
                    if (!(typeof v == "string")) {
                        v = MNK.jsonEncode(v);
                    }
                    k = MNK.cjkEncode(k);
                    result[k] = MNK.cjkEncode(v);
                });
                return result;
            }
            return o;
        },
        jsonEncode: function (o) {
            var useHasOwn = {}.hasOwnProperty ? true : false;
            var m = {
                "\b": '\\b',
                "\t": '\\t',
                "\n": '\\n',
                "\f": '\\f',
                "\r": '\\r',
                '"': '\\"',
                "\\": '\\\\'
            };
            var encodeString = function (s) {
                if (/["\\\x00-\x1f]/.test(s)) {
                    return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    }) + '"';
                }
                return '"' + s + '"';
            };
            var encodeArray = function (o) {
                var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(v === null ? "null" : MNK.jsonEncode(v));
                            b = true;
                    }
                }
                a.push("]");
                return a.join("");
            };
            if (typeof o == "undefined" || o === null) {
                return "null";
            } else if ($.isArray(o)) {
                return encodeArray(o);
            } else if (o instanceof Date) {
                return MNK.jsonEncode({
                    __time__: o.getTime()
                })
            } else if (typeof o == "string") {
                return encodeString(o);
            } else if (typeof o == "number") {
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o == "boolean") {
                return String(o);
            } else if ($.isFunction(o)) {
                return String(o);
            } else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    if (!useHasOwn || o.hasOwnProperty(i)) {
                        v = o[i];
                        switch (typeof v) {
                            case "undefined":
                            case "unknown":
                                break;
                            default:
                                if (b) {
                                    a.push(',');
                                }
                                a.push(MNK.jsonEncode(i), ":",
                                        v === null ? "null" : MNK.jsonEncode(v));
                                b = true;
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }
        },
        /**
         * 字符串转json对象
         * @param text 字符串
         * @returns {*} 返回json对象
         */
        string2Json: function (text) {
            try {
                var jo = $.parseJSON(text);
                if (jo == null) {
                    jo = {};
                }
            } catch (e) {
                try {
                    jo = new Function("return " + text)() || {};
                } catch (e) {
                }
                if (jo == null) {
                    jo = [];
                }
            }
            return jo;
        }
    });
})();
