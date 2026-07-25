# 🌐 Page Pulse

Page Pulse is a web-based website analysis tool that audits a webpage and provides useful SEO and performance information.

Users can enter any valid URL, and the application returns:

- HTTP Status
- Response Time
- Page Title
- Meta Description
- H1 Count
- Images Missing Alt Text
- Approximate Word Count

---

## Features

- Website analysis using a Node.js backend
- Clean responsive frontend
- Automatic URL normalization
- Loading indicator
- Error handling for invalid URLs, timeouts, and non-HTML pages
- Responsive developer-style UI

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Axios
- Cheerio

### Testing
- Jest
- Supertest

---

## Installation

Clone the repository.

```bash
git clone <repository-url>
```

Go to the backend folder.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

Start the server.

```bash
npm run dev
```

Open the frontend and analyze any website.

---

## API Contract

### POST /analyze

Request

```json
{
  "url": "https://example.com"
}
```

Successful Response

```json
{
  "httpStatus": 200,
  "responseTime": "215 ms",
  "pageTitle": "...",
  "metaDescription": "...",
  "h1Count": 1,
  "imagesMissingAlt": 0,
  "approximateWordCount": 1234
}
```

Error Response

```json
{
  "error": "Invalid URL."
}
```

---

## Design Decisions

### 1. Separate Routing and Parsing Logic

The Express route only validates requests and returns responses, while the parsing logic is placed in a separate module. This keeps responsibilities separate and makes the code easier to maintain and test.

### 2. Developer-Oriented User Interface

A minimal dark-themed interface was chosen to resemble modern developer tools. The focus is on readability and quick access to information rather than decorative design.

### 3. Client-Side Input Improvements

The application automatically normalizes URLs, supports the Enter key for submission, and safely escapes all text rendered from external webpages to improve usability and security.

---

## Testing

The project includes automated tests covering:

- Successful website analysis
- Missing URL
- Invalid URL

Tests can be executed using:

```bash
npm test
```

---

## Future Improvements

- Lighthouse integration
- Additional SEO checks
- Accessibility auditing
- Export reports as PDF
- Historical analysis

---

## AI Usage

ChatGPT was used to discuss project structure, review implementation ideas, and assist in refining the user interface and documentation. The application was implemented, tested, and customized based on those suggestions.

---

## Author

Kritika Sharma