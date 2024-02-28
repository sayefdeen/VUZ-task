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