Employee Management System
==========================

This project is an **Employee Management System** built with **Next.js 14**, using the **App Directory** structure, **Prisma ORM**, and **Zod** for validation. The UI components are styled using **ShadCN UI**, and **PNPM** is used as the package manager.

Technologies Used
-----------------

-   **Next.js 14 (App Directory)**
-   **Zod** for schema validation
-   **ShadCN UI** for styling and components
-   **PNPM** for package management

Prerequisites
-------------

Before you begin, ensure you have the following installed:

-   **Node.js** (v18 or later)
-   **PNPM** (v8 or later)

Setup and Installation
----------------------

### 1\. Clone the repository:

bash

Copy code

`git clone https://github.com/egagofur/fe-test-semudahitu.git
cd be-test-semudahitu`

### 2\. Install dependencies:

bash

Copy code

`pnpm install`

### 3\. Set up your environment variables:

-   Copy the `.env.example` file to `.env`:

bash

Copy code

`pnpm dev`

The server should now be running at `http://localhost:3000`.

API Documentation
-----------------

This Employee Management System provides a RESTful API for managing employee data. The API is structured as follows:

-   **GET** `/api/employees` - Retrieve a list of all employees
-   **POST** `/api/employees` - Create a new employee
-   **GET** `/api/employees/{id}` - Retrieve a specific employee by ID
-   **PUT** `/api/employees/{id}` - Update an employee's details
-   **DELETE** `/api/employees/{id}` - Delete an employee by ID

### Validation

-   All input data is validated using **Zod** for strict type safety.
-   Example of Zod validation:

typescript

Copy code

`import { z } from 'zod';

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  position: z.string().min(1, "Position is required"),
  salary: z.number().positive("Salary must be a positive number"),
});`
