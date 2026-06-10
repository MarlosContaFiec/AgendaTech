<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('API_URL', 'http://localhost:3000/api');

function apiRequest(
    string $endpoint,
    string $method = 'GET',
    ?array $data = null
) {
    $token = $_SESSION['token'] ?? null;

    $ch = curl_init(API_URL . $endpoint);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30
    ]);

    $headers = [
        'Content-Type: application/json',
        'Accept: application/json'
    ];

    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    curl_setopt(
        $ch,
        CURLOPT_HTTPHEADER,
        $headers
    );

    if ($method !== 'GET') {

        curl_setopt(
            $ch,
            CURLOPT_CUSTOMREQUEST,
            strtoupper($method)
        );

        if ($data !== null) {

            curl_setopt(
                $ch,
                CURLOPT_POSTFIELDS,
                json_encode($data)
            );
        }
    }

    $response = curl_exec($ch);

    if (curl_errno($ch)) {

        curl_close($ch);

        return [
            'success' => false,
            'message' => curl_error($ch)
        ];
    }

    $httpCode =
        curl_getinfo(
            $ch,
            CURLINFO_HTTP_CODE
        );

    curl_close($ch);

    $decoded =
        json_decode(
            $response,
            true
        );

    return [
        'status' => $httpCode,
        'data' => $decoded
    ];
}