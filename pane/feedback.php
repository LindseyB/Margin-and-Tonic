<?php

$curl = curl_init();
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_URL, 'https://spreadsheets.google.com/spreadsheet/viewform?formkey=dExJLXdTY01jRlB5eVYwc3U1OE51OWc6MQ');
$result = curl_exec($curl);
curl_close($curl);
echo $result;
exit;
