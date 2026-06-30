# AutoLog: Real-Time Vehicle Diagnostics & Telemetry

https://github.com/user-attachments/assets/9b6d00ea-90f6-497b-9589-3c37b115d203

AutoLog is a full-stack telemetry and diagnostic application that interfaces directly with vehicle Engine Control Units (ECUs) via standard OBD-II protocols. It bypasses the standard JavaScript bridge to render high-frequency hardware data into 60fps interactive graphs, backed by a robust API for historical tracking and VIN decoding.

Engineered and tested on a 2002 Lexus GS300 (Inline-6) using an ELM327 Bluetooth serial adapter (VEEPEAK Bluetooth Low Energy)

## ⚙️ Architecture & Stack

This repository is structured as a full-stack monorepo.

| Environment | Technology | Primary Purpose |
|---|---|---|
| **Frontend** | React Native | Cross-platform mobile client |
| **Graphics** | React Native Skia & Reanimated | UI-thread isolated 60fps telemetry graphing |
| **Hardware** | react-native-ble-plx | Asynchronous GATT Bluetooth socket management |
| **Backend** | Java & Spring Boot | RESTful API and NHTSA data fetching |
| **Database** | PostgreSQL | Persistent vehicle and diagnostic storage |

---

##  Core Engineering Features

*   **Native-Thread UI Rendering:** Utilizes `@shopify/react-native-skia` and `react-native-reanimated` `useSharedValue` to calculate and render dynamic SVG paths entirely on the native UI thread, preventing frame drops during high-frequency Bluetooth polling.
*   **Asynchronous Hardware Polling:** Implements a custom BLE loop that translates raw hex responses (e.g., `410C`) into human-readable SAE standard integers, while managing strict 100ms timeout windows to prevent ELM327 buffer overflows.
*   **Automated VIN Decoding:** (In Progress) Spring Boot `RestTemplate` integration with the NHTSA API to automatically fetch and persist specific OEM vehicle parameters based on the connected ECU.
*   **GATT Socket Management:** Handles Android OS-level Bluetooth quirks, including custom MTU buffer aggregation, connection delays, and asynchronous cleanup to prevent zombie sockets and memory leaks.

---

##  Future Roadmap

1. **NHTSA API & VIN Decoding:** Finalize the Spring Boot `RestTemplate` endpoint to automatically fetch, parse, and persist OEM vehicle specifications based on the connected ECU's VIN.
2. **Hardware & Database Optimization:** Transition historical telemetry storage to TimescaleDB for time-series efficiency, and implement dynamic Bluetooth polling rates based on negotiated adapter baud rates.
3. **Cross-Platform Ecosystem Expansion:** Bridge the existing React Native architecture to support native iOS BLE modules, and build out a web-based dashboard for desktop data review.
4. **Predictive Maintenance Scheduling:** Implement a local mileage tracking engine that cross-references live odometer data with OEM service intervals to trigger automated maintenance push notifications.
5. **AI-Assisted Diagnostic Engine:** Route captured OBD-II freeze-frame data and historical fuel trim (STFT/LTFT) telemetry through an LLM to provide users with probabilistic mechanical fault diagnoses (e.g., identifying vacuum leaks vs. faulty MAF sensors).
## Local Setup & Installation

Because this is a monorepo, the mobile app and the backend server are run independently. 

### 1. Starting the Mobile Client (Frontend)

Navigate to the frontend directory and install the necessary dependencies. Note: A physical Android device is required to test Bluetooth functionality; the iOS simulator does not support hardware BLE emulation.

```bash
cd frontend/OBD2And
npm install
npx expo start --clear
