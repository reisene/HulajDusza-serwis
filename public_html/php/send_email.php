<?php
if (!isset($_SESSION)) {
    session_start();
}

function verifyCsrfToken($csrfToken) {
    if ($_SERVER['HTTP_USER_AGENT'] !== $_SESSION['user_agent']) {
        echo json_encode(['success' => false, 'message' => 'Błąd CSRF']);
        exit;
    }
    if ($csrfToken !== $_SESSION['csrf_token'] || $csrfToken !== $_COOKIE['csrf_token']) {
        echo json_encode(['success' => false, 'message' => 'Błąd CSRF']);
        exit;
    }
}

$csrfToken = $_POST['csrf_token'];
verifyCsrfToken($csrfToken);

// Dane do Airtable
$airtable_api_url = "https://api.airtable.com/v0/appx76Q9YSMyuLxYF/Submissions";
$airtable_api_key = "patmmJVUgqZQmCvW3.b591c3a621807ac2d784c5c8afbff6612af7c0d2624e6131df6c0e3946dea5af";

// Dane do reCAPTCHA
$recaptcha_secret = "6LeTFCAqAAAAAL0kZ98HDceJdvN0_6GImtVvfMjg";

// Odbierz dane POST z formularza
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];
$recaptcha_response = $_POST['g-recaptcha-response'];
$uniqueID = $_POST['uniqueID'];

// Sprawdź reCAPTCHA
$recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
$recaptcha_data = array(
    'secret' => $recaptcha_secret,
    'response' => $recaptcha_response
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($recaptcha_data),
    ),
);

$context  = stream_context_create($options);
$recaptcha_verify = file_get_contents($recaptcha_url, false, $context);
$recaptcha_success = json_decode($recaptcha_verify);

if ($recaptcha_success->success) {
    // Jeśli reCAPTCHA się powiodła, wyślij do Formspree

    // Wysłanie do Airtable
    $airtable_data = json_encode(array(
        'fields' => array(
            'id' => $uniqueID,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message
        )
    ));

    $airtable_options = array(
        'http' => array(
            'header'  => "Authorization: Bearer " . $airtable_api_key . "\r\n" .
                         "Content-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => $airtable_data,
        ),
    );

    $airtable_context = stream_context_create($airtable_options);
    $airtable_response = file_get_contents($airtable_api_url, false, $airtable_context);

    if ($airtable_response) {
        // Zgłoszenie zakończone sukcesem
        echo json_encode(['success' => true, 'message' => 'Dziękujemy za zgłoszenie!']);
    } else {
        // Wystąpił problem
        echo json_encode(['success' => false, 'message' => 'Błąd podczas wysyłania formularza.']);
    }
} else {
    // Błąd weryfikacji reCAPTCHA
    echo json_encode(['success' => false, 'message' => 'Błąd weryfikacji reCAPTCHA.']);
}
?>