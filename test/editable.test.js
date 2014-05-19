describe('editable', function(){
	var table = '<table class="editable">' +
      '<thead>'+
        '<tr>'+
        	'<td>Name</td>'+
        	'<td>Says</td>'+
        '</tr>'+
      '</thead>'+
      '<tbody>' +
        '<tr class="odd">' +
          '<td>Mike</td>'+
          '<td>Hello</td>'+
        '</tr>'+
        '<tr class="even">' +
          '<td>Aaron</td>'+
          '<td class="editable">Hi</td>'+
        '</tr>'+
        '<tr class="odd">' +
          '<td>Eddie</td>'+
          '<td>Hey</td>'+
        '</tr>'+
      '</tbody>'+
    '</table>';

    var editable = $(table).appendTo('#sandbox').editable().data('upcycle-editable');

    it('does something', function(){
    	expect(true).to.be.true;
    });
});