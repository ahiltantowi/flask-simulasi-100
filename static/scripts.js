function runMasterAudit() {
        const btn = document.getElementById("auditBtn");
        const grid = document.getElementById("auditGrid");
        const lRoll = document.getElementById("l-roll");
        const sRoll = document.getElementById("s-roll");

        grid.classList.remove("hidden");
        btn.disabled = true;
        btn.innerHTML =
          "<i class='fas fa-sync fa-spin mr-2'></i> ANALYZING STREAM...";

        // Animasi acak awal (Loading effect)
        let loadingRoll = setInterval(() => {
          lRoll.innerText = Math.random().toFixed(4);
          sRoll.innerText = Math.random().toFixed(4);
        }, 50);

        fetch("/run-simulation")
          .then((r) => r.json())
          .then((data) => {
            clearInterval(loadingRoll); // Hentikan loading acak

            // Memulai sekuens angka dari data asli (Fast Sequence Effect)
            let i = 0;
            const streamData = data.lcg.full_data;
            const sysData = data.sys.full_data;

            let finalRoll = setInterval(() => {
              if (i < 20) {
                // Kita putar 20 angka pertama dengan cepat
                lRoll.innerText = streamData[i];
                sRoll.innerText = sysData[i];
                i++;
              } else {
                clearInterval(finalRoll);

                // Set ke angka terakhir agar mantap
                lRoll.innerText = streamData[0];
                sRoll.innerText = sysData[0];

                // Tampilkan sisa dashboard
                document.getElementById("l-results").classList.remove("hidden");
                document.getElementById("s-results").classList.remove("hidden");

                renderStats("l", data.lcg);
                renderStats("s", data.sys);

                btn.disabled = false;
                btn.innerHTML =
                  "<i class='fas fa-check-double mr-2'></i> AUDIT COMPLETE";
                btn.style.backgroundColor = "#15803d";
              }
            }, 40); // Kecepatan pergantian angka (40ms)
          });
      }

      function renderStats(prefix, stats) {
        const u = document.getElementById(`${prefix}-unif`);
        const r = document.getElementById(`${prefix}-runs`);
        const a = document.getElementById(`${prefix}-auto`);
        const raw = document.getElementById(`${prefix}-raw`);

        // Update Teks dengan padding agar sejajar seperti Terminal
        u.innerText = `${stats.status_unif.padEnd(
          7
        )} | P-VALUE: ${stats.p_unif.toFixed(4)}`;
        u.className = `mono text-xs font-bold ${
          stats.status_unif === "LULUS" ? "status-lulus" : "status-gagal"
        }`;

        r.innerText = `${stats.status_runs.padEnd(
          7
        )} | P-VALUE: ${stats.p_runs.toFixed(4)}`;
        r.className = `mono text-xs font-bold ${
          stats.status_runs === "LULUS" ? "status-lulus" : "status-gagal"
        }`;

        a.innerText = `${stats.status_auto.padEnd(
          7
        )} | NILAI R: ${stats.r_val.toFixed(4)}`;
        a.className = `mono text-xs font-bold ${
          stats.status_auto === "LULUS" ? "status-lulus" : "status-gagal"
        }`;

        raw.innerText =
          ">> BUFFER_RAW_DATA_STREAM: \n\n" + stats.full_data.join(" | ");
      }