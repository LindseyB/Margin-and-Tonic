<?php 
	if(!isset($_COOKIE['user_name'])) {
		// get out of here, stalker
		$home = 'http://' . preg_replace('/\/[^\/]*$/', '', $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
		header("Location: $home");
	}

	require_once "passwords.php";
	require_once "utils.php";
	
	if (!isset($_GET['book_id'])) {
		$book_id = "4da89cf6c9dfbeef9e000000";
	}
	else {
		$book_id = $_GET['book_id'];
	}

        $mongo = new Mongo(MONGO_STRING);
        $book = $mongo->margintonic->books->findOne(array('_id' => new MongoId($book_id)));

        $book_curl = curl_init();
        curl_setopt($book_curl, CURLOPT_URL, $book['url']);

        $query = array('book_id'=>$book_id);
        $comments = $mongo->margintonic->comments->find($query);

?><!DOCTYPE html>
<html>
<head>
	<title>Margin Tonic: Comments in the margins of your favorite books</title>
	<link type="text/css" href="css/smoothness/jquery-ui-1.8.11.custom.css" rel="Stylesheet" />
	<link rel="stylesheet" type="text/css" href="css/colorbox.css" />	
	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
	<script type="text/javascript" src="js/jquery.colorbox.js"></script>
	<script type="text/javascript" src="js/jquery.form.js"></script>
	<script type="text/javascript" src="js/margin-tonic.js"></script>
</head>
<body>
<div id="pane">
</div>
<div class="colmask threecol">
	<div class="colright">
	<div class="colmid">
	<div class="colleft" id="comments">
		<div id="article" class="col1"><?curl_exec($book_curl);?></div>
		<div class="col2"></div>
		<div class="col3" id="nav"></div>
<? foreach ($comments as $comment): ?>
<p class="triangle-isosceles right comment" style="top:<?=$comment['y_percent']?>%"><b><?=$comment['user_id']?></b><span><br /><?=$comment['comment']?></span></p>
<? endforeach; ?>
	</div>
	</div>
	</div>
</div>
<!-- colorbox forms -->
<div style="display:none">
<form id="comment_form" action="/api/comment" method="post">
    <input type="hidden" name="book_id" value="<?=$book_id?>" />
    <input type="hidden" name="y_percent" id="y_pos" />
    <textarea name="comment"></textarea><br />
    <strong id="strlen">0</strong> / <strong>140</strong><br />
    <button>Scribble</button>
</form>
</div>
<script>
	$(function() {
		$.margin_tonic = new MarginTonic();

		$('textarea[name=comment]').keyup(function() {
			$(this).val($(this).val().slice(0,140));
			$('#strlen').text(this.value.length);
		});

		$('.comment span').hide();
		$('.comment').click(function() {
			$('.comment:mt-show').css('z-index',3);
			$(this).css('z-index',4);
			$(this).find('span').toggle();
		});
	});

	var $window = $(window);
	$.extend($.expr[':'], {
		'mt-show':function(a,i,m) {
			var offset = $(a).offset();
			var windowTop = $window.scrollTop();
			return (windowTop <= offset.top && offset.top <= windowTop + $window.height());
		},
		'mt-hide':function(a,i,m) {
			var offset = $(a).offset();
			var windowTop = $window.scrollTop();
			return (windowTop <= offset.top && offset.top <= windowTop + $window.height());
		}
	});

	$(window).scroll(function() {
		$('.comment:mt-show').show();
		$('.comment:not(:mt-show)').hide();
		$.margin_tonic.scroll_colorbox || $.colorbox.close()
	});

</script>
</body>
</html>
<?php
curl_close($book_curl);
