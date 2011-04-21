// Margin Tonic
// A browser-based collaborative book reader
// Lindsey Bieda and Joe Frambach

// (closure to keep private functions private)
(function($) {

function MarginTonic (options) {
    var _this = this;
    
    _this.options = {
        filename: 'boo.mtbook',
        article: '.col1',
        comment_form: '#comment_form',
        panes: ['tools','define','library']
    };
    
    for (i in options) {
        _this.options[i] = options[i];
    }
    
    _this.nav = $(_this.options.nav);
    _this.article = $(_this.options.article);
    _this.pane = $(_this.options.pane);
    _this.header = $(_this.options.header);
    _this.spinner = $(_this.options.spinner);
    _this.comment_form = $(_this.options.comment_form);
    
    _this.article_iscroll = new iScroll(_this.article.parent().get(0),{
        bounce:false,
        longpresstime:500,
        longpress:function(e){_this._longpress(e)}
    });
    
    setTimeout(function() {
        _this.article_iscroll.refresh();
    }, 100);
    
    _this.comment_form.ajaxForm(function(comment){
        _this._comment_submit($.parseJSON(comment));
    });
    
    $(window).resize();
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
    
    _show_comment:function(comment) {
        var _this = this;
        var $flag = $('<div class="comment-flag" style="top:'+comment['y_percent']+'%">-</div>');
        var $comment = $('<div class="comment" style="top:'+comment['y_percent']+'%"><b>'+comment['user_id']+'</b><p>'+comment['comment']+'</p></div>');
        _this.article.parent().append($flag);
        _this.article.append($comment);
        $flag.click(function() {
            _this.article_iscroll.scrollToElement($comment.get(0),1000);
        });
    },
    
    _comment_submit:function(comment) {
        var _this = this;
        _this._show_comment(comment);
        setTimeout(function() {
            _this.article_iscroll.refresh();
        }, 100);
        $.colorbox.close();
    }
};

if (typeof exports !== 'undefined') exports.MarginTonic = MarginTonic;
else window.MarginTonic = MarginTonic;

// (end of private closure)
})(jQuery);
