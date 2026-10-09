package com.google.ar.core.examples.kotlin.helloar.campus

import java.util.UUID

/**
 * In-memory & pre-populated catalogue of Campus Buildings, Floors, Facilities, and QR checkpoints.
 * Operates behind a clean repository interface so remote backends can be connected without breaking UI.
 */
class CampusCatalogueRepository {

  private val _campuses = mutableListOf<Campus>()
  private val _destinations = mutableListOf<CampusDestination>()
  private val _checkpoints = mutableListOf<QrCheckpoint>()

  init {
    loadDefaultCampusData()
  }

  fun getCampus(): Campus = _campuses.firstOrNull() ?: defaultCampus()

  fun getBuildings(): List<Building> = getCampus().buildings

  fun getBuilding(buildingId: String): Building? =
    getBuildings().firstOrNull { it.id == buildingId }

  fun getFloors(buildingId: String): List<Floor> =
    getBuilding(buildingId)?.floors ?: emptyList()

  fun getAllDestinations(): List<CampusDestination> = _destinations.toList()

  fun getDestinationsForFloor(buildingId: String, floorNumber: Int): List<CampusDestination> =
    _destinations.filter { it.buildingId == buildingId && it.floorNumber == floorNumber }

  fun getDestination(destinationId: String): CampusDestination? =
    _destinations.firstOrNull { it.id == destinationId }

  fun findDestinationByWaypointId(waypointId: String): CampusDestination? =
    _destinations.firstOrNull { it.waypointId == waypointId }

  fun findCheckpointByQr(payload: String): QrCheckpoint? {
    val clean = payload.trim()
    return _checkpoints.firstOrNull { it.payload.equals(clean, ignoreCase = true) || it.id.equals(clean, ignoreCase = true) }
  }

  fun searchDestinations(query: String, category: DestinationCategory? = null, buildingId: String? = null): List<CampusDestination> {
    val q = query.trim().lowercase()
    return _destinations.filter { dest ->
      val matchesQuery = q.isEmpty() ||
        dest.name.lowercase().contains(q) ||
        dest.code.lowercase().contains(q) ||
        dest.roomNumber.lowercase().contains(q) ||
        dest.description.lowercase().contains(q) ||
        dest.keywords.any { it.lowercase().contains(q) }

      val matchesCategory = category == null || dest.category == category
      val matchesBuilding = buildingId == null || dest.buildingId == buildingId

      matchesQuery && matchesCategory && matchesBuilding
    }
  }

  fun registerDestination(destination: CampusDestination) {
    _destinations.removeAll { it.id == destination.id }
    _destinations.add(destination)
  }

  fun registerCheckpoint(checkpoint: QrCheckpoint) {
    _checkpoints.removeAll { it.id == checkpoint.id }
    _checkpoints.add(checkpoint)
  }

  private fun defaultCampus(): Campus {
    val mainBuildingFloors = listOf(
      Floor("b1_f0", "main_academic", 0, "Ground Floor", "Admin, Main Entrance, Auditorium & Cafe"),
      Floor("b1_f1", "main_academic", 1, "First Floor", "Computer Science, Electronics Labs & Classrooms"),
      Floor("b1_f2", "main_academic", 2, "Second Floor", "Mechanical, Civil Dept & Seminar Halls"),
    )

    val techWingFloors = listOf(
      Floor("b2_f0", "tech_wing", 0, "Ground Floor", "Robotics Lab & Innovation Center"),
      Floor("b2_f1", "tech_wing", 1, "First Floor", "AI Research Lab & Library"),
    )

    val mainBuilding = Building(
      id = "main_academic",
      name = "Main Academic Block",
      code = "MAB",
      description = "Administrative offices, central auditoriums, and core engineering classrooms.",
      centerGps = GpsCoordinate(13.0827, 80.2707, 10.0, 5.0f),
      floors = mainBuildingFloors,
    )

    val techWing = Building(
      id = "tech_wing",
      name = "Science & Tech Complex",
      code = "STC",
      description = "Advanced computing labs, robotics workspace, and research library.",
      centerGps = GpsCoordinate(13.0832, 80.2712, 10.0, 5.0f),
      floors = techWingFloors,
    )

    return Campus(
      id = "campus_main",
      name = "Smart University Campus",
      code = "SUC",
      description = "Main Engineering & Technology Campus",
      centerGps = GpsCoordinate(13.0829, 80.2709, 10.0, 5.0f),
      buildings = listOf(mainBuilding, techWing),
    )
  }

