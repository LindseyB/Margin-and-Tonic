<?php

require_once('../passwords.php');

/**
 * POST
 * data: {
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
        if (!isset($_COOKIE['user_name'])) {
            echo json_encode(array('error'=>'Not logged in.'));
            exit;
        }
        if (strlen($_POST['comment']) > 140) {
            echo json_encode(array('error'=>'Comment too long.'));
            exit;
        }
        $data = array();
        $data['user_id'] = $_COOKIE['user_name'];
        $data['book_id'] = $_POST['book_id'];
        $data['y_percent'] = $_POST['y_percent'];
        $data['comment'] = $_POST['comment'];
        
        $mongo = new Mongo(MONGO_STRING);
        $mongo->margintonic->comments->insert($data);
        
        $url = "/api/comment/${data['_id']}";
        header("location: $url");
        exit();
        
    break;
    case "GET":
        if (!isset($_GET)) break;
        $_id = $_GET['_id'];
        
        $mongo = new Mongo(MONGO_STRING);
        $data = $mongo->margintonic->comments->findOne(array('_id' => new MongoId($_id)));
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
