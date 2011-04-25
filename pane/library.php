<?php
require_once "../passwords.php";
$mongo = new Mongo(MONGO_STRING);
$books = $mongo->margintonic->books->find();
?>
<h2>Library</h2>
<ul>
<? foreach ($books as $book): ?>
    <li><a href="../<?=$book['_id']?>"><?=$book['title']?></a></li>
<? endforeach; ?>
</ul>
