package com.rosario.OBD2Backend;

// 1. Fixed: Now correctly pointing to the 'model' folder

import com.rosario.OBD2Backend.model.TripBatch;
import com.rosario.OBD2Backend.model.VehicleProfile;
import com.rosario.OBD2Backend.repository.TripBatchRepository;
import com.rosario.OBD2Backend.repository.VehicleProfileRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class Obd2BackendApplicationTests {

    @Autowired
    private TripBatchRepository tripRepository;

    @Autowired
    private VehicleProfileRepository profileRepository;

    @Test
    void contextLoads() {
    }

    @Test
    void testDatabaseConnectionAndSaveTrip() {
        TripBatch testBatch = new TripBatch();
        testBatch.setVehicleId("2002_Lexus_GS300");
        testBatch.setUploadTime(LocalDateTime.now());
        testBatch.setTelemetryPayload("[{\"rpm\": 2450, \"speed_mph\": 65, \"coolant_temp_c\": 88}]");

        TripBatch savedBatch = tripRepository.save(testBatch);

        // 3. Fixed: Removed "Assertions." because of our static imports above!
        assertNotNull(savedBatch.getId(), "The database should have generated an ID!");
        assertEquals("2002_Lexus_GS300", savedBatch.getVehicleId());

        System.out.println("SUCCESS! Saved test TRIP batch to PostgreSQL with ID: " + savedBatch.getId());
    }

    @Test
    void testCreateVehicleProfile() {
        VehicleProfile newProfile = new VehicleProfile();

        newProfile.setUserId("test_user_999");
        newProfile.setVin("JT8BD38S5200XXXXX");
        newProfile.setMake("Lexus");
        newProfile.setModel("GS300");
        newProfile.setProfileCreatedAt(LocalDateTime.now());
        newProfile.setSupportedPids("[\"0C\", \"0D\", \"0F\", \"11\"]");

        VehicleProfile savedProfile = profileRepository.save(newProfile);

        // Fixed: Removed "Assertions." here too
        assertNotNull(savedProfile.getId(), "Profile ID should have been generated!");
        assertEquals("Lexus", savedProfile.getMake());

        System.out.println("SUCCESS! Saved new VEHICLE PROFILE for test_user_999 with ID: " + savedProfile.getId());
    }
}