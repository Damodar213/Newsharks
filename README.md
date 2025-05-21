# New Sharks

A platform connecting entrepreneurs with investors.

## Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/Damodar213/Newsharks.git
   cd Newsharks
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb+srv://damodark818:246813579daM%40@newsharks.xif4ym2.mongodb.net/?retryWrites=true&w=majority&appName=newsharks
   ```

4. **Run the development server**
   ```
   npm run dev
   ```
   or use one of the alternative scripts:
   ```
   npm run dev:port    # Runs on port 3001
   npm run dev:reset   # Kills hanging processes first
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Features

- User authentication (login/signup)
- Project creation and management
- MongoDB integration
- Responsive UI

## Collaboration Workflow

1. Create a new branch for features: `git checkout -b feature/your-feature-name`
2. Make changes and commit them: `git commit -m "Description of changes"`
3. Push your branch: `git push origin feature/your-feature-name`
4. Create a Pull Request on GitHub
5. After review, merge the PR

## Tech Stack

- Next.js
- React
- MongoDB
- TypeScript
- Tailwind CSS 