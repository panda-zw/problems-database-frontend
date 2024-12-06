## Problems & Solutions Management Frontend
A modern frontend application for managing problems and solutions across sectors. Built with React, Next.js, TanStack Table, ShadCN UI, and React Query.

### Features
- **Table Management**: Interactive table with server-side pagination, sorting, and filtering.
- **Modal Forms**: Add or edit problems using ShadCN-powered modals.
- **Sheet Component**: View detailed problem information in a sleek sliding sheet.
- **Delete Confirmation**: Confirm deletions with a ShadCN confirmation dialog.
- **Real-Time Updates**: Ensure data consistency with React Query.

### Tech Stack
- React: Library for building user interfaces.
- Next.js: Framework for server-rendered React applications.
- TanStack Table: Advanced table features such as sorting, pagination, and filtering.
- ShadCN UI: Modern UI components for consistent design.
- React Query: State management and data fetching.
- Sonner: Toast notifications for user feedback.

### Getting Started
#### Prerequisites
Node.js (>= 20.x)
npm or yarn

##### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/panda-zw/problems-database-frontend.git

2. Navigate to the project directory:
    ```bash
    cd problems-solutions-frontend

3. Install dependencies:
    ```bash
    npm install
    # or
    yarn install

4. Create a `.env.local` file and configure the backend URL:
    ```bash
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5001


##### Running the Application
1. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev

2. Open your browser and visit:
    ```bash
    http://localhost:3000


### Contributing
1. Fork the repository.

2. Create a new feature branch:
    ```bash
    git checkout -b feature/your-feature-name

3. Commit your changes
    ```bash
    git commit -m "Add your feature"

4. Push to the branch
    ```bash
    git push origin feature/your-feature-name

5. Open a pull request


### License
This project is licensed under the MIT License. See the [License](LICENSE) file for details.
