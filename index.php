<?php 	
		$home = 'http://' . preg_replace('/\/[^\/]*$/', '', $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
		if(isset($_COOKIE['user_name'])){
			header("location: $home/read.php");
		}

		include "twitter-async/EpiCurl.php";
		include "twitter-async/EpiOAuth.php";
		include "twitter-async/EpiTwitter.php";
		include "passwords.php";
        

		$twitterObj = new EpiTwitter(CONSUMER_KEY, CONSUMER_SECRET);
		$authenticateUrl = $twitterObj->getAuthenticateUrl(null,array('oauth_callback' => "$home/twitter_callback.php"));  
?>
<!DOCTYPE html>
<html>
<head>
	<title>Margin Tonic: Comments in the margins of your favorite books</title>
	<link type="text/css" href="css/smoothness/jquery-ui-1.8.11.custom.css" rel="Stylesheet" />
	<link rel="stylesheet" type="text/css" href="css/colorbox.css" />	
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.8.11.custom.min.js"></script>
	<script type="text/javascript" src="js/jquery.colorbox-min.js"></script>
	<script type="text/javascript" src="js/jquery.form.js"></script>
	<style type="text/css" media="screen">
	html, body {
		height: 100%;
		background-image: url('images/margin_bg.png');
	}
	body {
		text-align: center;
		padding: 0;
		margin: 0;
	}
	div#distance { 
		margin-bottom: -10em;
		width: 1px;
		height: 50%;
		float: left;

	}
	div#content {
		position: relative;
		text-align: center; 
		height: 20em;
		width: 40em;
		margin: 0 auto; 
		clear: left; 
	}
	h1 {
		font: 60px ArvoBold;
		margin: 0;
		text-shadow: 0 1px 5px #555555;	
	}
	h2 {
		font: 18px ArvoItalic;
		margin: 0;
	}
	p {
		margin: 100px;
		font: 12px ArvoRegular;
	}
	a {
		text-decoration: none;
		color: white;
		background-color: black;
		padding: 3px;
	}
	@font-face {
		font-family: 'ArvoRegular';
		src: url('css/fonts/arvo/Arvo-Regular-webfont.eot');
		src: url('css/fonts/arvo/Arvo-Regular-webfont.eot?iefix') format('eot'),
		     url('css/fonts/arvo/Arvo-Regular-webfont.woff') format('woff'),
		     url('css/fonts/arvo/Arvo-Regular-webfont.ttf') format('truetype'),
		     url('css/fonts/arvo/Arvo-Regular-webfont.svg#webfontau9vOdrl') format('svg');
		font-weight: normal;
		font-style: normal;

	}

	@font-face {
		font-family: 'ArvoItalic';
		src: url('css/fonts/arvo/Arvo-Italic-webfont.eot');
		src: url('css/fonts/arvo/Arvo-Italic-webfont.eot?iefix') format('eot'),
		     url('css/fonts/arvo/Arvo-Italic-webfont.woff') format('woff'),
		     url('css/fonts/arvo/Arvo-Italic-webfont.ttf') format('truetype'),
		     url('css/fonts/arvo/Arvo-Italic-webfont.svg#webfontvBl98OZ1') format('svg');
		font-weight: normal;
		font-style: normal;

	}

	@font-face {
		font-family: 'ArvoBold';
		src: url('css/fonts/arvo/Arvo-Bold-webfont.eot');
		src: url('css/fonts/arvo/Arvo-Bold-webfont.eot?iefix') format('eot'),
		     url('css/fonts/arvo/Arvo-Bold-webfont.woff') format('woff'),
		     url('css/fonts/arvo/Arvo-Bold-webfont.ttf') format('truetype'),
		     url('css/fonts/arvo/Arvo-Bold-webfont.svg#webfontxi5Flt4Z') format('svg');
		font-weight: normal;
		font-style: normal;

	}

	@font-face {
		font-family: 'ArvoBoldItalic';
		src: url('css/fonts/arvo/Arvo-BoldItalic-webfont.eot');
		src: url('css/fonts/arvo/Arvo-BoldItalic-webfont.eot?iefix') format('eot'),
		     url('css/fonts/arvo/Arvo-BoldItalic-webfont.woff') format('woff'),
		     url('css/fonts/arvo/Arvo-BoldItalic-webfont.ttf') format('truetype'),
		     url('css/fonts/arvo/Arvo-BoldItalic-webfont.svg#webfontThKCEgOx') format('svg');
		font-weight: normal;
		font-style: normal;
	}
	</style>
</head>
<body>
   <div id="distance"></div>
   <div id="content">
      <h1>Margin Tonic</h1>
      <h2>comments in the margins of your favorite books</h2>
      <p>
      	<a href="<?=$authenticateUrl?>">Sign in with Twitter.</a>
      </p>
   </div>
</body>
</html>
