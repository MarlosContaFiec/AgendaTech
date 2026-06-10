<?php

define('API_URL', 'http://localhost:3000/api');

function apiRequest($endpoint, $method = 'GET', $data = null)
{
    $token = $_SESSION['token'] ?? null;

    $ch = curl_init(API_URL . $endpoint);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $headers = [
        'Content-Type: application/json'
    ];

    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if ($method !== 'GET') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

        if ($data) {
            curl_setopt(
                $ch,
                CURLOPT_POSTFIELDS,
                json_encode($data)
            );
        }
    }

    $response = curl_exec($ch);

    curl_close($ch);

    return json_decode($response, true);
}