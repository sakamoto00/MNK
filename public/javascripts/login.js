/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: ����9:48
 */
$(function() {
    //�����ɰ�
    var $mask = $('<div class="login-errmask"/>');
    //�û���
    var $username = $('input.login-username').attr("placeholder", $.i18n.prop('LOGIN-Username')).attr('title',$.i18n.prop('Username'));
    //����
    var $password = $('input.login-password').attr("placeholder", $.i18n.prop('LOGIN-Password')).attr('title',$.i18n.prop('Password'));
    $('input').focus(function(){
        $(this).parent().addClass('login-input-focus');
        $mask.remove();
    }).blur(function(){
            $(this).parent().removeClass('login-input-focus');
        });
    //�Ƿ񱣳ֵ�¼״̬
    var $keep = $('span.LOGIN-Keep_State').text($.i18n.prop('LOGIN-Keep_State')).click(
        function(){
            $(this).toggleClass('LOGIN-Keep_State-selected');
        }
    );
    //��¼��ť
    $('a').text($.i18n.prop('LOGIN-Login')).click(
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
        if(MNK.isEmpty(user)){
            showErrorMsg($username,$.i18n.prop('Privilege-User_Can_Not_Be_Null'));
            return;
        }
        //����Ϊ��
        if(MNK.isEmpty(pw)){
            showErrorMsg($password,$.i18n.prop('Privilege-Password_Can_Not_Be_Null'));
            return;
        }
        MNK.ajax({
            url : MNK.servletURL + '?op=fs_load&cmd=login',
            data : MNK.cjkEncodeDO({
                fsusername : encodeURIComponent(user),
                fspassword : encodeURIComponent(pw),
                fsremember : $keep.hasClass('selected')
            }),
            type : 'POST',
            async : false,
            error : function() {
                alert("Error!");
            },
            complete : function(res, status) {
                if (res.responseText == "") {
                    showErrorMsg($username,$.i18n.prop('Privilege-Authentication_failed'));
                    return;
                }
                var signResult = MNK.jsonDecode(res.responseText);
                if (signResult.fail) {
                    //�û��������벻ƥ��
                    showErrorMsg($username,$.i18n.prop('Privilege-Name_Not_Match_Password'));
                } else if (signResult.url) {
                    window.location.href = signResult.url;
                }
            }
        });
    };
    $username.focus();
});
