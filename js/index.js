/**
 * @author: 不懂安全的开发
 * @date: 2022-10-01
 */
$(function () {
        toast("综合查询初始化中...", 1000, '#005cb6', '#ffffff')
        let headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.106 Safari/537.36',
            "Content-Type": "text/html; charset=utf-8",
        }
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            let url = tabs[0].url;
            if (url.indexOf('chrome://') === 0) {
                toast("当前url无效", 2000, 'red', '#ffffff')
                return
            }
            init(url)
        });
        $('#checkTab1').click(function () {
            let className = $('#checkTab1').attr("class");
            if (className == 'buttonTabDefault') {
                $('#checkTab1').attr("class", "checkButtonTab");
                $('#checkTab3').attr("class", "buttonTabDefault");
                $('#checkTab2').attr("class", "buttonTabDefault");
                $('#checkTab4').attr("class", "buttonTabDefault");
                $('#checkTab5').attr("class", "buttonTabDefault");
                $('#main-item1').show();
                $('#main-item2').hide();
                $('#main-item3').hide();
                $('#main-item4').hide();
                $('#main-item5').hide();
            }
        })
        $('#checkTab2').click(function () {
            let className = $('#checkTab2').attr("class");
            if (className == 'buttonTabDefault') {
                // 调用fofa查询
                let fofaContent = $('#fofaContent').text().trim()
                toast("fofa查询中...", 1000, '#005cb6', '#ffffff')
                if (fofaContent == null || fofaContent == '') {
                    fofaQuery($('#IP').text().trim());
                }
                $('#checkTab1').attr("class", "buttonTabDefault");
                $('#checkTab3').attr("class", "buttonTabDefault");
                $('#checkTab2').attr("class", "checkButtonTab");
                $('#checkTab4').attr("class", "buttonTabDefault");
                $('#checkTab5').attr("class", "buttonTabDefault");
                $('#main-item1').hide();
                $('#main-item2').show();
                $('#main-item3').hide();
                $('#main-item4').hide();
                $('#main-item5').hide();
            }
        })
        $('#checkTab3').click(function () {
            let className = $('#checkTab3').attr("class");
            if (className == 'buttonTabDefault') {
                toast("子域信息加载中...", 1000, '#005cb6', '#ffffff')
                $('#checkTab1').attr("class", "buttonTabDefault");
                $('#checkTab3').attr("class", "checkButtonTab");
                $('#checkTab2').attr("class", "buttonTabDefault");
                $('#checkTab4').attr("class", "buttonTabDefault");
                $('#checkTab5').attr("class", "buttonTabDefault");
                $('#main-item1').hide();
                $('#main-item2').hide();
                $('#main-item3').show();
                $('#main-item4').hide();
                $('#main-item5').hide();
            }
        })

        $('#checkTab4').click(function () {
            $('#checkTab1').attr("class", "buttonTabDefault");
            $('#checkTab3').attr("class", "buttonTabDefault");
            $('#checkTab2').attr("class", "buttonTabDefault");
            $('#checkTab4').attr("class", "checkButtonTab");
            $('#checkTab5').attr("class", "buttonTabDefault");
            $('#main-item1').hide();
            $('#main-item2').hide();
            $('#main-item3').hide();
            $('#main-item4').show();
            $('#main-item5').hide();
            toast("零零信安查询中...", 1000, '#005cb6', '#ffffff')
            let company = $('#icp_company').text().trim()
            let IP = $('#IP').text().trim()
            if (company || IP) {
                chrome.storage.sync.get('zoneKey', function (items) {
                    if (!checkParam(items.zoneKey)) {
                        toast("请在配置中设置申请的key", 2000, 'red', '#ffffff')
                    } else {
                        let isNxet = true
                        if (company != '-') {
                            queryLLXA(company, items.zoneKey)
                            isNxet = false
                        }
                        if (isNxet) {
                            let param = "(ip==" + IP + ")"
                            queryLLXA(param, items.zoneKey)
                        }
                    }
                });

            }

        })
        $('#checkTab5').click(function () {
            $('#checkTab1').attr("class", "buttonTabDefault");
            $('#checkTab3').attr("class", "buttonTabDefault");
            $('#checkTab2').attr("class", "buttonTabDefault");
            $('#checkTab4').attr("class", "buttonTabDefault");
            $('#checkTab5').attr("class", "checkButtonTab");
            $('#main-item1').hide();
            $('#main-item2').hide();
            $('#main-item3').hide();
            $('#main-item4').hide();
            $('#main-item5').show();
            toast("获取配置中...", 1000, '#005cb6', '#ffffff')
            // 取出保存的配置
            chrome.storage.sync.get('zoneKey', function (items) {
                if (checkParam(items.zoneKey)) {
                    $('#saveZoneKeyVal').val(items.zoneKey)
                }
            });

        })
        // 零零信安保存配置
        $('#saveZoneKeyBtn').click(function () {
            let zoneKey = $('#saveZoneKeyVal').val()
            if (!checkParam(zoneKey)) {
                toast("请输入zoneKey", 2000, 'red', '#ffffff')
                return
            }
            chrome.storage.sync.set({zoneKey: zoneKey}, function () {
                toast("保存成功", 2000, 'blue', '#ffffff')
            });
        })

        // fofa保存配置
        $('#saveFofaBtn').click(function () {
            let fofaKey = $('#saveFofaVal').val()
            if (!checkParam(fofaKey)) {
                toast("请输入fofaKey", 2000, 'red', '#ffffff')
                return
            }
            chrome.storage.sync.set({fofaKey: fofaKey}, function () {
                toast("保存成功", 2000, 'blue', '#ffffff')
            });
        })
        // fofaToExcle
        $('#fofaToExcle').click(function () {
            let str = `ip/域名,端口号,状态码,协议,国家,标题,服务名称,更新时间\n`;
            let jsonData = $('#fofaHideData').text().trim()
            if (jsonData && jsonData.length > 0) {
                toast("导出数据中", 1000, 'blue', '#ffffff')
                toExcel(JSON.parse(jsonData), str, "fofa")
            } else {
                toast("没有数据", 1000, 'red', '#ffffff')
            }
        })
        // llxaToExcle
        $('#llxaToExcle').click(function () {
            let str = `标题,url,ip,系统,cms,端口号,公司,标签\n`;
            let jsonData = $('#llxaHideData').text().trim()
            if (jsonData && jsonData.length > 0) {
                toast("导出数据中", 1000, 'blue', '#ffffff')
                toExcel(JSON.parse(jsonData), str, "llxa")
            } else {
                toast("没有数据", 1000, 'red', '#ffffff')
            }
        })

        /**
         * 解析数据
         * @param url
         */
        function init(url) {
            let host = urlCheck(url)
            let ip = host.split(':')[0];
            if (IsLAN(ip)) {
                toast("当前ip为局域网ip，无法查询", 2000, 'red', '#ffffff')
                return
            }
            let isCheckIp = checkIp(ip)
            if (isCheckIp != undefined || isCheckIp) {
                toast("检测到当前是ip正在反查域名中", 2500, 'blue', '#ffffff')
                let domain = queryDomainByIp(ip)
                if (domain) {
                    let url = urlCheck(domain)
                    weightQuery(url)
                    querybdZC(url)
                }
            } else {
                weightQuery(ip)
                querybdZC(ip)
            }
        }

        /**
         * 提取url
         * @param url
         * @returns {*}
         */
        function urlCheck(url) {
            if (url.indexOf('http') > -1 || url.indexOf('https') > -1) {
                return host = url.split('/')[2];
            } else {
                returnhost = url;
            }
        }

        /**
         * 权重查询
         * @param host
         */
        function weightQuery(host) {
            let url = 'https://www.aizhan.com/cha/' + host + '/'
            $.ajax({
                url: url, type: 'GET', async: false, success: function (res) {
                    if (res) {
                        var html = $(res);
                        let trs = html.find("div.content > table.table > tbody")
                        let baidu = $(trs).find("tr").eq(1).find("#baidurank_br > img").attr("alt")
                        let yd = $(trs).find("tr").eq(1).find("#baidurank_mbr > img").attr("alt")
                        let sl0 = $(trs).find("tr").eq(1).find("#360_pr > img").attr("alt")
                        let sm = $(trs).find("tr").eq(1).find("#sm_pr > img").attr("alt")
                        let sougou = $(trs).find("tr").eq(1).find("#sogou_pr > img").attr("alt")
                        let google = $(trs).find("tr").eq(1).find("#google_pr > img").attr("alt")
                        // 权重信息
                        $('#baidu_q').text(baidu == 'n' ? '未收录' : baidu)
                        $('#yd_q').text(yd == 'n' ? '未收录' : yd)
                        $('#sl0_q').text(sl0 == 'n' ? '未收录' : sl0)
                        $('#sm_q').text(sm == 'n' ? '未收录' : sm)
                        $('#sougou_q').text(sougou == 'n' ? '未收录' : sougou)
                        $('#google_q').text(google == 'n' ? '未收录' : google)
                        // 备案信息
                        $('#icp_icp').text($(trs).find('tr').eq(3).find("#icp_icp").text().trim())
                        $('#icp_type').text($(trs).find('tr').eq(3).find("#icp_type").text().trim())
                        let company = $(trs).find('tr').eq(3).find("#icp_company").text().trim()
                        $('#icp_company').text(company)
                        $('#icp_passtime').text($(trs).find('tr').eq(3).find("#icp_passtime").text().trim())
                        // 域名信息
                        let whois_registrant = $(trs).find('tr').eq(4).find("#whois_registrant").text().trim()
                        $('#whois_registrant').text(whois_registrant.substring(whois_registrant.lastIndexOf("：") + 1, whois_registrant.length))
                        let whois_registrant_age = $(trs).find('tr').eq(4).find("#whois_created").text().trim()
                        $('#whois_registrant_age').text(whois_registrant_age.substring(whois_registrant_age.lastIndexOf("：") + 1, whois_registrant_age.length))
                        // 子域信息
                        let subdomain = html.find('#domain_list').text().trim()
                        var htmlAppendLeft = "";
                        var htmlAppendRight = "";
                        if (subdomain && subdomain.length > 0) {
                            subdomain.split("\n").forEach(function (item, index) {
                                let connt = Number(index) + 1
                                if (connt % 2 == 0) {
                                    htmlAppendLeft += "<div class='fant-color'>" + item + "</div>"
                                } else {
                                    htmlAppendRight += "<div class='fant-color'>" + item + "</div>"
                                }
                            })
                            $('#htmlAppendLeft').html(htmlAppendLeft)
                            $('#htmlAppendRight').html(htmlAppendRight)
                        }
                    }
                }, error: function (err) {
                    toast(err, 2000, 'red', '#ffffff')
                }
            })
            // 查询公司基本信息
            queryRegisteredInfo($('#icp_company').text())
        }

        /**
         * fofa查询
         * @param host
         */
        function fofaQuery(host) {
            // 校验数据
            if (host == null || host == "") {
                return
            }
            var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
            var reg = host.match(exp);
            if (reg == null) {
                return
            }
            let data = 'ip="' + host + '"'
            let url = 'https://fofa.info/result?qbase64=' + btoa(data)
            $.ajax({
                url: url, type: 'GET', async: false, headers: headers, success: function (res) {
                    var htmlFofa = "";
                    if (res) {
                        $('#msgTips').remove()
                        let result = []
                        var html = $(res);
                        let content = html.find(".result-item .rightListsMain")
                        for (let i = 0; i < content.length; i++) {
                            let fofaData = {}
                            let ip = $(content[i]).find("div.addrLeft > span.aSpan").text()
                            let fofaIp = ip.trim()
                            let portData = $(content[i]).find("div.addrRight > a.portHover")
                            let fofaPort = ""
                            if (portData.length >= 1) {
                                fofaPort = portData.text()
                            }
                            let fofastatusCode = $(content[i]).find("div.contentMain > div.contentRight").text().split("\n")[0].trim()
                            let fofaAgreementName = $(content[i]).find("div.addrRight > a.whiteSpan").text().trim()
                            let fofaCountryName = $(content[i]).find("div.contentMain > div.contentLeft").find("p").eq(2).text().trim()
                            let fofaTitleName = $(content[i]).find("div.contentMain > div.contentLeft > p.max-tow-row").text().trim()
                            let fofaServeName = $(content[i]).find("div.contentMain > div.contentLeft > p.listSpanCont").text().trim()
                            let updateTime = $(content[i]).find("div.contentMain > div.contentLeft").find("p").eq(6).text().trim()
                            let fofaUpdateTime = ""
                            if (check(updateTime)) {
                                fofaUpdateTime = updateTime
                            }
                            // 数据拼接
                            htmlFofa += "<div class='item-fofa'>"
                            if (i == 0) {
                                htmlFofa += "<div class='item-one item-title' style='width: 110px;'>标题</div>"
                                htmlFofa += "<div class='item-one item-title' style='width: 180px;'>域名/ip</div>"
                                htmlFofa += "<div class='item-one item-title' style='width: 110px;'>端口</div>"
                                htmlFofa += "<div class='item-one item-title' style='width: 110px;'>状态</div>"
                                htmlFofa += "<div class='item-one item-title' style='width: 110px;'>服务</div>"
                                htmlFofa += "</div>"
                            } else {
                                htmlFofa += "<div class='item-one' style='width: 110px;'><span>" + fofaTitleName + "</span></div>"
                                htmlFofa += "<div class='item-one' style='width: 180px;'><span>" + fofaIp + "</span></div>"
                                htmlFofa += "<div class='item-one' style='width: 110px;'><span>" + fofaPort + "</span></div>"
                                htmlFofa += "<div class='item-one' style='width: 110px;'><span>" + fofastatusCode + "</span></div>"
                                htmlFofa += "<div class='item-one' style='width: 110px;'><span>" + fofaServeName + "</span></div>"
                                htmlFofa += "</div>"
                            }
                            // 存储json数据
                            fofaData.ip = fofaIp
                            fofaData.port = fofaPort
                            fofaData.statusCode = fofastatusCode
                            fofaData.agreementName = fofaAgreementName
                            fofaData.countryName = fofaCountryName
                            fofaData.titleName = fofaTitleName
                            fofaData.serveName = fofaServeName
                            fofaData.updateTime = fofaUpdateTime
                            result.push(fofaData)
                        }
                        $('#fofaHideData').text(JSON.stringify(result))
                    }
                    $('#fofaContent').html(htmlFofa)
                }, error: function (err) {
                    toast('异常', 2000, 'red', '#ffffff')
                }
            })
        }


        /**
         * 查询公司基本信息
         * @param company
         */
        function queryRegisteredInfo(company) {
            if (company) {
                let url = 'https://data.chinaz.com/company/t0-p0-c0-i0-d0-s-' + company.trim()
                $.ajax({
                    url: url, type: 'GET', async: false, headers: headers, success: function (res) {
                        if (res) {
                            var html = $(res);
                            $('#companyName').text("资产归属：" + company)
                            let content = html.find("div.Module-table ul.Module-table-list")
                            if (content.length >= 1) {
                                let representativeName = $(content).find("li").eq(4).text()
                                let registeredCapital = $(content).find("li").eq(5).text()
                                $('#representativeName').text(representativeName)
                                $('#registeredCapital').text(registeredCapital)
                            }
                        }
                    }, error: function (err) {
                        toast('异常', 2000, 'red', '#ffffff')
                    }
                })
            }
        }

        /**
         * 根据域名查询ip相关信息
         * @param domain
         */
        function querybdZC(domain) {
            $('#domainName').text(domain)
            // 该接口无法查询baidu相关 直接返回 无需查询
            if (domain.indexOf("baidu") != -1) {
                $('#IP').text("该域名屏蔽接口无法查询")
                return
            }
            if (domain) {
                let url = 'https://seo.chinaz.com/' + domain.trim()
                $.ajax({
                    url: url, type: 'GET', async: false, headers: headers, success: function (res) {
                        if (res) {
                            var html = $(res);
                            let content = html.find("table._chinaz-seo-newt tbody")
                            let ipData = $(content).find("tr").eq(4).find("span.mr50").text().trim()
                            if (ipData && ipData.length >= 1) {
                                $('#IP').text(ipData.substring(ipData.indexOf("：") + 1, ipData.indexOf("[")))
                            }
                        }
                    }, error: function (err) {
                        toast('异常', 2000, 'red', '#ffffff')
                    }
                })
            }
        }

        /**
         * 根据ip反查域名
         * @param ip
         */
        function queryDomainByIp(ip) {
            if (ip) {
                var domain = "";
                let url = 'https://dns.aizhan.com/' + ip.trim() + "/"
                $.ajax({
                    url: url, type: 'GET', async: false, headers: headers, success: function (res) {
                        if (res) {
                            var html = $(res);
                            let count = html.find("div.dns-infos > ul.clearfix > li.last > span.red").text()
                            let content = html.find("div.dns-content > table.table >tbody > tr")
                            if (Number(count) > 0) {
                                domain = $(content[0]).find("td.domain > a").attr("href")
                            } else {
                                toast("ip反查域名解析失败", 4000, 'red', '#ffffff')
                            }
                        }
                    }, error: function (err) {
                        toast('异常', 2000, 'red', '#ffffff')
                    }
                })
                return domain
            }
        }

        /**
         * 零零信息查询
         * @param param
         */
        function queryLLXA(param, zoneKey) {
            if (checkParam(param) && checkParam(zoneKey)) {
                let url = 'https://0.zone/api/data/'
                let data = {
                    "title": param,
                    "title_type": "site",
                    "page": 1,
                    "pagesize": 10,
                    "zone_key_id": zoneKey
                }
                $('#llxaTitle').text("信息系统  " + data.title + "")
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    success: function (res) {
                        if (res.code == 0) {
                            let resultData = []
                            let htmlLLXA = ""
                            var data = res.data
                            if (data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    let llxaData = {}
                                    htmlLLXA += "<div class='LLXA-item'>"
                                    if (i == 0) {
                                        htmlLLXA += "<div class='item-two item-title' style='width: 110px;'>标题</div>"
                                        htmlLLXA += "<div class='item-two item-title' style='width: 180px;'>url</div>"
                                        htmlLLXA += "<div class='item-two item-title' style='width: 110px;'>操作系统</div>"
                                        htmlLLXA += "<div class='item-two item-title' style='width: 110px;'>CMS</div>"
                                        htmlLLXA += "<div class='item-two item-title' style='width: 110px;'>设备分类</div>"
                                        htmlLLXA += "</div>"
                                    } else {
                                        llxaData.title = data[i].title
                                        llxaData.url = data[i].url
                                        llxaData.ip = data[i].ip
                                        llxaData.os = data[i].os
                                        llxaData.cms = data[i].cms
                                        llxaData.port = data[i].port
                                        llxaData.company = data[i].company
                                        llxaData.tags = JSON.stringify(data[i].tags)
                                        resultData.push(llxaData)
                                        htmlLLXA += "<div class='item-two' style='width: 110px;'><span>" + data[i].title + "</span></div>"
                                        htmlLLXA += "<div class='item-two' style='width: 180px;'><span>" + data[i].url + "</span></div>"
                                        htmlLLXA += "<div class='item-two' style='width: 110px;'><span>" + data[i].os + "</span></div>"
                                        htmlLLXA += "<div class='item-two' style='width: 110px;'><span>" + data[i].cms + "</span></div>"
                                        htmlLLXA += "<div class='item-two' style='width: 110px;'><span>" + JSON.stringify(data[i].extra_info) + "</span></div>"
                                        htmlLLXA += "</div>"
                                    }
                                }
                                $('#llxaHideData').text(JSON.stringify(resultData))
                            }
                            $('#LLXAContent').html(htmlLLXA)
                        } else {
                            toast(JSON.stringify(res.message), 2000, 'red', '#ffffff')
                        }
                    },
                    error: function (err) {
                        toast(JSON.stringify("查询失败"), 2000, 'red', '#ffffff')
                    }
                })
            }
        }

        /**
         *  校验参数
         * @param param
         * @returns {boolean}
         */
        function checkParam(param) {
            if (param == null || param == "" || param == undefined) {
                return false
            }
            return true
        }

        /**
         * 校验时间
         * @param date
         * @returns {boolean}
         */
        function check(date) {
            return (new Date(date).getDate() == date.substring(date.length - 2));
        }

        /**
         * 消息提示
         * @param message
         * @param time
         * @param bgColor
         * @param fontColor
         */
        function toast(message = 'hi', time = 2000, bgColor = '#208bff', fontColor = 'white') {
            let toastWrap = document.createElement("div")
            let id = Date.now() + 'hhh';
            toastWrap.setAttribute('id', id)
            toastWrap.innerHTML = message
            toastWrap.style.color = fontColor
            toastWrap.style.backgroundColor = bgColor
            toastWrap.style.maxWidth = '250px'
            toastWrap.style.minWidth = '100px'
            toastWrap.style.margin = '20px'
            toastWrap.style.padding = '15px'
            toastWrap.style.fontSize = '14px'
            toastWrap.style.position = 'fixed'
            toastWrap.style.borderRadius = '15px'
            toastWrap.style.borderTopRightRadius = '0'
            toastWrap.style.top = '0'
            toastWrap.style.right = '0'
            document.body.append(toastWrap)
            setTimeout(function () {
                $("#" + id).fadeOut()
            }, time)
        }

        /**
         * 判断是否是局域网ip
         * @param ip
         * @returns {boolean}
         * @constructor
         */
        function IsLAN(ip) {
            ip.toLowerCase();
            if (ip == 'localhost') return true;
            let a_ip = 0;
            if (ip == "") return false;
            const aNum = ip.split(".");
            if (aNum.length != 4) return false;
            a_ip += parseInt(aNum[0]) << 24;
            a_ip += parseInt(aNum[1]) << 16;
            a_ip += parseInt(aNum[2]) << 8;
            a_ip += parseInt(aNum[3]) << 0;
            a_ip = a_ip >> 16 & 0xFFFF;
            return (a_ip >> 8 == 0x7F || a_ip >> 8 == 0xA || a_ip == 0xC0A8 || (a_ip >= 0xAC10 && a_ip <= 0xAC1F));
        }

        /**
         * 校验是否是ip
         */
        function checkIp(ip) {
            var reg = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;
            if (reg.test(ip)) {
                if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                    return true;
                } else {
                    return false;
                }
            }
        }

        /**
         * 导出excle
         * @param jsonData 数据
         * @param str 字段名 逗号分割
         * @param excleName 文件名称
         */
        function toExcel(jsonData, str, excleName) {
            for (let i = 0; i < jsonData.length; i++) {
                for (const key in jsonData[i]) {
                    str += `${jsonData[i][key] + '\t'},`;
                }
                str += '\n';
            }
            const uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
            const link = document.createElement("a");
            link.href = uri;
            link.download = excleName + ".csv";
            link.click();
        }
    }
)



