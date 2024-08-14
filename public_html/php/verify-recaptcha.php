<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recaptcha_secret = '6LeTFCAqAAAAAL0kZ98HDceJdvN0_6GImtVvfMjg';
    $recaptcha_response = $_POST['g-recaptcha-response'];

    // Weryfikacja tokena reCAPTCHA
    $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
    $response_keys = json_decode($response, true);

    if (intval($response_keys["success"]) !== 1) {
        echo json_encode(["success" => false, "message" => "Weryfikacja reCAPTCHA nie powiodła się."]);
        return;
    }

    // Jeśli weryfikacja reCAPTCHA jest pomyślna, kontynuuj przetwarzanie formularza
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $name = $_POST['name'];
    $message = $_POST['message'];

    // Generate a unique ID for the submission
    $uniqueID = time() . "-" . rand(100000, 999999);

    // Formspree URL
    $formspreeUrl = "https://formspree.io/f/manwqoep";

    // Prepare data for Formspree submission
    $formspreeData = http_build_query([
        'id' => $uniqueID,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'message' => $message,
    ]);

    // Send data to Formspree
    $formspreeOptions = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => $formspreeData,
        ],
    ];
    $formspreeContext  = stream_context_create($formspreeOptions);
    $formspreeResult = file_get_contents($formspreeUrl, false, $formspreeContext);

    // Airtable API settings
    $airtablePersonalAccessToken = "patmmJVUgqZQmCvW3.b591c3a621807ac2d784c5c8afbff6612af7c0d2624e6131df6c0e3946dea5af"; // Your Airtable Personal Access Token
    $airtableBaseId = "appx76Q9YSMyuLxYF"; // Your Airtable Base ID
    $airtableTableName = "Submissions"; // Your Airtable table name
    $airtableUrl = "https://api.airtable.com/v0/{$airtableBaseId}/{$airtableTableName}";

    // Prepare data for Airtable submission
    $airtableData = json_encode([
        'fields' => [
            'id' => $uniqueID,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'message' => $message,
        ],
    ]);

    // Send data to Airtable
    $airtableOptions = [
        'http' => [
            'header'  => "Authorization: Bearer {$airtablePersonalAccessToken}\r\nContent-Type: application/json\r\n",
            'method'  => 'POST',
            'content' => $airtableData,
        ],
    ];
    $airtableContext  = stream_context_create($airtableOptions);
    $airtableResult = file_get_contents($airtableUrl, false, $airtableContext);

    echo json_encode(["success" => true, "message" => "Formularz został pomyślnie wysłany."]);
}
?>
