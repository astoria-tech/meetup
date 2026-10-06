#!/usr/bin/env node
// Polls meetup-api for the next few upcoming events and triggers a site
// rebuild if any of their RSVP ("going") counts changed since last check.
// Run every 15m by meetup-rsvp-check.timer. First run only seeds the
// snapshot — it must not trigger a rebuild the moment this ships.
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const API_URL = "http://127.0.0.1:3000/api/upcoming";
const TRACK_COUNT = 5;
const REBUILD_SERVICE = "meetup-web-rebuild.service";
const STATE_DIR = new URL("../.data/", import.meta.url);
const STATE_FILE = new URL("rsvp-counts.json", STATE_DIR);

const execFileAsync = promisify(execFile);

async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_FILE, "utf8"));
  } catch (err) {
    if (err.code === "ENOENT") return null;
    throw err;
  }
}

async function saveState(counts) {
  await mkdir(STATE_DIR, { recursive: true });
  const tmp = new URL(`rsvp-counts.json.${process.pid}.tmp`, STATE_DIR);
  await writeFile(tmp, JSON.stringify(counts, null, 2) + "\n");
  await rename(tmp, STATE_FILE);
}

function countsEqual(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key, i) => key === bKeys[i] && a[key] === b[key]);
}

async function main() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`meetup-api ${API_URL} returned ${res.status}`);
  }
  const { events } = await res.json();

  const tracked = events.slice(0, TRACK_COUNT);
  const counts = Object.fromEntries(tracked.map((e) => [e.id, e.going]));

  const previous = await loadState();
  if (previous === null) {
    await saveState(counts);
    console.log(`Seeded RSVP snapshot for ${tracked.length} events; no rebuild triggered.`);
    return;
  }

  if (countsEqual(previous, counts)) {
    console.log("No RSVP changes among tracked events.");
    return;
  }

  console.log("RSVP counts changed:", { previous, counts });
  await saveState(counts);
  await execFileAsync("sudo", ["systemctl", "start", REBUILD_SERVICE]);
  console.log(`Triggered ${REBUILD_SERVICE}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
