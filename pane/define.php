<h2>Define</h2>
<input type="text" id="dict_search"/>
<div class="article"></div>

<script type="text/javascript">
$(function() {
    $("#dict_search").change(function(){
        $.get('api/define/'+$("#dict_search").val(),
        function(data) {
            for (var i in data) {
                $('.article').empty().append(data[i]);
            }
        }, 'json');
    });
    
    if ($.margin_tonic.dictword) {
        $('#dict_search').val($.margin_tonic.dictword).change();
        $.margin_tonic.dictword = null;
    }
});

$("#dict_search").click(function () { 
    $("#dict_search").val("");
});
</script>
