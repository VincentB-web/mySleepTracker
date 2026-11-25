const form = document.getElementById("sleepForm");
const result = document.getElementById("result");

function recommendationForAge(age) {
  // Recommendations are hours per 24-hour period; naps count for young children.
  if (age < 4 / 12) return { min: 14, max: 17, group: "Newborn" };
  if (age < 1) return { min: 12, max: 16, group: "Infant" };
  if (age <= 2) return { min: 11, max: 14, group: "Toddler" };
  if (age <= 5) return { min: 10, max: 13, group: "Preschool child" };
  if (age <= 12) return { min: 9, max: 12, group: "School-age child" };
  if (age <= 17) return { min: 8, max: 10, group: "Teenager" };
  if (age <= 60) return { min: 7, max: 9, group: "Adult" };
  if (age <= 64) return { min: 7, max: 9, group: "Older adult" };
  return { min: 7, max: 8, group: "Older adult" };
}

function formatTime(totalMinutes) {
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const age = Number(document.getElementById("age").value);
  const hours = Number(document.getElementById("hours").value);

  if (!Number.isFinite(age) || age < 0 || age > 120 ||
      !Number.isFinite(hours) || hours < 0 || hours > 24) {
    alert("Please enter a valid age (0–120) and sleep duration (0–24 hours).");
    return;
  }

  const rec = recommendationForAge(age);
  const within = hours >= rec.min && hours <= rec.max;
  const tooLittle = hours < rec.min;

  document.getElementById("statusTag").textContent =
    within ? "WITHIN RECOMMENDED RANGE" : tooLittle ? "BELOW RECOMMENDED" : "ABOVE RECOMMENDED";
  document.getElementById("resultTitle").textContent =
    within ? "You're in the recommended range." : tooLittle ? "You may need more sleep." : "You're sleeping above the usual range.";
  document.getElementById("resultText").textContent = within
    ? `For your age group (${rec.group}), your sleep duration is within the general recommendation. Keep a regular schedule and pay attention to how rested you feel.`
    : tooLittle
      ? `For your age group (${rec.group}), your sleep is below the recommended range. If possible, gradually add sleep time and keep a consistent bedtime.`
      : `For your age group (${rec.group}), your sleep is above the usual recommended range. Extra sleep can sometimes be normal, but persistent excessive sleep or daytime tiredness may be worth discussing with a healthcare professional.`;

  document.getElementById("actual").textContent = `${hours} ${hours === 1 ? "hour" : "hours"}`;
  document.getElementById("recommended").textContent = `${rec.min}–${rec.max} hours`;
  document.getElementById("tip").textContent = tooLittle
    ? `Try moving bedtime earlier by 15–30 minutes every few nights until you reach your target.`
    : within
      ? `A helpful habit: wake up at roughly the same time every day, including weekends.`
      : `If this amount is unusual for you, consider sleep quality, recent sleep debt, and how you feel during the day.`;

  // Show a sample bedtime based on the midpoint of the recommended range.
  const target = (rec.min + rec.max) / 2;
  const wakeMinutes = 7 * 60; // Example wake-up time: 7:00 AM
  const bedMinutes = wakeMinutes - target * 60;
  document.getElementById("scheduleHours").textContent = `${target} ${target === 1 ? "hour" : "hours"}`;
  document.getElementById("bedtime").textContent = formatTime(bedMinutes);
  document.getElementById("wakeTime").textContent = formatTime(wakeMinutes);

  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});
