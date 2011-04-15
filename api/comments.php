<?php

require_once('../passwords.php');

/**
 * GET
 * data: {
 *     user_id | book_id
 * }
 * returns: { <_id>:{
 *     user_id,
 *     book_id,
 *     y_percent,
 *     comment
 * } ...}
 */

// @todo: Don't do this.
try {

    switch($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        if (!isset($_GET)) break;
        
        if (isset($_GET['user_id']))
            $query = array('user_id'=>$_GET['user_id']);
        else if (isset($_GET['book_id']))
            $query = array('book_id'=>$_GET['book_id']);
        else
            break;
        
        $mongo = new Mongo(MONGO_STRING);
        $data = $mongo->margintonic->comments->find($query);
        $data = iterator_to_array($data);
        
        echo json_encode($data);
        exit();
        
    }

}
catch (Exception $e) {
    echo json_encode(array('error'=>$e->message));
    exit();
}

echo json_encode(array('error'=>'No Content'));
