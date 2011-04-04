// Margin Tonic
// A browser-based collaborative book reader
// Lindsey Bieda and Joe Frambach

// (closure to keep private functions private)
(function($) {

function MarginTonic (options) {
    var _this = this;
    
    _this.options = {
        filename: 'boo.txt',
        article: '#article',
        nav: '#nav',
        pane: '#pane',
        header: '#header',
        spinner: '#spinner',
        panes: ['tools','comments','dictionary','library']
    };
    
    for (i in options) {
        _this.options[i] = options[i];
    }
    
    _this.nav = $(_this.options.nav);
    _this.article = $(_this.options.article);
    _this.pane = $(_this.options.pane);
    _this.header = $(_this.options.header);
    _this.spinner = $(_this.options.spinner);
    
    _this.article.parent().iscroll({bounce:false});
    
    // Create tabs and panes, load pane contents
    for (var i in _this.options.panes) {
        var pane = _this.options.panes[i];
        _this.nav.append($('<div class="'+pane+'"><img src="images/'+pane+'.png" alt=""/><img src="images/'+pane+'_text_black.png" alt="'+pane+'"/></div>'));
    }

    // Nav Actions
    _this.nav.children().click(function() {
        if ($(this).hasClass('active')) return;
        _this.pane.hide().slideDown();
        _this.nav.children().removeClass('active');
        _this.pane.load('pane/'+$(this).attr('class'));
        $(this).addClass('active');
    });
};

MarginTonic.prototype = {
    
    // Private
    
    // Public
    busy: function(is_busy) {
        var _this = this;
        if (is_busy) {
            _this.spinner.show();
        } else {
            _this.spinner.hide();
        }
    },
    
    prepare: function(filename, text) {
        var filetype = filename.split('.').pop().toLowerCase(); // regex would be faster but this is cleaner
        switch (filetype) {
        case 'txt': return '<pre style="white-space:pre-wrap">'+text+'</pre>';
        case 'mtbook': return $(text);
        }
        return text;
    },
    
    loadBook: function() {
        var _this = this;
        _this.busy(true);
        $.get(_this.options.filename, function(data) {
            _this.article.html(_this.prepare(_this.options.filename,data));
            _this.busy(false);
        }, 'html');
    }
};

if (typeof exports !== 'undefined') exports.MarginTonic = MarginTonic;
else window.MarginTonic = MarginTonic;

// (end of private closure)
})(jQuery);
