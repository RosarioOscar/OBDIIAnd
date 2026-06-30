//Local library of standard OBD2 PIDs and their logic


export const PID_LIBRARY = {
    // -------------------------------------------------------------------------
    // SUPPORTED PIDS (Bitmask)
    // -------------------------------------------------------------------------
    "00": {
        name: "PIDs Supported [01 - 20]",
        PID: "0100",
        shortName: "SUPPORTED_PIDS_01_20",
        unit: "Bitmask",
        formula: "Bit Encoded",
        minValue: null,
        maxValue: null,
        parse: (bytes) => bytes // Logic handled by your discovery function
    },

    // -------------------------------------------------------------------------
    // DIAGNOSTIC STATUS
    // -------------------------------------------------------------------------
    "01": {
        name: "Monitor Status since DTCs Cleared",
        PID: "0101",
        shortName: "MONITOR_STATUS",
        unit: "Bit Encoded",
        formula: "Bit Encoded",
        minValue: null,
        maxValue: null,
        parse: (bytes) => ({
            milOn: !!(bytes[0] & 0x80), 
            dtcCount: bytes[0] & 0x7F,
            // Additional bytes B, C, D contain test readiness
        })
    },

    "02": {
        name: "Freeze Frame DTC",
        PID: "0102",
        shortName: "FREEZE_DTC",
        unit: "Code",
        formula: "Hex Decoding",
        minValue: null,
        maxValue: null,
        parse: (bytes) => {
            const A = bytes[0];
            const B = bytes[1];
            const chars = ["P", "C", "B", "U"];
            const firstChar = chars[A >> 6]; // Top 2 bits
            // Combine remaining bits of A and all of B
            const raw = ((A & 0x3F) << 8) | B; 
            const hex = raw.toString(16).toUpperCase().padStart(4, '0');
            return firstChar + hex;
        }
    },

    "03": {
        name: "Fuel System Status",
        PID: "0103",
        shortName: "FUEL_SYS_STATUS",
        unit: "Status",
        formula: "Bit Encoded",
        minValue: null,
        maxValue: null,
        parse: (bytes) => {
            const A = bytes[0];
            const statusMap = {
                1: "Open Loop (Cold)",
                2: "Closed Loop",
                4: "Open Loop (Driving)",
                8: "Open Loop (Fault)",
                16: "Closed Loop (Fault)"
            };
            return statusMap[A] || "Unknown";
        }
    },

    // -------------------------------------------------------------------------
    // ENGINE LOAD & TEMP
    // -------------------------------------------------------------------------
    "04": {
        name: "Calculated Engine Load",
        PID: "0104",
        shortName: "ENGINE_LOAD",
        unit: "%",
        formula: "A / 2.55",
        minValue: 0,
        maxValue: 100,
        parse: (bytes) => (bytes[0] / 2.55).toFixed(1),
        priority: 8
    },

    "05": {
        name: "Engine Coolant Temperature",
        PID: "0105",
        shortName: "COOLANT_TEMP",
        unit: "°C",
        formula: "A - 40",
        minValue: -40,
        maxValue: 215,
        parse: (bytes) => bytes[0] - 40,
        priority: 7,
    },

    // -------------------------------------------------------------------------
    // FUEL TRIMS (Short/Long Term)
    // -------------------------------------------------------------------------
    "06": {
        name: "Short Term Fuel Trim - Bank 1",
        PID: "0106",
        shortName: "STFT_B1",
        unit: "%",
        formula: "(A - 128) * 100/128",
        minValue: -100,
        maxValue: 99.2,
        parse: (bytes) => ((bytes[0] - 128) * 100 / 128).toFixed(1)
    },

    "07": {
        name: "Long Term Fuel Trim - Bank 1",
        PID: "0107",
        shortName: "LTFT_B1",
        unit: "%",
        formula: "(A - 128) * 100/128",
        minValue: -100,
        maxValue: 99.2,
        parse: (bytes) => ((bytes[0] - 128) * 100 / 128).toFixed(1)
    },

    "08": {
        name: "Short Term Fuel Trim - Bank 2",
        PID: "0108",
        shortName: "STFT_B2",
        unit: "%",
        formula: "(A - 128) * 100/128",
        minValue: -100,
        maxValue: 99.2,
        parse: (bytes) => ((bytes[0] - 128) * 100 / 128).toFixed(1)
    },

    "09": {
        name: "Long Term Fuel Trim - Bank 2",
        PID: "0109",
        shortName: "LTFT_B2",
        unit: "%",
        formula: "(A - 128) * 100/128",
        minValue: -100,
        maxValue: 99.2,
        parse: (bytes) => ((bytes[0] - 128) * 100 / 128).toFixed(1)
    },

    // -------------------------------------------------------------------------
    // PRESSURE & RPM
    // -------------------------------------------------------------------------
    "0A": {
        name: "Fuel Pressure",
        PID: "010A",
        shortName: "FUEL_PRESSURE",
        unit: "kPa",
        formula: "3 * A",
        minValue: 0,
        maxValue: 765,
        parse: (bytes) => bytes[0] * 3
    },

    "0B": {
        name: "Intake Manifold Absolute Pressure",
        PID: "010B",
        shortName: "MAP_PRESSURE",
        unit: "kPa",
        formula: "A",
        minValue: 0,
        maxValue: 255,
        parse: (bytes) => bytes[0]
    },

    "0C": {
        name: "Engine RPM",
        PID: "010C",
        shortName: "ENGINE_RPM",
        unit: "rpm",
        formula: "((A * 256) + B) / 4",
        minValue: 0,
        maxValue: 16383.75,
        parse: (bytes) => ((bytes[0] * 256) + bytes[1]) / 4,
        priority: 2,
    },

    "0D": {
        name: "Vehicle Speed",
        PID: "010D",
        shortName: "VEHICLE_SPEED",
        unit: "km/h",
        formula: "A",
        minValue: 0,
        maxValue: 255,
        parse: (bytes) => bytes[0],
        priority: 1
    },

    "0E": {
        name: "Timing Advance (Cyl 1)",
        PID: "010E",
        shortName: "TIMING_ADVANCE",
        unit: "°",
        formula: "(A / 2) - 64",
        minValue: -64,
        maxValue: 63.5,
        parse: (bytes) => ((bytes[0] / 2) - 64).toFixed(1),
        priority: 4
    },

    "0F": {
        name: "Intake Air Temperature",
        PID: "010F",
        shortName: "INTAKE_TEMP",
        unit: "°C",
        formula: "A - 40",
        minValue: -40,
        maxValue: 215,
        parse: (bytes) => bytes[0] - 40,
        priority: 5,

    },

    "10": {
        name: "Mass Air Flow Rate",
        PID: "0110",
        shortName: "MAF_RATE",
        unit: "g/s",
        formula: "((A * 256) + B) / 100",
        minValue: 0,
        maxValue: 655.35,
        parse: (bytes) => (((bytes[0] * 256) + bytes[1]) / 100).toFixed(2),
        priority: 3,
    },

    "11": {
        name: "Throttle Position",
        PID: "0111",
        shortName: "THROTTLE_POS",
        unit: "%",
        formula: "A * 100 / 255",
        minValue: 0,
        maxValue: 100,
        parse: (bytes) => ((bytes[0] * 100) / 255).toFixed(1),
        priority: 9,
    },

    "12": {
        name: "Commanded Secondary Air Status",
        PID: "0112",
        shortName: "SEC_AIR_STATUS",
        unit: "Bit Encoded",
        formula: "Bit Encoded",
        minValue: null,
        maxValue: null,
        parse: (bytes) => bytes[0] // Typically bitmask logic
    },

    "13": {
        name: "Oxygen Sensors Present",
        PID: "0113",
        shortName: "O2_SENSORS",
        unit: "Bitmask",
        formula: "A0..A7",
        minValue: null,
        maxValue: null,
        parse: (bytes) => bytes[0] // Use this to determine which 14-1B PIDs to call
    },

    // -------------------------------------------------------------------------
    // OXYGEN SENSORS (Voltage & Trim)
    // -------------------------------------------------------------------------
    // Note: These PIDs return TWO values.
    // A: Voltage (0-1.275V)
    // B: Short Term Fuel Trim (-100% to +99.2%)
    
    "14": {
        name: "Oxygen Sensor 1 - Bank 1",
        PID: "0114",
        shortName: "O2_B1S1",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "15": {
        name: "Oxygen Sensor 2 - Bank 1",
        PID: "0115",
        shortName: "O2_B1S2",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "16": {
        name: "Oxygen Sensor 3 - Bank 1",
        PID: "0116",
        shortName: "O2_B1S3",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "17": {
        name: "Oxygen Sensor 4 - Bank 1",
        PID: "0117",
        shortName: "O2_B1S4",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "18": {
        name: "Oxygen Sensor 1 - Bank 2",
        PID: "0118",
        shortName: "O2_B2S1",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "19": {
        name: "Oxygen Sensor 2 - Bank 2",
        PID: "0119",
        shortName: "O2_B2S2",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "1A": {
        name: "Oxygen Sensor 3 - Bank 2",
        PID: "011A",
        shortName: "O2_B2S3",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "1B": {
        name: "Oxygen Sensor 4 - Bank 2",
        PID: "011B",
        shortName: "O2_B2S4",
        unit: "V",
        formula: "A/200",
        minValue: 0,
        maxValue: 1.275,
        parse: (bytes) => ({
            voltage: (bytes[0] / 200).toFixed(3),
            trim: bytes[1] !== 0xFF ? ((bytes[1] / 1.28) - 100).toFixed(1) : "N/A"
        })
    },

    "1C": {
        name: "OBD Standards",
        PID: "011C",
        shortName: "OBD_STD",
        unit: "Type",
        formula: "Lookup",
        minValue: null,
        maxValue: null,
        parse: (bytes) => {
            const types = { 1: "OBD-II (CARB)", 2: "OBD (EPA)", 6: "EOBD" };
            return types[bytes[0]] || "Unknown";
        }
    },

    "1F": {
        name: "Run Time Since Engine Start",
        PID: "011F",
        shortName: "RUN_TIME",
        unit: "Seconds",
        formula: "(A * 256) + B",
        minValue: 0,
        maxValue: 65535,
        parse: (bytes) => (bytes[0] * 256) + bytes[1]
    },

    // -------------------------------------------------------------------------
    // NEXT BLOCK SUPPORT
    // -------------------------------------------------------------------------
    "20": {
        name: "PIDs Supported [21 - 40]",
        PID: "0120",
        shortName: "SUPPORTED_PIDS_21_40",
        unit: "Bitmask",
        formula: "Bit Encoded",
        minValue: null,
        maxValue: null,
        parse: (bytes) => bytes // Logic handled by your discovery function
    }
};

export const PID_PRIORITY = ["0C", "0D", "0E", "0F", "10", "04", "05", "06", "07"]