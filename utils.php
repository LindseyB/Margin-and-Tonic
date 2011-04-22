<?php

require_once "twitter-async/EpiCurl.php";
require_once "twitter-async/EpiOAuth.php";
require_once "twitter-async/EpiTwitter.php";
require_once "passwords.php";

function show_book() {
	//TODO: have this grab the book to show from some var
	// get /api/book/{book_id}
	$bookFile = "moby_dick.txt";
	$fh = fopen($bookFile, 'r');
	$book = fread($fh, filesize($bookFile));
	fclose($fh);

	// surround every word with span
	/*$book_arr = explode(" ", $book);
	foreach ($book_arr as &$element){
		$element = "<span>".$element."</span>";
	}
	unset($element);
	$book = implode(" ", $book_arr);*/


	// every paragraph is in a <p> tag
	$book = "<p>" . $book . "</p>";
	$book = str_replace("\n\n", "</p><p>", $book);
	echo $book;
}

function show_comments() {
	//TODO: have this show comments based on the logged in user
	$twitterObj = new EpiTwitter(CONSUMER_KEY, CONSUMER_SECRET, $_COOKIE['oauth_token'], $_COOKIE['oauth_token_secret']);
	//grab all of the current user's friends
	$friends = $twitterObj->get_statusesFriends();
	try {
		foreach($friends as $friend){
			// just echo them for now
			echo $friend->screen_name;
		}
	} catch (EpiTwitterException $e) {
		// silently die
	}
}

?>
