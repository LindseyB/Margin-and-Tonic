<?php

$url = 'http://www.google.com/search';
$querystring = http_build_query(array('q'=>'define:'.$_GET['q']));

$curl = curl_init();
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_URL, "$url?$querystring");
$result = curl_exec($curl);
curl_close($curl);

// replace the green links with white ones
$result = str_replace("#008000", "#FFFFFF", $result);

echo $result;
