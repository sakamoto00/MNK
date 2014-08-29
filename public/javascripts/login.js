/**
 * Coder: Sean
 * Date: 14-7-12
 * Time: 上午9:48
 */
$(function() {
    //报错蒙板
    var $mask = $('<div class="login-errmask"/>');
    //用户名
    var $username = $('input.login-username').attr("placeholder", $.i18n.prop('LOGIN-Username')).attr('title',$.i18n.prop('LOGIN-Username'));
    //密码
    var $password = $('input.login-password').attr("placeholder", $.i18n.prop('LOGIN-Password')).attr('title',$.i18n.prop('LOGIN-Password'));
    $('input').focus(function(){
        $mask.hide();
    });
    //是否保持登录状态
    var $keep = $('span.LOGIN-Keep_State').text($.i18n.prop('LOGIN-Keep_State')).click(
        function(){
            $(this).toggleClass('LOGIN-Keep_State-selected');
        }
    );
    //登录按钮
    $('button').text($.i18n.prop('LOGIN-Login')).click(
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

    var showErrorMsg = function($pos, msg){
        $mask.hide().insertBefore($pos).text(msg);
        $mask.click(function(){
            $(this).fadeOut();
            $pos.select();
        }).fadeIn();
    };

    var signIN = function(){
        $mask.hide();
        var user = $username.val();
        var pw = $password.val();
        //用户名为空
        if(MNK.isEmpty(user)){
            showErrorMsg($username,$.i18n.prop('Login-User_Can_Not_Be_Null'));
            return;
        }
        //密码为空
        if(MNK.isEmpty(pw)){
            showErrorMsg($password,$.i18n.prop('Login-Password_Can_Not_Be_Null'));
            return;
        }
        MNK.ajax({
            url : '/actions?cmd=login',
            data : MNK.cjkEncodeDO({
                username : encodeURIComponent(user),
                password : encodeURIComponent(pw),
                isKeep : $keep.hasClass('selected')
            }),
            complete : function(res, status) {
                if(status == 'success'){
                    var result = MNK.string2Json(res.responseText);
                    if (result && result.success) {
                        window.location.href = '/home';
                    }else{
                        //用户名和密码不匹配
                        showErrorMsg($username,$.i18n.prop('Login-Name_Not_Match_Password'));
                    }
                }
            }
        });
    };
    $username.focus();
});
