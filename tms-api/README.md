# IAM Module API

Identity and Access Management (IAM) Module API is a backend RESTful API built with Node.js and Express. It contains features for basic user registration and authentication, as well as group and user management for both users and administrators.

<!--- If we have only one group/collection, then no need for the "ungrouped" heading -->

## Endpoints

- [Authentication](#authentication)
  1. [Register User](#1-register-user)
     - [200 Register User](#i-example-request-200-register-user)
     - [400 Email/Username Exists](#ii-example-request-400-emailusername-exists)
     - [400 Body Empty](#iii-example-request-400-body-empty)
     - [400 Fields Empty](#iv-example-request-400-fields-empty)
     - [400 Types Invalid](#v-example-request-400-types-invalid)
     - [400 Fields Invalid](#vi-example-request-400-fields-invalid)
  1. [Login User](#2-login-user)
     - [200 Login User](#i-example-request-200-login-user)
     - [401 Username/Password Invalid](#ii-example-request-401-usernamepassword-invalid)
     - [401 Body Empty](#iii-example-request-401-body-empty)
     - [401 Fields Empty](#iv-example-request-401-fields-empty)
     - [401 Types Invalid](#v-example-request-401-types-invalid)
     - [401 Fields Invalid](#vi-example-request-401-fields-invalid)
     - [403 User Disabled](#vii-example-request-403-user-disabled)
  1. [Logout User](#3-logout-user)
     - [200 Logout User](#i-example-request-200-logout-user)
- [Groups](#groups)
  1. [Get All Groups](#1-get-all-groups)
     - [200 Get All Groups](#i-example-request-200-get-all-groups)
     - [401 Current User Not Logged In](#ii-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#iii-example-request-403-current-user-disabled)
  1. [Create New Group (Admin)](#2-create-new-group-admin)
     - [200 Create New Group (Admin)](#i-example-request-200-create-new-group-admin)
     - [200 Create New Groups (Admin)](#ii-example-request-200-create-new-groups-admin)
     - [400 Body Empty (Admin)](#iii-example-request-400-body-empty-admin)
     - [400 Group Empty (Admin)](#iv-example-request-400-group-empty-admin)
     - [400 Group Invalid (Admin)](#v-example-request-400-group-invalid-admin)
     - [400 Group Exists (Admin)](#vi-example-request-400-group-exists-admin)
     - [400 Groups Invalid (Admin)](#vii-example-request-400-groups-invalid-admin)
     - [400 Group In Groups Invalid (Admin)](#viii-example-request-400-group-in-groups-invalid-admin)
     - [400 Group In Groups Exists (Admin)](#ix-example-request-400-group-in-groups-exists-admin)
     - [401 Current User Not Logged In](#x-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#xi-example-request-403-current-user-disabled)
     - [403 Create New Group (User)](#xii-example-request-403-create-new-group-user)
  1. [Get Users In Group (Admin)](#3-get-users-in-group-admin)
     - [200 Get Users In Group (Admin)](#i-example-request-200-get-users-in-group-admin)
     - [400 Group Invalid (Admin)](#ii-example-request-400-group-invalid-admin)
     - [401 Current User Not Logged In](#iii-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#iv-example-request-403-current-user-disabled)
     - [403 Get Users In Group (User)](#v-example-request-403-get-users-in-group-user)
     - [404 Group Not Found (Admin)](#vi-example-request-404-group-not-found-admin)
  1. [Add User To Group (Admin)](#4-add-user-to-group-admin)
     - [200 Add User To Group (Admin)](#i-example-request-200-add-user-to-group-admin)
     - [200 Add Users To Group (Admin)](#ii-example-request-200-add-users-to-group-admin)
     - [400 Group Invalid (Admin)](#iii-example-request-400-group-invalid-admin)
     - [400 Username Invalid (Admin)](#iv-example-request-400-username-invalid-admin)
     - [400 Username Not Found (Admin)](#v-example-request-400-username-not-found-admin)
     - [400 Username Already In Group (Admin)](#vi-example-request-400-username-already-in-group-admin)
     - [400 Usernames Invalid (Admin)](#vii-example-request-400-usernames-invalid-admin)
     - [400 Username In Usernames Invalid (Admin)](#viii-example-request-400-username-in-usernames-invalid-admin)
     - [400 Username In Usernames Not Found (Admin)](#ix-example-request-400-username-in-usernames-not-found-admin)
     - [400 Username In Usernames Already In Group (Admin)](#x-example-request-400-username-in-usernames-already-in-group-admin)
     - [401 Current User Not Logged In](#xi-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#xii-example-request-403-current-user-disabled)
     - [403 Add User To Group (User)](#xiii-example-request-403-add-user-to-group-user)
     - [404 Group Not Found (Admin)](#xiv-example-request-404-group-not-found-admin)
  1. [Remove User From Group (Admin)](#5-remove-user-from-group-admin)
     - [200 Remove User From Group (Admin)](#i-example-request-200-remove-user-from-group-admin)
     - [200 Remove Users From Group (Admin)](#ii-example-request-200-remove-users-from-group-admin)
     - [400 Group Invalid (Admin)](#iii-example-request-400-group-invalid-admin-1)
     - [400 Username Invalid (Admin)](#iv-example-request-400-username-invalid-admin-1)
     - [400 Username Not Found (Admin)](#v-example-request-400-username-not-found-admin-1)
     - [400 Username Not In Group (Admin)](#vi-example-request-400-username-not-in-group-admin)
     - [400 Usernames Invalid (Admin)](#vii-example-request-400-usernames-invalid-admin-1)
     - [400 Username In Usernames Invalid (Admin)](#viii-example-request-400-username-in-usernames-invalid-admin-1)
     - [400 Username In Usernames Not Found (Admin)](#ix-example-request-400-username-in-usernames-not-found-admin-1)
     - [400 Username In Usernames Not In Group (Admin)](#x-example-request-400-username-in-usernames-not-in-group-admin)
     - [401 Current User Not Logged In](#xi-example-request-401-current-user-not-logged-in-1)
     - [403 Current User Disabled](#xii-example-request-403-current-user-disabled-1)
     - [403 Remove User From Group (User)](#xiii-example-request-403-remove-user-from-group-user)
     - [404 Group Not Found (Admin)](#xiv-example-request-404-group-not-found-admin-1)
- [Users](#users)
  1. [Get All Users (Admin)](#1-get-all-users-admin)
     - [200 Get All Users (Admin)](#i-example-request-200-get-all-users-admin)
     - [200 Search All Users By Username (Admin)](#ii-example-request-200-search-all-users-by-username-admin)
     - [200 Filter All Users By Active Status (Admin)](#iii-example-request-200-filter-all-users-by-active-status-admin)
     - [200 Filter All Users By Group (Admin)](#iv-example-request-200-filter-all-users-by-group-admin)
     - [200 Filter All Users By Groups (Admin)](#v-example-request-200-filter-all-users-by-groups-admin)
     - [200 Get All Users With Limit (Admin)](#vi-example-request-200-get-all-users-with-limit-admin)
     - [200 Get All Users With Limit And Page (Admin)](#vii-example-request-200-get-all-users-with-limit-and-page-admin)
     - [200 Get All Users With Limit And Offset (Admin)](#viii-example-request-200-get-all-users-with-limit-and-offset-admin)
     - [400 Fields Invalid (Admin)](#ix-example-request-400-fields-invalid-admin)
     - [400 Limit Missing (Admin)](#x-example-request-400-limit-missing-admin)
     - [401 Current User Not Logged In](#xi-example-request-401-current-user-not-logged-in-2)
     - [403 Current User Disabled](#xii-example-request-403-current-user-disabled-2)
     - [403 Get All Users (User)](#xiii-example-request-403-get-all-users-user)
  1. [Create User (Admin)](#2-create-user-admin)
     - [200 Create User (Admin)](#i-example-request-200-create-user-admin)
     - [200 Create User With Group (Admin)](#ii-example-request-200-create-user-with-group-admin)
     - [200 Create User With Groups (Admin)](#iii-example-request-200-create-user-with-groups-admin)
     - [400 Email/Username Exists (Admin)](#iv-example-request-400-emailusername-exists-admin)
     - [400 Body Empty (Admin)](#v-example-request-400-body-empty-admin)
     - [400 Fields Empty (Admin)](#vi-example-request-400-fields-empty-admin)
     - [400 Types Invalid (Admin)](#vii-example-request-400-types-invalid-admin)
     - [400 Fields Invalid (Admin)](#viii-example-request-400-fields-invalid-admin)
     - [400 Group Not Found (Admin)](#ix-example-request-400-group-not-found-admin)
     - [400 Group In Groups Invalid (Admin)](#x-example-request-400-group-in-groups-invalid-admin)
     - [400 Group In Groups Not Found (Admin)](#xi-example-request-400-group-in-groups-not-found-admin)
     - [401 Current User Not Logged In](#xii-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#xiii-example-request-403-current-user-disabled)
     - [403 Create User (User)](#xiv-example-request-403-create-user-user)
  1. [Get Current User](#3-get-current-user)
     - [200 Get Current User](#i-example-request-200-get-current-user)
     - [401 Current User Not Logged In](#ii-example-request-401-current-user-not-logged-in-1)
     - [403 Current User Disabled](#iii-example-request-403-current-user-disabled-1)
  1. [Get User](#4-get-user)
     - [200 Get Current User](#i-example-request-200-get-current-user-1)
     - [200 Get Other User (Admin)](#ii-example-request-200-get-other-user-admin)
     - [400 Username Invalid (Admin)](#iii-example-request-400-username-invalid-admin)
     - [401 Current User Not Logged In](#iv-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#v-example-request-403-current-user-disabled)
     - [403 Get Other User (User)](#vi-example-request-403-get-other-user-user)
     - [404 User Not Found (Admin)](#vii-example-request-404-user-not-found-admin)
  1. [Update Current User](#5-update-current-user)
     - [200 Update Current User Email And Password](#i-example-request-200-update-current-user-email-and-password)
     - [200 Update Current User Active Status (Admin)](#ii-example-request-200-update-current-user-active-status-admin)
     - [200 Update Current User Groups (Admin)](#iii-example-request-200-update-current-user-groups-admin)
     - [400 Body Empty](#iv-example-request-400-body-empty)
     - [400 Fields Empty](#v-example-request-400-fields-empty)
     - [400 Fields Invalid](#vi-example-request-400-fields-invalid-1)
     - [400 Types Invalid](#vii-example-request-400-types-invalid)
     - [400 Email Exists](#viii-example-request-400-email-exists)
     - [400 Group In Groups Not Found (Admin)](#ix-example-request-400-group-in-groups-not-found-admin)
     - [401 Current User Not Logged In](#x-example-request-401-current-user-not-logged-in-1)
     - [403 Current User Disabled](#xi-example-request-403-current-user-disabled-1)
     - [403 Update Current User Active Status (User)](#xii-example-request-403-update-current-user-active-status-user)
     - [403 Update Current User Groups (User)](#xiii-example-request-403-update-current-user-groups-user)
  1. [Update User](#6-update-user)
     - [200 Update Current User Email And Password](#i-example-request-200-update-current-user-email-and-password-1)
     - [200 Update Current User Active Status (Admin)](#ii-example-request-200-update-current-user-active-status-admin-1)
     - [200 Update Current User Groups (Admin)](#iii-example-request-200-update-current-user-groups-admin-1)
     - [200 Update Other User Email And Password (Admin)](#iv-example-request-200-update-other-user-email-and-password-admin)
     - [200 Update Other User Active Status (Admin)](#v-example-request-200-update-other-user-active-status-admin)
     - [200 Update Other User Groups (Admin)](#vi-example-request-200-update-other-user-groups-admin)
     - [400 Invalid Username (Admin)](#vii-example-request-400-invalid-username-admin)
     - [400 Body Empty](#viii-example-request-400-body-empty)
     - [400 Fields Empty](#ix-example-request-400-fields-empty)
     - [400 Fields Invalid](#x-example-request-400-fields-invalid)
     - [400 Types Invalid](#xi-example-request-400-types-invalid)
     - [400 Email Exists](#xii-example-request-400-email-exists)
     - [400 Group In Groups Not Found (Admin)](#xiii-example-request-400-group-in-groups-not-found-admin)
     - [401 Current User Not Logged In](#xiv-example-request-401-current-user-not-logged-in)
     - [403 Current User Disabled](#xv-example-request-403-current-user-disabled)
     - [403 Update Current User Active Status (User)](#xvi-example-request-403-update-current-user-active-status-user)
     - [403 Update Current User Groups (User)](#xvii-example-request-403-update-current-user-groups-user)
     - [403 Update Other User Email And Password (User)](#xviii-example-request-403-update-other-user-email-and-password-user)
     - [403 Update Other User Active Status (User)](#xix-example-request-403-update-other-user-active-status-user)
     - [403 Update Other User Groups (User)](#xx-example-request-403-update-other-user-groups-user)
     - [404 User Not Found (Admin)](#xxi-example-request-404-user-not-found-admin)
  1. [Get Current User Groups](#7-get-current-user-groups)
     - [200 Get Current User Groups](#i-example-request-200-get-current-user-groups)
     - [401 Current User Not Logged In](#ii-example-request-401-current-user-not-logged-in-2)
     - [403 Current User Disabled](#iii-example-request-403-current-user-disabled-2)
  1. [Get User Groups](#8-get-user-groups)
     - [200 Get Current User Groups](#i-example-request-200-get-current-user-groups-1)
     - [200 Get Other User Groups (Admin)](#ii-example-request-200-get-other-user-groups-admin)
     - [400 Username Invalid (Admin)](#iii-example-request-400-username-invalid-admin-1)
     - [401 Current User Not Logged In](#iv-example-request-401-current-user-not-logged-in-1)
     - [403 Current User Disabled](#v-example-request-403-current-user-disabled-1)
     - [403 Get Other User Groups (User)](#vi-example-request-403-get-other-user-groups-user)
     - [404 User Not Found (Admin)](#vii-example-request-404-user-not-found-admin-1)
  1. [Check Current User Group](#9-check-current-user-group)
     - [200 Check Current User Group](#i-example-request-200-check-current-user-group)
     - [200 Check Current User Groups](#ii-example-request-200-check-current-user-groups)
     - [400 Group Missing](#iii-example-request-400-group-missing)
     - [400 Group Empty](#iv-example-request-400-group-empty)
     - [400 Group Invalid](#v-example-request-400-group-invalid)
     - [400 Group Not Found](#vi-example-request-400-group-not-found)
     - [400 Groups Invalid](#vii-example-request-400-groups-invalid)
     - [400 Group In Groups Invalid](#viii-example-request-400-group-in-groups-invalid)
     - [400 Group In Groups Not Found](#ix-example-request-400-group-in-groups-not-found)
     - [401 Current User Not Logged In](#x-example-request-401-current-user-not-logged-in-2)
     - [403 Current User Disabled](#xi-example-request-403-current-user-disabled-2)
  1. [Check User Group](#10-check-user-group)
     - [200 Check Current User Group](#i-example-request-200-check-current-user-group-1)
     - [200 Check Current User Groups](#ii-example-request-200-check-current-user-groups-1)
     - [200 Check Other User Group (Admin)](#iii-example-request-200-check-other-user-group-admin)
     - [400 Username Invalid (Admin)](#iv-example-request-400-username-invalid-admin-2)
     - [400 Group Missing](#v-example-request-400-group-missing)
     - [400 Group Empty](#vi-example-request-400-group-empty)
     - [400 Group Invalid](#vii-example-request-400-group-invalid)
     - [400 Group Not Found](#viii-example-request-400-group-not-found)
     - [400 Groups Invalid](#ix-example-request-400-groups-invalid)
     - [400 Group In Groups Invalid](#x-example-request-400-group-in-groups-invalid)
     - [400 Group In Groups Not Found](#xi-example-request-400-group-in-groups-not-found)
     - [401 Current User Not Logged In](#xii-example-request-401-current-user-not-logged-in-1)
     - [403 Current User Disabled](#xiii-example-request-403-current-user-disabled-1)
     - [403 Check Other User Group (User)](#xiv-example-request-403-check-other-user-group-user)
     - [404 User Not Found (Admin)](#xv-example-request-404-user-not-found-admin)

---

## Authentication

This folder contains all APIs relating to user registration and authentication features.

### 1. Register User

Register a new user using a username, email address, and password.

#### Request Body

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must also be unique.

- `email` must be a valid email address not longer than 255 characters. It must also be unique.

- `password` must contain alphanumeric or special characters only. It must not be shorter than 8 characters or longer than 10 characters.

#### Response Data

If successful, the new user's data and a JWT will be returned.

**_Endpoint:_**

```HTTP
POST /api/v1/register HTTP/1.1
Host: {{DOMAIN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Register User

**_Body:_**

```JSON
{ "username": "new", "email": "new@example.com", "password": "password" }
```

#### I. Example Response: 200 Register User

```JSON
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "username": "new",
    "email": "new@example.com",
    "active": true,
    "groups": ["user"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ldyIsImlhdCI6MTY5NDMzNTc5OCwiZXhwIjoxNjk0OTQwNTk4fQ.d5Tp3L4v5655akh-PuJ9IAOKhJcH4Clhxw_R7DalGlM"
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 400 Email/Username Exists

**_Body:_**

```JSON
{ "username": "user", "email": "user@example.com", "password": "password" }
```

#### II. Example Response: 400 Email/Username Exists

```JSON
{
  "success": false,
  "message": "Username already exists. Email already exists.",
  "errors": {
    "username": "Username already exists.",
    "email": "Email already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### III. Example Request: 400 Body Empty

**_Body: None_**

#### III. Example Response: 400 Body Empty

```JSON
{
  "success": false,
  "message": "Username must be provided. Email must be provided. Password must be provided.",
  "errors": {
    "username": "Username must be provided.",
    "email": "Email must be provided.",
    "password": "Password must be provided."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 400 Fields Empty

**_Body:_**

```JSON
{ "username": "", "email": "", "password": "" }
```

#### IV. Example Response: 400 Fields Empty

```JSON
{
  "success": false,
  "message": "Username must not be empty. Email must not be empty. Password must not be empty.",
  "errors": {
    "username": "Username must not be empty.",
    "email": "Email must not be empty.",
    "password": "Password must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Types Invalid

**_Body:_**

```JSON
{ "username": null, "email": null, "password": null }
```

#### V. Example Response: 400 Types Invalid

```JSON
{
  "success": false,
  "message": "Username must be a string. Email must be a string. Password must be a string.",
  "errors": {
    "username": "Username must be a string.",
    "email": "Email must be a string.",
    "password": "Password must be a string."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Fields Invalid

**_Body:_**

```JSON
{ "username": "inv@lid", "email": "inv@lid", "password": "inv@lid" }
```

#### VI. Example Response: 400 Fields Invalid

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters. Email must be a string containing a valid email address. Password must have at least length 8.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters.",
    "email": "Email must be a string containing a valid email address.",
    "password": "Password must have at least length 8."
  }
}
```

**_Status Code:_** 400

<br>

### 2. Login User

Login user using a username and password.

#### Request Body

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters.

- `password` must contain alphanumeric or special characters only. It must not be shorter than 8 characters or longer than 10 characters.

#### Preconditions

- The user's account must not be disabled.

#### Response Data

If successful, the user's data and a JWT will be returned.

**_Endpoint:_**

```HTTP
POST /api/v1/login HTTP/1.1
Host: {{DOMAIN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Login User

**_Body:_**

```JSON
{ "username": "user", "password": "password" }
```

#### I. Example Response: 200 Login User

```JSON
{
  "success": true,
  "message": "User logged in successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJpYXQiOjE2OTQzNjE5MTcsImV4cCI6MTY5NDk2NjcxN30.NqrtC0A1-r9qGdeMhsrsP16VfVAQrhkJav1lTEGhoxs"
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 401 Username/Password Invalid

**_Body:_**

```JSON
{ "username": "user", "password": "password1" }
```

#### II. Example Response: 401 Username/Password Invalid

```JSON
{
  "success": false,
  "message": "Invalid username or password."
}
```

**_Status Code:_** 401

<br>

#### III. Example Request: 401 Body Empty

**_Body: None_**

#### III. Example Response: 401 Body Empty

```JSON
{
  "success": false,
  "message": "Invalid username or password."
}
```

**_Status Code:_** 401

<br>

#### IV. Example Request: 401 Fields Empty

**_Body:_**

```JSON
{ "username": "", "password": "" }
```

#### IV. Example Response: 401 Fields Empty

```JSON
{
  "success": false,
  "message": "Invalid username or password."
}
```

**_Status Code:_** 401

<br>

#### V. Example Request: 401 Types Invalid

**_Body:_**

```JSON
{ "username": null, "password": null }
```

#### V. Example Response: 401 Types Invalid

```JSON
{
  "success": false,
  "message": "Invalid username or password."
}
```

**_Status Code:_** 401

<br>

#### VI. Example Request: 401 Fields Invalid

**_Body:_**

```JSON
{ "username": "inv@lid", "password": "inv@lid" }
```

#### VI. Example Response: 401 Fields Invalid

```JSON
{
  "success": false,
  "message": "Invalid username or password."
}
```

**_Status Code:_** 401

<br>

#### VII. Example Request: 403 User Disabled

**_Body:_**

```JSON
{ "username": "inactive", "password": "password" }
```

#### VII. Example Response: 403 User Disabled

```JSON
{
  "success": false,
  "message": "User has been disabled. Please contact the administrator to access the system."
}
```

**_Status Code:_** 403

<br>

### 3. Logout User

Logout the current user.

#### Response Data

If successful, a confirmation message will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/logout HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Logout User

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body: None_**

#### I. Example Response: 200 Logout User

```JSON
{
  "success": true,
  "message": "User logged out successfully."
}
```

**_Status Code:_** 200

<br>

## Groups

This folder contains all APIs relating to group management features. Users must be logged in to access all APIs in this folder.

### 1. Get All Groups

Get all existing groups.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

#### Response Data

If successful, all existing groups will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/groups HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get All Groups

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body: None_**

#### I. Example Response: 200 Get All Groups

```JSON
{
  "success": true,
  "data": ["admin", "user"]
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body: None_**

#### II. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### III. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body: None_**

#### III. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 2. Create New Group (Admin)

Create a new group. Only administrators allowed.

#### Request Body

- `group (optional)` must contain alphanumeric characters only and must not be longer than 50 characters. It must also not be an existing group.

- `groups (optional)` must be a comma-separated string of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also not be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

- The request body must contain at least one of the above fields.

#### Response Data

If successful, a confirmation message will be returned.

**_Endpoint:_**

```HTTP
POST /api/v1/group HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Create New Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "group": "new" }
```

#### I. Example Response: 200 Create New Group (Admin)

```JSON
{
  "success": true,
  "message": "Group created successfully."
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Create New Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": ["new1", "new2"] }
```

#### II. Example Response: 200 Create New Groups (Admin)

```JSON
{
  "success": true,
  "message": "Groups created successfully."
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Body Empty (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body: None_**

#### III. Example Response: 400 Body Empty (Admin)

```JSON
{
  "success": false,
  "message": "Group must be provided.",
  "errors": {
    "group": "Group must be provided."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 400 Group Empty (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "group": "" }
```

#### IV. Example Response: 400 Group Empty (Admin)

```JSON
{
  "success": false,
  "message": "Group must not be empty.",
  "errors": {
    "group": "Group must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Group Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "group": "inv@lid" }
```

#### V. Example Response: 400 Group Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Group Exists (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "group": "user" }
```

#### VI. Example Response: 400 Group Exists (Admin)

```JSON
{
  "success": false,
  "message": "Group already exists.",
  "errors": {
    "group": "Group already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Groups Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": "inv@lid" }
```

#### VII. Example Response: 400 Groups Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Groups must be an array, or groups must be a comma-separated string.",
  "errors": {
    "groups": "Groups must be an array, or groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Group In Groups Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": ["new", "inv@lid"] }
```

#### VIII. Example Response: 400 Group In Groups Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "groups": "Group 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Group In Groups Exists (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": ["user", "admin"] }
```

#### IX. Example Response: 400 Group In Groups Exists (Admin)

```JSON
{
  "success": false,
  "message": "Group 'user' already exists, and group 'admin' already exists.",
  "errors": {
    "groups": "Group 'user' already exists, and group 'admin' already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body:_**

```JSON
{ "group": "new" }
```

#### X. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XI. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body:_**

```JSON
{ "group": "new" }
```

#### XI. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XII. Example Request: 403 Create New Group (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body:_**

```JSON
{ "group": "new" }
```

#### XII. Example Response: 403 Create New Group (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 3. Get Users In Group (Admin)

Get all users in a group. Only administrators allowed.

#### URL Variables

- `group` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

#### Response Data

If successful, all users in the group will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/group/:group/users HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get Users In Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### I. Example Response: 200 Get Users In Group (Admin)

```JSON
{
  "success": true,
  "data": ["new", "user"]
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 400 Group Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | inv@lid |             |

**_Body: None_**

#### II. Example Response: 400 Group Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### III. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### III. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### IV. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### IV. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### V. Example Request: 403 Get Users In Group (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### V. Example Response: 403 Get Users In Group (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### VI. Example Request: 404 Group Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | unknown |             |

**_Body: None_**

#### VI. Example Response: 404 Group Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group not found."
}
```

**_Status Code:_** 404

<br>

### 4. Add User To Group (Admin)

Add a user or several users into a group. Only administrators allowed.

#### URL Variables

- `group` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group.

#### Query Parameters

- `username (optional)` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must also be a username which exists and is not in the group.

- `usernames (optional)` must be a comma-separated string of usernames. Each username must contain alphanumeric characters only. They must not be shorter than 3 characters or longer than 32 characters. They must also be usernames which exists and are not in the group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

- The request query must contain at least one of the above fields.

#### Response Data

If successful, a confirmation message will be returned.

**_Endpoint:_**

```HTTP
POST /api/v1/group/:group/users HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Add User To Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user1" }
```

#### I. Example Response: 200 Add User To Group (Admin)

```JSON
{
  "success": true,
  "message": "User added to group successfully."
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Add Users To Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["user2", "user3"] }
```

#### II. Example Response: 200 Add Users To Group (Admin)

```JSON
{
  "success": true,
  "message": "Users added to group successfully."
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Group Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | inv@lid |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### III. Example Response: 400 Group Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 400 Username Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "inv@lid" }
```

#### IV. Example Response: 400 Username Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Username Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "unknown" }
```

#### V. Example Response: 400 Username Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Username not found.",
  "errors": {
    "username": "Username not found."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Username Already In Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### VI. Example Response: 400 Username Already In Group (Admin)

```JSON
{
  "success": false,
  "message": "Username already in group.",
  "errors": {
    "username": "Username already in group."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Usernames Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": "inv@lid" }
```

#### VII. Example Response: 400 Usernames Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Usernames must be an array, or usernames must be a comma-separated string.",
  "errors": {
    "usernames": "Usernames must be an array, or usernames must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Username In Usernames Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["inv@lid"] }
```

#### VIII. Example Response: 400 Username In Usernames Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "usernames": "Username 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Username In Usernames Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["unknown"] }
```

#### IX. Example Response: 400 Username In Usernames Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User 'unknown' not found.",
  "errors": {
    "usernames": "User 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Username In Usernames Already In Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["user"] }
```

#### X. Example Response: 400 Username In Usernames Already In Group (Admin)

```JSON
{
  "success": false,
  "message": "User 'user' already in group.",
  "errors": {
    "usernames": "User 'user' already in group."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XI. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XII. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XII. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIII. Example Request: 403 Add User To Group (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XIII. Example Response: 403 Add User To Group (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIV. Example Request: 404 Group Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | unknown |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XIV. Example Response: 404 Group Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group not found."
}
```

**_Status Code:_** 404

<br>

### 5. Remove User From Group (Admin)

Remove a user or several users from a group. Only administrators allowed.

#### URL Variables

- `group` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group.

#### Query Parameters

- `username (optional)` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must also be a username which exists and is in the group.

- `usernames (optional)` must be a comma-separated string of usernames. Each username must contain alphanumeric characters only. They must not be shorter than 3 characters or longer than 32 characters. They must also be usernames which exists and are in the group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

- The request query must contain at least one of the above fields.

#### Response Data

If successful, a confirmation message will be returned.

**_Endpoint:_**

```HTTP
DELETE /api/v1/group/:group/users HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Remove User From Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user1" }
```

#### I. Example Response: 200 Remove User From Group (Admin)

```JSON
{
  "success": true,
  "message": "User removed from group successfully."
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Remove Users From Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["user2", "user3"] }
```

#### II. Example Response: 200 Remove Users From Group (Admin)

```JSON
{
  "success": true,
  "message": "Users removed from group successfully."
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Group Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | inv@lid |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### III. Example Response: 400 Group Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 400 Username Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "inv@lid" }
```

#### IV. Example Response: 400 Username Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Username Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "unknown" }
```

#### V. Example Response: 400 Username Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Username not found.",
  "errors": {
    "username": "Username not found."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Username Not In Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user1" }
```

#### VI. Example Response: 400 Username Not In Group (Admin)

```JSON
{
  "success": false,
  "message": "Username not in group.",
  "errors": {
    "username": "Username not in group."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Usernames Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": "inv@lid" }
```

#### VII. Example Response: 400 Usernames Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Usernames must be an array, or usernames must be a comma-separated string.",
  "errors": {
    "usernames": "Usernames must be an array, or usernames must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Username In Usernames Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["inv@lid"] }
```

#### VIII. Example Response: 400 Username In Usernames Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "usernames": "Username 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Username In Usernames Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["unknown"] }
```

#### IX. Example Response: 400 Username In Usernames Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User 'unknown' not found.",
  "errors": {
    "usernames": "User 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Username In Usernames Not In Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "usernames": ["user1"] }
```

#### X. Example Response: 400 Username In Usernames Not In Group (Admin)

```JSON
{
  "success": false,
  "message": "User 'user1' not in group.",
  "errors": {
    "usernames": "User 'user1' not in group."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XI. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XII. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XII. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIII. Example Request: 403 Remove User From Group (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XIII. Example Response: 403 Remove User From Group (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIV. Example Request: 404 Group Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | unknown |             |

**_Body:_**

```JSON
{ "username": "user" }
```

#### XIV. Example Response: 404 Group Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group not found."
}
```

**_Status Code:_** 404

<br>

## Users

This folder contains all APIs relating to user management features. Users must be logged in to access all APIs in this folder.

### 1. Get All Users (Admin)

Get and filter all users. Only administrators allowed.

#### Query Parameters

- `q (optional)` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It will search for users with matching usernames.

- `active (optional)` must be a boolean-like string (`"true"`, `"false"`, `"yes"`, `"no"`, `"1"`, or `"0"`). It will filter users with that active status.

- `group (optional)` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group. It will filter users who belong to that group.

- `groups (optional)` must be a comma-separated string of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. They must also be existing groups. It will filter users who belong to those groups.

- `limit (optional)` must be an integer string. It will limit the results to that number of users.

- `page (optional)` must be an integer string and must be specified with `limit`. It will return the set of users corresponding to that page and limit.

- `offset (optional)` must be an integer and must be specified with `limit`. It will return the set of users corresponding to that limit and offset.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

#### Response Data

If successful, all filtered users will be returned. If no filter was specified, all users will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/users HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get All Users (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters: None_**

**_Body: None_**

#### I. Example Response: 200 Get All Users (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "admin",
      "email": "admin@example.com",
      "active": true,
      "groups": ["admin"]
    },
    {
      "username": "inactive",
      "email": "inactive@example.com",
      "active": false,
      "groups": []
    },
    {
      "username": "new",
      "email": "new@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user",
      "email": "user@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user1",
      "email": "user1@example.com",
      "active": true,
      "groups": []
    },
    {
      "username": "user2",
      "email": "user2@example.com",
      "active": true,
      "groups": []
    },
    {
      "username": "user3",
      "email": "user3@example.com",
      "active": true,
      "groups": []
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Search All Users By Username (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key | Value | Description        |
| --- | ----- | ------------------ |
| q   | adm   | Search by username |

**_Body: None_**

#### II. Example Response: 200 Search All Users By Username (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "admin",
      "email": "admin@example.com",
      "active": true,
      "groups": ["admin"]
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 200 Filter All Users By Active Status (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key    | Value | Description             |
| ------ | ----- | ----------------------- |
| active | false | Filter by active status |

**_Body: None_**

#### III. Example Response: 200 Filter All Users By Active Status (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "inactive",
      "email": "inactive@example.com",
      "active": false,
      "groups": []
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### IV. Example Request: 200 Filter All Users By Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key   | Value | Description     |
| ----- | ----- | --------------- |
| group | user  | Filter by group |

**_Body: None_**

#### IV. Example Response: 200 Filter All Users By Group (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "new",
      "email": "new@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user",
      "email": "user@example.com",
      "active": true,
      "groups": ["user"]
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### V. Example Request: 200 Filter All Users By Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key    | Value      | Description      |
| ------ | ---------- | ---------------- |
| groups | user,admin | Filter by groups |

**_Body: None_**

#### V. Example Response: 200 Filter All Users By Groups (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "admin",
      "email": "admin@example.com",
      "active": true,
      "groups": ["admin"]
    },
    {
      "username": "new",
      "email": "new@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user",
      "email": "user@example.com",
      "active": true,
      "groups": ["user"]
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### VI. Example Request: 200 Get All Users With Limit (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| limit | 2     | Limit data  |

**_Body: None_**

#### VI. Example Response: 200 Get All Users With Limit (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "admin",
      "email": "admin@example.com",
      "active": true,
      "groups": ["admin"]
    },
    {
      "username": "inactive",
      "email": "inactive@example.com",
      "active": false,
      "groups": []
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### VII. Example Request: 200 Get All Users With Limit And Page (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key   | Value | Description   |
| ----- | ----- | ------------- |
| limit | 2     | Limit data    |
| page  | 2     | Paginate data |

**_Body: None_**

#### VII. Example Response: 200 Get All Users With Limit And Page (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "new",
      "email": "new@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user",
      "email": "user@example.com",
      "active": true,
      "groups": ["user"]
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### VIII. Example Request: 200 Get All Users With Limit And Offset (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key    | Value | Description |
| ------ | ----- | ----------- |
| limit  | 2     | Limit data  |
| offset | 2     | Offset data |

**_Body: None_**

#### VIII. Example Response: 200 Get All Users With Limit And Offset (Admin)

```JSON
{
  "success": true,
  "data": [
    {
      "username": "new",
      "email": "new@example.com",
      "active": true,
      "groups": ["user"]
    },
    {
      "username": "user",
      "email": "user@example.com",
      "active": true,
      "groups": ["user"]
    }
  ]
}
```

**_Status Code:_** 200

<br>

#### IX. Example Request: 400 Fields Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key    | Value   | Description             |
| ------ | ------- | ----------------------- |
| q      | inv@lid | Search by username      |
| active | inv@lid | Filter by active status |
| group  | inv@lid | Filter by group         |
| groups | inv@lid | Filter by groups        |
| limit  | inv@lid | Limit data              |
| page   | inv@lid | Paginate data           |
| offset | inv@lid | Offset data             |

**_Body: None_**

#### IX. Example Response: 400 Fields Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username search query must be a string containing only alphanumeric characters. Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'. Group must be a string containing only alphanumeric characters. Groups must be a comma-separated string. Limit must be a string containing an integer. Page must be a string containing an integer. Offset must be a string containing an integer.",
  "errors": {
    "q": "Username search query must be a string containing only alphanumeric characters.",
    "active": "Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'.",
    "group": "Group must be a string containing only alphanumeric characters.",
    "groups": "Groups must be a comma-separated string.",
    "limit": "Limit must be a string containing an integer.",
    "page": "Page must be a string containing an integer.",
    "offset": "Offset must be a string containing an integer."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Limit Missing (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Query Parameters:_**

| Key    | Value | Description   |
| ------ | ----- | ------------- |
| page   | 2     | Paginate data |
| offset | 2     | Offset data   |

**_Body: None_**

#### X. Example Response: 400 Limit Missing (Admin)

```JSON
{
  "success": false,
  "message": "Page must be specified together with a limit. Offset must be specified together with a limit.",
  "errors": {
    "page": "Page must be specified together with a limit.",
    "offset": "Offset must be specified together with a limit."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Query Parameters: None_**

**_Body: None_**

#### XI. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XII. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Query Parameters: None_**

**_Body: None_**

#### XII. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIII. Example Request: 403 Get All Users (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters: None_**

**_Body: None_**

#### XIII. Example Response: 403 Get All Users (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 2. Create User (Admin)

Register a new user using a username, email address, password, and groups. Only administrators allowed.

#### Request Body

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must also be unique.

- `email` must be a valid email address not longer than 255 characters. It must also be unique.

- `password` must contain alphanumeric or special characters only. It must not be shorter than 8 characters or longer than 10 characters.

- `groups (optional)` must be a comma-separated string of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The current user must be an administrator.

#### Response Data

If successful, the new user's data will be returned.

**_Endpoint:_**

```HTTP
POST /api/v1/users HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{ADMIN_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Create User (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new1", "email": "new1@example.com", "password": "password" }
```

#### I. Example Response: 200 Create User (Admin)

```JSON
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "username": "new1",
    "email": "new1@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Create User With Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new2", "email": "new2@example.com", "password": "password", "group": "new" }
```

#### II. Example Response: 200 Create User With Group (Admin)

```JSON
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "username": "new2",
    "email": "new2@example.com",
    "active": true,
    "groups": ["new"]
  }
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 200 Create User With Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new3", "email": "new3@example.com", "password": "password", "groups": ["new", "new1"] }
```

#### III. Example Response: 200 Create User With Groups (Admin)

```JSON
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "username": "new3",
    "email": "new3@example.com",
    "active": true,
    "groups": ["new", "new1"]
  }
}
```

**_Status Code:_** 200

<br>

#### IV. Example Request: 400 Email/Username Exists (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "user", "email": "user@example.com", "password": "password" }
```

#### IV. Example Response: 400 Email/Username Exists (Admin)

```JSON
{
  "success": false,
  "message": "Username already exists. Email already exists.",
  "errors": {
    "username": "Username already exists.",
    "email": "Email already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Body Empty (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body: None_**

#### V. Example Response: 400 Body Empty (Admin)

```JSON
{
  "success": false,
  "message": "Username must be provided. Email must be provided. Password must be provided.",
  "errors": {
    "username": "Username must be provided.",
    "email": "Email must be provided.",
    "password": "Password must be provided."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Fields Empty (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "", "email": "", "password": "" }
```

#### VI. Example Response: 400 Fields Empty (Admin)

```JSON
{
  "success": false,
  "message": "Username must not be empty. Email must not be empty. Password must not be empty.",
  "errors": {
    "username": "Username must not be empty.",
    "email": "Email must not be empty.",
    "password": "Password must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Types Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": null, "email": null, "password": null, "group": null, "groups": null }
```

#### VII. Example Response: 400 Types Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string. Email must be a string. Password must be a string. Group must be a string. Groups must be an array, or groups must be a string.",
  "errors": {
    "username": "Username must be a string.",
    "email": "Email must be a string.",
    "password": "Password must be a string.",
    "group": "Group must be a string.",
    "groups": "Groups must be an array, or groups must be a string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Fields Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "inv@lid", "email": "inv@lid", "password": "inv@lid", "group": "inv@lid", "groups": "inv@lid" }
```

#### VIII. Example Response: 400 Fields Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters. Email must be a string containing a valid email address. Password must have at least length 8. Group must be a string containing only alphanumeric characters. Groups must be an array, or groups must be a comma-separated string.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters.",
    "email": "Email must be a string containing a valid email address.",
    "password": "Password must have at least length 8.",
    "group": "Group must be a string containing only alphanumeric characters.",
    "groups": "Groups must be an array, or groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Group Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new4", "email": "new4@example.com", "password": "password", "group": "unknown" }
```

#### IX. Example Response: 400 Group Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group not found.",
  "errors": {
    "group": "Group not found."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Group In Groups Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new4", "email": "new4@example.com", "password": "password", "groups": ["inv@lid"] }
```

#### X. Example Response: 400 Group In Groups Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Group 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "groups": "Group 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 400 Group In Groups Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "username": "new4", "email": "new4@example.com", "password": "password", "groups": ["unknown"] }
```

#### XI. Example Response: 400 Group In Groups Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group 'unknown' not found.",
  "errors": {
    "groups": "Group 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### XII. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body:_**

```JSON
{ "username": "new", "email": "new@example.com", "password": "password" }
```

#### XII. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XIII. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body:_**

```JSON
{ "username": "new", "email": "new@example.com", "password": "password" }
```

#### XIII. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIV. Example Request: 403 Create User (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body:_**

```JSON
{ "username": "new", "email": "new@example.com", "password": "password" }
```

#### XIV. Example Response: 403 Create User (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 3. Get Current User

Get the current user's data.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

#### Response Data

If successful, the current user's data will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get Current User

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body: None_**

#### I. Example Response: 200 Get Current User

```JSON
{
  "success": true,
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body: None_**

#### II. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### III. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body: None_**

#### III. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 4. Get User

Get a user's data using their username.

#### URL Variables

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must be an existing username.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- Users are only allowed to use their own username. Admins can use any username.

#### Response Data

If successful, the user's data will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user/:username HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get Current User

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### I. Example Response: 200 Get Current User

```JSON
{
  "success": true,
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Get Other User (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### II. Example Response: 200 Get Other User (Admin)

```JSON
{
  "success": true,
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Username Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | inv@lid |             |

**_Body: None_**

#### III. Example Response: 400 Username Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### IV. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### V. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key      | Value    | Description |
| -------- | -------- | ----------- |
| username | inactive |             |

**_Body: None_**

#### V. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### VI. Example Request: 403 Get Other User (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Body: None_**

#### VI. Example Response: 403 Get Other User (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### VII. Example Request: 404 User Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | unknown |             |

**_Body: None_**

#### VII. Example Response: 404 User Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User not found."
}
```

**_Status Code:_** 404

<br>

### 5. Update Current User

Update any of the following fields for the current user:

- Email address

- Password

- Active status (Admins Only)

- Groups (Admins Only)

#### Request Body

- `email (optional)` must be a valid email address not longer than 255 characters. It must also be unique.

- `password (optional)` must contain alphanumeric or special characters only. It must not be shorter than 8 characters or longer than 10 characters.

- `active (optional)` must be a boolean value or a boolean-like string (`"yes"`/`"no"`) or boolean number (`0`/`1`).

- `groups (optional)` must be either a single group or a comma-separated string of groups or an array of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- Users are not allowed to edit active status and groups. Only admins can do that.

- The request body must contain at least one of the above fields.

#### Response Data

If successful, the current user's updated data will be returned.

**_Endpoint:_**

```HTTP
PUT /api/v1/user HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Update Current User Email And Password

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body:_**

```JSON
{ "email": "user@example.com", "password": "password" }
```

#### I. Example Response: 200 Update Current User Email And Password

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Update Current User Active Status (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "active": true }
```

#### II. Example Response: 200 Update Current User Active Status (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "admin",
    "email": "admin@example.com",
    "active": true,
    "groups": ["admin"]
  }
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 200 Update Current User Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": ["admin"] }
```

#### III. Example Response: 200 Update Current User Groups (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "admin",
    "email": "admin@example.com",
    "active": true,
    "groups": ["admin"]
  }
}
```

**_Status Code:_** 200

<br>

#### IV. Example Request: 400 Body Empty

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body: None_**

#### IV. Example Response: 400 Body Empty

```JSON
{
  "success": false,
  "message": "Nothing to update."
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Fields Empty

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "email": "", "password": "", "active": "", "groups": "" }
```

#### V. Example Response: 400 Fields Empty

```JSON
{
  "success": false,
  "message": "Email must not be empty. Password must not be empty. Active must not be empty. Groups must not be empty.",
  "errors": {
    "email": "Email must not be empty.",
    "password": "Password must not be empty.",
    "active": "Active must not be empty.",
    "groups": "Groups must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Fields Invalid

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "email": " ", "password": " ", "active": " ", "groups": " " }
```

#### VI. Example Response: 400 Fields Invalid

```JSON
{
  "success": false,
  "message": "Email must be a string containing a valid email address. Password must have at least length 8. Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'. Groups must be a comma-separated string.",
  "errors": {
    "email": "Email must be a string containing a valid email address.",
    "password": "Password must have at least length 8.",
    "active": "Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'.",
    "groups": "Groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Types Invalid

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "email": null, "password": null, "active": null, "groups": null }
```

#### VII. Example Response: 400 Types Invalid

```JSON
{
  "success": false,
  "message": "Email must be a string. Password must be a string. Active must be a boolean, active must be a string, or active must be a number. Groups must be an array, or groups must be a string.",
  "errors": {
    "email": "Email must be a string.",
    "password": "Password must be a string.",
    "active": "Active must be a boolean, active must be a string, or active must be a number.",
    "groups": "Groups must be an array, or groups must be a string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Email Exists

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "email": "user@example.com" }
```

#### VIII. Example Response: 400 Email Exists

```JSON
{
  "success": false,
  "message": "Email already exists.",
  "errors": {
    "email": "Email already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Group In Groups Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_Body:_**

```JSON
{ "groups": ["admin", "unknown"] }
```

#### IX. Example Response: 400 Group In Groups Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group 'unknown' not found.",
  "errors": {
    "groups": "Group 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body:_**

```JSON
{ "email": "user@example.com", "password": "password" }
```

#### X. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XI. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body:_**

```JSON
{ "email": "inactive@example.com", "password": "password" }
```

#### XI. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XII. Example Request: 403 Update Current User Active Status (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body:_**

```JSON
{ "active": true }
```

#### XII. Example Response: 403 Update Current User Active Status (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to change active status. Please contact an administrator to do so."
}
```

**_Status Code:_** 403

<br>

#### XIII. Example Request: 403 Update Current User Groups (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body:_**

```JSON
{ "groups": ["user"] }
```

#### XIII. Example Response: 403 Update Current User Groups (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to change groups. Please contact an administrator to do so."
}
```

**_Status Code:_** 403

<br>

### 6. Update User

Update any of the following fields for a user:

- Email address

- Password

- Active status (Admins Only)

- Groups (Admins Only)

#### URL Variables

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must be an existing username.

#### Request Body

- `email (optional)` must be a valid email address not longer than 255 characters. It must also be unique.

- `password (optional)` must contain alphanumeric or special characters only. It must not be shorter than 8 characters or longer than 10 characters.

- `active (optional)` must be a boolean value or a boolean-like string (`"yes"`/`"no"`) or a boolean number (`0`/`1`).

- `groups (optional)` must be either a single group or a comma-separated string of groups or an array of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- Users are only allowed to use their own username. Admins can use any username.

- Users are not allowed to edit active status and groups. Only admins can do that.

- The request body must contain at least one of the above fields.

## Response Data

If successful, the user's updated data will be returned.

**_Endpoint:_**

```HTTP
PUT /api/v1/user/:username HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Update Current User Email And Password

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "email": "user@example.com", "password": "password" }
```

#### I. Example Response: 200 Update Current User Email And Password

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Update Current User Active Status (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "active": true }
```

#### II. Example Response: 200 Update Current User Active Status (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "admin",
    "email": "admin@example.com",
    "active": true,
    "groups": ["admin"]
  }
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 200 Update Current User Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "groups": ["admin"] }
```

#### III. Example Response: 200 Update Current User Groups (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "admin",
    "email": "admin@example.com",
    "active": true,
    "groups": ["admin"]
  }
}
```

**_Status Code:_** 200

<br>

#### IV. Example Request: 200 Update Other User Email And Password (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "email": "user@example.com", "password": "password" }
```

#### IV. Example Response: 200 Update Other User Email And Password (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### V. Example Request: 200 Update Other User Active Status (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "active": true }
```

#### V. Example Response: 200 Update Other User Active Status (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### VI. Example Request: 200 Update Other User Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "groups": ["user"] }
```

#### VI. Example Response: 200 Update Other User Groups (Admin)

```JSON
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    "username": "user",
    "email": "user@example.com",
    "active": true,
    "groups": ["user"]
  }
}
```

**_Status Code:_** 200

<br>

#### VII. Example Request: 400 Invalid Username (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | inv@lid |             |

**_Body:_**

```JSON
{ "email": "invalid@example.com", "password": "password" }
```

#### VII. Example Response: 400 Invalid Username (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Body Empty

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body: None_**

#### VIII. Example Response: 400 Body Empty

```JSON
{
  "success": false,
  "message": "Nothing to update."
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Fields Empty

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "email": "", "password": "", "active": "", "groups": "" }
```

#### IX. Example Response: 400 Fields Empty

```JSON
{
  "success": false,
  "message": "Email must not be empty. Password must not be empty. Active must not be empty. Groups must not be empty.",
  "errors": {
    "email": "Email must not be empty.",
    "password": "Password must not be empty.",
    "active": "Active must not be empty.",
    "groups": "Groups must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Fields Invalid

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "email": " ", "password": " ", "active": " ", "groups": " " }
```

#### X. Example Response: 400 Fields Invalid

```JSON
{
  "success": false,
  "message": "Email must be a string containing a valid email address. Password must have at least length 8. Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'. Groups must be a comma-separated string.",
  "errors": {
    "email": "Email must be a string containing a valid email address.",
    "password": "Password must have at least length 8.",
    "active": "Active must be one of the following strings: 'true', 'false', 'yes', 'no', '1', or '0'.",
    "groups": "Groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 400 Types Invalid

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "email": null, "password": null, "active": null, "groups": null }
```

#### XI. Example Response: 400 Types Invalid

```JSON
{
  "success": false,
  "message": "Email must be a string. Password must be a string. Active must be a boolean, active must be a string, or active must be a number. Groups must be an array, or groups must be a string.",
  "errors": {
    "email": "Email must be a string.",
    "password": "Password must be a string.",
    "active": "Active must be a boolean, active must be a string, or active must be a number.",
    "groups": "Groups must be an array, or groups must be a string."
  }
}
```

**_Status Code:_** 400

<br>

#### XII. Example Request: 400 Email Exists

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "email": "user@example.com" }
```

#### XII. Example Response: 400 Email Exists

```JSON
{
  "success": false,
  "message": "Email already exists.",
  "errors": {
    "email": "Email already exists."
  }
}
```

**_Status Code:_** 400

<br>

#### XIII. Example Request: 400 Group In Groups Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | admin |             |

**_Body:_**

```JSON
{ "groups": ["admin", "unknown"] }
```

#### XIII. Example Response: 400 Group In Groups Not Found (Admin)

```JSON
{
  "success": false,
  "message": "Group 'unknown' not found.",
  "errors": {
    "groups": "Group 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### XIV. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "email": "user@example.com", "password": "password" }
```

#### XIV. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XV. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key      | Value    | Description |
| -------- | -------- | ----------- |
| username | inactive |             |

**_Body:_**

```JSON
{ "email": "inactive@example.com", "password": "password" }
```

#### XV. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XVI. Example Request: 403 Update Current User Active Status (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "active": true }
```

#### XVI. Example Response: 403 Update Current User Active Status (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to change active status. Please contact an administrator to do so."
}
```

**_Status Code:_** 403

<br>

#### XVII. Example Request: 403 Update Current User Groups (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body:_**

```JSON
{ "groups": ["user"] }
```

#### XVII. Example Response: 403 Update Current User Groups (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to change groups. Please contact an administrator to do so."
}
```

**_Status Code:_** 403

<br>

#### XVIII. Example Request: 403 Update Other User Email And Password (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Body:_**

```JSON
{ "email": "other@example.com", "password": "password" }
```

#### XVIII. Example Response: 403 Update Other User Email And Password (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIX. Example Request: 403 Update Other User Active Status (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Body:_**

```JSON
{ "active": true }
```

#### XIX. Example Response: 403 Update Other User Active Status (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XX. Example Request: 403 Update Other User Groups (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Body:_**

```JSON
{ "groups": ["user"] }
```

#### XX. Example Response: 403 Update Other User Groups (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XXI. Example Request: 404 User Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | unknown |             |

**_Body:_**

```JSON
{ "email": "unknown@example.com", "password": "password" }
```

#### XXI. Example Response: 404 User Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User not found."
}
```

**_Status Code:_** 404

<br>

### 7. Get Current User Groups

Get the current user's groups.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

#### Response Data

If successful, the current user's groups will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user.groups HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get Current User Groups

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Body: None_**

#### I. Example Response: 200 Get Current User Groups

```JSON
{
  "success": true,
  "data": ["user"]
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Body: None_**

#### II. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### III. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Body: None_**

#### III. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 8. Get User Groups

Get a user's groups using their username.

#### URL Variables

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must be an existing username.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- Users are only allowed to use their own username. Admins can use any username.

#### Response Data

If successful, the user's groups will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user/:username.groups HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Get Current User Groups

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### I. Example Response: 200 Get Current User Groups

```JSON
{
  "success": true,
  "data": ["user"]
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Get Other User Groups (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### II. Example Response: 200 Get Other User Groups (Admin)

```JSON
{
  "success": true,
  "data": ["user"]
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Username Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | inv@lid |             |

**_Body: None_**

#### III. Example Response: 400 Username Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Body: None_**

#### IV. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### V. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key      | Value    | Description |
| -------- | -------- | ----------- |
| username | inactive |             |

**_Body: None_**

#### V. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### VI. Example Request: 403 Get Other User Groups (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Body: None_**

#### VI. Example Response: 403 Get Other User Groups (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### VII. Example Request: 404 User Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | unknown |             |

**_Body: None_**

#### VII. Example Response: 404 User Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User not found."
}
```

**_Status Code:_** 404

<br>

### 9. Check Current User Group

Check if the current user is in a group or in any one of several groups.

#### Query Parameters

- `group (optional)` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group.

- `groups (optional)` must be a comma-separated string of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- The request query must contain at least one of the above fields.

#### Response Data

If successful, a boolean value representing whether the current user is in the group or in any one of the groups will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user.checkGroup HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Check Current User Group

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### I. Example Response: 200 Check Current User Group

```JSON
{
  "success": true,
  "data": true
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Check Current User Groups

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key    | Value      | Description |
| ------ | ---------- | ----------- |
| groups | user,admin |             |

**_Body: None_**

#### II. Example Response: 200 Check Current User Groups

```JSON
{
  "success": true,
  "data": true
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 400 Group Missing

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters: None_**

**_Body: None_**

#### III. Example Response: 400 Group Missing

```JSON
{
  "success": false,
  "message": "Group must be provided.",
  "errors": {
    "group": "Group must be provided."
  }
}
```

**_Status Code:_** 400

<br>

#### IV. Example Request: 400 Group Empty

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group |       |             |

**_Body: None_**

#### IV. Example Response: 400 Group Empty

```JSON
{
  "success": false,
  "message": "Group must not be empty.",
  "errors": {
    "group": "Group must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Group Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | inv@lid |             |

**_Body: None_**

#### V. Example Response: 400 Group Invalid

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Group Not Found

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | unknown |             |

**_Body: None_**

#### VI. Example Response: 400 Group Not Found

```JSON
{
  "success": false,
  "message": "Group not found.",
  "errors": {
    "group": "Group not found."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Groups Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key    | Value   | Description |
| ------ | ------- | ----------- |
| groups | inv@lid |             |

**_Body: None_**

#### VII. Example Response: 400 Groups Invalid

```JSON
{
  "success": false,
  "message": "Groups must be a comma-separated string.",
  "errors": {
    "groups": "Groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Group In Groups Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key    | Value        | Description |
| ------ | ------------ | ----------- |
| groups | user,inv@lid |             |

**_Body: None_**

#### VIII. Example Response: 400 Group In Groups Invalid

```JSON
{
  "success": false,
  "message": "Group 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "groups": "Group 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Group In Groups Not Found

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_Query Parameters:_**

| Key    | Value        | Description |
| ------ | ------------ | ----------- |
| groups | user,unknown |             |

**_Body: None_**

#### IX. Example Response: 400 Group In Groups Not Found

```JSON
{
  "success": false,
  "message": "Group 'unknown' not found.",
  "errors": {
    "groups": "Group 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### X. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XI. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### XI. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

### 10. Check User Group

Check if a user is in a group or in any one of several groups.

#### URL Variables

- `username` must contain alphanumeric characters only. It must not be shorter than 3 characters or longer than 32 characters. It must be an existing username.

#### Query Parameters

- `group (optional)` must contain alphanumeric characters only and must not be longer than 50 characters. It must also be an existing group.

- `groups (optional)` must be a comma-separated string of groups. Each group must contain alphanumeric characters only and must not be longer than 50 characters. Each group must also be an existing group.

#### Preconditions

- The current user must be logged in and their account must not be disabled.

- Users are only allowed to use their own username. Admins can use any username.

- The request query must contain at least one of the above fields.

#### Response Data

If successful, a boolean value representing whether the user is in the group or in any one of the groups will be returned.

**_Endpoint:_**

```HTTP
GET /api/v1/user/:username.checkGroup HTTP/1.1
Host: {{DOMAIN}}
Authorization: Bearer {{USER_TOKEN}}
```

**_Example Requests/Responses:_**

#### I. Example Request: 200 Check Current User Group

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### I. Example Response: 200 Check Current User Group

```JSON
{
  "success": true,
  "data": true
}
```

**_Status Code:_** 200

<br>

#### II. Example Request: 200 Check Current User Groups

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key    | Value      | Description |
| ------ | ---------- | ----------- |
| groups | user,admin |             |

**_Body: None_**

#### II. Example Response: 200 Check Current User Groups

```JSON
{
  "success": true,
  "data": true
}
```

**_Status Code:_** 200

<br>

#### III. Example Request: 200 Check Other User Group (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### III. Example Response: 200 Check Other User Group (Admin)

```JSON
{
  "success": true,
  "data": true
}
```

**_Status Code:_** 200

<br>

#### IV. Example Request: 400 Username Invalid (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | inv@lid |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### IV. Example Response: 400 Username Invalid (Admin)

```JSON
{
  "success": false,
  "message": "Username must be a string containing only alphanumeric characters.",
  "errors": {
    "username": "Username must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### V. Example Request: 400 Group Missing

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters: None_**

**_Body: None_**

#### V. Example Response: 400 Group Missing

```JSON
{
  "success": false,
  "message": "Group must be provided.",
  "errors": {
    "group": "Group must be provided."
  }
}
```

**_Status Code:_** 400

<br>

#### VI. Example Request: 400 Group Empty

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group |       |             |

**_Body: None_**

#### VI. Example Response: 400 Group Empty

```JSON
{
  "success": false,
  "message": "Group must not be empty.",
  "errors": {
    "group": "Group must not be empty."
  }
}
```

**_Status Code:_** 400

<br>

#### VII. Example Request: 400 Group Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | inv@lid |             |

**_Body: None_**

#### VII. Example Response: 400 Group Invalid

```JSON
{
  "success": false,
  "message": "Group must be a string containing only alphanumeric characters.",
  "errors": {
    "group": "Group must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### VIII. Example Request: 400 Group Not Found

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value   | Description |
| ----- | ------- | ----------- |
| group | unknown |             |

**_Body: None_**

#### VIII. Example Response: 400 Group Not Found

```JSON
{
  "success": false,
  "message": "Group not found.",
  "errors": {
    "group": "Group not found."
  }
}
```

**_Status Code:_** 400

<br>

#### IX. Example Request: 400 Groups Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key    | Value   | Description |
| ------ | ------- | ----------- |
| groups | inv@lid |             |

**_Body: None_**

#### IX. Example Response: 400 Groups Invalid

```JSON
{
  "success": false,
  "message": "Groups must be a comma-separated string.",
  "errors": {
    "groups": "Groups must be a comma-separated string."
  }
}
```

**_Status Code:_** 400

<br>

#### X. Example Request: 400 Group In Groups Invalid

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key    | Value        | Description |
| ------ | ------------ | ----------- |
| groups | user,inv@lid |             |

**_Body: None_**

#### X. Example Response: 400 Group In Groups Invalid

```JSON
{
  "success": false,
  "message": "Group 'inv@lid' must be a string containing only alphanumeric characters.",
  "errors": {
    "groups": "Group 'inv@lid' must be a string containing only alphanumeric characters."
  }
}
```

**_Status Code:_** 400

<br>

#### XI. Example Request: 400 Group In Groups Not Found

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key    | Value        | Description |
| ------ | ------------ | ----------- |
| groups | user,unknown |             |

**_Body: None_**

#### XI. Example Response: 400 Group In Groups Not Found

```JSON
{
  "success": false,
  "message": "Group 'unknown' not found.",
  "errors": {
    "groups": "Group 'unknown' not found."
  }
}
```

**_Status Code:_** 400

<br>

#### XII. Example Request: 401 Current User Not Logged In

**_Headers: None_**

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | user  |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### XII. Example Response: 401 Current User Not Logged In

```JSON
{
  "success": false,
  "message": "You must be logged in to access this resource."
}
```

**_Status Code:_** 401

<br>

#### XIII. Example Request: 403 Current User Disabled

**_Headers:_**

| Key           | Value                       | Description    |
| ------------- | --------------------------- | -------------- |
| Authorization | Bearer `{{INACTIVE_TOKEN}}` | Inactive token |

**_URL Variables:_**

| Key      | Value    | Description |
| -------- | -------- | ----------- |
| username | inactive |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### XIII. Example Response: 403 Current User Disabled

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XIV. Example Request: 403 Check Other User Group (User)

**_Headers:_**

| Key           | Value                   | Description |
| ------------- | ----------------------- | ----------- |
| Authorization | Bearer `{{USER_TOKEN}}` | User token  |

**_URL Variables:_**

| Key      | Value | Description |
| -------- | ----- | ----------- |
| username | other |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### XIV. Example Response: 403 Check Other User Group (User)

```JSON
{
  "success": false,
  "message": "You are not allowed to access this resource."
}
```

**_Status Code:_** 403

<br>

#### XV. Example Request: 404 User Not Found (Admin)

**_Headers:_**

| Key           | Value                    | Description |
| ------------- | ------------------------ | ----------- |
| Authorization | Bearer `{{ADMIN_TOKEN}}` | Admin token |

**_URL Variables:_**

| Key      | Value   | Description |
| -------- | ------- | ----------- |
| username | unknown |             |

**_Query Parameters:_**

| Key   | Value | Description |
| ----- | ----- | ----------- |
| group | user  |             |

**_Body: None_**

#### XV. Example Response: 404 User Not Found (Admin)

```JSON
{
  "success": false,
  "message": "User not found."
}
```

**_Status Code:_** 404

<br>

---

[Back to top](#iam-module-api)

> Generated at 2023-09-11 00:05:44 by [docgen](httpsthub HTTP/1.1
> Host: hedevsaddam/docgen)

