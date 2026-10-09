package com.google.ar.core.examples.kotlin.helloar.campus

import java.util.UUID

/**
 * Coordinate models and spatial structures for Smart Campus Navigation.
 * Indoor local coordinates are kept separate from outdoor GPS coordinates.
 */

data class GpsCoordinate(
  val latitude: Double,
  val longitude: Double,
  val altitude: Double = 0.0,
  val accuracyMeters: Float = 0f,
  val timestampMs: Long = System.currentTimeMillis(),
)

enum class PositionSource(val label: String) {
  AR_TRACKING("AR Visual Odometry"),
  QR_CHECKPOINT("QR Checkpoint"),
  OUTDOOR_GPS("Outdoor GPS"),
  MANUAL_SELECTION("Manual Selection"),
}

data class CampusLocation(
  val campusId: String = "default_campus",
  val buildingId: String? = null,
  val floorId: String? = null,
  val floorNumber: Int = 0,
  val localX: Float = 0f,
  val localY: Float = 0f,
  val localZ: Float = 0f,
  val gpsCoordinate: GpsCoordinate? = null,
  val source: PositionSource = PositionSource.MANUAL_SELECTION,
  val confidence: Float = 1.0f,
  val lastUpdatedMs: Long = System.currentTimeMillis(),
)

enum class DestinationCategory(val displayName: String, val iconName: String) {
  CLASSROOM("Classroom", "school"),
  LABORATORY("Laboratory", "science"),
  LIBRARY("Library", "local_library"),
  FACULTY_OFFICE("Faculty / Admin Office", "badge"),
  CANTEEN("Canteen / Cafeteria", "restaurant"),
  SEMINAR_HALL("Auditorium / Seminar Hall", "theater_comedy"),
  RESTROOM("Restroom", "wc"),
  ENTRANCE("Campus Entrance / Exit", "meeting_room"),
  STAIRCASE("Stairs", "stairs"),
  ELEVATOR("Elevator", "elevator"),
  OTHER("Facility", "place"),
}

data class Campus(
  val id: String = "campus_main",
  val name: String,
  val code: String,
  val description: String = "",
  val centerGps: GpsCoordinate? = null,
  val buildings: List<Building> = emptyList(),
)

data class Floor(
  val id: String,
  val buildingId: String,
  val floorNumber: Int,
  val name: String,
  val description: String = "",
  val planAssetPath: String? = null,
)

data class Building(
  val id: String,
  val campusId: String = "campus_main",
  val name: String,
  val code: String,
  val description: String = "",
  val centerGps: GpsCoordinate? = null,
  val floors: List<Floor> = emptyList(),
)

data class CampusDestination(
  val id: String = UUID.randomUUID().toString(),
  val name: String,
  val code: String = "",
  val category: DestinationCategory,
  val buildingId: String,
  val floorId: String,
  val floorNumber: Int,
  val roomNumber: String = "",
  val description: String = "",
  val keywords: List<String> = emptyList(),
  val waypointId: String? = null,
  val qrCodePayload: String? = null,
  val gpsCoordinate: GpsCoordinate? = null,
)

data class QrCheckpoint(
  val id: String,
  val payload: String,
  val name: String,
  val buildingId: String,
  val floorId: String,
  val floorNumber: Int,
  val localX: Float = 0f,
  val localY: Float = 0f,
  val localZ: Float = 0f,
  val headingDegrees: Float = 0f,
  val waypointId: String? = null,
  val description: String = "",
)
