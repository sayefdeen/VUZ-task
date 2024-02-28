# VUZ Task

Welcome to our project! Below you'll find instructions on how to get started with the project, along with an overview of its structure.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**: 
    ```
    git clone https://github.com/your-username/project.git
    ```

2. **Install Dependencies**:
    ```
    cd project
    npm ci
    docker-compose up --build -d
    ```

3. **Configure Environment Variables**:
    - Copy `.env.example` to `.env` and fill in the necessary environment variables, you can find them on email

4. **Start the Application**:
    ```
    npm run start:dev
    ```

5. **Access the Application**:
    - Once the API is started, you can use it at `http://localhost:3000` in postman.
    - Install this [POSTMAN](https://drive.google.com/drive/folders/1pIRNKH7OktkWc7-Qj0y-tUoTdkF3GrO9?usp=sharing) json files

## Project Structure

Here's an overview of the project structure:

```
project/
│
├── src/ # Source code
│ ├── consumers/ # Real Time consumers
│ │ ├── shipmentDelete.consumer.ts
│ │ ├── shipmentUpdate.consumer.ts
│ │ └── index.ts
│ │
│ ├── controllers/ # Controllers handling business logic
│ │ ├── auth.controller.ts
│ │ ├── admin.controller.ts
│ │ ├── user.controller.ts
│ │ └── index.ts
│ │
│ ├── dtos/
│ │ ├── createShipment.dto.ts
│ │ ├── createUser.dto.ts
│ │ ├── returnedUser.dto.ts
│ │ ├── shipmentFeedBack.dto.ts
│ │ ├── signIn.dto.ts
│ │ ├── updateShipment.dto.ts
│ │ ├── index.ts
│ │
│ ├── entities/
│ │ ├── shipment.ts
│ │ ├── users.ts
│ │ └── index.ts
│ │
│ ├── enums/
│ │ ├── kafka.ts
│ │ ├── Role.ts
│ │ ├── shipment.ts
│ │ ├── userStatus.ts
│ │ ├── index.ts
│ │
│ ├── interceptors/
│ │ ├── admin.interceptor.ts
│ │ ├── authentication.interceptor.ts
│ │ ├── userSerialize.interceptor.ts
│ │ ├── index.ts
│ │
│ ├── modules/
│ │ ├── admin.module.ts
│ │ ├── auth.module.ts
│ │ ├── kafka.module.ts
│ │ ├── mail.module.ts
│ │ ├── user.module.ts
│ │ └── index.ts
│ │
│ ├── services/
│ │ ├── admin.service.ts
│ │ ├── auth.service.ts
│ │ ├── bcrypt.service.ts
│ │ ├── jwt.service.ts
│ │ ├── kafkaConsumer.service.ts
│ │ ├── kafkaProducer.service.ts
│ │ ├── mail.service.ts
│ │ ├── user.service.ts
│ │ └── index.ts
│ │
│ ├── app.controller.ts
│ ├── app.module.ts
│ ├── app.service.ts
│ ├── main.ts
│ 
│ 
├── .env
├── .env.example
├── .eslintrc.js
├── .gitignore
├── .nvmrc
├── .prettierrc
├── docker-compose.yaml
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

Feel free to explore the directories further to understand more about each component of the project.

# Documentations

## Admin Controller API Documentation

### PATCH /admin/approve

- **Method:** PATCH
- **Description:** Approve a user.
- **Accepts:**
  - Query Parameter:
    - `email`: String (Email of the user to approve)
- **Returns:** No content (HTTP 204)

### PATCH /admin/disable

- **Method:** PATCH
- **Description:** Disable a user.
- **Accepts:**
  - Query Parameter:
    - `email`: String (Email of the user to disable)
- **Returns:** No content (HTTP 204)

### GET /admin/shipment

- **Method:** GET
- **Description:** Get all shipments.
- **Accepts:**
  - Query Parameters (optional):
    - `limit`: Number (Number of shipments to retrieve)
    - `page`: Number (Page number)
- **Returns:** JSON array of shipment objects

### POST /admin/shipment

- **Method:** POST
- **Description:** Create a new shipment.
- **Accepts:**
  - Body:
    - `origin`: String (Origin of the shipment)
    - `destination`: String (Destination of the shipment)
    - `deliveryPreferences`: Object (Delivery preferences)
      - `deliveryTimeWindows`: Object (Delivery time windows)
        - `from`: String (Start time of delivery window)
        - `to`: String (End time of delivery window)
      - `packagingInstructions`: String (Optional packaging instructions)
      - `deliveryVehicleTypePreferences`: Enum (Delivery vehicle type preferences)
- **Returns:** JSON object of the created shipment

### PATCH /admin/shipment/:id

- **Method:** PATCH
- **Description:** Update an existing shipment.
- **Accepts:**
  - Path Parameter:
    - `id`: String (ID of the shipment to update)
  - Body:
    - `origin`: String (Optional updated origin of the shipment)
    - `destination`: String (Optional updated destination of the shipment)
    - `deliveryPreferences`: Object (Optional updated delivery preferences)
      - `deliveryTimeWindows`: Object (Optional updated delivery time windows)
        - `from`: String (Optional updated start time of delivery window)
        - `to`: String (Optional updated end time of delivery window)
      - `packagingInstructions`: String (Optional updated packaging instructions)
      - `deliveryVehicleTypePreferences`: Enum (Optional updated delivery vehicle type preferences)
    - `status`: Enum (Optional updated status of the shipment)
- **Returns:** JSON object of the updated shipment

### DELETE /admin/shipment/:id

- **Method:** DELETE
- **Description:** Delete a shipment.
- **Accepts:**
  - Path Parameter:
    - `id`: String (ID of the shipment to delete)
- **Returns:** No content (HTTP 204)


## Auth Controller API Documentation

### POST /auth/register

- **Method:** POST
- **Description:** Register a new user.
- **Accepts:**
  - Body:
    - `user`: Object (CreateUserDto)
      - `email`: String (User's email)
      - `password`: String (User's password)
      - `fullName`: String (User's full name)
- **Returns:** JSON object of the created user and authentication token (ReturnedUserDto)
  - `user`: Object (UserDto)
    - `email`: String (User's email)
    - `fullName`: String (User's full name)
    - `role`: Enum (User's role)
  - `token`: String (User's authentication token)

### POST /auth/signin

- **Method:** POST
- **Description:** Sign in a user.
- **Accepts:**
  - Body:
    - `body`: Object (SignInDto)
      - `email`: String (User's email)
      - `password`: String (User's password)
- **Returns:** JSON object containing user details and authentication token (ReturnedUserDto)
  - `user`: Object (UserDto)
    - `email`: String (User's email)
    - `fullName`: String (User's full name)
    - `role`: Enum (User's role)
  - `token`: String (User's authentication token)

## User Controller API Documentation

### GET /user/shipment

- **Method:** GET
- **Description:** Get all shipments for the user.
- **Accepts:**
  - Query Parameters (optional):
    - `limit`: Number (Number of shipments to retrieve)
    - `page`: Number (Page number)
- **Returns:** JSON array of shipment objects

### POST /user/shipment

- **Method:** POST
- **Description:** Create a new shipment for the user.
- **Accepts:**
  - Body:
    - `body`: Object (CreateShipmentDto)
      - `origin`: String (Shipment's origin)
      - `destination`: String (Shipment's destination)
      - `deliveryPreferences`: Object (DeliveryPreferencesDto)
        - `deliveryTimeWindows`: Object (DeliveryTimeWindowsDto)
          - `from`: String (Delivery window start time)
          - `to`: String (Delivery window end time)
        - `packagingInstructions`: String (Packaging instructions)
        - `deliveryVehicleTypePreferences`: Enum (Delivery vehicle type preferences)
- **Returns:** JSON object of the created shipment

### PATCH /user/shipment/:id

- **Method:** PATCH
- **Description:** Update an existing shipment for the user.
- **Accepts:**
  - Path Parameter:
    - `id`: String (ID of the shipment to update)
  - Body:
    - `body`: Partial object (CreateShipmentDto)
      - `origin`: String (Shipment's origin)
      - `destination`: String (Shipment's destination)
      - `deliveryPreferences`: Object (DeliveryPreferencesDto)
        - `deliveryTimeWindows`: Object (DeliveryTimeWindowsDto)
          - `from`: String (Delivery window start time)
          - `to`: String (Delivery window end time)
        - `packagingInstructions`: String (Packaging instructions)
        - `deliveryVehicleTypePreferences`: Enum (Delivery vehicle type preferences)
- **Returns:** JSON object of the updated shipment

### DELETE /user/shipment/:id

- **Method:** DELETE
- **Description:** Cancel a shipment for the user.
- **Accepts:**
  - Path Parameter:
    - `id`: String (ID of the shipment to cancel)
- **Returns:** JSON object of the canceled shipment

### POST /user/shipment/feedBack/:id

- **Method:** POST
- **Description:** Provide feedback for a shipment.
- **Accepts:**
  - Path Parameter:
    - `id`: String (ID of the shipment to provide feedback for)
  - Body:
    - `body`: Object (ShipmentFeedBack)
      - `rating`: Number (Rating for the shipment, between 1 and 5)
      - `comments`: String (Comments for the shipment)
- **Returns:** JSON object of the updated shipment