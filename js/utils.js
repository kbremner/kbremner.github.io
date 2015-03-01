// Simple function to get a url parameter
// See https://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable){
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
    }
}

function filterByTag(tag) {
    if(tag !== undefined) {
      // Hide all the posts that don't have the tag
      $("div.panel:not([data-tags$='" + tag + "'],"+ // Ends with the tag
        "[data-tags^='" + tag + ",'],"+ // Starts with the tag
        "[data-tags*='," + tag + ",'])") // contains the tag
          .hide();
    }
}