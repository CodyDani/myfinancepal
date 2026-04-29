# My Finance Pal

A comprehensive personal finance management application that helps you allocate income, track budgets, and manage expenses according to structured financial principles.

## Features

### Income Allocation
- Automatically allocate income into 6 predefined portions:
  - **Tithe** (10%) - Church Account
  - **Giving** (10%) - Palmpay Account
  - **Investment & Saving for Budgeted Needs** (20%) - Moniepoint Account
  - **House needs** (20%) - Kuda Account
  - **Data & Airtime** (10%) - Smartcash Account
  - **Transportation & Emergencies** (30%) - Opay Account

### Budget Management
- Track budgeted needs with priority levels (High, Medium, Low)
- Monitor available savings for budget fulfillment
- Add and manage budget items with proposed amounts

### Expense Tracking
- Record expenses from allocated accounts
- Track spending by account, amount, and description
- View expense history with detailed breakdowns

### Responsive Design
- **Desktop**: Horizontal navigation menu with active page highlighting
- **Tablet & Mobile**: Hamburger menu with slide-out navigation
- Optimized layouts for screens from 320px to 1024px+

### Data Persistence
- All data saved locally using browser localStorage
- Persistent across browser sessions
- No data loss on page refresh

## Technologies Used

- **HTML5**: Semantic structure with multiple page containers
- **CSS3**: Mobile-first responsive design with CSS Grid and Flexbox
- **JavaScript (ES6)**: DOM manipulation, event handling, and data management
- **Google Fonts**: Heebo font family for modern typography
- **localStorage API**: Client-side data persistence

## Installation & Setup

1. **Clone or Download**: Place all files in the same directory
2. **Required Files**:
   - `index.html` - Main application structure
   - `style.css` - Responsive styling and layout
   - `script.js` - Application logic and functionality
3. **Open**: Open `index.html` in any modern web browser
4. **No Dependencies**: Pure vanilla JavaScript - no build tools or packages required

## Usage

### Getting Started
1. Enter your income amount in the "Add Income" field
2. Click "Submit" to allocate income into portions
3. Review the allocated amounts in the categories section
4. Click "Record" to save the allocation

### Navigation
- **Desktop**: Use the horizontal menu at the top to switch between pages
- **Mobile/Tablet**: Tap the hamburger (☰) icon to open the navigation menu

### Managing Budgets
1. Navigate to "Budgeted Needs" page
2. Fill out the budget form with need name, amount, and priority
3. Submit to add to your budget list
4. Monitor available savings in the investment portion

### Recording Expenses
1. Go to "Expenses" page
2. Select the account to deduct from
3. Enter expense amount and description
4. Submit to record and update balances

### Viewing Balances
- Visit the "Balance" page to see current amounts in all portions
- Amounts update automatically when income is allocated or expenses are recorded

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Data Storage

All financial data is stored locally in your browser's localStorage. This means:
- Data persists between sessions
- No internet connection required
- Data is private to your browser
- Clearing browser data will remove all saved information

## Development Notes

### Code Structure
- **HTML**: Single-page application with hidden/shown containers
- **CSS**: Mobile-first approach with media queries at 700px, 900px, 1024px
- **JavaScript**: Modular functions for data management and UI updates

### Key Functions
- `showPage()`: Handles page navigation and menu state
- `displayBalance()`: Renders portion balances
- `updateBudgetPage()`: Manages budget calculations
- `renderExpenses()`: Displays expense history
- `saveData()` / `loadData()`: localStorage operations

## Contributing

This is a personal finance tool. For improvements or bug fixes:
1. Test changes across different screen sizes
2. Ensure data persistence works correctly
3. Maintain responsive design principles
4. Follow existing code style and structure

## License

This project is for personal use. Feel free to modify and adapt for your needs.

## Financial Principles

This app is built around the principle: **"Never Borrow to spend on Liability (Bad debt)"**

The allocation system encourages:
- Consistent giving and saving habits
- Emergency fund building
- Debt-free living
- Structured financial discipline