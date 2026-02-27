<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once '../config/database.php';
    $pdo->exec("USE tourisia");

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data['partner_id']) || !isset($data['title'])) {
        http_response_code(400);
        echo json_encode(["message" => "Données incomplètes."]);
        exit();
    }

    $sql = "INSERT INTO offers (partner_id, type, title, description, details, location, price, currency, images, video)
            VALUES (:partner_id, :type, :title, :description, :details, :location, :price, :currency, :images, :video)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':partner_id' => $data['partner_id'],
        ':type' => $data['type'],
        ':title' => $data['title'],
        ':description' => $data['description'],
        ':details' => isset($data['details']) ? json_encode($data['details']) : null,
        ':location' => $data['location'],
        ':price' => $data['price'],
        ':currency' => $data['currency'] ?? 'CFA',
        ':images' => isset($data['images']) ? json_encode($data['images']) : null,
        ':video' => $data['video'] ?? null
    ]);

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Offre créée avec succès !",
        "offer_id" => $pdo->lastInsertId()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
}
?>