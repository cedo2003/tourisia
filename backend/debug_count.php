<?php
require_once 'c:/tourisia/backend/config/database.php';
$pdo->exec("USE tourisia");

$itineraries = $pdo->query("SELECT id, title FROM itineraries")->fetchAll(PDO::FETCH_ASSOC);
foreach ($itineraries as $it) {
    echo "ITINERARY ID: " . $it['id'] . " | TITLE: " . $it['title'] . "\n";

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM itinerary_items WHERE itinerary_id = ?");
    $stmt->execute([$it['id']]);
    echo "  Items in itinerary_items: " . $stmt->fetchColumn() . "\n";

    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE itinerary_id = ?");
    $stmt->execute([$it['id']]);
    echo "  Items in reservations: " . $stmt->fetchColumn() . "\n";

    echo "  Offer names in itinerary:\n";
    $stmt = $pdo->prepare("SELECT o.title FROM itinerary_items ii JOIN offers o ON ii.offer_id = o.id WHERE ii.itinerary_id = ?");
    $stmt->execute([$it['id']]);
    foreach ($stmt->fetchAll(PDO::FETCH_COLUMN) as $name) {
        echo "    - $name\n";
    }
    echo "\n";
}
?>