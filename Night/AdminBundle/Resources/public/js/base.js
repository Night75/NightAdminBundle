jQuery(document).ready(function() {
	jQuery('html').removeClass('no-js');
	Admin.add_pretty_errors(document);
	Admin.add_collapsed_toggle();
	Admin.add_filters(document);
	Admin.set_object_field_value(document);
	Admin.setup_collection_buttons(document);
});

var Admin = {

	/**
     * render log message
     * @param mixed
     */
	log: function() {
		var msg = '[Sonata.Admin] ' + Array.prototype.join.call(arguments,', ');
		if (window.console && window.console.log) {
			window.console.log(msg);
		} else if (window.opera && window.opera.postError) {
			window.opera.postError(msg);
		}
	},

	/**
     * display related errors messages
     *
     * @param subject
     */
	add_pretty_errors: function(subject) {
		jQuery('div.sonata-ba-field-error', subject).each(function(index, element) {
			var input = jQuery('input, textarea, select', element);

			var message = jQuery('div.sonata-ba-field-error-messages', element).html();
			jQuery('div.sonata-ba-field-error-messages', element).html('');
			if (!message) {
				message = '';
			}

			if (message.length == 0) {
				return;
			}

			var target;

			/* Hack to handle qTip on select */
			if(jQuery(input).is("select")) {
				jQuery(element).prepend("<span></span>");
				target = jQuery('span', element);
				jQuery(input).appendTo(target);
			}
			else {
				target = input;
			}

			target.qtip({
				content: message,
				show: 'focusin',
				hide: 'focusout',
				position: {
					corner: {
						target: 'rightMiddle',
						tooltip: 'leftMiddle'
					}
				},
				style: {
					name: 'red',
					border: {
						radius: 2
					},
					tip: 'leftMiddle'
				}
			});

		});
	},

	/**
     * Add the collapsed toggle option to the admin
     *
     * @param subject
     */
	add_collapsed_toggle: function(subject) {
		jQuery('fieldset.sonata-ba-fieldset-collapsed').has('.error').addClass('sonata-ba-collapsed-fields-close');
		jQuery('fieldset.sonata-ba-fieldset-collapsed div.sonata-ba-collapsed-fields').not(':has(.error)').hide();
		jQuery('fieldset legend a.sonata-ba-collapsed', subject).live('click', function(event) {
			event.preventDefault();

			var fieldset = jQuery(this).closest('fieldset');

			jQuery('div.sonata-ba-collapsed-fields', fieldset).slideToggle();
			fieldset.toggleClass('sonata-ba-collapsed-fields-close');
		});
	},

	stopEvent: function(event) {
		// https://github.com/sonata-project/SonataAdminBundle/issues/151
		//if it is a standard browser use preventDefault otherwise it is IE then return false
		if(event.preventDefault) {
			event.preventDefault();
		} else {
			event.returnValue = false;
		}

		//if it is a standard browser get target otherwise it is IE then adapt syntax and get target
		if (typeof event.target != 'undefined') {
			targetElement = event.target;
		} else {
			targetElement = event.srcElement;
		}

		return targetElement;
	},

	add_filters: function(subject) {
		jQuery('div.filter_container.inactive', subject).hide();
		jQuery('fieldset.filter_legend', subject).click(function(event) {
			jQuery('div.filter_container', jQuery(event.target).parent()).toggle();
		});
	},

	/**
     * Change object field value
     * @param subject
     */
	set_object_field_value: function(subject) {

		this.log(jQuery('a.sonata-ba-edit-inline', subject));
		jQuery('a.sonata-ba-edit-inline', subject).click(function(event) {
			Admin.stopEvent(event);

			var subject = jQuery(this);
			jQuery.ajax({
				url: subject.attr('href'),
				type: 'POST',
				success: function(json) {
					if(json.status === "OK") {
						var elm = jQuery(subject).parent();
						elm.children().remove();
						// fix issue with html comment ...
						elm.html(jQuery(json.content.replace(/<!--[\s\S]*?-->/g, "")).html());
						elm.effect("highlight", {
							'color' : '#57A957'
						}, 2000);
						Admin.set_object_field_value(elm);
					} else {
						jQuery(subject).parent().effect("highlight", {
							'color' : '#C43C35'
						}, 2000);
					}
				}
			});
		});
	},

	setup_collection_buttons: function(subject) {
		//  =================  ______________  Au chargement
		jQuery(".sonata-collection-row div label").each(function(){
			var content = jQuery(this).text();
			if(parseInt(this) !== NaN){
				var newLabel = parseInt(content) + 1;
				var numRegexp = new RegExp('\\d', 'g');
				newLabel = content.replace(numRegexp, newLabel);
				jQuery(this).text(jQuery.trim(newLabel));
			}
		})
		

		if(jQuery(".sonata-collection-row").length == 0){
			jQuery(".sonata-collection-add").addClass("btn-first");
		}
		
		//  =================  _____________ Event Listener
		jQuery(subject).on('click', '.sonata-collection-add', function(event) {
			Admin.stopEvent(event);

			jQuery(".sonata-collection-add").removeClass("btn-first")
			var container = jQuery(this).closest('[data-prototype]');
			var proto = container.attr('data-prototype');
			
			//  ================= Set field id
			var idRegexp = new RegExp(container.attr('id')+'___name__','g');			
			// --- Modif by Night
			proto = proto.replace(idRegexp, container.attr('id')+'_'+(container.children().length ));
			//proto = proto.replace(idRegexp, container.attr('id')+'_'+(container.children().length - 1));
 
			//  ================= Set Label
			var labelRegexp = new RegExp('__name__label__','g');
			// --- Modif by Night
			proto = proto.replace(labelRegexp, container.children().length);
			
			// ================= Set field name
			var parts = container.attr('id').split('_');
		 
			console.log(parts[parts.length-1]+'\\]\\[__name__');
			console.log(parts[parts.length-1]+']['+(container.children().length - 1));
           
			var nameRegexp = new RegExp(parts[parts.length-1]+'\\]\\[__name__','g');
			// --- Modif by Night
			proto = proto.replace(nameRegexp, parts[parts.length-1]+']['+(container.children().length));
			//proto = proto.replace(nameRegexp, parts[parts.length-1]+']['+(container.children().length -1));
			jQuery(proto).insertBefore(jQuery(this).parent());
           

			jQuery(this).trigger('sonata-collection-item-added');
		});

		jQuery(subject).on('click', '.sonata-collection-delete', function(event) {
			Admin.stopEvent(event);

			jQuery(this).closest('.sonata-collection-row').remove();
            
			jQuery(this).trigger('sonata-collection-item-deleted');
		});
	}
}
