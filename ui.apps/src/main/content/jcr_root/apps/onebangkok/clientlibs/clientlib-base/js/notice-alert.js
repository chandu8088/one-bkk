if(document.getElementsByClassName('check-edit-mode').length>0){
    document.getElementsByTagName('body')[0].style='overflow-y: hidden'
}
var urlPath = window.location.pathname;
urlPath = urlPath.substring(0, urlPath.lastIndexOf("."));
var lowerCaseUrl = window.location.href.toLowerCase();
var isEditMode = lowerCaseUrl.includes('wcmmode=disabled') || lowerCaseUrl.includes('wcmmode=preview') ;

    if($('meta[content="homepage-template"]').length == 1){
    $.ajax({
        type: "GET",
        url: urlPath +'.getOffers.json?',
        success: function(data, textStatus, jqXHR) {
            //alert('Success!');
            var parsed_data = JSON.parse(JSON.stringify(data));
            //alert(parsed_data.xf_path);
            if(parsed_data.response_path != '' && (parsed_data.wcmmode != 'EDIT' || isEditMode)) {
                $.ajax({
                        type: "GET",
                        url: parsed_data.response_path+'.html',
                        success: function(data, textStatus, jqXHR) {
                            //alert('Success!');
                              const ele = document.getElementsByClassName("root")[0];
                           //ele.innerHTML += data
                           ele.insertAdjacentHTML('beforeend',data);
                           const closebtn = document.querySelector('#notice_alert_close')
                              if(closebtn){
                                  closebtn.addEventListener('click',()=>{
                                      closeModal(closebtn.classList.modalId)
                                  })
                              }
                        },
                        error: function(jqXHR) {
                            //alert('Error occurred!');
                        }
                    });
            }

        },
        error: function(jqXHR) {
            //alert('Error occurred!');
        }
    });
}
