// Margin Tonic
// A browser-based collaborative book reader
// Lindsey Bieda and Joe Frambach

// (closure to keep private functions private)
(function($) {

$.fn.MarginTonic = function(options) {
    var opts = $.extend({}, $.fn.MarginTonic.defaults, options);
    
    // instance method
    this.busy = function(is_busy) {
        if (is_busy) {
            $(opts.spinner).show();
        } else {
            $(opts.spinner).hide();
        }
    }
    
    this.loadBook = function() {
        var busy = this.busy;
        busy(true);
        $.get(opts.filename, function(data) {
            $(opts.tome).html($(data).html());
            busy(false);
        }, 'html');
    }
    
    return this;
};

// public
$.fn.MarginTonic.defaults = {
    filename: 'moby_dick.mtbook',
    tome: '#tome',
    spinner: '#spinner'
};

// (end of private closure)
})(jQuery);
