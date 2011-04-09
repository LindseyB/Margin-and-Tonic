// Margin Tonic
// A browser-based collaborative book reader
// Lindsey Bieda and Joe Frambach

// (closure to keep private functions private)
(function($) {

function MarginTonic (options) {
    var _this = this;
    
    _this.options = {
        filename: 'boo.mtbook',
        article: '#article',
        nav: '#nav',
        pane: '#pane',
        header: '#header',
        spinner: '#spinner',
        panes: ['tools','dictionary','library']
    };
    
    for (i in options) {
        _this.options[i] = options[i];
    }
    
    _this.nav = $(_this.options.nav);
    _this.article = $(_this.options.article);
    _this.pane = $(_this.options.pane);
    _this.header = $(_this.options.header);
    _this.spinner = $(_this.options.spinner);
    
    _this.article_iscroll = new iScroll(_this.article.parent().get(0),{
        bounce:false,
        longpresstime:500,
        longpress:function(e) {
            var x,y,word,pos,size,
                o = e.target || e.srcElement;
            
            if (o.id == _this.article[0].id) {
                return false;
            }
        
            x = (e.pageX || e.clientX) - _this.article.parent().position().left;
            y = (e.pageY || e.clientY) - _this.article_iscroll.y - _this.article.parent().position().top;
            
            var contents = $(o).contents().filter(function(){return this.nodeType==Node.TEXT_NODE;});
            
            if (contents.length==1 && !(/\W/.test(contents[0].nodeValue))) {
                word = contents[0].nodeValue.trim();
            }
            else {
                contents.each(function(i,el) {
                    $(el).replaceWith($(el.nodeValue.replace(/(\W*)([\w-]+)(\W*)/g,'$1<span>$2</span>$3')));
                });
                console.log($(o).children());
                $(o).children().each(function(i,w) {
                    pos = $(w).position();
                    if (pos.left <= x && x <= pos.left + $(w).width() && pos.top <= y && y <= pos.top + $(w).height()) {
                        word = $(w).text().trim();
                    }
                });
            }
            
            if (!word) return false;
        
            _this.dictword = word;
            
            _this.nav.find(".active").click();
            _this.nav.find(".dictionary").click();
            return false;
        }
    });
    
    setTimeout(function() {
        _this.article_iscroll.refresh();
    }, 100);
    
    _this.article.mousedown(function(e) {
        $(this).data({x:e.pageX, y:e.pageY});
    })
    .mouseup(function(e) {
        if ($(this).data('x') != e.pageX || $(this).data('y') != e.pageY) {
            return;
        }
        
    });
    
    // Create tabs and panes, load pane contents
    for (var i in _this.options.panes) {
        var pane = _this.options.panes[i];
        _this.nav.append($('<div class="'+pane+'"><img src="images/'+pane+'.png" alt="'+pane+'"/><img src="images/'+pane+'_text_black.png" alt="'+pane+'"/></div>').data({name:pane}));
    }

    // Nav Actions
    _this.nav.children().click(function() {
        var name = $(this).data('name');
            
        if (_this.nav.current == name) {
            _this.pane.animate({left:-_this.pane.width()});
            _this.nav.current = null;
            $(this).removeClass('active');
            return;
        }
        
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        
        _this.pane.animate({left:-_this.pane.width()}, function() {
            _this.pane.load('pane/'+name, function() {
                _this.pane.animate({left:_this.nav.width()},function() {
                });
            });
        });
        
        _this.nav.current = name;
    });
    
    $(window).resize();
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
        case 'mtbook': return '<div>'+text+'</div>';
        }
        return text;
    },
    
    loadBook: function() {
        var _this = this;
        _this.busy(true);
        $.get(_this.options.filename, function(data) {
            _this.article.html(_this.prepare(_this.options.filename,data));
            // ajax get comments
            var comments = [
                ["Boo","I like this part. It\'s like a scary story.",63.625],
                ["Boo","I don\'t like this part. I would come back.",86.9]
            ];
            for (var i in comments) {
                _this.article.append('<div class="comment" style="top:'+comments[i][2]+'%"><b>'+comments[i][0]+'</b><p>'+comments[i][1]+'</p></div>');
            }
            _this.busy(false);
        }, 'html');
    }
};

if (typeof exports !== 'undefined') exports.MarginTonic = MarginTonic;
else window.MarginTonic = MarginTonic;

// (end of private closure)
})(jQuery);
