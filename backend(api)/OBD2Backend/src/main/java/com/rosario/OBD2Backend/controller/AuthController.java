package com.rosario.OBD2Backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> mockLogin(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();

        // Extract the credentials from the React Native payload
        String email = credentials.get("email");
        String password = credentials.get("password");

        // The Strict Authorization Gate
        if ("testuser1234@gmail.com".equals(email) && "1234".equals(password)) {
            response.put("token", "mock-jwt-secret-token-777");
            response.put("userId", "101");
            response.put("message", "Authentication successful");

            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid credentials. Access denied.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}