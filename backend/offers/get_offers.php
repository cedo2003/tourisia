<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once '../config/database.php';
    $pdo->exec("USE tourisia");

    $partnerId = isset($_GET['partner_id']) ? $_GET['partner_id'] : null;

    if (!$partnerId) {
        http_response_code(400);
        echo json_encode(["message" => "ID du partenaire manquant."]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM offers WHERE partner_id = ? ORDER BY created_at DESC");
    $stmt->execute([$partnerId]);
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode JSON fields
    foreach ($offers as &$offer) {
        if ($offer['images'])
            $offer['images'] = json_decode($offer['images']);
        if ($offer['details'])
            $offer['details'] = json_decode($offer['details']);
    }

    echo json_encode($offers);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
}
?>