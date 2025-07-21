# Soko Link - AI Business Finder

Soko Link is an AI-powered mobile-first web app designed to help users discover and connect with local businesses in their neighborhood. It provides features for both buyers and sellers, including AI-driven search, negotiation assistance, and a community marketplace.

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **AI:** Google Gemini API (`@google/genai`)
- **Mapping:** Leaflet & React-Leaflet
- **Icons:** Lucide React

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or newer)
- npm, pnpm, or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd soko-link
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of your project and add your Google Gemini API key:
    ```
    VITE_API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The `VITE_` prefix is required by Vite to expose the variable to the frontend code.*

### Running the Development Server

To run the app in development mode, execute:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the address shown in your terminal) to view it in the browser. The page will reload if you make edits.

## Deployment to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).

2.  **Import your project on Vercel.**
    - Log in to your Vercel account and click "Add New... -> Project".
    - Select your Git repository.
    - Vercel will automatically detect that you are using Vite and configure the build settings.

3.  **Add your Environment Variable.**
    - In the Vercel project settings, go to the "Environment Variables" section.
    - Add a new variable with the key `VITE_API_KEY` and paste your Google Gemini API key as the value.
    - **Important:** Ensure this variable is available for all environments (Production, Preview, Development).

4.  **Deploy!**
    - Click the "Deploy" button. Vercel will build and deploy your application. You'll be provided with a live URL.
