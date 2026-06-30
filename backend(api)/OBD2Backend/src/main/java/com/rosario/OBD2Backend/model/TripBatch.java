package com.rosario.OBD2Backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trip_batches")
public class TripBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleId;
    private LocalDateTime uploadTime;

    @Column(columnDefinition = "TEXT")
    private String telemetryPayload;

    public TripBatch() {}

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public LocalDateTime getUploadTime() {
        return uploadTime;
    }

    public void setUploadTime(LocalDateTime uploadTime) {
        this.uploadTime = uploadTime;
    }

    public String getTelemetryPayload() {
        return telemetryPayload;
    }

    public void setTelemetryPayload(String telemetryPayload) {
        this.telemetryPayload = telemetryPayload;
    }
}