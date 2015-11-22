jQuery(function($) {
  'use strict';
  jQuery.event.props.push('dataTransfer');

  $('.drop-zone')
    .on('dragenter', function() {
      $(this).addClass('over');
    })
    .on('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    })
    .on('dragleave', function() {
      $(this).removeClass('over');
    })
    .on('drop', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).removeClass('over');
      uploadFile(e.dataTransfer.files[0], $(this).data('size'));
    });

  $('.file').on('change',function(e) {
    uploadFile(e.target.files[0]);
  });

  function uploadFile(file, size) {
    var formData = new FormData();

    if (file === undefined) {
      showErrorMsg('ファイルを選ばれていません', size);
    } else if (file.type !== 'image/jpeg') {
      showErrorMsg('JPEGファイルを指定してください', size);
    } else {
      showErrorMsg('', size);
      formData.append('upfile', file);
      formData.append('size', size);
      $.ajax({
        url: 'composite.php',
        type: 'POST',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false
      })
      .done(function(data) {
        if (data.error === 0) {
          window.URL = window.URL || window.webkitURL;
          var a = document.createElement('a');
          a.href = data.dir + data.filename;
          a.download = data.filename;
          document.body.appendChild(a); // appendしてないとFirefoxで click が発火しない
          a.click();
        }
      })
      .fail(function() {
        console.error(arguments);
      });
    }
  }

  function showErrorMsg(msg, size) {
    $('#errors-' + size).text(msg);
  }

});
