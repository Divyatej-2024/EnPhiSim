import React, { useEffect } from "react";

export default function BrowserLevel({ level, onOptionClick }) {
  useEffect(() => {
    const script = document.createElement("script");

    script.innerHTML = `
      function safeCarousel() {
        var x = document.getElementsByClassName("mySlides");
        if (!x || x.length === 0) {
          console.warn("No .mySlides found yet, retrying...");
          setTimeout(safeCarousel, 500);
          return;
        }

        let myIndex = 0;
        function carousel() {
          for (let i = 0; i < x.length; i++) {
            if (x[i]) x[i].style.display = "none";
          }
          myIndex++;
          if (myIndex > x.length) myIndex = 1;
          if (x[myIndex - 1]) x[myIndex - 1].style.display = "block";
          setTimeout(carousel, 4000);
        }

        carousel();
      }

      // Start AFTER ensuring DOM has loaded
      setTimeout(safeCarousel, 300);

      function myFunction() {
        var x = document.getElementById("navDemo");
        if (!x) return;
        if (x.className.indexOf("w3-show") == -1) {
          x.className += " w3-show";
        } else { 
          x.className = x.className.replace(" w3-show", "");
        }
      }

      var modalCheck = setInterval(() => {
        var modal = document.getElementById('ticketModal');
        if (modal) {
          clearInterval(modalCheck);
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = "none";
            }
          };
        }
      }, 300);
    `;

    document.body.appendChild(script);
    return () => script.remove();
  }, []);

  const htmlContent = `
    <div style="height: 70vh; overflow-y: auto; border: 3px solid #000;">
      ${level.browser_html}
    </div>
  `;

  return (
    <div>
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {level.options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onOptionClick(opt)}
            style={{
              padding: "10px 20px",
              margin: "10px",
              background: "#000",
              color: "#fff",
              borderRadius: "6px",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
