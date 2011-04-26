// Margin Tonic
// A browser-based collaborative book reader
// Lindsey Bieda and Joe Frambach

// (closure to keep private functions private)
(function($) {

function MarginTonic (options) {
    var _this = this;
    
    _this.options = {
        article: '#article',
        nav: '#nav',
        pane: '#pane',
        comments: '#comments',
        comment_form: '#comment_form',
        panes: ['feedback','define','library']
    };
    
    for (i in options) {
        _this.options[i] = options[i];
    }
    
    _this.nav = $(_this.options.nav);
    _this.article = $(_this.options.article);
    _this.pane = $(_this.options.pane);
    _this.comment_form = $(_this.options.comment_form);
    _this.comments = $(_this.options.comments);

    // Create tabs and panes, load pane contents
    for (var i in _this.options.panes) {
        var pane = _this.options.panes[i];
        _this.nav.append($('<img src="images/'+pane+'.png" alt="'+pane+'" id="'+pane+'" /><br />').data({name:pane}));
    }

    // Nav Actions
    _this.nav.children().click(function(){_this._navclick(this)});
    $("#library").data('colorbox',true);
    $("#feedback").data('colorbox',true);

    _this.comment_form.ajaxForm(function(comment){
        _this._comment_submit($.parseJSON(comment));
    });

    _this.article.bind('mousedown touchstart',function(e) {
        e.stopPropagation();
        if (e.touches && e.touches.length) e = e.touches[0];
        _this.article_loc = [e.pageX,e.pageY];
        _this.article_timeout = setTimeout(function(){_this._article_longpress(e)},500);
    })
    .bind('mouseup touchend',function(e) {
        _this.article_timeout && clearTimeout(_this.article_timeout);
    })
    .bind('mousemove touchmove',function(e) {
        if (!_this.article_timeout) return true;
        if (e.touches && e.touches.length) e = e.touches[0];
        if (Math.abs(_this.article_loc[0] - e.pageX) < 10)
        if (Math.abs(_this.article_loc[1] - e.pageY) < 10) return true;
        clearTimeout(_this.article_timeout);
        _this.article_timeout = null;
    });

    _this.comments.bind('mousedown touchstart',function(e) {
        if (e.touches && e.touches.length) e = e.touches[0];
        _this.comments_loc = [e.pageX,e.pageY];
        _this.comments_timeout = setTimeout(function(){_this._comments_longpress(e)},500);
    })
    .bind('mouseup touchend',function(e) {
        _this.comments_timeout && clearTimeout(_this.comments_timeout);
    })
    .bind('mousemove touchmove',function(e) {
        if (!_this.comments_timeout) return true;
        if (e.touches && e.touches.length) e = e.touches[0];
        if (Math.abs(_this.comments_loc[0] - e.pageX) < 10) 
        if (Math.abs(_this.comments_loc[1] - e.pageY) < 10) return true;
        clearTimeout(_this.comments_timeout);
        _this.comments_timeout = null;
    });
};

MarginTonic.prototype = {
    
    // Private

    _comments_longpress:function(e) {
        var _this = this;
        var x,y,word,pos,size,
            o = e.target || e.srcElement;

        x = (e.pageX || e.clientX) - _this.comments.parent().position().left;
        y = (e.pageY || e.clientY) - _this.comments.parent().position().top;

        _this.comment_form.find('textarea').val('');
        _this.comment_form.find('[name=y_percent]').val(100 * y / _this.comments.height());
        $.colorbox({
            inline:true,
            href:_this.options.comment_form
        });
        return false;
    },

    _article_longpress:function(e) {
        var _this = this;
        var x,y,word,pos,size,
            o = e.target || e.srcElement;
    
        x = (e.pageX || e.clientX) - _this.article.offset().left;
        y = (e.pageY || e.clientY) - _this.article.offset().top;
        
        var contents = $(o).contents().filter(function(){return this.nodeType==Node.TEXT_NODE;});
        
        if (contents.length==1 && !(/\W/.test(contents[0].nodeValue))) {
            word = contents[0].nodeValue.trim();
        }
        else {
            contents.each(function(i,el) {
                $(el).replaceWith($(el.nodeValue.replace(/(\W*)([\w-]+)(\W*)/g,'$1<span>$2</span>$3')));
            });
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
        _this.nav.find("#define").click();
        return false;
    },
    
    _navclick:function(tab) {
        var _this = this;
        var name = $(tab).data('name');

        if ($(tab).data('colorbox')) {
            var mt = $.margin_tonic;
            $.colorbox({
                href:'pane/'+name,
                onOpen:function(){mt.scroll_colorbox = true;},
                onClosed:function(){mt.scroll_colorbox = false;}
            });
            return;
        }

        $(tab).siblings().removeClass('active');
        _this.pane.removeClass(_this.nav.current);
        _this.pane.hide("fast", function() {
            if (_this.nav.current == name) {
                _this.nav.current = null;
                $(tab).removeClass('active');
            }
            else {
                _this.nav.current = name;
                $(tab).addClass('active');
                _this.pane.addClass(name);
                _this.pane.load('pane/'+name, function() {
                    _this.pane.slideDown("slow");
                });
            }
        });
    },
    
    _show_comment:function(comment) {
        var _this = this;
        var $flag = $('<div class="comment-flag" style="top:'+comment['y_percent']+'%">-</div>');
        var $comment = $('<p class="triangle-isosceles right comment" style="top:'+comment['y_percent']+'%"><b>'+comment['user_id']+'</b>'+comment['comment']+'</p>');
        _this.comments.append($flag);
        _this.comments.append($comment);
    },
    
    _comment_submit:function(comment) {
        var _this = this;
        _this._show_comment(comment);
        $.colorbox.close();
    },
};

if (typeof exports !== 'undefined') exports.MarginTonic = MarginTonic;
else window.MarginTonic = MarginTonic;

// (end of private closure)
})(jQuery);
