<?php

require_once "../simple_html_dom.php";

$url = 'http://www.google.com/search';
$querystring = http_build_query(array('q'=>'define:'.$_GET['q']));

$html = file_get_html("$url?$querystring");
$uls = array();
foreach ($html->find('ul.std, .spell') as $ul) {
	$ul = str_replace("#008000", "#FFFFFF", "$ul");
	$ul = str_replace("/url?q=", "", "$ul");
	$uls[] = "$ul";
}
echo json_encode($uls);
