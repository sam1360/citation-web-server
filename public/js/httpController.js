

function replaceCitation(msg, error) {
  const $citationOutput = $('#citationOutput');
  const $citationMsg = $citationOutput.children('.panel-body');

  if (error) {
    $citationMsg.addClass('error');
  }
  else {
    $citationMsg.removeClass('error');
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


function getCitation() {
    var data = {
        style: $('#citationFormat').val(),
        url: $('#citationUrl').val()
    }

    $.post(window.location.href.slice(0, window.location.href.indexOf('?')) + '/v01/citation/', data)
        .done(function (returnData) {
            console.log(returnData);
            replaceCitation(returnData.citation);
        })
        .fail((jqxhr, status, err) => {
          console.error(`Error (HTTP status code )${status}): ${err}`);
          replaceCitation('Unable to generate citation. Please check your citation URL and try again.', true);
        });
}

$('#citeBtn').click((evt) => {
  getCitation();
});
