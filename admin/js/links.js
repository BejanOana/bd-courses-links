/*global $*/

// READ recods on page load
$(document).ready(function () {
    readRecords(); // calling function
});

// READ records
function readRecords() {
    $.get("/links/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id +'">'
            			+ displayColumns(value)
        				+ '</tr>';
            $('#articles').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="name">'+value.name+'</td>'
			+ '<td class="description">'+'<a href="'+value.description+'" target="_blank" >'+value.description+'</a></td>'
		
			+ '<td align="center">'
			+ '<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Delete</button>'
			+ '</td>'
			+ '<td class="select_course">'+value.courseId+'</td>';
}

function addRecord() {
    $('#id').val('');
    $('#name').val('');
    $('#description').val('');
    
    $('#select_course').empty();
    
    $('#myModalLabel').html('Add New Link');
   
    $.get("/courses/", {}, function (data, status) {
        data.forEach(function(value) {
            var option= '<option id="'+ value.id +'">'
            	    +	value.name
        				+ '</option>';
            $('#select_course').append(option);
        });
    });
}

function viewRecord(id) {
    var url = "/links/" + id;
    
    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#name').val(data.name);
        $('#description').val(data.description);

        $('#id').val(id);
        $('#myModalLabel').html('Edit Link');
        $('#select_course').find(":selected").attr("id");
        
        $('#add_new_record_modal').modal('show');
    });
}

function saveRecord() {
    var formData = $('#record_form').serializeObject();
    formData.courseId=$('#select_course').find(":selected").attr("id");
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/links',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');
            
            var row = '<tr id="row_id_'+ data.id +'">'
            			+ displayColumns(data)
        				+ '</tr>';
            $('#articles').append(row);
        } 
    });
}

function updateRecord(formData) {
      $.ajax({
        url: '/links/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#row_id_'+formData.id+'>td.name').html(formData.name);
            $('#row_id_'+formData.id+'>td.description').html(formData.description);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}

function deleteRecord(id) {
    $.ajax({
        url: '/links/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}