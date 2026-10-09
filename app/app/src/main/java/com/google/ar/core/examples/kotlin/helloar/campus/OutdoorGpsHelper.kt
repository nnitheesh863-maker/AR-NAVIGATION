package com.google.ar.core.examples.kotlin.helloar.campus

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.Looper
import android.util.Log
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * Manages Outdoor GPS position updates and campus building proximity calculations.
 */
class OutdoorGpsHelper(
  private val context: Context,
  private val onLocationUpdated: (GpsCoordinate) -> Unit,
) : LocationListener {

  companion object {
    private const val TAG = "OutdoorGpsHelper"
    private const val MIN_TIME_MS = 2000L
    private const val MIN_DISTANCE_M = 1.0f

    /** Calculate distance in meters between two GPS coordinates using Haversine formula. */
    fun distanceBetweenMeters(
      lat1: Double,
      lon1: Double,
      lat2: Double,
      lon2: Double,
    ): Double {
      val earthRadius = 6371000.0 // meters
      val dLat = Math.toRadians(lat2 - lat1)
      val dLon = Math.toRadians(lon2 - lon1)
      val a = sin(dLat / 2) * sin(dLat / 2) +
        cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
        sin(dLon / 2) * sin(dLon / 2)
      val c = 2 * atan2(sqrt(a), sqrt(1 - a))
      return earthRadius * c
    }
  }

  private var locationManager: LocationManager? = null
  private var isListening = false
  var lastKnownGps: GpsCoordinate? = null
    private set

  fun start() {
    if (isListening) return
    locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
    if (locationManager == null) {
      Log.w(TAG, "LocationManager not available on this device")
      return
    }

    try {
      val isGpsEnabled = locationManager?.isProviderEnabled(LocationManager.GPS_PROVIDER) == true
      val isNetworkEnabled = locationManager?.isProviderEnabled(LocationManager.NETWORK_PROVIDER) == true

      if (!isGpsEnabled && !isNetworkEnabled) {
        Log.w(TAG, "Neither GPS nor Network location provider is enabled")
        return
      }

      // Check last known location
      fetchLastKnownLocation()

      if (isGpsEnabled) {
        locationManager?.requestLocationUpdates(
          LocationManager.GPS_PROVIDER,
          MIN_TIME_MS,
          MIN_DISTANCE_M,
          this,
          Looper.getMainLooper(),
        )
      }
      if (isNetworkEnabled) {
        locationManager?.requestLocationUpdates(
          LocationManager.NETWORK_PROVIDER,
          MIN_TIME_MS,
          MIN_DISTANCE_M,
          this,
          Looper.getMainLooper(),
        )
      }
      isListening = true
      Log.i(TAG, "Outdoor GPS updates started")
    } catch (e: SecurityException) {
      Log.e(TAG, "Location permission missing when starting GPS updates", e)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to start location updates", e)
    }
  }

  fun stop() {
    if (!isListening) return
    try {
      locationManager?.removeUpdates(this)
      isListening = false
      Log.i(TAG, "Outdoor GPS updates stopped")
    } catch (e: Exception) {
      Log.w(TAG, "Error stopping location updates", e)
    }
  }

  @SuppressLint("MissingPermission")
  private fun fetchLastKnownLocation() {
    try {
      val gpsLoc = locationManager?.getLastKnownLocation(LocationManager.GPS_PROVIDER)
      val netLoc = locationManager?.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
      val best = when {
        gpsLoc != null && netLoc != null -> if (gpsLoc.time > netLoc.time) gpsLoc else netLoc
        gpsLoc != null -> gpsLoc
        else -> netLoc
      }
      if (best != null) {
        onLocationChanged(best)
      }
    } catch (e: SecurityException) {
      Log.w(TAG, "SecurityException reading last known location", e)
    }
  }

  override fun onLocationChanged(location: Location) {
    val gps = GpsCoordinate(
      latitude = location.latitude,
      longitude = location.longitude,
      altitude = location.altitude,
      accuracyMeters = location.accuracy,
      timestampMs = location.time,
    )
    lastKnownGps = gps
    onLocationUpdated(gps)
  }

  @Deprecated("Deprecated in Java")
  override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
  override fun onProviderEnabled(provider: String) {}
  override fun onProviderDisabled(provider: String) {}
}
