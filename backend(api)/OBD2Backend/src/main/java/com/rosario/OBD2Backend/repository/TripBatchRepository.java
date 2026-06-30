package com.rosario.OBD2Backend.repository;

import com.rosario.OBD2Backend.model.TripBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripBatchRepository extends JpaRepository<TripBatch, Long> {
}