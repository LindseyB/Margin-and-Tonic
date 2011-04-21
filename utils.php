<?php
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
}

?>