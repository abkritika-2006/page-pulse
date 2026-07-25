// Escape any text pulled from the analyzed page before it touches
// innerHTML — titles/descriptions are untrusted, third-party content.
function escapeHtml(str) {
    if (str === undefined || str === null || str === "") return "";
    const div = document.createElement("div");
    div.textContent = String(str);
    return div.innerHTML;
}

// Map an HTTP status (number or "200 OK" style string) to a status class.
function statusClass(httpStatus) {
    const code = parseInt(String(httpStatus).match(/\d{3}/)?.[0] ?? "", 10);
    if (code >= 200 && code < 300) return "ok";
    if (code >= 300 && code < 400) return "warn";
    if (code >= 400) return "error";
    return "";
}

// If the user typed a bare domain, assume https.
function normalizeUrl(raw) {
    if (!/^https?:\/\//i.test(raw)) {
        return "https://" + raw;
    }
    return raw;
}

// Give the response time a plain-language meaning + status class.
function responseTimeMeta(responseTimeStr) {
    const ms = parseInt(String(responseTimeStr).match(/\d+/)?.[0] ?? "0", 10);

    if (ms <= 150) return { label: "Excellent", cls: "ok" };
    if (ms <= 500) return { label: "Good", cls: "ok" };
    if (ms <= 1200) return { label: "Moderate", cls: "warn" };

    return { label: "Slow", cls: "error" };
}

async function analyzeWebsite() {

    const urlInput = document.getElementById("urlInput");
    const rawValue = urlInput.value.trim();
    const result = document.getElementById("result");
    const loading = document.getElementById("loading");
    const button = document.getElementById("analyzeBtn");

    result.innerHTML = "";

    if (!rawValue) {
        result.innerHTML = `<p class="error-msg">Enter a URL to analyze.</p>`;
        return;
    }

    const url = normalizeUrl(rawValue);

    loading.textContent = "Analyzing " + url + "...";
    button.disabled = true;

    try {

        const response = await fetch("https://page-pulse-backend-fk2w.onrender.com/analyze", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        loading.textContent = "";
        button.disabled = false;

        if (data.error) {
            result.innerHTML = `<p class="error-msg">${escapeHtml(data.error)}</p>`;
            return;
        }

        const sCls = statusClass(data.httpStatus);

        const altCount = Number(data.imagesMissingAlt) || 0;
        const altCls =
            altCount === 0
                ? "ok"
                : altCount <= 3
                ? "warn"
                : "error";

        const rt = responseTimeMeta(data.responseTime);

        const title = data.pageTitle
            ? escapeHtml(data.pageTitle)
            : "";

        const desc = data.metaDescription
            ? escapeHtml(data.metaDescription)
            : "";

        result.innerHTML = `

<div class="stat-grid">

    <div class="card">
        <div class="card-label">
            <span class="dot ${sCls}"></span>
            HTTP Status
        </div>
        <div class="card-value ${sCls}">
            ${escapeHtml(data.httpStatus)}
        </div>
    </div>

    <div class="card">
        <div class="card-label">
            <span class="dot ${rt.cls}"></span>
            Response Time
        </div>
        <div class="card-value ${rt.cls}">
            ⚡ ${escapeHtml(data.responseTime)}
        </div>
        <div class="card-sub ${rt.cls}">
            ${rt.label}
        </div>
    </div>

    <div class="card">
        <div class="card-label">
            H1 Count
        </div>
        <div class="card-value">
            ${escapeHtml(data.h1Count)}
        </div>
    </div>

</div>

<div class="card card-full">
    <div class="card-label">// page title</div>
    <div class="card-value small ${title ? "" : "empty"}">
        ${title || "No title found"}
    </div>
</div>

<div class="card card-full">
    <div class="card-label">// meta description</div>
    <div class="card-value small ${desc ? "" : "empty"}">
        ${desc || "No meta description found"}
    </div>
</div>

<div class="two-col">

    <div class="card">
        <div class="card-label">
            <span class="dot ${altCls}"></span>
            Images Missing Alt
        </div>
        <div class="card-value ${altCls}">
            ${escapeHtml(data.imagesMissingAlt)}
        </div>
    </div>

    <div class="card">
        <div class="card-label">
            Approx. Word Count
        </div>
        <div class="card-value">
            ${escapeHtml(data.approximateWordCount)}
        </div>
    </div>

</div>

`;

    } catch (err) {

        loading.textContent = "";
        button.disabled = false;

        result.innerHTML = `
            <p class="error-msg">
                Unable to connect to the Page Pulse API. Please try again in a few moments.
            </p>
        `;

    }

}

// Allow pressing Enter in the URL field to trigger analysis.
document.addEventListener("DOMContentLoaded", () => {

    const urlInput = document.getElementById("urlInput");

    if (urlInput) {

        urlInput.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {
                analyzeWebsite();
            }

        });

    }

});