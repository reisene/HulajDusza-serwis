<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $formData = json_decode(file_get_contents('php://input'), true);
    $error = null;

    // Sprawdź, czy pole telefonu lub maila jest wypełnione
    if (empty($formData['email']) && empty($formData['phone'])) {
        $error = 'Proszę podać adres email lub numer telefonu';
    } elseif (!empty($formData['email']) && !filter_var($formData['email'], FILTER_VALIDATE_EMAIL)) {
        $error = 'Nieprawidłowy adres email';
    } elseif (!empty($formData['phone']) && !preg_match('/^[0-9]{9}$/', $formData['phone'])) {
        $error = 'Nieprawidłowy numer telefonu';
    } elseif (empty($formData['name'])) {
        $error = 'Nieprawidłowe imię';
    } elseif (empty($formData['message'])) {
        $error = 'Nieprawidłowa wiadomość';
    }

    if ($error) {
        // Zwróć odpowiedź z błędem
        header('Content-Type: application/json');
        echo json_encode(['error' => $error]);
        exit;
    }

    // Dane formularza są prawidłowe, możesz kontynuować
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
}
?>