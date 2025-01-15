<?php
$config = json_decode(json: file_get_contents(filename: '../config.json'), associative: true);
$secret_key = base64_decode(string: $config['secret_key']);
$iv = base64_decode(string: $config['iv']);

if (!isset($config['secret_key']) || !isset($config['iv']) || !isset($config['airtable-api-url']) || !isset($config['airtable-api-key']) || !isset($config['recaptcha_secret'])) {
    echo 'Błąd: plik config.json nie zawiera wymaganych danych.';
    exit;
}

if (!isset($_COOKIE['PHPSESSID'])) {
    echo json_encode(value: ['success' => false, 'message' => 'Sesja nie jest zainicjowana. Proszę odświeżyć stronę i spróbować ponownie.']);
    exit;
}

session_id(id: $_COOKIE['PHPSESSID']); # skipcq
session_start();

verifyCsrfToken(secret_key: $secret_key, iv: $iv);

    /**
     * Verifies the CSRF token and session variables.
     * 
     * This function verifies the CSRF token by decrypting it and comparing it with the token stored in the session.
     * It also verifies the User Agent and session ID.
     * 
     * @param string $secret_key The secret key used for encryption and decryption.
     * @param string $iv The initialization vector used for encryption and decryption.
     * 
     * @return void
     */
function verifyCsrfToken($secret_key, $iv) {
    // Get the encrypted token and IV from the session
    $encryptedToken = $_SESSION['csrf_token'];
    $csrfToken = $_POST['csrf_token'];
    $cipher = "AES-256-CBC";
    $decryptedCsrfToken = openssl_decrypt(data: $csrfToken, cipher_algo: $cipher, passphrase: $secret_key, options: 0, iv: $iv);
    if ($decryptedCsrfToken === false) {
        echo json_encode(['success' => false, 'message' => 'Błąd dekodowania tokena CSRF']);
        exit;
    }

    // Decrypt the token using OpenSSL
    
    $decryptedToken = openssl_decrypt(data: $encryptedToken, cipher_algo: $cipher, passphrase: $secret_key, options: 0, iv: $iv);

    // Verify the decrypted token
    if (!hash_equals(known_string: $decryptedToken, user_string: $decryptedCsrfToken)) {
        echo json_encode(value: ['success' => false, 'message' => 'Błąd CSRF']);
        exit;
    }

    if (!isset($_SESSION['csrf_token']) || empty($csrfToken)) {
        echo json_encode(value: ['success' => false, 'message' => 'Brak ciasteczka lub tokena']);
        exit;
    }

    if (!hash_equals(known_string: $_SESSION['csrf_token'], user_string: $csrfToken)) {
        echo json_encode(value: ['success' => false, 'message' => 'Błąd CSRF ses']);
        exit;
    }

    if ($_SERVER['HTTP_USER_AGENT'] !== $_SESSION['user_agent']) {
        echo json_encode(value: ['success' => false, 'message' => 'Błąd User Agent']);
        exit;
    }

    if (!isset($_COOKIE['PHPSESSID']) || $_COOKIE['PHPSESSID'] !== session_id()) {
        echo json_encode(value: ['success' => false, 'message' => 'Błąd sesji']);
        exit;
    }
}


// Dane do Airtable
$airtable_api_url = $config['airtable-api-url'];
$airtable_api_key = $config['airtable-api-key'];

// Dane do reCAPTCHA
$recaptcha_secret = $config['recaptcha_secret'];

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

$context  = stream_context_create(options: $options);
$recaptcha_verify = file_get_contents(filename: $recaptcha_url, use_include_path: false, context: $context);
$recaptcha_success = json_decode(json: $recaptcha_verify);

if ($recaptcha_success->success) {
    // Wysłanie do Airtable
    $airtable_data = json_encode(value: array(
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

    $airtable_context = stream_context_create(options: $airtable_options);
    $airtable_response = file_get_contents(filename: $airtable_api_url, use_include_path: false, context: $airtable_context);

    if ($airtable_response) {
        // Zgłoszenie zakończone sukcesem
        echo json_encode(value: ['success' => true, 'message' => 'Dziękujemy za zgłoszenie!']);
    } else {
        // Wystąpił problem
        echo json_encode(value: ['success' => false, 'message' => 'Błąd podczas wysyłania formularza.']);
    }
} else {
    // Błąd weryfikacji reCAPTCHA
    echo json_encode(value: ['success' => false, 'message' => 'Błąd weryfikacji reCAPTCHA.']);
}
?>