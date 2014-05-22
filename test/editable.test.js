describe('editable', function(){
	var table = '<table>' +
      '<thead>'+
        '<tr>'+
        	'<td>Name</td>'+
        	'<td>Greeting</td>'+
        '</tr>'+
      '</thead>'+
      '<tbody>' +
        '<tr class="odd">' +
          '<td class="editable">Mike</td>'+
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
      'widgetContainer': '#sandbox'
    }).data('upcycle-editable');

    xit("triggers change event when the edited element's value changes", function(done){
    	editable.element.one('editable:value:change', function(event, data){
        expect(data.targetElement.text()).to.equal('Hiya');
        done();
      });
      editable._onEditChange(null, {
        'targetElement': $('#sandbox table.upcycle-editable td.editable').eq(1),
        'targetElementNewValue': 'Hiya'
      });
    });
});