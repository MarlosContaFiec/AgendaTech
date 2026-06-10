'use strict';

/**
 * Converts a time string "HH:MM" or "HH:MM:SS" to total minutes since midnight.
 */
function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Converts total minutes since midnight to "HH:MM" format.
 */
function fromMinutes(mins) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Adds minutes to a time string and returns "HH:MM:SS" format.
 */
function addMinutes(timeStr, minutes) {
  const total = toMinutes(timeStr) + minutes;
  return `${fromMinutes(total)}:00`;
}

module.exports = { toMinutes, fromMinutes, addMinutes };
