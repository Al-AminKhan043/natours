# Natours Application

Natours is a feature-rich application that allows users to explore exciting tours, create accounts, book tours, and manage their personal profiles. The application also includes a robust role-based access control system, enabling admins and guides to manage the platform effectively.

---

## Features

### **For All Users:**
- **Explore Tours**: Browse through an extensive collection of tours.
- **View Specific Tours**: Get detailed information about any selected tour.
- **Account Creation**: Easily sign up and start exploring.

### **For Logged-in Users:**
- **Book Tours**: Use a demo payment method with credit cards to book tours seamlessly.
- **View Booked Tours**: Access a list of all tours you've booked.
- **User Dashboard**:
  - View account details.
  - Update your email, password, and name.

### **Roles and Permissions:**
- **Admin**:
  - Full access to delete and update tours.
  - Manage the entire application.
- **Lead Guide** and **Guide**:
  - Restricted roles with access to manage tours as needed.
- **Users**:
  - Standard users with access to view and book tours.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Integration**: Stripe
- **Authentication**: JWT-based authentication and authorization

---

## Installation and Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/natours.git
   cd natours
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Setup Environment Variables:**
   Create a `config.env` file in the root directory and add the following:
   ```env
   PORT=3000
   DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours
   DATABASE_PASSWORD=<your_database_password>
   JWT_SECRET=<your_jwt_secret>
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   STRIPE_SECRET_KEY=<your_stripe_secret_key>
   STRIPE_PUBLIC_KEY=<your_stripe_public_key>
   ```

4. **Run the Application:**
   ```bash
   npm start
   ```

5. **Access the Application:**
   Navigate to `http://127.0.0.1:3000` in your web browser.

---

## Usage

### **Demo User Accounts:**
- **Admin**:
  - Email: `admin@natours.io`
  - Password: `admin123`
- **Standard User**:
  - Email: `user@natours.io`
  - Password: `user123`

### **Demo Payment:**
Use the following credit card details to test the booking feature:
- Card Number: `4242 4242 4242 4242`
- Expiry Date: `12/34`
- CVC: `123`

---

## API Documentation

The Natours app exposes a RESTful API for client-server communication. For detailed API endpoints, refer to the [API Documentation](https://documenter.getpostman.com/view/39944898/2sAYQWJszp).

---

---

## Contributing

We welcome contributions! If you have an idea or find a bug, feel free to:
1. Fork the repository.
2. Create a new branch.
3. Submit a pull request.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.


---

### Happy Touring with Natours! 🌍
