package com.google.ar.core.examples.kotlin.helloar.campus

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class CampusCatalogueTest {

  private lateinit var repo: CampusCatalogueRepository
  private lateinit var qrScanner: QrCheckpointScanner

  @Before
  fun setUp() {
    repo = CampusCatalogueRepository()
    qrScanner = QrCheckpointScanner(repo)
  }

  @Test
  fun testDefaultCampusStructure() {
    val campus = repo.getCampus()
    assertEquals("campus_main", campus.id)
    assertEquals(2, campus.buildings.size)

    val mainBuilding = repo.getBuilding("main_academic")
    assertNotNull(mainBuilding)
    assertEquals(3, mainBuilding?.floors?.size)
  }

  @Test
  fun testSearchDestinationsByKeyword() {
    val csResults = repo.searchDestinations("cs")
    assertTrue(csResults.isNotEmpty())
    assertTrue(csResults.any { it.name.contains("Computer Science", ignoreCase = true) })

    val cafeResults = repo.searchDestinations("canteen")
    assertTrue(cafeResults.isNotEmpty())
    assertEquals(DestinationCategory.CANTEEN, cafeResults.first().category)
  }

  @Test
  fun testFilterByCategory() {
    val labs = repo.searchDestinations(query = "", category = DestinationCategory.LABORATORY)
    assertTrue(labs.size >= 2)
    assertTrue(labs.all { it.category == DestinationCategory.LABORATORY })
  }

  @Test
  fun testQrCheckpointScanning() {
    val result = qrScanner.processScan("CAMPUS:MAIN:1:CSLAB1")
    assertTrue(result is QrCheckpointScanner.ScanResult.Success)
    val success = result as QrCheckpointScanner.ScanResult.Success
    assertEquals("main_academic", success.checkpoint.buildingId)
    assertEquals(1, success.checkpoint.floorNumber)
    assertEquals(PositionSource.QR_CHECKPOINT, success.estimatedLocation.source)
    assertEquals(12.5f, success.estimatedLocation.localX, 0.001f)
  }

  @Test
  fun testUnknownQrPayload() {
    val result = qrScanner.processScan("RANDOM_INVALID_QR")
    assertTrue(result is QrCheckpointScanner.ScanResult.UnknownCheckpoint)
  }

  @Test
  fun testGpsDistanceCalculation() {
    // Distance between two known coordinates (e.g. ~44 meters apart)
    val lat1 = 13.0827
    val lon1 = 80.2707
    val lat2 = 13.0830
    val lon2 = 80.2710
    val dist = OutdoorGpsHelper.distanceBetweenMeters(lat1, lon1, lat2, lon2)
    assertTrue(dist in 40.0..60.0)
  }
}
