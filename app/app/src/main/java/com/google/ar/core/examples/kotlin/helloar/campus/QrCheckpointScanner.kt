package com.google.ar.core.examples.kotlin.helloar.campus

/**
 * Handles indoor QR checkpoint positioning and parsing.
 * Treats a QR scan as a known reference checkpoint, not continuous tracking.
 */
class QrCheckpointScanner(
  private val campusCatalogue: CampusCatalogueRepository,
) {

  sealed class ScanResult {
    data class Success(
      val checkpoint: QrCheckpoint,
      val destination: CampusDestination?,
      val estimatedLocation: CampusLocation,
    ) : ScanResult()

    data class UnknownCheckpoint(val rawPayload: String) : ScanResult()
    data class InvalidPayload(val error: String) : ScanResult()
  }

  fun processScan(rawPayload: String?): ScanResult {
    if (rawPayload.isNullOrBlank()) {
      return ScanResult.InvalidPayload("Scanned QR code was empty")
    }

    val trimmed = rawPayload.trim()
    val checkpoint = campusCatalogue.findCheckpointByQr(trimmed)
      ?: return ScanResult.UnknownCheckpoint(trimmed)

    val destination = campusCatalogue.getAllDestinations().firstOrNull {
      it.qrCodePayload.equals(checkpoint.payload, ignoreCase = true) ||
      it.waypointId != null && it.waypointId == checkpoint.waypointId
    }

    val location = CampusLocation(
      buildingId = checkpoint.buildingId,
      floorId = checkpoint.floorId,
      floorNumber = checkpoint.floorNumber,
      localX = checkpoint.localX,
      localY = checkpoint.localY,
      localZ = checkpoint.localZ,
      source = PositionSource.QR_CHECKPOINT,
      confidence = 0.95f,
      lastUpdatedMs = System.currentTimeMillis(),
    )

    return ScanResult.Success(
      checkpoint = checkpoint,
      destination = destination,
      estimatedLocation = location,
    )
  }
}
