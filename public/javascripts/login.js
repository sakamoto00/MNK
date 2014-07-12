/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: 上午9:48
 */
$(function() {
    //报错蒙板
    var $mask = $('<div class="login-errmask"/>');
    //用户名
    var $username = $('input.login-username').attr("placeholder", FR.i18nText('Username')).attr('title',FR.i18nText('Username'));
    //密码
    var $password = $('input.login-password').attr("placeholder", FR.i18nText('Password')).attr('title',FR.i18nText('Password'));
    $('input').focus(function(){
        $(this).parent().addClass('login-input-focus');
        $mask.remove();
    }).blur(function(){
            $(this).parent().removeClass('login-input-focus');
        });
    //是否保持登录状态
    var $keep = $('span.login-remember').text(FR.i18nText('Privilege-Keep_Login_State')).click(
        function(){
            $(this).toggleClass('login-remember-selected');
        }
    );
    //登录按钮
    $('a').text(FR.i18nText('Sign_In')).click(
        function(){
            signIN();
        }
    );
    //绑定回车
    $(document).keydown(function(e){
        if(e.keyCode===13){
            signIN();
        }
    });
    /**
     * 初始化FS的登录背景图片
     */
    var initBackgroundImage = function () {
        var self = this;
        var ran = new Date().getTime() + "" + (Math.random() * 1000);
        FR.ajax({
            url: FR.servletURL + "?op=fs_load&cmd=getLoginImageID&_ran=" + ran,
            complete: function (res, status) {
                if (status == 'success') {
                    var loginID = FR.jsonDecode(res.responseText);
                    self.loginImgID = loginID.id;
                    var url = FR.servletURL
                        + ((self.loginImgID && self.loginImgID != 'null') ? ('?op=fr_attach&cmd=ah_image&id=' + self.loginImgID + '&isAdjust=false') : '?op=resource&resource=/com/fr/base/images/oem/signin.png');
                    if ($('body').length > 0) {
                        $('body').css({
                            background: 'url(' + url + ') no-repeat',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        });
                        var offset = $('#login-scalebg').offset();
                        $('#login-scalebg').css({
                            background: 'url(' + url + ') no-repeat -'+offset.left+'px -'+offset.top+'px',
                            overflow: 'hidden'
                        });
                    }
                }
            }
        })
    };

    var showErrorMsg = function($pos, msg){
        $mask.hide().insertAfter($pos).text(msg);
        $mask.click(function(){
            $(this).fadeOut();
            $pos.select();
        }).fadeIn();
    };

    var signIN = function(){
        $mask.remove();
        var user = $username.val();
        var pw = $password.val();
        //用户名为空
        if(FR.isEmpty(user)){
            showErrorMsg($username,FR.i18nText('Privilege-User_Can_Not_Be_Null'));
            return;
        }
        //密码为空
        if(FR.isEmpty(pw)){
            showErrorMsg($password,FR.i18nText('Privilege-Password_Can_Not_Be_Null'));
            return;
        }
        FR.ajax({
            url : FR.servletURL + '?op=fs_load&cmd=login',
            data : FR.cjkEncodeDO({
                fsusername : encodeURIComponent(user),
                fspassword : encodeURIComponent(pw),
                fsremember : $keep.hasClass('selected')
            }),
            type : 'POST',
            async : false,
            error : function() {
                FR.Msg.toast("Error!");
            },
            complete : function(res, status) {
                if (res.responseText == "") {
                    showErrorMsg($username,FR.i18nText('Privilege-Authentication_failed'));
                    return;
                }
                var signResult = FR.jsonDecode(res.responseText);
                if (signResult.fail) {
                    //用户名和密码不匹配
                    showErrorMsg($username,FR.i18nText('Privilege-Name_Not_Match_Password'));
                } else if (signResult.url) {
                    window.location.href = signResult.url;
                }
            }
        });
    };
    initBackgroundImage();
    $username.focus();
    $(window).resize(function(){
        var offset = $('#login-scalebg').offset();
        $('#login-scalebg').css({
            'background-position-x': -offset.left,
            'background-position-y': -offset.top
        });
    });
});
