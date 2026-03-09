<?php
require_once 'c:/tourisia/backend/config/database.php';
$pdo->exec("USE tourisia");

try {
    // Check if column exists first to avoid errors
    $check = $pdo->query("SHOW COLUMNS FROM reservations LIKE 'itinerary_id'");
    if (!$check->fetch()) {
        $pdo->exec("ALTER TABLE reservations ADD COLUMN itinerary_id INT NULL AFTER offer_id");
        echo "Column itinerary_id added successfully.\n";
    } else {
        echo "Column itinerary_id already exists.\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>