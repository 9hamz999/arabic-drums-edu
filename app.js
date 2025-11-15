// JS placeholder// الأصوات الأساسية
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0, decay: 0.2, sustain: 0 }
}).toDestination();
const hihat = new Tone.MetalSynth().toDestination();

// إنشاء مربعات الإيقاع (16 خطوة لكل صف)
document.querySelectorAll(".steps").forEach(stepsEl => {
    for (let i = 0; i < 16; i++) {
        const box = document.createElement("div");
        box.classList.add("step");
        box.dataset.index = i;
        stepsEl.appendChild(box);

        box.addEventListener("click", () => {
            box.classList.toggle("active");
        });
    }
});

// تشغيل الإيقاعات
let isPlaying = false;
let currentStep = 0;

document.getElementById("playBtn").addEventListener("click", async () => {
    await Tone.start();

    isPlaying = !isPlaying;
    document.getElementById("playBtn").innerText = isPlaying ? "إيقاف" : "تشغيل";

    if (isPlaying) {
        Tone.Transport.start();
    } else {
        Tone.Transport.stop();
        currentStep = 0;
    }
});

// تحديث الـ BPM
document.getElementById("bpm").addEventListener("input", e => {
    Tone.Transport.bpm.value = Number(e.target.value);
});

// كل خطوة في الإيقاع
Tone.Transport.scheduleRepeat(time => {
    // لكل صف (Kick – Snare – HiHat)
    document.querySelectorAll(".steps").forEach(stepsEl => {
        const sound = stepsEl.dataset.sound;
        const stepBox = stepsEl.children[currentStep];

        if (stepBox.classList.contains("active")) {
            if (sound === "kick") kick.triggerAttackRelease("C2", "8n", time);
            if (sound === "snare") snare.triggerAttackRelease("8n", time);
            if (sound === "hihat") hihat.triggerAttackRelease("16n", time);
        }
    });

    // الانتقال للخطوة التالية
    currentStep = (currentStep + 1) % 16;
}, "16n");
