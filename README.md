# BudgetFrame

BudgetFrame is a personal finance management web application that helps users track their income, expenses, and overall financial health in a visually appealing interface.

## Features

- **User Authentication**: Secure signup and login system
- **Dashboard**: Overview of financial status including income, expenses, and net balance
- **Profile Management**: Customize user profile and personal information
- **Income Tracking**: Record and categorize various income sources
- **Expense Management**: Track expenses by category
- **Visual Reports**: View financial data through interactive charts and graphs
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Interface**: Glassmorphic UI with blue accents

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Passport.js
- **Design**: Bootstrap with custom glassmorphic styling

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/budgetframe.git
   ```

2. Install dependencies:

   ```
   cd budgetframe
   npm install
   ```

3. Set environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables:

     ```
     DATABASE_URL=your_mongodb_connection_string
     SESSION_SECRET=your_session_secret
     USER_ID
     DB_PASSWORD
     ```

4. Start the application:

   ```
   npm start
   ```

   ```
   node server.js
   ```

5. Visit `http://localhost:8080` in your browser

## Project Structure

```
budgetframe/
├── config/
│   ├── database.js
│   └── passport.js
├── models/
│   └── user.js
├── public/
│   ├── images/
│   ├── style.css
│   └── main.js
├── routes/
│   └── routes.js
├── views/
│   ├── index.ejs
│   ├── profile.ejs
│   ├── dashboard.ejs
│   └── login.ejs
├── server.js
├── package.json
└── README.md
```

## Usage

### Dashboard

The dashboard provides a comprehensive view of your financial status:

- **Income Section**: Add and view income from various sources
- **Expenses Section**: Track expenses by category
- **Net Balance**: See your overall financial position
- **Visualizations**: Pie charts for expense categories and bar charts for income vs expenses

### Profile Management

The profile page allows users to:

- Edit username and profile name
- View and manage account information

## API Routes

### Authentication Routes

- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /signup` - Signup page
- `POST /signup` - Register new user
- `GET /logout` - Log out user

### Profile Routes

- `GET /profile` - View profile
- `POST /update-profile` - Update profile information
- `POST /upload-profile-photo` - Upload profile photo

### Dashboard Routes

- `GET /dashboard` - View dashboard
- `POST /add-income` - Add new income
- `POST /add-expense` - Add new expense
- `GET /get-finances` - Get all financial data
- `DELETE /delete-income/:id` - Delete income record
- `DELETE /delete-expense/:id` - Delete expense record

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for icons
- Bootstrap for base styling
- The glassmorphic design trend for UI inspiration
