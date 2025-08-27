1. Core Architecture & Technology Stack
Frontend: A single HTML file with embedded CSS (Tailwind) and JavaScript.
Backend & Database: Google Firebase, specifically:
Firebase Authentication: Handles user sign-in. (Note: The login logic is in a separate login.html file not shown here).
Firestore Database: A NoSQL database where all application data is stored in real-time (employees, lotteries, sales, payouts, etc.).
Real-time Updates: The app uses Firestore's onSnapshot listeners. This means the UI automatically updates whenever data changes in the database, without users needing to refresh the page.
2. User Authentication & Role-Based Access Control (RBAC)
Login: A user logs in via the login.html page (not shown) using Firebase Auth.
Session Management: The main app (index.html) listens for authentication state changes. If a user is logged in, it fetches their details from the users collection in Firestore.
Roles: Each user has a role (admin, hr, manager, employee, accountant).
RBAC Enforcement: The applyRBAC() function checks the user's role and shows/hides specific UI elements (like the "Add Employee" button or the Accounting tab) based on permissions. For example, only an admin might see the button to delete a lottery.
3. Key Modules & Functionality
The system is divided into several sections, accessible via the top navigation tabs.
A. Dashboard (tab-dashboard)
This is the main overview for managers and admins.
Metrics Cards: Shows real-time totals (Employees, Active Lottery Participants, Winners, Commissions, Revenue, Profit).
Charts: Visualizes data using Chart.js.
Sales/Commission Chart: Bar chart comparing sales and calculated commissions per employee.
Role Distribution: Doughnut chart showing the breakdown of employee roles.
Performance Chart: Bar chart showing individual employee performance metrics.
Employee Management Table: The core HR functionality. Authorized users can:
View a list of all employees.
Add a new employee (with details like name, email, role, salary, commission rate, sales target, etc.).
Edit or Remove existing employees (via prompt dialogs).
B. Lotteries (tab-lotteries)
This module manages the core product: lotteries.
Create a Lottery: Admins can define a new lottery with a name, dates, prize amount, and ticket price.
View & Manage Lotteries: Lists all existing lotteries and their status (active, ended, completed).
Key Actions:
Draw Winner: For an active lottery, this function randomly selects a winner from all sold tickets, updates the lottery status, and creates a "prize" payout record for the winner.
End Lottery: Manually closes a lottery without drawing a winner.
Delete Lottery: Removes a lottery and all its associated tickets from the database.
C. Commission & Payouts Engine
This logic is woven throughout the system but has a dedicated section.
Commission Tracking: Whenever a sale is recorded (likely in the sales collection), a commission record is created for the employee based on their commission rate. These are displayed in the "Commissions (recent)" sidebar.
Payouts Management: Payouts represent money that needs to be paid out. They can be of two types:
Prize Payouts: Created automatically when a lottery winner is drawn.
Salary Payouts: Created from the Payroll module.
Status & Workflow: Payouts have a status (pending, paid). An accountant can click "Mark Paid" to update the status and record the payment date.
D. Payroll (tab-payroll)
This module automates salary calculations.
Select Month: The user chooses a month (e.g., 2024-05).
Compute Payroll: The system:
Fetches all employees and their base salaries.
Fetches all sales for that month and calculates each employee's commission.
Calculates bonuses for employees who exceeded their sales targets.
Sums it all up (Base + Commission + Bonus) into a total payout for the month.
Save to Payouts: The computed payroll can be saved, which creates a batch of "salary" payout records in the payouts collection for an accountant to later mark as paid.
E. Accounting (tab-accounting)
Provides a financial overview for a selected month.
Summary Cards: Shows total Revenue (from ticket sales), Prize Payouts, Commissions/Salaries paid, and the resulting Profit (Revenue - Prizes - Salaries).
Breakdown Table: Lists every financial transaction (sales and payouts) for the month, providing a detailed audit trail.
F. Compliance (tab-compliance)
A simple system to track mandatory requirements for employees (e.g., training, certifications, document submissions).
Add Items: HR can assign a requirement to an employee with a deadline.
Track Status: Items are marked as pending or complete.
Alerts: The dashboard shows upcoming deadlines and overdue items, helping to avoid compliance issues.
4. Data Flow & Relationships
The entire system is driven by collections in Firestore. Here’s how they connect:
employees: The central collection. Each employee document contains their personal and financial details.
lotteries: Contains the definition of each lottery.
tickets: Linked to a lotteryId and an ownerEmail (employee who sold it). A ticket is marked as sold.
sales: Records each ticket sale, linked to an employeeEmail and a lotteryId. This is the source for revenue and commission calculations.
commissions: Created from sales, linked to an employeeEmail.
payouts: Records money to be paid out, linked to an employeeEmail. Can be a prize or salary type.
compliance: Tracks tasks for each employeeEmail.
users: Stores login credentials and the role for Firebase Auth users.
5. The "Lottery" Process - A Practical Example
Admin creates a lottery: "Grand Prize Draw" with a ₵10,000 prize, tickets at ₵10.
Employee sells tickets: When an employee (e.g., john@lotterycorp.com) sells a ticket, a document is added to the sales collection with price: 10, employeeEmail: "john@lotterycorp.com", and lotteryId: "grand-prize-draw".
Commission is calculated: A commission document is automatically created for John for ₵1 (assuming his commission rate is 10%).
Dashboard updates: The "Total Commissions" and "Revenue" metrics go up in real-time.
Drawing the winner: The admin clicks "Draw Winner". The system:
Queries all tickets sold for the "Grand Prize Draw".
Randomly picks one.
Updates the lotteries document with the winner's email.
Creates a payouts document of type prize for ₵10,000 for the winner, with status pending.
Paying out: An accountant sees the pending prize payout and clicks "Mark Paid", updating its status and recording the payment date.
Accounting view: In the Accounting tab, the ₵10,000 prize payout is now reflected, reducing the overall profit for the month.
Summary
This HRMS is a complete, integrated business management system for a lottery company. It handles not just employees (HR), but also the product lifecycle (Lotteries), sales tracking, commission calculations, payroll processing, financial accounting, and compliance tracking—all in real-time using Firebase's powerful and scalable infrastructure. The single-page application design provides a smooth, app-like user experience.

