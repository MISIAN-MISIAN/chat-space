$(function(){
  function buildHTML(message){
    var image = message.image? `<img class="lower-message__image" src=${message.image}>` : ""; 
    
    var html =  `<div class="message" data-message-id="${message.id}">
                  <div class="message-top">
                    <div class="message-top__name">
                      ${message.name}
                    </div>
                    <div class="message-top__data">
                      ${message.date}
                    </div>
                  </div>
                  <div class="message-bottom">
                    <p class="message-top__comment">
                      ${message.content}
                    </p>
                  </div>
                  ${image}
                </div>`
    return html;
  }
  


  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(message){
      var html = buildHTML(message);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $('#new_message')[0].reset();
    })
    .fail(function(){
      alert('error');
    })

    .always(function(){
      $(".form__submit").removeAttr("disabled", false);
    })
  });


  var reloadMessages = function() {
    if (window.location.href.match(/\/groups\/\d+\/messages/)){
      var last_message_id = $('.message:last').data('message-id');
      
      $.ajax({
        url: 'api/messages',
        type: 'get',
        dataType: 'json',
        data: {id: last_message_id}
      })
      .done(function(messages) {
          var insertHTML = '';
          messages.forEach(function(message){
            if (Object.keys(message).length !== 0){
              insertHTML += buildHTML(message);
              $(".messages").append(insertHTML);
              $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight});
            };
          });
        
      })
      .fail(function() {
        alert('自動更新失敗しました');
      });
    }
  }
  setInterval(reloadMessages, 20000);
});