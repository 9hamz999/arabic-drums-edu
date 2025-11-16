document.addEventListener("DOMContentLoaded", () => {

    // مكتبة الأصوات
    const soundLibrary = {
        "Bendir1": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/Ban1.mp3",
        "Bendir2": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/Ban2.wav",
        "Bendir3": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/Ban3.wav",
        "Bendir4": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/Ban4.wav",
        "Bendir5": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/Ban5.wav",
        "Bdoff dom": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/doff%20group%20dom.wav",
        "doff sha": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/doff%20group%20sha.wav",
        "doff tak": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer/doff%20group%20tak.wav",
        "PRCDavul Dum": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCDavul%20Dum.wav",
        "PRCDavul Tek": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCDavul%20Tek.wav",
        "PRCBENDiR 41": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCBENDiR%2041.wav",
        "PRCBENDiR 42": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCBENDiR%2042.wav",
        "PRCBENDiR C1": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCBENDiR%20C1.wav",
        "PRCBENDiR C4": "https://raw.githubusercontent.com/9hamz999/arabic-drums-edu/refs/heads/main/sounds/Bandeer5/PRCBENDiR%20C4.wav"
    };

    const rows = [];
    let stepIndex = 0;
    let isPlaying = false;

    const sequencerDiv = document.getElementById("sequencer");

    // إنشاء صف جديد
    function createRow(soundUrl = soundLibrary["Bendir1"]) {

        const rowId = "row_" + rows.length;

        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        rowDiv.id = rowId;

        // قائمة أصوات
        const select = document.createElement("select");
        select.classList.add("sound-select");

        for (let name in soundLibrary) {
            const option = document.createElement("option");
            option.value = soundLibrary[name];
            option.textContent = name;
            select.appendChild(option);
        }
        select.value = soundUrl;

        // زر حذف الصف
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => {
            rowDiv.remove();
            const idx = rows.findIndex(r => r.id === rowId);
            if (idx !== -1) rows.splice(idx, 1);
        });

        // Player
        let player = new Tone.Player(soundUrl).toDestination();

        // الخطوات
        const stepsDiv = document.createElement("div");
        stepsDiv.classList.add("steps");

        const stepsCount = Number(document.getElementById("stepsCount").value) || 16;

        for (let i = 0; i < stepsCount; i++) {
            const step = document.createElement("div");
            step.classList.add("step");
            step.dataset.index = i;

          if (i % 4 === 0) step.classList.add("bar-end"); // لون للمجموعة

            step.addEventListener("click", () => {
                step.classList.toggle("active");
            });

            stepsDiv.appendChild(step);
        }

        rowDiv.appendChild(select);
        rowDiv.appendChild(stepsDiv);
        rowDiv.appendChild(deleteBtn);

        sequencerDiv.appendChild(rowDiv);

        rows.push({ id: rowId, player, stepsCount });

        // تغيير الصوت
        select.addEventListener("change", () => {
            player.load(select.value);
        });
    }

    // إنشاء صف أولي
    createRow();

    // زر إضافة صوت
    document.getElementById("addSound").addEventListener("click", () => {
        createRow();
    });

    // زر تشغيل / إيقاف
    document.getElementById("playBtn").addEventListener("click", async () => {
        await Tone.start();
        isPlaying = !isPlaying;
        document.getElementById("playBtn").innerText = isPlaying ? "إيقاف" : "تشغيل";

        if (isPlaying) {
            stepIndex = 0;
            Tone.Transport.start();
        } else {
            Tone.Transport.stop();
            clearCurrentHighlight();
        }
    });

    // تعديل BPM
    document.getElementById("bpm").addEventListener("input", e => {
        Tone.Transport.bpm.value = Number(e.target.value);
    });



    Tone.Transport.scheduleRepeat(time => {
        rows.forEach(row => {
            const rowDiv = document.getElementById(row.id);
            const steps = rowDiv.querySelectorAll(".step");

            // تشغيل خطوة حالية إذا نشطت
            const step = steps[stepIndex % row.stepsCount];
            if (step.classList.contains("active")) {
                row.player.start(time);
            }

            // تسليط الضوء البصري
            step.classList.add("current");
        });

        // إزالة الـ highlight السابق بعد نصف خطوة
        Tone.Transport.scheduleOnce(() => clearCurrentHighlight(), "8n");

        stepIndex++;
    }, "16n");

    function clearCurrentHighlight() {
        rows.forEach(row => {
            const rowDiv = document.getElementById(row.id);
            if (!rowDiv) return;
            const steps = rowDiv.querySelectorAll(".step");
            steps.forEach(s => s.classList.remove("current"));
        });
    }

});
