describe('editable', function(){
	var table = '<table class="editable">'
      '<thead>'+
        '<tr><td>Name</td><td>Says</td></tr>'+
      '</thead>'+
      '<tbody>' +
        '<tr>' +
          '<td>Joe</td><td>Hello</td>'+
        '</tr>'+
      '</tbody>'+
    '</table>';

    var editable = $(table).appendTo('#sandbox').editable().data('upcycle-editable');
    
    
});