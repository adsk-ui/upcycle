describe('editable', function() {
    var table = '<table>' +
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

    var editable;

    beforeEach(function() {
        editable = $(table).appendTo('#sandbox-inner').editable({
            'widgetContainer': '#sandbox',
            'popoverContainer': 'body'
        }).data('upcycle-editable');
    });
    afterEach(function() {
        editable._destroy();
        editable.element.remove();
    });

    it("triggers change event when the edited element's value changes", function(done) {
        editable.element.one('editable:value:change', function(event, data) {
            expect(data.element.innerHTML).to.equal('Hiya');
            done();
        });
        editable.element
            .find('.editable').eq(1)
            .one('shown', function() {
                var $this = $(this),
                    $popover = $this.data('popover').tip(),
                    $input = $popover.find('input[type="text"]');
                _.defer(function() {
                    $input.attr('value', 'Hiya').trigger($.Event("keydown", {
                        keyCode: 13
                    }));
                });
            })
            .trigger('click');
    });
    it("does not allow popover to close unintentionally", function(done) {
        editable.element
            .find('.editable').eq(1)
            .one('shown', function() {
                var $this = $(this),
                    $popover = $this.data('popover').tip(),
                    docClickHandler = sinon.spy();
                $(document).one('click', docClickHandler);  
                // defer this to allow the editable component's
                // "shown" event handler to execute first
                _.defer(function(){
                    $popover.trigger('click');
                    expect(docClickHandler.called).to.equal(false);
                    done();
                });
            })
            .trigger('click');
    });

    it("provides maxlength option for text input", function(done){
        editable.option('textInputMaxLength', 1);
        editable.element.find('.editable').eq(1)
            .one('shown', function(){
                var $this = $(this),
                    $popover = $this.data('popover').tip();
                expect($popover.find('input[type="text"]').attr('maxlength')).to.equal('1');
                done();
            })
            .trigger('click');
    });
});