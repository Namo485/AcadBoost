# AcadBoost: Your Personalized AI Learning Companion

AcadBoost is a modern, AI-powered learning platform designed to help students and self-learners navigate the vast world of online education. It provides a centralized dashboard to track progress, discover new courses, and receive personalized recommendations to accelerate learning and bridge knowledge gaps.

## The Problem: The Modern Learner's Dilemma

In today's digital age, learners have access to an overwhelming number of online courses, tutorials, and resources. This abundance creates several challenges:

*   **Information Overload**: It's difficult to know where to start or which resources are most effective.
*   **Fragmented Progress**: Tracking learning across multiple platforms is manual and cumbersome.
*   **Lack of Personalization**: Generic course paths don't adapt to an individual's unique learning style, pace, or existing knowledge gaps.
*   **Maintaining Motivation**: Without a clear view of progress and a structured path, it's easy to lose motivation.

## The AcadBoost Solution

AcadBoost tackles these challenges by providing a smart, centralized, and personalized learning environment.

*   **Unified Dashboard**: Consolidates a user's learning journey into one place, tracking time spent, courses in progress, and completed subjects.
*   **AI-Powered Recommendations**: Leverages generative AI to suggest personalized content, helping users discover relevant courses and materials to fill their knowledge gaps.
*   **Interactive Learning with EduChat**: An integrated AI chatbot that provides instant answers to questions, suggests relevant web links, and recommends YouTube search queries to deepen understanding.
*   **Curated Course Discovery**: Offers a well-organized library of courses and resources across various domains like programming, AI, and professional skills.

## Technical Stack

*   **Framework**: Next.js (App Router) & React
*   **Styling**: Tailwind CSS with ShadCN UI components
*   **Database**: Firestore
*   **Authentication**: Firebase Authentication (Email/Password & Google)
*   **Generative AI**: Google's Gemini models via Genkit
*   **Deployment**: Firebase App Hosting

## Development Journey & Challenges

Building AcadBoost has been an iterative process focused on creating a stable and useful application. Key challenges encountered and overcome include:

1.  **AI Integration Instability**: Initial versions of the EduChat chatbot suffered from unreliable third-party API integrations (like the YouTube API), leading to frequent errors and a poor user experience.
    *   **Solution**: We pivoted to a more robust approach. Instead of fetching live data and risking API failures, the AI model now generates direct, high-quality search suggestions. This made the feature significantly more reliable while still providing valuable, actionable recommendations for the user.

2.  **Component & Dependency Conflicts**: As the app grew, we faced build failures due to dependency mismatches, particularly with React 19 compatibility. We also encountered accessibility and rendering errors in our UI components.
    *   **Solution**: We systematically updated and resolved package conflicts (e.g., `next-themes`). Errors within our UI components were debugged and fixed by ensuring they adhered to the requirements of the underlying libraries (e.g., adding necessary `Title` props to dialogs).

This iterative, problem-solving approach has been key to developing AcadBoost into the stable platform it is today.

## Getting Started
To get started:

1.  Ensure you have Node.js and npm installed.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

Open https://studio--studio-4134769196-3d2ee.us-central1.hosted.app with your browser to see the result.
