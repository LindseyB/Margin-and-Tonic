<?php

require_once('../passwords.php');

/**
 * POST
 * data: {
 *     user_id,
 *     book_id,
 *     y_percent,
 *     comment
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
 *     user_id,
 *     book_id,
 *     y_percent,
 *     comment
 * }
 */

// @todo: Don't do this.
try {

    switch($_SERVER["REQUEST_METHOD"]) {
    case "POST":
        if (!isset($_POST)) break;
        $data = array();
        $data['user_id'] = $_POST['user_id'];
        $data['book_id'] = $_POST['book_id'];
        $data['y_percent'] = $_POST['y_percent'];
        $data['comment'] = $_POST['comment'];
        
        $mongo = new Mongo(MONGO_STRING);
        $mongo->margintonic->comments->insert($data);
        
        $url = "comment.php?comment_id=${data['_id']}";
        header("location: $url");
        exit();
        
    break;
    case "GET":
        if (!isset($_GET)) break;
        $comment_id = $_GET['comment_id'];
        
        $mongo = new Mongo(MONGO_STRING);
        $data = $mongo->margintonic->comments->findOne(array('_id' => new MongoId($comment_id)));
        $data['_id'] = "${data['_id']}";
        
        echo json_encode($data);
        exit();
        
    }

}
catch (Exception $e) {
    echo json_encode(array('error'=>$e->message));
    exit();
}

echo json_encode(array('error'=>'No Content'));