  private fun loadDefaultCampusData() {
    val campus = defaultCampus()
    _campuses.clear()
    _campuses.add(campus)

    _destinations.clear()
    _destinations.addAll(
      listOf(
        // Ground Floor - Main Block
        CampusDestination(
          id = "dest_main_entrance",
          name = "Main Campus Entrance",
          code = "GATE-01",
          category = DestinationCategory.ENTRANCE,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "G-00",
          description = "Front security gate and visitor reception",
          keywords = listOf("gate", "entrance", "reception", "entry", "exit", "front"),
          qrCodePayload = "CAMPUS:MAIN:G:ENTRANCE",
        ),
        CampusDestination(
          id = "dest_admin_office",
          name = "Dean & Administrative Office",
          code = "ADM-100",
          category = DestinationCategory.FACULTY_OFFICE,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "G-01",
          description = "Student affairs, accounts, and Dean of Academics",
          keywords = listOf("dean", "admin", "office", "principal", "fees", "accounts"),
          qrCodePayload = "CAMPUS:MAIN:G:ADMIN",
        ),
        CampusDestination(
          id = "dest_auditorium",
          name = "Grand Seminar Hall / Auditorium",
          code = "AUD-G",
          category = DestinationCategory.SEMINAR_HALL,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "G-10",
          description = "500-seat main auditorium for conferences and events",
          keywords = listOf("hall", "auditorium", "seminar", "events", "stage"),
          qrCodePayload = "CAMPUS:MAIN:G:AUD",
        ),
        CampusDestination(
          id = "dest_canteen",
          name = "Central Cafeteria & Canteen",
          code = "CAN-01",
          category = DestinationCategory.CANTEEN,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "G-CAFE",
          description = "Student cafeteria, dining area, and refreshments",
          keywords = listOf("food", "cafe", "canteen", "lunch", "snacks", "coffee"),
          qrCodePayload = "CAMPUS:MAIN:G:CAFE",
        ),
        CampusDestination(
          id = "dest_stairs_g_to_1",
          name = "Central Staircase (to 1st Floor)",
          code = "STR-G1",
          category = DestinationCategory.STAIRCASE,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "STR-01",
          description = "Direct stairs connecting Ground Floor to 1st and 2nd Floors",
          keywords = listOf("stairs", "staircase", "steps", "climb"),
          qrCodePayload = "CAMPUS:MAIN:G:STAIRS",
        ),
        CampusDestination(
          id = "dest_elevator_main",
          name = "Main Passenger Lift",
          code = "LFT-01",
          category = DestinationCategory.ELEVATOR,
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          roomNumber = "LFT-01",
          description = "Accessible elevator to all floors",
          keywords = listOf("lift", "elevator", "accessible", "wheelchair"),
          qrCodePayload = "CAMPUS:MAIN:G:LIFT",
        ),

        // 1st Floor - Main Block
        CampusDestination(
          id = "dest_cs_lab1",
          name = "Computer Science Laboratory 1",
          code = "CS-LAB1",
          category = DestinationCategory.LABORATORY,
          buildingId = "main_academic",
          floorId = "b1_f1",
          floorNumber = 1,
          roomNumber = "101",
          description = "High-performance workstations for AI and Cloud Computing",
          keywords = listOf("cs", "computer", "lab", "coding", "software", "101"),
          qrCodePayload = "CAMPUS:MAIN:1:CSLAB1",
        ),
        CampusDestination(
          id = "dest_room102",
          name = "Lecture Hall 102",
          code = "LH-102",
          category = DestinationCategory.CLASSROOM,
          buildingId = "main_academic",
          floorId = "b1_f1",
          floorNumber = 1,
          roomNumber = "102",
          description = "Smart Classroom equipped with 4K projector and audio",
          keywords = listOf("class", "classroom", "102", "lecture", "hall"),
          qrCodePayload = "CAMPUS:MAIN:1:102",
        ),
        CampusDestination(
          id = "dest_room103",
          name = "Lecture Hall 103",
          code = "LH-103",
          category = DestinationCategory.CLASSROOM,
          buildingId = "main_academic",
          floorId = "b1_f1",
          floorNumber = 1,
          roomNumber = "103",
          description = "Department lecture room",
          keywords = listOf("class", "classroom", "103", "lecture"),
          qrCodePayload = "CAMPUS:MAIN:1:103",
        ),
        CampusDestination(
          id = "dest_faculty_cs",
          name = "Faculty Rooms - Computer Science",
          code = "FAC-CS",
          category = DestinationCategory.FACULTY_OFFICE,
          buildingId = "main_academic",
          floorId = "b1_f1",
          floorNumber = 1,
          roomNumber = "105",
          description = "Professors and lecturers cabins",
          keywords = listOf("staff", "faculty", "prof", "hod", "cs", "office"),
          qrCodePayload = "CAMPUS:MAIN:1:FAC",
        ),

        // Tech Wing
        CampusDestination(
          id = "dest_library",
          name = "Central Digital Library",
          code = "LIB-01",
          category = DestinationCategory.LIBRARY,
          buildingId = "tech_wing",
          floorId = "b2_f1",
          floorNumber = 1,
          roomNumber = "LIB-200",
          description = "Books, digital journals, reading hall, and quiet study zones",
          keywords = listOf("library", "books", "study", "reading", "journals"),
          qrCodePayload = "CAMPUS:TECH:1:LIB",
        ),
        CampusDestination(
          id = "dest_robotics_lab",
          name = "Robotics & IoT Innovation Lab",
          code = "ROB-LAB",
          category = DestinationCategory.LABORATORY,
          buildingId = "tech_wing",
          floorId = "b2_f0",
          floorNumber = 0,
          roomNumber = "G-22",
          description = "Makerspace, 3D printers, and robotics development",
          keywords = listOf("robot", "robotics", "iot", "makerspace", "hardware", "lab"),
          qrCodePayload = "CAMPUS:TECH:0:ROBOTICS",
        ),
      )
    )

    _checkpoints.clear()
    _checkpoints.addAll(
      listOf(
        QrCheckpoint(
          id = "CP-G-01",
          payload = "CAMPUS:MAIN:G:ENTRANCE",
          name = "Main Entrance Pillar QR",
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          localX = 0.0f,
          localY = 0.0f,
          localZ = 0.0f,
          headingDegrees = 0f,
          description = "Mounted on entrance pillar A1",
        ),
        QrCheckpoint(
          id = "CP-1-01",
          payload = "CAMPUS:MAIN:1:CSLAB1",
          name = "CS Lab 1 Entrance QR",
          buildingId = "main_academic",
          floorId = "b1_f1",
          floorNumber = 1,
          localX = 12.5f,
          localY = 3.2f,
          localZ = -8.0f,
          headingDegrees = 90f,
          description = "Door frame of Room 101",
        ),
        QrCheckpoint(
          id = "CP-G-CAFE",
          payload = "CAMPUS:MAIN:G:CAFE",
          name = "Canteen Gate QR",
          buildingId = "main_academic",
          floorId = "b1_f0",
          floorNumber = 0,
          localX = -15.0f,
          localY = 0.0f,
          localZ = -22.0f,
          headingDegrees = 180f,
          description = "Next to cafeteria counter",
        ),
        QrCheckpoint(
          id = "CP-LIB-01",
          payload = "CAMPUS:TECH:1:LIB",
          name = "Library Turnstile QR",
          buildingId = "tech_wing",
          floorId = "b2_f1",
          floorNumber = 1,
          localX = 5.0f,
          localY = 3.5f,
          localZ = 14.0f,
          headingDegrees = 270f,
          description = "Library check-in desk",
        ),
      )
    )
  }
}
