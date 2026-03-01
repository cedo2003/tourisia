<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$body = json_decode(file_get_contents("php://input"), true);

$sender_id = $body['sender_id'] ?? null;
$receiver_id = $body['receiver_id'] ?? null;
$sender_type = $body['sender_type'] ?? null;  // 'user' or 'partner'
$message = trim($body['message'] ?? '');

if (!$sender_id || !$receiver_id || !$sender_type || !$message) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields."]);
    exit();
}

if (!in_array($sender_type, ['user', 'partner'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid sender_type."]);
    exit();
}

try {
    require_once '../config/database.php';
    $pdo->exec("USE tourisia");
    require_once 'cleanup.php';

    $stmt = $pdo->prepare(
        "INSERT INTO messages (sender_id, receiver_id, sender_type, message) VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$sender_id, $receiver_id, $sender_type, $message]);

    echo json_encode(["success" => true, "message_id" => $pdo->lastInsertId()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>