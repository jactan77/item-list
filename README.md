# Item List Application

This Angular application provides a simple interface for managing items with their quantities and threshold values.
# Demo
![](README/demo.gif)
## Features

- Add new items with specified name and amount
- Set minimum and middle threshold values for each item
- Increase/decrease item amounts
- Remove items from the list
- View detailed information about each item
- Real-time validation of input values
- Real-time database synchronization with Firebase
- Optimized listeners that prevent full refresh when adding new items

## Getting Started

### Prerequisites

- Node.js and npm installed
- Angular CLI version 19.1.6
- Firebase account and project setup

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure Firebase:
  - Create a Firebase project in the Firebase console
  - Add your Firebase configuration to the environment files
  - Enable the Realtime Database in your Firebase project

### Running the Application

Start the development server:
```bash
ng serve
```
Navigate to `http://localhost:4200/`

## Development

To generate new components:
```bash
ng generate component component-name
```

For more information on Angular CLI commands, see the [Angular CLI Overview](https://angular.dev/tools/cli).



## Built With

- Angular 19.1.6
- Bootstrap for styling
- Firebase Realtime Database
- RxJS for reactive programming

## Testing

Run unit tests:
```bash
ng test
```

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
