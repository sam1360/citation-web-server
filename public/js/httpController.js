"use strict";

const GITHUB_CLIENT_ID = '92ead414d69dd0f9ef84';
const urlParams = new Map(window.location.search.slice(1).split('&').map((e) => [e.split('=')[0], e.split('=')[1]]));

function replaceCitation(msg, error) {
    var $citationOutput, $citationMsg;

    $citationOutput = $('#citationOutput');
    $citationMsg = $citationOutput.children(".panel-body");

    if (error) {
        $citationMsg.addClass("error");
    }
    else {
        $citationMsg.removeClass("error");
    }

    if (!$citationOutput.is(':visible')) {
        $citationMsg.html(msg);
        $citationOutput.slideDown();
    }
    else {
        $citationMsg.fadeOut(200);
        $citationMsg.html(msg);
        $citationMsg.fadeIn(200);
    }
}

function getGitHubCode() {
    var data, secret;

    // get the secret from the backend

    data = {
        clientId: GITHUB_CLIENT_ID
    }

    $.post(window.location.href.slice(0, window.location.href.indexOf('?')) + '/v01/gitHub/secret/', data)
        .done(function (returnData) {
            secret = returnData.secret;
        })
        .fail(function (jqxhr, status, err) {
            console.error('Error (HTTP status code ' + status + '): ' + err);
            return;
        });

    // save the secret as a cookie, with a 15 minute expiration
    document.cookie = 'gitHubSecret=' + secret + '; max-age=900';

    // redirect to GitHub to complete the authorization
    window.location.href = 'https://github.com/login/oauth/authorize'
                            + '?client_id=' + GITHUB_CLIENT_ID
                            + '&redirect_uri=' + window.location.href
                            + '&state=' + secret;
}

function getGitHubToken() {
    var data = {
        code: urlParams.get('code'),
        secret: urlParams.get('state')
    }

    $.post(window.location.href.slice(0, window.location.href.indexOf('?')) + '/v01/gitHub/token/', data)
        .done(function (returnData) {
            // set the cookie with a max age of two weeks
            document.cookie = 'gitHubToken=' + returnData.token + '; max-age=1210000';
        })
        .fail(function (jqxhr, status, err) {
            console.error('Error (HTTP status code ' + status + '): ' + err);
        });
}

function getCitation() {
    var data, authToken, src;

    src = $('#citationUrl').val();

    // If a GitHub URL is used, perform special checks to make sure we have / get a GitHub Oauth key
    if (~src.toLowerCase().indexOf('github.com')) {
        if (~document.cookie.indexOf('gitHubToken=')) {
            // user has an active authentication token for GitHub
            authToken = document.cookie.match(/gitHubToken=.*;/)[0].slice(12, -1);
        }
        else {
            // user does not have an active GitHub token
            $('authorizeGitHubModal').modal('open');
            return;
        }
    }

    data = {
        style: $('#citationFormat').val(),
        token: authToken ? authToken : null,
        url: src
    }

    $.post(window.location.href.slice(0, window.location.href.indexOf('?')) + '/v01/citation/', data)
        .done(function (returnData) {
            console.log(returnData);
            if (returnData.citation) {
                replaceCitation(returnData.citation);
            }
            else {
                console.error("Error: Empty citation returned.");
                replaceCitation("Unable to generate citation. Please check your citation URL and try again.", true);
            }

        })
        .fail(function (jqxhr, status, err) {
            console.error("Error (HTTP status code )" + status + "): " + err);
            replaceCitation("Unable to generate citation. Please check your citation URL and try again.", true);
        });
}

$("#authorizeGitHubModal").modal({show: false});
$("#authorizeGitHubBtn").click(function (evt) {
    getGitHubCode();
});

$('#citeBtn').click(function (evt) {
    getCitation();
});

if (urlParams.has('code')) {
    getGitHubToken();
}
