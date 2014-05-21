describe('editable', function(){
	var table = '<table class="editable">' +
      '<thead>'+
        '<tr>'+
        	'<td>Name</td>'+
        	'<td>Greeting</td>'+
        '</tr>'+
      '</thead>'+
      '<tbody>' +
        '<tr class="odd">' +
          '<td>Mike</td>'+
          '<td>Hello</td>'+
        '</tr>'+
        '<tr class="even">' +
          '<td>Aaron</td>'+
          '<td class="editable" data-edit-new="EDITPANEL_NEW_VALUE" data-edit-enter="EDITPANEL_ENTER_VALUE" data-edit-og="EDITPANEL_OG_VALUE" data-edit-og-value="Yo">Hi</td>'+
        '</tr>'+
        '<tr class="odd">' +
          '<td>Eddie</td>'+
          '<td>Hey</td>'+
        '</tr>'+
      '</tbody>'+
    '</table>';

    var editable = $(table).appendTo('#sandbox').editable({
      'editWidgetContainer': '#sandbox'
    }).data('upcycle-editable');

    it('does something', function(){
    	expect(true).to.be.true;
    });
});