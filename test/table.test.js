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
        '<td>Aloha</td>' +
        '</tr>' +
        '<tr class="even">' +
        '<td>Aaron</td>' +
        '<td>Ciao</td>' +
        '</tr>' +
        '<tr class="odd">' +
        '<td>Eddie</td>' +
        '<td>Bueno</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';

    var $dummy;

    before(function() {
        table = $(markup).appendTo('#sandbox-inner').table({
            scrollable: true
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
        // expect(table.element.find('th').eq(0).hasClass('down-down-down')).to.be.true;
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
    it('proxies click events from dummy header', function(done){
        function clickHnadler(){
            done();
        }
        table.element.find('th').eq(0).one('click', clickHnadler);
        var th = $dummy.find('th').eq(0);

        th.trigger('click');
    });
});