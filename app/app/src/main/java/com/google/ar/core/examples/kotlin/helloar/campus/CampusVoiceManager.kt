package com.google.ar.core.examples.kotlin.helloar.campus

import android.content.Context
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

/**
 * Lifecycle-aware Text-to-Speech voice guidance for Smart Campus Navigation.
 * Supports English and Tamil with queue management and mute toggles.
 */
class CampusVoiceManager(
  private val context: Context,
) : TextToSpeech.OnInitListener {

  companion object {
    private const val TAG = "CampusVoiceManager"
  }

  private var tts: TextToSpeech? = null
  private var isTtsReady = false
  var isMuted: Boolean = false
  var currentLanguage: String = "en" // "en" or "ta" (Tamil)

  private var lastSpokenInstruction: String? = null
  private var lastSpokenTimestampMs: Long = 0L

  init {
    try {
      tts = TextToSpeech(context.applicationContext, this)
    } catch (e: Exception) {
      Log.e(TAG, "Failed to initialize TextToSpeech", e)
    }
  }

  override fun onInit(status: Int) {
    if (status == TextToSpeech.SUCCESS) {
      isTtsReady = true
      setLanguage(currentLanguage)
      Log.i(TAG, "TTS initialized successfully")
    } else {
      Log.w(TAG, "TTS initialization failed with status: $status")
    }
  }

  fun setLanguage(langCode: String) {
    currentLanguage = langCode
    if (!isTtsReady || tts == null) return

    val targetLocale = when (langCode.lowercase()) {
      "ta", "tam", "tamil" -> Locale.Builder().setLanguage("ta").setRegion("IN").build()
      else -> Locale.US
    }

    val result = tts?.setLanguage(targetLocale)
    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
      Log.w(TAG, "Locale $targetLocale is not supported or missing data; falling back to US English")
      tts?.language = Locale.US
    }
  }

  fun speak(instruction: String, force: Boolean = false) {
    if (isMuted || !isTtsReady || tts == null || instruction.isBlank()) return

    val now = System.currentTimeMillis()
    // Avoid repeating the exact same instruction within 4 seconds unless forced
    if (!force && instruction == lastSpokenInstruction && (now - lastSpokenTimestampMs) < 4000L) {
      return
    }

    lastSpokenInstruction = instruction
    lastSpokenTimestampMs = now

    val textToSpeak = if (currentLanguage.startsWith("ta")) {
      translateToTamil(instruction)
    } else {
      instruction
    }

    tts?.speak(textToSpeak, TextToSpeech.QUEUE_FLUSH, null, "campus_nav_${now}")
  }

  fun stop() {
    tts?.stop()
  }

  fun shutdown() {
    try {
      tts?.stop()
      tts?.shutdown()
    } catch (e: Exception) {
      Log.w(TAG, "Error shutting down TTS", e)
    } finally {
      tts = null
      isTtsReady = false
    }
  }

  private fun translateToTamil(text: String): String {
    // High-frequency navigation terms translated to Tamil phonetics / phrasing
    return when {
      text.contains("Turn left", ignoreCase = true) -> "இடது பக்கம் திரும்பவும். " + text.replace("Turn left", "", true)
      text.contains("Turn right", ignoreCase = true) -> "வலது பக்கம் திரும்பவும். " + text.replace("Turn right", "", true)
      text.contains("Proceed straight", ignoreCase = true) || text.contains("Continue forward", ignoreCase = true) ->
        "நேராக செல்லவும். " + text.replace("Proceed straight", "", true).replace("Continue forward", "", true)
      text.contains("Arrived", ignoreCase = true) || text.contains("You have reached", ignoreCase = true) ->
        "நீங்கள் இலக்கை அடைந்துவிட்டீர்கள். $text"
      text.contains("staircase", ignoreCase = true) || text.contains("stairs", ignoreCase = true) ->
        "படிக்கட்டுகளைப் பயன்படுத்தவும். $text"
      text.contains("elevator", ignoreCase = true) || text.contains("lift", ignoreCase = true) ->
        "மின்தூக்கியைப் பயன்படுத்தவும். $text"
      else -> text
    }
  }
}
