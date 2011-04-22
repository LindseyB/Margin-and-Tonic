<?php

require_once('../passwords.php');

/**
 * GET
 * data: {
 * }
 * returns: { <_id>:{
 *     title,
 *     author,
 *     url,
 *     selector
 * } ...}
 */

// @todo: Don't do this.
try {

    switch($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        if (!isset($_GET)) break;
        
        $mongo = new Mongo(MONGO_STRING);
        $data = $mongo->margintonic->books->find();
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
