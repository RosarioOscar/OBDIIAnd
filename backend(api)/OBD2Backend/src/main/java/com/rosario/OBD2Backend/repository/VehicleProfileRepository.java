package com.rosario.OBD2Backend.repository;

import com.rosario.OBD2Backend.model.VehicleProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleProfileRepository extends JpaRepository<VehicleProfile, Long> {

    // Finds all vehicles belonging to our test user
    List<VehicleProfile> findByUserId(String userId);
}