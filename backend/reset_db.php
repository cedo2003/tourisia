<?php
require_once 'c:/tourisia/backend/config/database.php';

try {
    $pdo->exec("USE tourisia");

    // Disable foreign key checks to allow truncating tables with relations
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    // Get all tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Emptying tables...\n";
    foreach ($tables as $table) {
        $pdo->exec("TRUNCATE TABLE `$table`");
        echo " - $table: DONE\n";
    }

    // Re-enable foreign key checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

    echo "\nDatabase is now empty.\n";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
?>