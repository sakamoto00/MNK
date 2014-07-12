/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ����9:48
 */
$(function() {
    //�����ɰ�
    var $mask = $('<div class="login-errmask"/>');
    //�û���
    var $username = $('input.login-username').attr("placeholder", FR.i18nText('Username')).attr('title',FR.i18nText('Username'));
    //����
    var $password = $('input.login-password').attr("placeholder", FR.i18nText('Password')).attr('title',FR.i18nText('Password'));
    $('input').focus(function(){
        $(this).parent().addClass('login-input-focus');
        $mask.remove();
    }).blur(function(){
            $(this).parent().removeClass('login-input-focus');
        });
    //�Ƿ񱣳ֵ�¼״̬
    var $keep = $('span.login-remember').text(FR.i18nText('Privilege-Keep_Login_State')).click(
        function(){
            $(this).toggleClass('login-remember-selected');
        }
    );
    //��¼��ť
    $('a').text(FR.i18nText('Sign_In')).click(
        function(){
            signIN();
        }
    );
    //�󶨻س�
    $(document).keydown(function(e){
        if(e.keyCode===13){
            signIN();
        }
    });
    /**
     * ��ʼ��FS�ĵ�¼����ͼƬ
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
        //�û���Ϊ��
        if(FR.isEmpty(user)){
            showErrorMsg($username,FR.i18nText('Privilege-User_Can_Not_Be_Null'));
            return;
        }
        //����Ϊ��
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
                    //�û��������벻ƥ��
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
