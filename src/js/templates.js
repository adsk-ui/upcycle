this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["editable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "maxlength=\""
    + container.escapeExpression(((helper = (helper = helpers.textInputMaxLength || (depth0 != null ? depth0.textInputMaxLength : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"textInputMaxLength","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"bottom\">\n	<div>\n		<span role=\"label\">"
    + alias4(((helper = (helper = helpers.defaultValueLabel || (depth0 != null ? depth0.defaultValueLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"defaultValueLabel","hash":{},"data":data}) : helper)))
    + "</span>:<br/>\n		<strong>\""
    + alias4(((helper = (helper = helpers.defaultValue || (depth0 != null ? depth0.defaultValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"defaultValue","hash":{},"data":data}) : helper)))
    + "\"</strong>\n	</div>\n	<button role=\"button\" data-action=\"revert\" class=\"btn\">"
    + alias4(((helper = (helper = helpers.defaultButtonLabel || (depth0 != null ? depth0.defaultButtonLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"defaultButtonLabel","hash":{},"data":data}) : helper)))
    + "</button>\n</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<label>"
    + alias4(((helper = (helper = helpers.newValueLabel || (depth0 != null ? depth0.newValueLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newValueLabel","hash":{},"data":data}) : helper)))
    + ":</label><input type=\"text\" placeholder=\""
    + alias4(((helper = (helper = helpers.newValuePlaceholder || (depth0 != null ? depth0.newValuePlaceholder : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"newValuePlaceholder","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.textInputMaxLength : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "></input>\n"
    + ((stack1 = helpers.unless.call(alias1,(depth0 != null ? depth0.currentValueIsDefault : depth0),{"name":"unless","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"useData":true});;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["facetlist"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.options : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "			<li class=\"up-facet-option\" data-facet=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" data-facet-option=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\">\n				<span class=\"up-facet-option-name\">"
    + alias2(alias1(depth0, depth0))
    + "</span><button role=\"button\" data-action=\"remove\" class=\"btn up-btn-close-x-small\">remove</button> \n			</li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"up-inner\">\n	<span role=\"label\">"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span>\n	<ul role=\"presentation\" class=\"up-facets\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.facets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n</div>";
},"useData":true,"useDepths":true});;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["filterpanel"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"up-filterpanel-header\">\n	<div class=\"pull-left\">\n		<span class=\"up-filterpanel-title pull-left\" title=\""
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span>\n		<span class=\"up-filterpanel-result pull-left\"></span>\n	</div>\n	<div class=\"pull-right\">\n		<button role=\"button\" data-action=\"clear-all\" class=\"btn-link\" title=\""
    + alias4(((helper = (helper = helpers.clearAllLabel || (depth0 != null ? depth0.clearAllLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"clearAllLabel","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.clearAllLabel || (depth0 != null ? depth0.clearAllLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"clearAllLabel","hash":{},"data":data}) : helper)))
    + "</button>\n		<button data-action=\"close\" class=\"btn up-btn-close-x\">close</button>\n	</div>\n</div>\n<div class=\"up-selectlist\">"
    + ((stack1 = ((helper = (helper = helpers.selectlist || (depth0 != null ? depth0.selectlist : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selectlist","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>";
},"useData":true});;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["hover_tooltip"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "	"
    + ((stack1 = ((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"content","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", buffer = 
  "<div id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = ((helper = (helper = helpers.tinyscrollbar || (depth0 != null ? depth0.tinyscrollbar : depth0)) != null ? helper : alias2),(options={"name":"tinyscrollbar","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!helpers.tinyscrollbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true});;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["selectlist"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "	<ul role=\"presentation\" class=\"up-facets\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</ul>\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "	  		<li role=\"facet\" class=\"up-facet\">\n	  			<div role=\"header\" class=\"up-facet-header\">\n			  		<span role=\"button\" data-action=\"toggle\"></span>\n			  		<span role=\"label\" data-value=\""
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "\" class=\"up-facet-label\">"
    + alias4(((helper = (helper = helpers.displayName || (depth0 != null ? depth0.displayName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"displayName","hash":{},"data":data}) : helper)))
    + "</span>\n		  		</div>\n		  		<ul role=\"group\" class=\"up-facet-options\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.options : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		  		</ul>\n		  	</li>\n"
    + ((stack1 = helpers.unless.call(alias1,(data && data.last),{"name":"unless","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "			  		<li class=\"up-facet-option\" data-facet=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" data-facet-option=\""
    + alias2(alias1(depth0, depth0))
    + "\">\n			  			<input data-facet=\""
    + alias2(alias1((depths[1] != null ? depths[1].name : depths[1]), depth0))
    + "\" data-facet-option=\""
    + alias2(alias1(depth0, depth0))
    + "\" type=\"checkbox\">\n			  			<span class=\"up-facet-option-name\">"
    + alias2(alias1(depth0, depth0))
    + "</span>\n			  		</li>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "	  		<li class=\"divider\"></li>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, buffer = 
  "<div class=\"up-inner\">\n";
  stack1 = ((helper = (helper = helpers.tinyscrollbar || (depth0 != null ? depth0.tinyscrollbar : depth0)) != null ? helper : helpers.helperMissing),(options={"name":"tinyscrollbar","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},options) : helper));
  if (!helpers.tinyscrollbar) { stack1 = helpers.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"useData":true,"useDepths":true});;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "	<thead>\n		<tr>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.headers : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</tr>\n	</thead>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "			<th>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</th>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "	<tr class=\""
    + container.escapeExpression(((helper = (helper = helpers.stripe || (depth0 != null ? depth0.stripe : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"stripe","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,depth0,{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</tr>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "		<td>"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</td>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<table>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.headers : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	<tbody>\n"
    + ((stack1 = (helpers.zebra || (depth0 && depth0.zebra) || helpers.helperMissing).call(alias1,(depth0 != null ? depth0.rows : depth0),{"name":"zebra","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "	</tbody>\n</table>\n";
},"useData":true});;