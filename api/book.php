<?php

require_once('../passwords.php');

/**
 * POST
 * data: {
 *     title,
 *     author,
 *     url,
 *     selector[optional]
 * }
 * returns: redirect to GET
 */

/**
 * GET
 * data: {
 *     _id
 * }
 * returns: {
 *     _id,
 *     title,
 *     author,
 *     url,
 *     selector,
 *     content,
 *     comments
 * }
 */

// @todo: Don't do this.
try {

    switch($_SERVER["REQUEST_METHOD"]) {
    case "POST":
        if (!isset($_POST)) break;
        $data = array();
        $data['title'] = $_POST['title'];
        $data['author'] = $_POST['author'];
        $data['url'] = $_POST['url'];
        $data['selector'] = $_POST['selector'];
        
        $mongo = new Mongo(MONGO_STRING);
        $mongo->margintonic->books->insert($data);
        
        $url = "/api/book/${data['_id']}";
        header("location: $url");
        exit();
        
    break;
    case "GET":
        if (!isset($_GET)) break;
        $_id = $_GET['_id'];
        
        $mongo = new Mongo(MONGO_STRING);
        $data = $mongo->margintonic->books->findOne(array('_id' => new MongoId($_id)));
        $data['_id'] = "${data['_id']}";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $data['url']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $data['content'] = curl_exec($ch);
        curl_close($ch);
        
        $query = array('book_id'=>$_GET['_id']);
        $comments = $mongo->margintonic->comments->find($query);
        $comments = iterator_to_array($comments);
        $data['comments'] = $comments;
        
        echo json_encode($data);
        exit();
        
    }

}
catch (Exception $e) {
    echo json_encode(array('error'=>$e->message));
    exit();
}

echo json_encode(array('error'=>'No Content'));
