<?php

require_once "twitter-async/EpiCurl.php";
require_once "twitter-async/EpiOAuth.php";
require_once "twitter-async/EpiTwitter.php";
require_once "passwords.php";
require_once "utils.php";

// handle twitter login here
$twitterObj = new EpiTwitter(CONSUMER_KEY, CONSUMER_SECRET);
$twitterObj->setToken($_GET['oauth_token']);

$token = $twitterObj->getAccessToken();
$twitterObj->setToken($token->oauth_token, $token->oauth_token_secret);

// now get the user information
$twitterObj = new EpiTwitter(CONSUMER_KEY, CONSUMER_SECRET, $token->oauth_token, $token->oauth_token_secret);
$userinfo = $twitterObj->get('/account/verify_credentials.json');
$home = 'http://' . preg_replace('/\/[^\/]*$/', '', $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
if (isset($userinfo->screen_name)) {
	setcookie('oauth_token', $token->oauth_token);
	setcookie('oauth_token_secret', $token->oauth_token_secret);
	setcookie('user_name', $userinfo->screen_name);
	header("location: $home/read.php");
	?><a href="<?=home?>/read.php">Click here to continue</a><?
}
else {
	header("location: $home");
	?><a href="<?=$home?>">Click here to continue.</a><?
}

