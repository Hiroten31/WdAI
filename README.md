# ZTPAI - Project
This is repository that will hold my project of application to fulfill ZTPAI subject.
The requirements are:

1. [README and run](#1-description) - clear description of project and how to setup it
2. [Architecture / ERD](#2-architecture) - readable diagram ERD with at least 5 tables
3. [Database](#3-database) - at least 3NF normalization with 30 records
4. [Git repository](#4-repository) - at least 40 commits with clear history and commit message convention
5. [Functionality](#5-functionality) - implemented at least 70% of declared function
6. [Technology stack](#6-technology-stack) - backend and frontend built using modern technologies with a short justification
7. [Code architecture](#7-code-architecture) - clearly separated files (controllers, services)
8. [UX/UI](#8-uxui) - application is responsive, correct design choices
9. [Authentication](#9-authentication) - JWT, user roles, proper session handling
10. [API](#10-api) - REST/GraphQL compliant with standards, correct status and errors handling
11. [Frontend–API](#11-frontend-api) - frontend clearly use API, correct handling of loading and errors states
12. [Code quality](#12-code-quality) - no duplicated code, retained name convention, no garbage code
13. [Asynchronous processing / queues](#13-asynchronous-processing--queues) - example of queued task (RabbitMQ/Kafka)
14. [API documentation](#14-api-documentation) - complete and up-to-date Swagger/OpenAPI

## 1. Description
The Project is aimed to help in building complex stories in clear and organized way.

<logo></logo>

> **The idea behind StoryForge**
> Building stories and worlds doesn't come in straight line, it comes in various different steps and ideas.
> You came up with a village, a character and some cool plot twists, but the full story is not clear YET.
> Normally you would have to try and put it together right away, which already seen like a hard task.
> Creativity need some freedom - which this site helps to provide.

At the StoryForge you will be able to create and edit notes for your ideas, tag them and connect with other notes.

**As example**:
You created a village named "*Nilfgaard*" - tagged it as `location` and saved it.
You created a character named "*Cynthia*" - tagged it as `character` and connected it to the `location` of *Nilfgaard*.

Now you will see in a overview a nested list tree that will connect one to another making it easier to keep track of how the story is developing.

## 2. Architecture
Placeholder:

<img width="603" height="636" alt="Screenshot 2025-11-22 at 11 19 29" src="https://github.com/user-attachments/assets/e08ee95c-3334-49af-89d5-ff724ac031b3" />

## 3. Database
Normalized level at 3NF, with at least 30 test records.

## 4. Repository
The repository is build based on the project idea "StoryForge" and the branches are different types of realization.
In the end this branch will became `main` and be the only branch and implementation of the idea. Hopefully.

## 5. Functionality
- Logging into the website
- Creating multiple `Project`s
- Creating `tags` in each `Project`
- Adding `notes` for each `Project`
- Adding `tags` for each `note`
- Making `notes` able to be parent to eachother endlessly
- Generating the nested list of `notes` and reactive requests during the interactions (probably won't work)

If I'll have enough time:
- Adding `sketches`, so upload of images for each `Project`
- Adding roles
- Adding sharing to other users

## 6. Technology stack
1. React - I'll need `dnd-kit` library for my nested list generation
2. Node.js + Express - Great communication tool for my case
3. PostgreSQL - I used it few times and created a cluster with it, very lightweighted

## 7. Code architecture
**Project**:

ZTPAI/

├── backend/

│   ├── src/

│   │   ├── index.js

│   ├── package.json

│   └── Dockerfile

│

├── frontend/

│   ├── src/

│   ├── package.json

│   └── Dockerfile

│

├── docker-compose.yml

└── README.md



## 8. UX/UI

I will need to use [this feature](https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/iframe.html?id=examples-tree-sortable--all-features&viewMode=story) on one of my sites

## 9. Authentication

## 10. API

## 11. Frontend-API

## 12. Code quality

The best!

## 13. Asynchronous processing / queues

## 14. API documentation
