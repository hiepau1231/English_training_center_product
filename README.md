
# English Teaching Center Management

**A Node.js web application using Express.js to manage student information, courses, teachers, and class schedules for an English teaching center.**

## Introduction

This application is built for the following purposes:

* Managing students' personal information.
* Managing the courses being taught.
* Managing class schedules.
* Tracking students' learning progress.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- npm

### Installation

1. Clone the repository:
    - git clone https://github.com/DatEdric/English_training_center_product.git
    After cloning, navigate into the project directory:
    - cd English_training_center_product
    To view all available branches, use the command:
    - git branch -a
    - git checkout -b master origin/master
    - git branch
2. Install dependencies:
    - npm install
3. Running the Application
    You can run the application using either of the following commands:
    - npm start
    or
    - node app
4. Running Tests
To run all the test cases, use:
npm test
To run individual test cases from the tests directory:
npx jest tests/classroomAPI.test.js
npx jest tests/scheduleAPI.test.js
npx jest tests/teacherAPI.test.js
5. The list of APIs that have been created and tested:
    Use the Postman API testing tool to view the data returned by the API.
    * Classroom API:
        - method: GET: http://localhost:3000/room/
        - method: POST: http://localhost:3000/room/
        - method: GET: http://localhost:3000/room/edit/:id
        - method: PUT: http://localhost:3000/room//update/:id
        - method: PATCH: http://localhost:3000/room/delete/:id
        - method: GET: http://localhost:3000/room/deleted-all
        - method: PUT: http://localhost:3000/room/restore/:id
        - method: DELETE: http://localhost:3000/room/force-delete
        
            * Schedule Daily API:
        - method: GET: http://localhost:3000/schedule/
        - method: POST: http://localhost:3000/schedule/
        - method: GET: http://localhost:3000/schedule/edit/:id
        - method: PUT: http://localhost:3000/schedule//update/:id
        - method: PATCH: http://localhost:3000/schedule/delete/:id
        - method: GET: http://localhost:3000/schedule/deleted-all
        - method: PUT: http://localhost:3000/schedule/restore/:id
        - method: DELETE: http://localhost:3000/schedule/force-delete

            * Teacher Schedule API:
        - method: GET: http://localhost:3000/teacher/
        - method: POST: http://localhost:3000/teacher/
        - method: GET: http://localhost:3000/teacher/edit/:id
        - method: PUT: http://localhost:3000/teacher//update/:id
        - method: PATCH: http://localhost:3000/teacher/delete/:id
        - method: GET: http://localhost:3000/teacher/deleted-all
        - method: PUT: http://localhost:3000/teacher/restore/:id
        - method: DELETE: http://localhost:3000/teacher/force-delete
        

This version includes all the specific command instructions inside the `README.md` file.