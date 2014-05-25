this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["editable"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"bottom\">\n	<div>\n		<span role=\"label\">";
  if (stack1 = helpers.defaultValueLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.defaultValueLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>:<br/>\n		<strong>\"";
  if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.defaultValue); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"</strong>\n	</div>\n	<button role=\"button\" data-action=\"revert\" class=\"btn\">";
  if (stack1 = helpers.defaultButtonLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.defaultButtonLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n</div>\n";
  return buffer;
  }

  buffer += "<form>\n<label>";
  if (stack1 = helpers.newValueLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.newValueLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>:<input type=\"text\" placeholder=\"";
  if (stack1 = helpers.newValuePlaceholder) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.newValuePlaceholder); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></input>\n</form>\n";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.currentValueIsDefault), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["facetlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(2, program2, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program2(depth0,data,depth1) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n			<li class=\"up-facet\" data-facet=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet-option=\"";
  stack2 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\">\n				<span class=\"up-facet-option\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span><button role=\"button\" data-action=\"remove\" class=\"btn up-btn-close-x-small\">remove</button>\n			</li>\n			";
  return buffer;
  }

  buffer += "<div class=\"up-inner\">\n	<span role=\"label\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.label); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n	<ul role=\"presentation\" class=\"up-facets\">\n		";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.facets), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["filterpanel"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"up-filterpanel-header\">\n	<div class=\"up-filterpanel-title pull-left\">";
  if (stack1 = helpers.label) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.label); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</div><div class=\"up-filterpanel-result pull-left\"></div>\n	<div class=\"pull-right\">\n		<button role=\"button\" data-action=\"clear-all\" class=\"btn-link\">";
  if (stack1 = helpers.clearAllLabel) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.clearAllLabel); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n		<button data-action=\"close\" class=\"btn up-btn-close-x\">close</button>\n	</div>\n</div>\n<div class=\"up-selectlist\">";
  if (stack1 = helpers.selectlist) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.selectlist); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>";
  return buffer;
  });;
this["upcycle"] = this["upcycle"] || {};
this["upcycle"]["templates"] = this["upcycle"]["templates"] || {};
this["upcycle"]["templates"]["selectlist"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<ul role=\"presentation\" class=\"up-facets\">\n		";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</ul>\n	";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n	  		<li role=\"facet\" class=\"up-facet\">\n	  			<div role=\"header\" class=\"up-facet-header\">\n			  		<span role=\"button\" data-action=\"toggle\"></span>\n			  		<span role=\"label\" data-value=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"up-facet-label\">";
  if (stack1 = helpers.displayName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.displayName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n		  		</div>\n		  		<ul role=\"group\" class=\"up-facet-options\">\n		  			";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.options), {hash:{},inverse:self.noop,fn:self.programWithDepth(3, program3, data, depth0),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		  		</ul>\n		  	</li>\n		  	";
  stack2 = helpers.unless.call(depth0, ((stack1 = data),stack1 == null || stack1 === false ? stack1 : stack1.last), {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  		";
  return buffer;
  }
function program3(depth0,data,depth1) {
  
  var buffer = "", stack1;
  buffer += "\n			  		<li class=\"up-facet-option\">\n			  			<input data-facet=\""
    + escapeExpression(((stack1 = (depth1 && depth1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" data-facet-option=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" type=\"checkbox\">\n			  			<span class=\"up-facet-option-name\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span>\n			  		</li>\n			  		";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "	\n	  		<li class=\"divider\"></li>\n	  		";
  }

  buffer += "<div class=\"up-inner\">\n	";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.tinyscrollbar) { stack1 = stack1.call(depth0, options); }
  else { stack1 = (depth0 && depth0.tinyscrollbar); stack1 = typeof stack1 === functionType ? stack1.call(depth0, options) : stack1; }
  if (!helpers.tinyscrollbar) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  });;