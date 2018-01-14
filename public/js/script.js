$(document).ready(function(){
    showCourses()
    showLinks()
})

function showCourses() {

        $.get( "/courses", function( data ) {
            var html = '';
            data.forEach(function(cours) {
                html = html + '<li><a href="#" onClick="showLinks('+cours.id+')">'+cours.name+'</a></li>'
            })
            $('#courses').html(html)
        });
   
}

//todo: implement showProducts method
function showLinks(coursId) {
    if(coursId) {
        var url = '/courses/'+ coursId +'/links';
    } else {
        var url = '/links'   
    }
    $.get(url, function(data) {
        var html = '';
        data.forEach(
            function(link) {
                html = html + '<div class="link">'
                 
                  +  '<p>'+'<a href="'+link.description+'" target="_blank" >'+link.description+'</a></p>'
                + '</div>';
            }
        )
        $('#content').html(html);
    })
}