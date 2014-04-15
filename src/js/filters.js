$.widget('Upcycle.filter', {
	'options': {
		'templatesNamespace': 'Upcycle.templates',
		'data': {},
		'eventDelay': 0
	},
	'appliedFilters': {},
	'_create': function(){
		this._setOptions(this.options);
		this._on({'change': this._onChange});
		this._on({'click [data-action="clear-all"]': this.clear});
		this._on({'click [data-action="toggle"]': this._toggleGroup});
		this.element.addClass('filter'); 
		this._update();
	},
	'_update': function(){
		this.element.append(this._renderMarkup(this.options.data));
	},
	'clear': function(){
		this.element.find('[type="checkbox"]').each(function(index, checkbox){
			checkbox.checked = false;
		});
		return this;
	},
	'_toggleGroup': function(){

	},
	'_setOption': function(key, value){
		$.Widget.prototype._setOption.call(this, key, value);
		if(key === 'eventDelay'){
			this._triggerChangeEvent = _.debounce(function(event, appliedFilters){
				var that = this;
				if( this._debouncingChangeEvent ){
					clearInterval(this._debouncingChangeEvent);
				}
				this._debouncingChangeEvent = setTimeout(function(){
					delete that._debouncingChangeEvent;
					if(!_.isEqual(appliedFilters, that.appliedFilters)){
						that.appliedFilters = appliedFilters;
						that._trigger('change', event, {'appliedFilters': that.appliedFilters});	
					}
				}, this.options.eventDelay);
			}, value);
		}
	},
	'_onChange': function(event){
		var that = this;
		var appliedFilters = {};
		this.element.find('[type="checkbox"]').each(function(){
			if( this.checked ){
				var group = this.getAttribute('data-group'),
					facet = this.getAttribute('data-facet');	
				if(appliedFilters.hasOwnProperty(group)){
					appliedFilters[group].push( facet );
				}else{
					appliedFilters[group] = [facet];
				}
			}
		});
		this._triggerChangeEvent(event, appliedFilters);
	},
	'_renderMarkup': function(data){
		var template = eval(this.options.templatesNamespace)['filter'],
			templateContext = this._getTemplateContext(data);
		return template(templateContext);
	},
	'_getTemplateContext': function(data){
		data = data || {};
		data.facetCount = _.reduce(data.filters, function(memo, filter){
			return _.isArray(filter.values) ? memo + filter.values.length : memo;
		}, 0);
		return data;
	},
});