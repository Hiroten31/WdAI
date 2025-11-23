package com.storyforge.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/users")
public class UserController {

	// Tymczasowe dane, zeby nie stawiac calej bazy.
	private final Map<Integer, Map<String, Object>> users = new HashMap<>() {{
        put(1, Map.of("id", 1, "username", "hiro", "email", "hiro@example.com", "role", "admin"));
        put(2, Map.of("id", 2, "username", "anna", "email", "anna@example.com", "role", "user"));
    }};

	@GetMapping
    public ResponseEntity<Object> getUsers() {
        return ResponseEntity.ok(users.values());
    }

	@GetMapping("/{id}")
	public ResponseEntity<Object> getUserById(@PathVariable int id) {
    	if (!users.containsKey(id)) {
        	return ResponseEntity.status(404).body(
            	Map.of("error", "User not found")
        	);
    	}
    	return ResponseEntity.ok(users.get(id));
	}

	@GetMapping("/validate/{id}")
	public ResponseEntity<Object> validateId(@PathVariable String id) {
    	if (!id.matches("\\d+")) {
        	return ResponseEntity.badRequest().body(
            	Map.of("error", "Invalid ID format")
        	);
    	}
    	return ResponseEntity.ok(Map.of("message", "Valid ID"));
	}

}
