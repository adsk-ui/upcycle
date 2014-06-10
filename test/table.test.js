var table;
describe('table', function() {
    var markup = '<table id="this-table" class="my-table" data-something="xxx">' +
        '<thead>' +
        '<tr>' +
        '<th>Name</th>' +
        '<th>Greeting</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr class="odd">' +
        '<td class="editable">Mike</td>' +
        '<td>Hello</td>' +
        '</tr>' +
        '<tr class="even">' +
        '<td>Aaron</td>' +
        '<td class="editable" data-new-label="EDITABLE_NEW_VALUE" data-new-placeholder="EDITABLE_NEW_VALUE_PLACEHOLDER" data-default-label="EDITABLE_DEFAULT_VALUE" data-default-value="Yo">Hi</td>' +
        '</tr>' +
        '<tr class="odd">' +
        '<td>Eddie</td>' +
        '<td>Hey</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

    var $dummy;

    before(function() {
        table = $(markup).appendTo('#sandbox-inner').table({
            scrollable: true,
            cssDesc: 'down-down-down'
        }).data('upcycle-table');
        $dummy = table.element.prev('table');
    });

    after(function() {
        // table.element.remove();
    });

    it('initializes tablesorter and proxies options', function() {
        table.element.trigger('sorton', [
            [
                [0, 0]
            ]
        ]);
        expect(table.element.find('th').eq(0).hasClass('down-down-down')).to.be.true;
    });
    it('creates dummy table with header and copies attributes', function() {
        expect($dummy).to.have.length(1);
        expect($dummy.hasClass('my-table')).to.be.true;
        expect($dummy.attr('id')).to.be.undefined;
        expect($dummy.attr('data-something')).to.equal('xxx');
    });
    it('hides dummy table from screenreaders', function() {
        expect($dummy.attr('role')).to.equal('presentation');
        expect($dummy.attr('aria-hidden')).to.equal('true');
    });
});