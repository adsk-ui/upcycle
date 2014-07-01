var table;
describe('table', function() {
    var markup = '<div></div>';

    var $dummy;

    before(function() {
        table = $(markup).appendTo('#sandbox-inner').table({
            scrollable: true,
            templateContext: {
                'headers': ['Name', 'Greeting'],
                'rows': [
                    ['Mike', 'Hello'],
                    ['Aaron', 'Hi'],
                    ['Eddie', 'hey'],
                ]
            }
        }).data('upcycle-table');
        $dummy = table.element.prev('table');
    });

    after(function() {
        table.element.remove();
    });

    xit('initializes tablesorter and proxies options', function() {
        table.element.trigger('sorton', [
            [
                [0, 0]
            ]
        ]);
        // expect(table.element.find('th').eq(0).hasClass('down-down-down')).to.be.true;
    });
    xit('creates dummy table with header and copies attributes', function() {
        expect($dummy).to.have.length(1);
        expect($dummy.hasClass('my-table')).to.be.true;
        expect($dummy.attr('id')).to.be.undefined;
        expect($dummy.attr('data-something')).to.equal('xxx');
    });
    xit('hides dummy table from screenreaders', function() {
        expect($dummy.attr('role')).to.equal('presentation');
        expect($dummy.attr('aria-hidden')).to.equal('true');
    });
    xit('proxies click events from dummy header', function(done){
        function clickHnadler(){
            done();
        }
        table.element.find('th').eq(0).one('click', clickHnadler);
        var th = $dummy.find('th').eq(0);

        th.trigger('click');
    });
});