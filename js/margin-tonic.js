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
        panes: ['tools','define','library']
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
    
    _this.comment_form.ajaxForm(function(comment){
        _this._comment_submit($.parseJSON(comment));
    });
};

MarginTonic.prototype = {
    
    // Private
    _longpress:function(e) {
        var _this = this;
        var x,y,word,pos,size,
            o = e.target || e.srcElement;
    
        x = (e.pageX || e.clientX) - _this.article.parent().position().left;
        y = (e.pageY || e.clientY) - _this.article_iscroll.y - _this.article.parent().position().top;
        
        if (o.id == _this.article[0].id) {
            if (x < parseInt(_this.article.css('padding-left'))) {
                _this.comment_form.find('textarea').val('');
                _this.comment_form.find('[name=y_percent]').val(100 * y / _this.article.height());
                $.colorbox({
                    inline:true,
                    href:_this.options.comment_form
                });
            }
            return false;
        }
        
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
        _this.nav.find(".dictionary").click();
        return false;
    },
    
    _navclick:function(tab) {
        var _this = this;
        var name = $(tab).data('name');
        
        if (_this.nav.current == name) {
            _this.pane.animate({left:-_this.pane.width()});
            _this.nav.current = null;
            $(this).removeClass('active');
            return;
        }
        
        $(tab).siblings().removeClass('active');
        $(tab).addClass('active');
        
        _this.pane.animate({left:-_this.pane.width()}, function() {
            _this.pane.load('pane/'+name, function() {
                _this.pane.animate({left:_this.nav.width()},function() {
                });
            });
        });
        
        _this.nav.current = name;
    },
    
    _show_comment:function(comment) {
	console.log(comment);
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
    
    _prepare: function(filename, text) {
        var filetype = filename.split('.').pop().toLowerCase(); // regex would be faster but this is cleaner
        switch (filetype) {
        case 'txt': return '<pre style="white-space:pre-wrap">'+text+'</pre>';
        case 'htm':
        case 'html': return '<div>'+text+'</div>';
        }
        return text;
    },
    
    // Public
    loadBook: function(book_id) {
        var _this = this;
        
	$.get("/api/book/"+book_id, function(book) {
            _this.article.empty();
            $(".comment-flag").remove();
            
            _this.article.append(_this._prepare(book['url'],book['content']));
            console.log(book['comments'])
            $.each(book['comments'], function(i,comment) {
                _this._show_comment(comment);
            });
            
            _this.comment_form.find('[name=book_id]').val(book_id);
            
        }, 'json');
    }
};

if (typeof exports !== 'undefined') exports.MarginTonic = MarginTonic;
else window.MarginTonic = MarginTonic;

// (end of private closure)
})(jQuery);
