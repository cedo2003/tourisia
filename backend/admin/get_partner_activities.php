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

    // Récupérer les infos du partenaire
    $stmt = $pdo->prepare("SELECT p.*, u.fullname as user_name FROM partners p JOIN users u ON p.user_id = u.id WHERE p.id = ?");
    $stmt->execute([$partnerId]);
    $partner = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$partner) {
        http_response_code(404);
        echo json_encode(["message" => "Partenaire non trouvé."]);
        exit();
    }

    // Mock data pour les activités (en attendant une table réelle d'offres/réservations)
    // Ici on pourrait compter les offres de ce partenaire, ses revenus, etc.
    $activities = [
        "stats" => [
            "total_views" => rand(100, 5000),
            "total_bookings" => rand(5, 50),
            "revenue" => rand(500, 10000) . " €",
            "active_offers" => rand(1, 15)
        ],
        "recent_actions" => [
            ["date" => date('Y-m-d H:i:s', strtotime('-1 day')), "action" => "Mise à jour du profil", "details" => "Modification des coordonnées"],
            ["date" => date('Y-m-d H:i:s', strtotime('-3 days')), "action" => "Nouvelle offre", "details" => "Circuit 'Soleil et Plage'"],
            ["date" => date('Y-m-d H:i:s', strtotime('-1 week')), "action" => "Connexion", "details" => "Login depuis Cotonou"]
        ]
    ];

    echo json_encode([
        "partner" => $partner,
        "activities" => $activities
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur serveur : " . $e->getMessage()]);
}
?>