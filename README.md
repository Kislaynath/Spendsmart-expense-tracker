# Spendsmart-expense-tracker
Expense Tracker built with HTML, CSS and JavaScript
# 💸 SpendSmart — Expense Tracker

A fully functional **Expense Tracker** web application built using pure **HTML, CSS, and JavaScript** — no frameworks, no libraries.

---

## 🌐 Live Demo
>  https://kislaynath.github.io/Spendsmart-expense-tracker/

---

## 📸 Features

- ✅ Add **Income** and **Expense** transactions
- ✅ View **Balance, Total Income, Total Expenses** in real time
- ✅ **Filter** transactions by All / Income / Expense
- ✅ **Delete** individual transactions
- ✅ **Clear All** transactions with confirmation modal
- ✅ **7-Day Bar Chart** showing daily spending patterns
- ✅ **Top Categories** breakdown with progress bars
- ✅ **Live Weather Widget** using Open-Meteo API (no API key needed)
- ✅ **Geolocation** to detect your city automatically
- ✅ **LocalStorage** — data persists even after browser is closed
- ✅ **Savings Tip** based on your spending ratio
- ✅ Fully **Responsive** — works on mobile and desktop
- ✅ **Keyboard shortcuts** — Enter to add, Escape to close modal

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and layout |
| CSS3 | Styling, animations, responsive design |
| JavaScript (Vanilla) | All logic, DOM manipulation, API calls |
| LocalStorage API | Save and load transactions in browser |
| Open-Meteo API | Free weather data (no API key required) |
| Nominatim API | Reverse geocoding to get city name |
| Geolocation API | Detect user's current location |

---

## 📁 Project Structure

```
spendsmart-expense-tracker/
│
├── index.html      → HTML structure and layout
├── style.css       → All CSS styles and animations
├── script.js       → All JavaScript logic and API calls
└── README.md       → Project documentation
```

---


## 📱 How to Use

1. **Select type** — Click **Income** or **Expense** button
2. **Fill the form** — Enter description, amount, category, date
3. **Click Add Transaction** — or press **Enter**
4. **View your data** — Summary cards update instantly
5. **Filter history** — Use All / Income / Expense tabs
6. **Delete a transaction** — Click the ✕ button on any item
7. **Clear all** — Click "Clear All" and confirm in the popup

---

## 🌦️ Weather Widget

- Automatically detects your **current location** using browser Geolocation API
- Fetches **live temperature** from Open-Meteo (free, no API key)
- Falls back to **Ahmedabad** if location permission is denied
- Click the weather widget to **refresh** anytime

---

## 💾 Data Persistence

All transactions are saved in the browser's **LocalStorage** under the key `spendsmart_v1`. Data remains available even after:
- Closing the browser tab
- Refreshing the page
- Restarting the computer

Data is only cleared when you click **"Clear All"** or manually clear browser data.

---

## 🧠 Key JavaScript Concepts Used

- **DOM Manipulation** — `getElementById`, `innerHTML`, `textContent`
- **Event Listeners** — `addEventListener` for all interactions
- **Event Delegation** — Single listener on parent for dynamic delete buttons
- **LocalStorage** — `setItem`, `getItem`, `JSON.stringify`, `JSON.parse`
- **Fetch API** — Async HTTP requests to weather and geocoding APIs
- **Array Methods** — `filter`, `push`, `unshift`, `sort`
- **Date Object** — For chart generation and date formatting

---
