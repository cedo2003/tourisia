<?php
require_once 'c:/tourisia/backend/config/database.php';
$pdo->exec("USE tourisia");

echo "ALL RESERVATIONS:\n";
$stmt = $pdo->query("SELECT id, user_id, offer_id, itinerary_id, status FROM reservations");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
?>