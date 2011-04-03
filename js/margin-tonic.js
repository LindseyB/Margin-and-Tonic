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
    };
    
    this.prepare = function(filename, text) {
        var filetype = filename.split('.').pop(); // regex would be faster but this is cleaner
        switch (filename) {
        case 'txt': return '<pre>'+text+'</pre>';
        case 'mtbook': return $(text);
        }
        return text;
    }
    
    this.loadBook = function() {
        var $this = this;
        $this.busy(true);
        $.get(opts.filename, function(data) {
            $(opts.tome).html($this.prepare(opts.filename,data));
            $this.busy(false);
        }, 'html');
    };
    
    return this;
};

// public
$.fn.MarginTonic.defaults = {
    filename: 'moby_dick.txt',
    tome: '#tome',
    spinner: '#spinner',
    dictionary: 'nav#panes div.dictionary'
};

// (end of private closure)
})(jQuery);

$(function() {
    // Nav Actions
    $('nav#actions div').click(function() {
        if ($(this).hasClass('active')) return;
        $('nav#actions div.active').removeClass('active');
        $('nav#panes div.active').removeClass('active');
        $('nav#panes div.'+$(this).attr('class')).addClass('active');
        $(this).addClass('active');
    })
    
    
    // Dictionary
    var $dictionary = $($.fn.MarginTonic.defaults.dictionary);
    $($dictionary).find(':text').change(function(){
        $.get('dictionary/'+$dictionary.find(':text').val(),
        function(data) {
            $($dictionary).find('article').html($(data).find('ul.std, .spell'));
        });
    });
    
    
    
})