package com.rosario.OBD2Backend.controller;

import com.rosario.OBD2Backend.model.VehicleProfile;
import com.rosario.OBD2Backend.repository.VehicleProfileRepository;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleProfileRepository repository;

    public VehicleController(VehicleProfileRepository repository) {
        this.repository = repository;
    }

    // Endpoint to catch data from React Native
    @PostMapping("/profile")
    public VehicleProfile createProfile(@RequestBody VehicleProfile profile) {
        profile.setProfileCreatedAt(LocalDateTime.now());
        return repository.save(profile);
    }

    // Endpoint to quickly view all saved vehicles in your browser
    @GetMapping
    public List<VehicleProfile> getAllProfiles() {
        return repository.findAll();
    }
}