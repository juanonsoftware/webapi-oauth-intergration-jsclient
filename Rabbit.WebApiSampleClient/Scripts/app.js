var settings = {
    //apiServiceBaseUri: 'http://development.com:40678/',
    apiServiceBaseUri: 'http://webapioauth.apphb.com/',
};

var WebAPIClient = function () {
}() || {};

WebAPIClient.authExternalProvider = function (provider) {
    var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

    var externalProviderUrl = settings.apiServiceBaseUri + "api/OAuth/Login?provider=" + provider + "&returnUrl=" + redirectUri;
    var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
};

WebAPIClient.displayAuthInfo = function () {
    var fragment = JSON.parse(sessionStorage.getItem('auth'));
    if (fragment) {
        $("#auth").text('AccessToken: ' + fragment.access_token + ', provider: ' + fragment.provider + ', name: ' + fragment.name);
    }
};

WebAPIClient.getValueWithAccessToken = function () {
    var fragment = JSON.parse(sessionStorage.getItem('auth'));

    if (!fragment) {
        $("#result").text('INFO: Auth is null, please authenticate first.');
        return;
    }

    $.ajax(settings.apiServiceBaseUri + 'api/Values', {
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + fragment.access_token);
        }
    }).done(function (data) {
        $("#result").text('Success with IsAuthenticated = ' + data.IsAuthenticated + ', Data=' + data.Data);
    }).fail(function (error) {
        $("#result").text('Fail: ' + error);
    });
};
