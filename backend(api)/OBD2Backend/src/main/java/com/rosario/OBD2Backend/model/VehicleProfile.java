package com.rosario.OBD2Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_profiles")
public class VehicleProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // A generic string we will pass from React Native for testing
    private String userId;

    private String vin;
    private String make;
    private String model;

    @Column(columnDefinition = "TEXT")
    private String supportedPids;

    private LocalDateTime profileCreatedAt;

    public VehicleProfile() {}

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSupportedPids() { return supportedPids; }
    public void setSupportedPids(String supportedPids) { this.supportedPids = supportedPids; }

    public LocalDateTime getProfileCreatedAt() { return profileCreatedAt; }
    public void setProfileCreatedAt(LocalDateTime profileCreatedAt) { this.profileCreatedAt = profileCreatedAt; }
}