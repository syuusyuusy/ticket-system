<!DOCTYPE html>
<html>
<body>
  <h1>予約可能な時間</h1>
  <ul id="list"></ul>

  <script>
    async function load() {
      const url = "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMWTQacu9t81K5HZumGsGOqG60zAhToz2L_G4y4AoyBvED5AvLAPMBliKmV6pySrRMadMKIvtRry5adCU8XownJfdwvsWi0hiNLwRefLune5np950SF-oNh8OHwQT8NURJEw1L1OvpgjlmkWL7IiBmK7pdjbaBpL48bBZryL7YI1jghlFTJML1tlmkTz0rjA8-LVsvQd_vcmDk8BXEHDx8GjT5RKH06OyC8ZMafFTaWeFB5MhcgAttt_CdU9ZsX2RT9Ik-zImmtYzjYAOHHPdxZ7fr8OCg&lib=MNyNcv_qMnCu0mlCuA1J48nJa9p4FWqyd";

      try {
        const res = await fetch(url);
        const data = await res.json();

        const list = document.getElementById("list");
        list.innerHTML = "";

        if (data.length === 0) {
          list.innerHTML = "<li>現在空きはありません</li>";
          return;
        }

        data.forEach(item => {
          const li = document.createElement("li");
          li.textContent = `${item.time_slot}（残り${item.remaining}人）`;
          list.appendChild(li);
        });

      } catch (e) {
        console.error(e);
      }
    }

    load();
  </script>
</body>
</html>