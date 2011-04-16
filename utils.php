<?php
function show_book() {
	//TODO: have this grab the book to show from some var
	$bookFile = "moby_dick.txt";
	$fh = fopen($bookFile, 'r');
	$book = fread($fh, filesize($bookFile));
	fclose($fh);

	$book = "<p>" . $book . "</p>";
	$book = str_replace("\n", "</p><p>", $book);
	echo $book;
}

function show_comments() {
	//TODO: have this show comments based on the logged in user
}

?>