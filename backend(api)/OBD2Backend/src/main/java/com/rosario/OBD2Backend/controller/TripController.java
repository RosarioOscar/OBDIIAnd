package com.rosario.OBD2Backend.controller;

import com.rosario.OBD2Backend.model.TripBatch;
import com.rosario.OBD2Backend.repository.TripBatchRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripBatchRepository repository;

    public TripController(TripBatchRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/batch")
    public TripBatch saveTripBatch(@RequestBody TripBatch tripBatch) {
        tripBatch.setUploadTime(LocalDateTime.now());

        return repository.save(tripBatch);
    }

    @GetMapping
    public List<TripBatch> getAllTrips() {
        return repository.findAll();
    }
}