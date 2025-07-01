
export const generate_web_structure = (content="",additional_note="")=>{

return `

AI Prompt: Architect-Driven, DRY & Best-Principles Technical PRD Generator for Web Applications

Goal: To generate an architect-driven, comprehensive, and highly actionable Technical Product Requirements Document (PRD). This PRD will internalize the principles of a seasoned web software architect, envisioning every required part, feature, and implementation detail. It will strictly adhere to the DRY (Don't Repeat Yourself) principle and other best software design principles (e.g., SOLID, separation of concerns, modularity, scalability, security by design). The output will serve as a definitive blueprint for developers to create granular tasks for a web application.

Crucially, if specific technology stacks are not mentioned in the 'Blueprint Questions & Answers', the AI will default to the following, where applicable:
    • Frontend (Web): React (with Zustand for state management, React Router for navigation, and an emphasis on Tailwind CSS for a modern, utility-first UI).
    • Backend (if required): Node.js with Express.js.
    • Database (if required): The AI will intelligently choose between PostgreSQL (for scalable, server-side relational needs), MongoDB (for scalable, server-side non-relational needs), and SQLite (for simple, embedded needs) based on the app's complexity and data relationships.

Input:
    1. App Idea (A concise, one-paragraph summary of the app's core purpose and value proposition): """${content}""".
    2. Blueprint Questions & Answers (Detailed answers that influence the PRD's depth. The AI will extrapolate and apply design best practices based on these): """${additional_note}""".

Output: A comprehensive Technical PRD document structured as follows:

Technical Product Requirements Document (PRD)
    1. Introduction
        • 1.1. Executive Summary: A short technical overview of the proposed solution.
        • 1.2. Technical Vision & Goals: The technical aspirations for a highly performant, secure, and delightful user experience using a modern React-based stack.
        • 1.3. Target Audience & Critical Use Cases (Technical Lens): Key user segments and their most critical technical interactions with the system.
    2. Functional Requirements & Optimized User Flows
        • 2.1. Feature Decomposition & Detailed Technical Scope:
            ◦ [For each major feature, provide a detailed description of its functionality and technical sub-components, emphasizing reusability and explicit React/backend interactions.]
            ◦ Example:
                ▪ 2.1.1. Robust User Authentication & Authorization System:
                    • Frontend (React): Implement controlled components for forms using useState. Integrate react-hook-form for declarative validation. User input is captured and sent via axios to /api/v1/auth/register (POST). Securely manage JWT tokens in memory (e.g., within Zustand state) and potentially use HttpOnly cookies for refresh tokens. Social logins will use dedicated libraries (e.g., @react-oauth/google) and abstract common logic within a custom hook, useAuth. The email verification flow will show a toast notification upon registration and redirect to a dedicated verification page.
                    • Backend (Node.js/Express.js): An AuthService handles request validation (express-validator), password hashing (bcrypt), and JWT generation (jsonwebtoken). It integrates with the chosen database for user data persistence.
        • 2.2. Critical User Journeys (Technical Flow):
            ◦ [Illustrate key user journeys with a focus on the underlying technical steps, API calls, React component state changes, and system interactions.]
            ◦ Example: User Registers & Creates First Item:
                ▪ Frontend: User inputs data on the RegistrationPage (using controlled <input> components and a <Button>).
                ▪ Frontend: The useAuth hook's registerUser() function is called, triggering a POST to /api/v1/auth/register via axios.
                ▪ Backend: AuthService validates input, hashes the password, stores the user, and sends a verification email.
                ▪ Frontend: Upon success, a toast notification is displayed, and React Router navigates to EmailVerificationPendingPage, which shows a loading spinner.
                ▪ User: Clicks the verification link in the email.
                ▪ Backend: AuthService validates the token and updates the user's status.
                ▪ Frontend: The AuthStore (Zustand) detects the auth status change, and a protected route in React Router redirects to the DashboardPage.
                ▪ Frontend: User navigates to the CreateItemPage, calls POST /api/v1/items via a useItems hook.
                ▪ Backend: ItemService validates, processes, and stores the data.
        • 2.3. Comprehensive Screen & View Inventory:
            ◦ [List every single screen/view required. For each, describe its primary purpose, key data displayed, and primary user interactions, noting reusable components.]
            ◦ Example:
                ▪ 2.3.1. Authentication Module Pages:
                    • WelcomePage: Features an introductory message and CTAs.
                    • LoginPage: Features controlled <input> components, a "Show/Hide Password" toggle, and social login buttons.
                    • RegisterPage: Similar to Login, with additional fields and a "Terms of Service" checkbox.
                ▪ 2.3.2. Core Application Pages:
                    • DashboardPage: Adaptable layout using Tailwind CSS responsive prefixes. Features a SideNav for navigation, a Header, and a CardGrid for displaying items.
                    • ItemDetailPage: Uses a dynamic route (/items/:itemId). Fetches and displays item details, using Shimmer components for the loading state.
                    • SettingsPage: A form for updating user preferences, with toggles and input fields.
    3. Deep Technical Design & Architecture
        • 3.1. System Architecture:
            ◦ Frontend Stack: [Default: React]
                ▪ Core Framework: React (latest stable), TypeScript.
                ▪ State Management: Zustand (for centralized, simple state management).
                ▪ Navigation: React Router (for declarative routing and deep linking).
                ▪ HTTP Client: Axios (with interceptors for auth and logging).
                ▪ Styling: Tailwind CSS (for utility-first styling).
                ▪ UI Components: A custom component library or a headless UI library (e.g., Headless UI) for creating accessible, reusable components.
                ▪ Data Persistence (Local): localStorage for non-sensitive data, IndexedDB (via Dexie.js) for offline capabilities.
            ◦ Backend Services: [Default: Node.js with Express.js]
            ◦ Database Strategy: [Default: PostgreSQL, MongoDB, or SQLite based on need]
        • 3.2. External Libraries & Dependencies (Latest Stable Versions - as of June 2025):
            ◦ Frontend (React):
                ▪ react: 18.3.1
                ▪ react-dom: 18.3.1
                ▪ react-router-dom: 6.24.0
                ▪ zustand: 4.5.2
                ▪ axios: 1.7.2
                ▪ tailwindcss: 3.4.4
                ▪ react-hook-form: 7.52.0
                ▪ zod: 3.23.8 (for schema validation)
                ▪ @tanstack/react-query: 5.45.1 (for server state management)
                ▪ framer-motion: 11.2.11 (for animations)
                ▪ lucide-react: 0.395.0 (for icons)
                ▪ i18next: 23.11.5 (for internationalization)
                ▪ @testing-library/react: 16.0.0
                ▪ jest: 29.7.0
            ◦ Backend (Node.js/Express.js):
                ▪ express: 4.19.2
                ▪ mongoose: 8.4.3 (if MongoDB) / sequelize: 6.37.3 (if PostgreSQL)
                ▪ jsonwebtoken: 9.0.2
                ▪ bcrypt: 5.1.1
                ▪ cors: 2.8.5
                ▪ helmet: 7.1.0
                ▪ express-validator: 7.0.1
        • 3.3. Core API Design (Concise Endpoints):
            ◦ POST /api/v1/auth/login: Authenticates a user.
            ◦ POST /api/v1/auth/register: Registers a new user.
            ◦ GET /api/v1/users/me: Retrieves the current user's profile.
            ◦ GET /api/v1/items: Retrieves a paginated list of items.
        • 3.4. Data Model & Schema:
            ◦ [Detailed entity-relationship diagrams (conceptual) or schema definitions, emphasizing indexing and relationships.]
        • 3.5. Reusable Modules, Libraries & Design Patterns:
            ◦ Backend:
                ▪ AuthService: Encapsulates authentication logic.
                ▪ ErrorHandlingMiddleware: Standardizes error responses.
            ◦ Frontend (React):
                ▪ ApiClient: Centralized Axios instance with interceptors.
                ▪ AuthStore (Zustand): Global state for user authentication.
                ▪ ThemeStore (Zustand): Manages app theme (light/dark mode).
                ▪ Component Library: Reusable components like <Button>, <Input>, <Card>, <Modal>.
                ▪ Custom Hooks: useAuth, useItems, useDebounce for abstracting logic.
                ▪ OfflineSyncManager: Manages offline actions and syncs with the backend.
        • 3.6. State Management & Data Flow:
            ◦ Frontend: Utilize Zustand for global state (auth, theme) and TanStack Query for server state (caching, fetching, mutating API data). Local component state will be managed with useState. Data flows from APIs via hooks into components. User actions call functions in hooks, which update state and trigger API calls.
        • 3.7. Error Handling, Logging & Monitoring Strategy:
            ◦ Standardized error responses from the backend are parsed by the ApiClient. Component-level errors are caught with Error Boundaries.
        • 3.8. Caching & Performance Optimizations:
            ◦ Frontend (React): Component memoization (React.memo), code splitting (via dynamic import()), image optimization, and server-state caching with TanStack Query.
        • 3.9. Security Implementation Details:
            ◦ Authentication via JWTs (short-lived access tokens, long-lived refresh tokens in HttpOnly cookies). Input validation with Zod. Prevention of XSS via React's default data binding.
    4. Non-Functional Requirements
        • 4.1. Performance Metrics: API response times, page load times (Core Web Vitals).
        • 4.2. Scalability Targets: User base growth, data volume.
        • 4.3. Reliability & High Availability: Uptime SLA, disaster recovery.
        • 4.4. Maintainability & Testability: Code coverage targets, adherence to linting rules.
        • 4.5. Compatibility: Target modern browsers (Chrome, Firefox, Safari, Edge).
    5. Implementation Roadmap & Milestones
        • [A high-level phasing of technical development (e.g., Phase 1: Core Auth & UI Shell; Phase 2: Feature X; Phase 3: Optimizations).]
    6. Technical Risks, Open Questions & Assumptions
        • [List identified technical risks and state any assumptions made, including the use of the default tech stack.]

Instructions for the AI (Internal Software Designer Mindset):
    1. Deep Analysis & Inference: Go beyond surface-level answers. Infer the underlying technical requirements and design implications from the user's responses to the Blueprint Questions.
    2. Architectural Vision & Defaults: Form a high-level architectural vision. If the user explicitly states tech preferences, use them. Otherwise, intelligently apply the default stacks.
    3. DRY & Modularity First: Actively identify and propose reusable modules, services, APIs, and UI components before detailing specific feature implementations. Structure the PRD to highlight these reusable building blocks.
    4. Genuine Technical Design: For every feature and component, think about how it would genuinely be built with the chosen/default stack. Consider database schema implications, API contracts, error handling, security flows, and data synchronization.
    5. Best Practices Integration: Weave in established software design principles (SOLID, loose coupling, separation of concerns, defensive programming) into the proposed solutions and explanations.
    6. Real-World Examples: Use concrete, realistic examples for API endpoints, data schema, and technical flows, consistent with the chosen/default stack.
    7. Comprehensive Screen Inventory: Ensure every screen or distinct UI state is identified, with a brief technical note on its purpose and potential reusable elements.
    8. Actionable for Task Creation: The level of detail should enable a development team to break down the PRD into specific, measurable, achievable, relevant, and time-bound (SMART) tasks for individual developers.
    9. Proactive Problem Solving: Anticipate potential technical challenges (e.g., scalability bottlenecks, complex integrations) and suggest high-level mitigation strategies.
    10. Clarity and Precision: Use precise technical language. Employ diagrams (conceptually described), tables, and bullet points for maximum clarity. Avoid ambiguity.
    11. Balance Detail with Conciseness: Provide sufficient detail without overwhelming the reader. Focus on information useful to developers.
    12. Iterative Thinking: While a "final" PRD, it should implicitly allow for further refinement during the development process (e.g., via "Open Questions & Assumptions").
    13. Latest Libraries Lookup: When populating "3.2. External Libraries & Dependencies," simulate a real-time check for the latest stable versions of relevant libraries for the chosen/default stack. Acknowledge the current date (June 17, 2025) for version context.
    14. Concise Endpoints: Ensure "3.3. Core API Design" only lists the endpoint path, HTTP method, and a brief description, without JSON bodies or error responses.
    15. Performance Optimization: Strategies for efficient resource utilization and responsiveness, including Flutter's build performance, image caching, and optimized backend queries.
    16. Modern UI/UX: Adherence to design framework guidelines, rich animations , adaptive layouts (e.g., using 'MediaQuery' for responsiveness), and visually stunning elements.
    17. Maintainability & Extensibility: Code readability, testability (with clear unit and widget tests), and ease of future modifications using a layered architecture.
      
`	

}

export const generate_mobile_structure = (content="",additional_note="")=>{

return `

AI Prompt: Architect-Driven, DRY & Best-Principles Technical PRD Generator with Default Stacks & Latest External Libraries (Concise Endpoints, Modern Flutter UI & Detailed Implementations)

Goal: To generate an architect-driven, comprehensive, and highly actionable Technical Product Requirements Document (PRD). This PRD will internalize the principles of a seasoned software designer, envisioning every required part, feature, and implementation detail. It will strictly adhere to the DRY (Don't Repeat Yourself) principle and other best software design principles (e.g., SOLID, separation of concerns, modularity, scalability, security by design), ensuring genuinely real, creative, and optimized implementations, along with the strategic arrangement of all components. The output will serve as a definitive blueprint for developers to create granular tasks.

Crucially, if specific technology stacks are not mentioned in the 'Blueprint Questions & Answers', the AI will default to the following, where applicable:
    • Frontend (Mobile): Flutter (with Riverpod for robust state management and an emphasis on Material 3 design, using modern widgets like NavigationRail, SnackBar, Hero animations, and custom painters where appropriate for a top-notch, visually appealing UI as seen in the provided samples).
    • Backend (if required): Node.js with Express.js
    • Database (if required): SQLite (for simple, embedded needs or initial mobile-first local storage) / MongoDB/Mongoose (for scalable, server-side non-relational needs) / PostgreSQL (for scalable, server-side relational needs) - The AI will intelligently choose among SQLite, MongoDB/Mongoose, and PostgreSQL based on the app's complexity, data relationships, and server-side requirements as inferred from the blueprint.
    
Input:
    1. App Idea (A Brief Description, A concise, one-paragraph summary of the app's core purpose and value proposition): """${content}""".
    2. Blueprint Questions & Answers (A series of detailed and comprehensive answers to blueprint questions. Emphasize that the quality of these answers directly influences the depth and accuracy of the generated PRD. The AI will extrapolate and infer based on these answers, applying design best practices. but you can customize them based on your needs): """${additional_note}""".

Output:
A comprehensive Technical PRD document structured as follows, embodying the best principles of software design and including detailed library information:

Technical Product Requirements Document (PRD)
        • 1.1. Executive Summary: A short technical overview of the proposed solution.
        • 1.2. Technical Vision & Goals: Beyond business goals, what are the technical aspirations for a highly performant, secure, and delightful user experience using modern Flutter capabilities?
        • 1.3. Target Audience & Critical Use Cases (Technical Lens): Identify key user segments and their most critical technical interactions with the system, focusing on interaction patterns that leverage Flutter's strengths.
    2. Functional Requirements & Optimized User Flows
        • 2.1. Feature Decomposition & Detailed Technical Scope:
            ◦ [For each major feature, provide a detailed description of its functionality, technical sub-components, and how it will operate, emphasizing reusability and explicit Flutter/backend interactions.]
            ◦ Example:
                ▪ 2.1.1. Robust User Authentication & Authorization System:
                    • 2.1.1.1. Multi-Factor Registration & Login (DRY Component: AuthService - Flutter 'AuthenticationRepository' / Backend 'AuthService'):
                        ◦ **Frontend (Flutter):** Implement 'TextFormField' widgets with 'InputDecoration.filled' and 'RoundedRectangleBorder' for modern Material 3 look. Integrate 'flutter_form_builder' for declarative form validation. User input captured and sent via 'dio' to '/api/v1/auth/register' (POST) or '/api/v1/auth/login' (POST). Securely store JWT tokens using 'shared_preferences' or 'flutter_secure_storage'. Social logins will use dedicated packages (e.g., 'google_sign_in', 'sign_in_with_apple') and abstract common logic within a 'SocialSignInProvider' (Riverpod). Email verification flow will present a 'SnackBar' upon successful registration prompting user to check email, and navigate to 'EmailVerificationScreen'.
                        ◦ **Backend (Node.js/Express.js):** 'AuthService' handles request validation ('express-validator'), password hashing ('bcrypt'), JWT generation ('jsonwebtoken'), and secure token management. Integrates with 'PostgreSQL' (or 'MongoDB') for user data persistence. Email verification token generation and sending handled by a 'NotificationService'.
                    • 2.1.1.2. Secure Password Management: Hashing (e.g., BCrypt), salting, rate-limiting on reset attempts (backend). Frontend will provide clear, real-time password strength indicators and utilize 'password_strength' package.
                    • 2.1.1.3. Role-Based Access Control (RBAC) Module: Fine-grained permissions (e.g., 'user.read', 'product.create') enforced via backend middleware. Frontend widgets will dynamically adjust visibility/interactivity based on user roles retrieved from a 'PermissionProvider' (Riverpod).
                ▪ **2.1.2. Internationalization & Localization (i18n/l10n):**
                    • **Frontend (Flutter):** Implement Flutter's built-in localization system using '.arb' files and 'flutter_gen' for type-safe access to localized strings. Provide mechanisms for users to switch languages via a 'SettingsScreen' toggle. Ensure all user-facing text, dates, numbers, and currencies are localized using the 'intl' package.
                    • **Backend (if applicable):** Design APIs to accept 'Accept-Language' headers and return localized content where appropriate, or serve static localized content from asset bundles/CDNs.
                ▪ **2.1.3. Offline Capabilities & Data Synchronization:**
                    • **Frontend (Flutter):** Implement a robust offline strategy using local persistence. For structured data, choose 'sqflite' or 'Isar' for a local database. Use 'connectivity_plus' to monitor network status. Data will be cached locally on successful fetch. User actions performed offline will be queued and synchronized with the backend ('ItemService') upon network reconnection (e.g., using a background service/worker or a dedicated 'SyncProvider' in Riverpod). Conflict resolution strategy (e.g., last-write-wins or user-prompted resolution) will be defined for specific data types.
                    • **Backend:** Design APIs and database schemas to support optimistic concurrency control or versioning for data synchronization to manage conflicts effectively.
                ▪ 2.1.4. [Feature N Name]: [Detailed technical functionality, focusing on optimized data flow, state changes (Riverpod 'Notifier'/'AsyncNotifier'), and concrete reusable Flutter widgets or backend services.]
        • 2.2. Critical User Journeys (Technical Flow):
            ◦ [Illustrate key user journeys with a focus on the underlying technical steps, precise API calls, Flutter widget state changes, and system interactions. This helps developers visualize the sequence of operations, highlighting modern Flutter UI elements.]
            ◦ Example: User Registers & Creates First Item:
                ▪ Frontend: User inputs data on 'RegistrationScreen' (using 'TextFormField's and a 'FilledButton').
                ▪ Frontend: 'ref.read(authProvider.notifier).registerUser()' is called, triggering a POST '/api/v1/auth/register' via 'dio'.
                ▪ Backend: 'AuthService' validates input, hashes password, stores user in 'users' table, sends verification email via 'NotificationService'.
                ▪ Frontend: Upon successful registration, a 'SnackBar' with an action button is displayed ('ScaffoldMessenger.of(context).showSnackBar()'), and 'go_router' navigates to 'EmailVerificationPendingScreen' which shows an 'AnimatedCrossFade' between loading and success states.
                ▪ User: Clicks verification link in email (deep link handled by 'uni_links' or 'go_router''s built-in deep linking).
                ▪ Backend: 'AuthService' validates token, updates user status.
                ▪ Frontend: 'AuthRepository' (via Riverpod) detects auth status change, 'go_router' redirects to 'DashboardScreen' (which utilizes 'NavigationRail' for primary navigation on wider screens, and 'BottomNavigationBar' on narrow screens).
                ▪ Frontend: User navigates to 'CreateItemScreen' (a modal bottom sheet 'showModalBottomSheet' for quick input, styled with 'Material 3' components).
                ▪ Frontend: Calls POST '/api/v1/items' with item data (e.g., using 'ImagePicker' for image upload, 'TextFormField' for description, and an 'ElevatedButton' for submission) via an 'ItemRepository' (Riverpod).
                ▪ Backend: 'ItemService' validates, processes, stores data in 'products' table, potentially triggers events (e.g., 'ItemCreatedEvent' via a message queue).
        • 2.3. Comprehensive Screen & View Inventory:
            ◦ [List every single screen/view required. For each, describe its primary purpose, key data displayed, and primary user interactions. Explicitly note modern Flutter widgets, Material 3 components, and any screens that reuse common UI components or layouts, aiming for designs similar to the provided visual samples.]
            ◦ Example:
                ▪ 2.3.1. Authentication Module Screens:
                    • SplashScreen: Features a 'Hero' animation for the app logo transition.
                    • WelcomeCarouselScreen: Uses 'PageView.builder' with 'SmoothPageIndicator' for onboarding, 'FilledButton's for CTA.
                    • LoginScreen: Features 'TextFormField's with 'suffixIcon' for password visibility toggling, 'FilledButton's for login, and custom 'SocialLoginButtons' with 'OutlinedButton's and icons. Utilizes 'FormKey' for validation.
                    • RegisterScreen: Similar to Login, with additional 'TextFormField's for user details, 'Checkbox' for terms, and a 'TextButton' for "Forgot Password".
                    • ForgotPasswordScreen: A simple 'Scaffold' with 'AppBar', 'TextFormField', and 'ElevatedButton'.
                    • EmailVerificationScreen: Displays a progress indicator ('CircularProgressIndicator') while checking status, a 'Container' with 'BorderRadius' and shadow for the message box, and a 'TextButton' to resend email.
                ▪ 2.3.2. Core Application Screens:
                    • DashboardScreen: Adaptable layout using 'LayoutBuilder' to switch between 'BottomNavigationBar' (mobile) and 'NavigationRail' (tablet/desktop), features 'SliverAppBar' for scrolling effects, custom 'Card' widgets with rounded corners and subtle shadows (Material 3 elevation), 'ListView.builder' for lists of items, and potentially a 'CustomPaint' widget for a unique background shape (as seen in fitness app samples). Uses 'Consumer' or 'Selector' for Riverpod state updates.
                    • ItemDetailScreen (ID: {itemId}): Uses 'Hero' animation for image transition from list view, 'SingleChildScrollView' for content, 'ClipRRect' for image shaping, 'RichText' for dynamic content, and 'FilledButton'/'FloatingActionButton.extended' for primary actions. Incorporates 'SnackBar' for feedback (e.g., "Item added to cart").
                    • SettingsScreen: Structured with 'ListTile's, 'SwitchListTile's for toggles (e.g., dark mode, language selection), 'Divider's, and 'PopupMenuButton' for advanced options.
                    • ProfileScreen: Uses a 'CircleAvatar' for the profile picture, 'Column' and 'Row' widgets for structured user information, 'Card' widgets for sections, and 'FilledButton' or 'OutlinedButton' for actions like "Edit Profile" or "Logout". (Similar to uploaded profile samples).
                    • [Screen N]: [Brief description, explicitly noting reusable components, Material 3 design patterns, and adaptive layout considerations for a visually rich experience.]
    3. Deep Technical Design & Architecture
        • 3.1. System Architecture (Component-Level Detail):
            ◦ [Provide a detailed architectural diagram (conceptual description) outlining services, databases, message queues, and their interconnections. Justify chosen technologies based on scalability, performance, and maintainability. Defaults will be used if not specified. Emphasize how Flutter frontend components integrate.]
            ◦ Frontend Stack: [Default: Flutter (with Riverpod and Material 3)]
                ▪ **Core Framework:** Flutter SDK (latest stable).
                ▪ **State Management:** Riverpod (using 'Provider', 'Notifier', 'AsyncNotifier', 'Family' for efficient and testable state).
                ▪ **Navigation:** 'go_router' for declarative routing and deep linking, handling both 'BottomNavigationBar' and 'NavigationRail' transitions.
                ▪ **HTTP Client:** 'dio' for robust network requests, interceptors for logging, authentication.
                ▪ **UI Components:** Extensive use of Material 3 widgets ('ElevatedButton', 'FilledButton', 'OutlinedButton', 'Card', 'AppBar', 'SnackBar', 'NavigationRail', 'BottomNavigationBar', 'TextFormField', 'PopupMenuButton', 'Switch', 'Checkbox'), 'Cupertino' widgets for iOS platform adaptation where necessary. Custom painters for unique visual elements.
                ▪ **Data Persistence (Local):** 'shared_preferences' for key-value storage, 'sqflite' or 'Isar' (for local database needs as part of offline strategy), 'flutter_secure_storage' for sensitive data.
            ◦ Backend Services (if required for functionality): [Default: Node.js with Express.js] [Specific languages, frameworks, runtime.]
            ◦ Database Strategy (if required): [Default: PostgreSQL if server-side relational needs is implied; MongoDB if server-side non-relational; otherwise SQLite for local/embedded data.]
                ▪ Primary DB: [e.g., PostgreSQL for relational data (users, items, transactions). Justify choice (ACID, complex queries, support for JSONB if needed).]
                ▪ Caching Layer (if applicable): [e.g., Redis] for session management, frequently accessed read-heavy data, and rate limiting.
                ▪ Search Engine (if applicable): [e.g., Elasticsearch] for full-text search, with Flutter frontend integrating search results efficiently.
                ▪ Message Broker (if applicable): [e.g., RabbitMQ, Kafka] for asynchronous communication, event processing (e.g., 'UserRegisteredEvent', 'ItemCreatedEvent').
                ▪ File Storage (if applicable): [e.g., AWS S3, Azure Blob Storage] for user-uploaded content (images, documents), with Flutter's 'image_picker' and 'dio' handling uploads.
                ▪ API Gateway (if applicable): [e.g., AWS API Gateway, NGINX] for request routing, authentication, rate limiting, and potentially response transformation for Flutter clients.
                ▪ Cloud Infrastructure (if applicable): [e.g., AWS, Azure, Google Cloud Platform. Will make a reasonable default inference if not specified, e.g., AWS for a general cloud need.]
                ▪ CI/CD Pipeline (High-Level): [Brief mention of intended CI/CD tools and strategy, including Flutter-specific build/deployment (e.g., Fastlane).]
        • 3.2. External Libraries & Dependencies (Latest Stable Versions - as of June 17, 2025):
            ◦ [This section is mandatory. List all significant external libraries/packages/SDKs required for the app's implementation, along with their latest stable versions. Group them by frontend/backend/common where applicable. The AI will simulate a check for latest versions, ensuring modern Material 3 compatibility.]
            ◦ Example (will be genuinely populated by AI):
                ▪ Frontend (Flutter):
                    • flutter: 3.22.2 (latest stable SDK)
                    • flutter_riverpod: 2.5.1
                    • go_router: 14.1.4
                    • dio: 5.4.3+1
                    • shared_preferences: 2.2.3
                    • flutter_secure_storage: 9.0.0
                    • cached_network_image: 3.3.1
                    • image_picker: 1.1.2
                    • font_awesome_flutter: 10.7.0 (for rich icons)
                    • google_sign_in: 6.2.1
                    • sign_in_with_apple: 6.1.1
                    • intl: 0.19.0 (for localization/date formatting)
                    • equatable: 2.0.5
                    • uuid: 4.1.0
                    • flex_color_scheme: 7.3.1 (for advanced theming with Material 3)
                    • shimmer: 3.0.0 (for loading states, as seen in modern apps)
                    • charts_flutter: 0.12.0 (if data visualization is implied from app idea)
                    • 'package:http/http.dart': 1.2.1 (as alternative/fallback for network)
                    • 'url_launcher': 6.3.0
                    • 'path_provider': 2.1.3
                    • 'sqflite': 2.3.3 (or 'isar': 3.1.0 for more complex local DB)
                    • 'json_annotation': 4.9.0
                    • 'connectivity_plus': 6.0.1 (for network status monitoring for offline mode)
                    • 'flutter_localizations': (included with Flutter SDK)
                ▪ Backend (Node.js/Express.js - if applicable):
                    • express: 4.19.2
                    • mongoose: 8.4.3 (if MongoDB) / sequelize: 6.37.3 (if PostgreSQL)
                    • pg: 8.12.0 (if PostgreSQL directly)
                    • jsonwebtoken: 9.0.2
                    • bcrypt: 5.1.1
                    • dotenv: 16.4.5
                    • winston: 3.13.0
                    • cors: 2.8.5
                    • helmet: 7.1.0
                    • express-validator: 7.0.1 (for robust input validation)
                    • nodemailer: 6.9.13 (for email notifications)
                ▪ Common/Utilities:
                    • uuid: 9.0.1 (Node.js)
                    • lodash: 4.17.21 (Node.js)
        • 3.3. Core API Design (Concise Endpoints):
            ◦ [List the main API endpoints with their HTTP methods and a brief description. Focus on what Flutter clients will consume. No detailed JSON request/response bodies or error responses will be included, but assume standard RESTful practices.]
            ◦ Example:
                ▪ POST /api/v1/auth/login: Authenticates a user and issues an access token.
                ▪ POST /api/v1/auth/register: Registers a new user account.
                ▪ GET /api/v1/users/{userId}: Retrieves details for a specific user (e.g., profile data to display in 'ProfileScreen').
                ▪ PUT /api/v1/users/{userId}: Updates details for a specific user.
                ▪ GET /api/v1/items: Retrieves a paginated list of items (e.g., for 'DashboardScreen''s 'ListView').
                ▪ POST /api/v1/items: Creates a new item, potentially accepting file uploads.
                ▪ GET /api/v1/items/{itemId}: Retrieves detailed information for a single item (for 'ItemDetailScreen').
                ▪ DELETE /api/v1/items/{itemId}: Deletes an item.
        • 3.4. Data Model & Schema (Relational/NoSQL Design):
            ◦ [Detailed entity-relationship diagrams (conceptual, with attributes and types) for relational databases or schema definitions for NoSQL databases. Emphasize indexing strategies, relationships, and data integrity constraints. Consider how Flutter models will map to these.]
            ◦ Example (Conceptual for users and products):
                ▪ Table: users
                    • user_id (UUID, PK) - Primary key, indexed.
                    • email (VARCHAR(255), UNIQUE, NOT NULL) - Indexed for fast lookups.
                    • password_hash (TEXT, NOT NULL)
                    • first_name (VARCHAR(100), NOT NULL)
                    • last_name (VARCHAR(100), NOT NULL)
                    • profile_picture_url (TEXT, NULL) - URL to external storage (e.g., S3).
                    • account_status (ENUM('active', 'pending_verification', 'suspended'), DEFAULT 'pending_verification')
                    • created_at (TIMESTAMPTZ, DEFAULT NOW(), Indexed)
                    • updated_at (TIMESTAMPTZ, DEFAULT NOW(), Indexed)
                    • last_login (TIMESTAMPTZ, NULL) - Indexed.
                ▪ Table: products
                    • product_id (UUID, PK)
                    • owner_user_id (UUID, FK -> users.user_id, Indexed)
                    • name (VARCHAR(255), NOT NULL, Indexed for search/filtering).
                    • description (TEXT, NULL)
                    • price (NUMERIC(10,2), NOT NULL)
                    • currency (VARCHAR(3), NOT NULL, DEFAULT 'NGN')
                    • status (ENUM('available', 'sold', 'draft'), NOT NULL, DEFAULT 'draft') - Indexed for filtering.
                    • created_at (TIMESTAMPTZ, DEFAULT NOW())
                    • updated_at (TIMESTAMPTZ, DEFAULT NOW())
                    • image_urls (TEXT[], NULL) - Array of URLs for multiple product images.
                    • category (VARCHAR(50), NOT NULL, Indexed).
        • 3.5. Reusable Modules, Libraries & Design Patterns:
            ◦ [This is a critical section for DRY and best practices. Explicitly outline every potential reusable component, library, or design pattern that should be implemented, focusing on their detailed technical role in a Flutter/Node.js ecosystem.]
            ◦ Backend:
                ▪ 'AuthService': Encapsulates all authentication/authorization logic, including JWT handling, password hashing, and user session management.
                ▪ 'NotificationService': Generic interface for email, SMS, Push notifications, abstracting provider specifics (e.g., SendGrid, Twilio).
                ▪ 'ValidationMiddleware' (Express): Centralized schema validation using 'express-validator' or 'Joi'.
                ▪ 'ErrorHandlingMiddleware': Standardized error responses (e.g., custom 'AppError' class) and centralized logging ('Winston').
                ▪ 'DatabaseClient/ORM Wrapper': Consistent database interaction layer ('Mongoose' for MongoDB, 'Sequelize' for PostgreSQL, or direct 'pg' client wrapper).
                ▪ 'EventBus/MessagePublisher': For inter-service communication (if microservices, e.g., 'RabbitMQ' client).
                ▪ 'FileStorageService': Utility for interacting with cloud storage (e.g., AWS S3 SDK).
            ◦ Frontend (Flutter):
                ▪ 'APIClient' (via Dio): Centralized utility for making all API calls, handling authentication tokens (injecting into headers), global error parsing (e.g., 401 refresh token logic), and request retries.
                ▪ 'AuthProvider'/'AuthNotifier' (Riverpod): Global state management for user authentication status, user data, and authentication-related actions (login, logout, registration). Listens to 'shared_preferences' for persistent login.
                ▪ 'ThemeNotifier' (Riverpod): Manages app theme (light/dark mode) and Material 3 color schemes, allowing dynamic switching.
                ▪ 'FormWidgets': Generic, reusable Flutter widgets for input fields ('CustomTextFormField' with built-in validation and 'Material 3' styling), buttons ('PrimaryButton', 'SecondaryButton' with 'FilledButton'/'OutlinedButton'), checkboxes, dropdowns, adhering to the app's design system.
                ▪ 'DialogService': Centralized control for displaying custom dialogs/modals (e.g., 'showDialog' with custom content), error alerts, and confirmation prompts (replacing 'alert'/'confirm').
                ▪ 'SnackBarService': For displaying temporary success/error messages ('ScaffoldMessenger.of(context).showSnackBar').
                ▪ 'ImagePickerUploader': Reusable Flutter component for image selection ('image_picker') and direct upload ('dio') to cloud storage, showing progress indicators.
                ▪ 'LoadingOverlay': A reusable widget or overlay service to show full-screen loading indicators during async operations.
                ▪ 'AdaptiveLayout' Widgets: Components that dynamically adjust their layout based on screen size (e.g., switching between 'BottomNavigationBar' and 'NavigationRail').
                ▪ 'LocalizationService': Handles loading and providing localized strings, potentially integrating with 'flutter_localizations' and 'intl'.
                ▪ 'OfflineSyncManager' (Riverpod): Manages the queue of offline actions and triggers data synchronization with the backend upon network availability.
            ◦ Common (Utils/Models):
                ▪ 'Logger': Consistent logging utility for both frontend (e.g., 'logger' package, sending to remote logging service like Firebase Crashlytics/Sentry) and backend ('Winston').
                ▪ 'ConfigurationManager': Environment-agnostic config loading for both platforms.
                ▪ Data Models: Shared Dart classes (e.g., using 'json_annotation' for JSON serialization/deserialization) defining the structure of API request/response bodies and database entities, ensuring consistency between frontend and backend.
        • 3.6. State Management & Data Flow (Detailed):
            ◦ Frontend: Utilize Riverpod extensively. Data will flow from backend APIs (via 'dio') into 'Repository' classes (e.g., 'AuthRepository', 'ItemRepository'). These repositories will expose 'Notifier' or 'AsyncNotifier' providers, which widgets will 'watch' or 'read'. For example, 'AuthProvider' will hold the current user state, 'ItemsProvider' will manage lists of items, and 'SelectedFilterProvider' will manage UI filtering state. User actions will call methods on 'Notifiers' to update state and interact with repositories. This includes managing local state for offline capabilities before syncing.
            ◦ Backend: Data flow is typically request-response based. 'Controllers' handle incoming requests, delegate business logic to 'Services', which interact with 'Repositories' (or 'DAOs') for database operations.
        • 3.7. Error Handling, Logging & Monitoring Strategy:
            ◦ Standardized Error Responses: Consistent HTTP status codes (4xx, 5xx) and JSON error payloads from backend APIs. Flutter's 'dio' interceptors will parse these errors into a structured 'AppException' (Dart).
            ◦ Centralized Logging: Aggregate logs from both Flutter (using 'logger' package, sending to remote logging service like Firebase Crashlytics/Sentry) and Node.js ('Winston', sending to ELK stack/CloudWatch). Specify log levels (debug, info, warn, error) and critical data to capture (timestamps, user IDs, request IDs, error stack traces).
            ◦ Monitoring & Alerting: Tools for system health, performance metrics (e.g., Prometheus/Grafana, AWS CloudWatch), and alerts (PagerDuty, Slack). Flutter performance metrics (frame rates, memory usage) will be tracked.
            ◦ Tracing: Distributed tracing for microservices (e.g., OpenTelemetry, AWS X-Ray) to understand request flow across services.
        • 3.8. Caching & Performance Optimizations:
            ◦ Frontend (Flutter): Image caching ('cached_network_image'), lazy loading of lists ('ListView.builder' or 'ListView.separated'), code splitting (implicitly handled by Flutter), widget tree optimization (const widgets, minimal rebuilds using Riverpod's granular reactivity), pre-fetching data, and local database caching for offline access.
            ◦ Backend: Database indexing, query optimization, Redis caching for frequently accessed data (e.g., user profiles, popular items), HTTP caching headers.
        • 3.9. Security Implementation Details (In-Depth):
            ◦ Authentication & Authorization: JWT structure (short-lived access tokens, long-lived refresh tokens), token refresh mechanisms ('dio' interceptor for automatic refresh), secure storage of tokens ('flutter_secure_storage' on frontend, HttpOnly cookies/Redis on backend).
            ◦ Data Protection: Encryption at rest (database-level, cloud storage, local device encryption) and in transit (HTTPS/TLS 1.3 for all communications).
            ◦ Input Validation: Strict server-side validation ('express-validator') and client-side validation (Flutter forms) to prevent common vulnerabilities.
            ◦ Vulnerability Mitigation: Prevention of XSS, CSRF, SQL Injection (via ORMs/prepared statements), broken access control, mass assignment, insecure direct object references. Rate limiting on sensitive endpoints (e.g., login, password reset).
            ◦ API Security: API key management, OAuth scopes for granular access.
            ◦ Principle of Least Privilege: Minimal access for services and users to resources.
    4. Non-Functional Requirements (Actionable & Testable)
        • 4.1. Performance Metrics:
            ◦ API Response Times: Specific targets (e.g., 90th percentile of critical API calls < 200ms).
            ◦ Page Load Times (Flutter): Specific targets (e.g., main screens load < 1 second on first open, < 0.5 seconds on subsequent opens).
            ◦ Concurrency: Support [X] concurrent active users with acceptable performance (e.g., average response time degradation < 10%).
        • 4.2. Scalability Targets:
            ◦ User Base Growth: Able to scale to [X] times current expected user base within [Y] months/years with minimal architectural changes, primarily through horizontal scaling of backend services and database read replicas.
            ◦ Data Volume: Handle [X] GB/TB of data per month/year (e.g., 1 TB of user-generated content, 100GB of transactional data).
        • 4.3. Reliability & High Availability:
            ◦ Uptime SLA: [e.g., 99.99% (four nines)] for core services.
            ◦ Disaster Recovery Objective: RTO (Recovery Time Objective) of [Z] minutes/hours, RPO (Recovery Point Objective) of [P] minutes/hours.
            ◦ Redundancy: Implementation of redundant services and databases in multiple availability zones.
        • 4.4. Maintainability & Testability:
            ◦ Code Coverage: Minimum [X]% unit test coverage, [Y]% integration test coverage for both Flutter and backend.
            ◦ Code Quality: Adherence to established linting rules (e.g., 'flutter_lints' for Flutter, ESLint for Node.js), static analysis, and mandatory code review processes.
            ◦ Documentation: Comprehensive inline comments, clear READMEs, updated architectural diagrams, and OpenAPI documentation for backend APIs.
        • 4.5. Deployment & Operations:
            ◦ CI/CD: Automated build, test, and deployment pipelines (e.g., GitHub Actions, GitLab CI for Flutter apps to App Store/Play Store and backend to cloud services).
            ◦ Monitoring: Comprehensive observability (metrics, logs, traces) for production systems, with dashboards and alerts.
            ◦ Rollback Strategy: Defined process for safe, rapid rollbacks in case of production issues.
        • 4.6. Compatibility:
            ◦ Mobile OS: iOS (min version: 15.0), Android (min SDK: 21).
            ◦ Web Browsers (if Flutter web is considered): Chrome, Firefox, Safari, Edge (last 2 versions).
    5. Implementation Roadmap & Milestones (Technical Perspective)
        • [Suggest a high-level phasing of technical development, e.g., Phase 1: Core Authentication & User Profile; Phase 2: Item Management & Search; Phase 3: Notifications & Analytics. Highlight Flutter-specific milestones like "Material 3 Theme Implementation" or "Adaptive Layouts for Tablet Support".]
        • [Identify critical technical dependencies, e.g., "Backend API for Authentication must be stable before frontend authentication can be completed."]
    6. Technical Risks, Open Questions & Assumptions
        • [List any identified technical risks (e.g., performance bottlenecks with large datasets, complexity of custom UI animations, third-party API integration stability, complex offline data conflict resolution). Suggest high-level mitigation strategies (e.g., "Implement database sharding if user base exceeds 1M," "Conduct thorough performance testing on key Flutter screens").]
        • [Clearly state any remaining open technical questions or assumptions made during the design process that require further clarification or validation. Includes stating when default stacks were assumed and any specific design choices (e.g., "Assumed Material 3 design will be strictly followed, requiring custom theming implementation.").]

Instructions for the AI (Internal Software Designer Mindset):
    1. Deep Analysis & Inference: Go beyond surface-level answers. Infer the underlying technical requirements and design implications from the user's responses to the Blueprint Questions.
    2. Architectural Vision & Defaults: Form a high-level architectural vision. If the user explicitly states tech preferences, use them. Otherwise, intelligently apply the default stacks (Flutter with Riverpod and Material 3 for frontend, Node.js with Express.js for backend if needed, SQLite for local/simple needs or PostgreSQL/MongoDB for server-side persistence based on data relationships) and clearly state in "Open Questions & Assumptions" that defaults were used.
    3. DRY & Modularity First: Actively identify and propose reusable modules, services, APIs, and UI components before detailing specific feature implementations. Structure the PRD to highlight these reusable building blocks.
    4. Genuine Technical Design: For every feature and component, think about how it would genuinely be built with the chosen/default stack. Consider database schema implications, API contracts, error handling, security flows, and data synchronization.
    5. Best Practices Integration: Weave in established software design principles (SOLID, loose coupling, separation of concerns, defensive programming) into the proposed solutions and explanations.
    6. Real-World Examples: Use concrete, realistic examples for API endpoints, data schema, and technical flows, consistent with the chosen/default stack.
    7. Comprehensive Screen Inventory: Ensure every screen or distinct UI state is identified, with a brief technical note on its purpose and potential reusable elements.
    8. Actionable for Task Creation: The level of detail should enable a development team to break down the PRD into specific, measurable, achievable, relevant, and time-bound (SMART) tasks for individual developers.
    9. Proactive Problem Solving: Anticipate potential technical challenges (e.g., scalability bottlenecks, complex integrations) and suggest high-level mitigation strategies.
    10. Clarity and Precision: Use precise technical language. Employ diagrams (conceptually described), tables, and bullet points for maximum clarity. Avoid ambiguity.
    11. Balance Detail with Conciseness: Provide sufficient detail without overwhelming the reader. Focus on information useful to developers.
    12. Iterative Thinking: While a "final" PRD, it should implicitly allow for further refinement during the development process (e.g., via "Open Questions & Assumptions").
    13. Latest Libraries Lookup: When populating "3.2. External Libraries & Dependencies," simulate a real-time check for the latest stable versions of relevant libraries for the chosen/default stack. Acknowledge the current date (June 17, 2025) for version context.
    14. Concise Endpoints: Ensure "3.3. Core API Design" only lists the endpoint path, HTTP method, and a brief description, without JSON bodies or error responses.
    15. Performance Optimization: Strategies for efficient resource utilization and responsiveness, including Flutter's build performance, image caching, and optimized backend queries.
    16. Modern UI/UX: Adherence to Material 3 guidelines, rich animations (Hero, AnimatedContainer), adaptive layouts (e.g., using 'MediaQuery' or 'LayoutBuilder' for 'BottomNavigationBar'/'NavigationRail' responsiveness), and visually stunning elements akin to the provided app samples.
    17. Maintainability & Extensibility: Code readability, testability (with clear unit and widget tests), and ease of future modifications using a layered architecture.
      


`   

}


export const generate_api_structure = (content="",additional_note="")=>{

return `
AI Prompt: Architect-Driven, DRY & Best-Principles Technical PRD Generator with Default Stacks & Latest External Libraries (Concise Endpoints)

Goal: To generate an architect-driven, comprehensive, and highly actionable Technical Product Requirements Document (PRD) focused exclusively on Backend API/Service development. This PRD will internalize the principles of a seasoned software designer, envisioning every required part, service, and implementation detail. It will strictly adhere to the DRY (Don't Repeat Yourself) principle and other best software design principles (e.g., SOLID, separation of concerns, modularity, scalability, security by design), ensuring genuinely real, creative, and optimized implementations, along with the strategic arrangement of all backend components. The output will serve as a definitive blueprint for developers to create granular tasks.

Crucially, if specific technology stacks are not mentioned in the 'Blueprint Questions & Answers', the AI will default to the following, where applicable, intelligently choosing based on the application's complexity and requirements:
    • Backend: Node.js with Express.js (primary choice)
    • Database: PostgreSQL (for relational data needs, primary choice) / MongoDB (for flexible schema, NoSQL document data needs) - The AI will intelligently choose between PostgreSQL and MongoDB based on the app's data structure and persistence requirements as inferred from the blueprint.

Furthermore, the PRD must explicitly list all external libraries (dependencies) that would be used in the implementation, along with their latest stable versions (as of the current date, June 16, 2025). The AI should simulate a quick check for common, robust libraries relevant to the chosen/default stack and features.

Input:
    1. App Idea (A Brief Description): A concise, one-paragraph summary of the API/service's core purpose and value proposition: """${content}""".
    2. Blueprint Questions & Answers: A series of detailed and comprehensive answers to blueprint questions. Emphasize that the quality of these answers directly influences the depth and accuracy of the generated PRD. The AI will extrapolate and infer based on these answers, applying design best practices. (Note: you can customize these answers based on your needs): """${additional_note}""".

Output: A comprehensive Technical PRD document structured as follows, embodying the best principles of software design and including detailed library information:

Technical Product Requirements Document (PRD)
    1. Strategic Overview & Architectural Vision
        • 1.1. Executive Summary: A high-level technical overview of the proposed backend API/service solution, its core problem solved, and the architectural philosophy underpinning its design (e.g., API-First, Microservices, Event-Driven).
        • 1.2. Core Principles & Non-Negotiables:
            ◦ DRY (Don't Repeat Yourself): Explicit commitment to abstracting common logic and components.
            ◦ Modularity & Loose Coupling: Design for independent, interchangeable services and modules.
            ◦ Scalability: Solutions for anticipated API request load and future data/user growth.
            ◦ Security by Design: Security considerations embedded from the ground up for all API endpoints and data handling.
            ◦ Performance Optimization: Strategies for efficient resource utilization and API response times.
            ◦ Maintainability & Extensibility: Code readability, testability, and ease of future modifications and API versioning.
            ◦ [Add other relevant principles based on the app idea, e.g., Idempotency, Fault Tolerance]
        • 1.3. Technical Vision & Goals: Beyond business goals, what are the technical aspirations for the backend API/service?
        • 1.4. Target Consumers & Critical API Use Cases (Technical Lens): Identify key API consumer segments (e.g., mobile apps, web apps, third-party developers) and their most critical technical interactions with the API/service.
    2. Functional Requirements & Optimized API Flows
        • 2.1. Feature Decomposition & Detailed Technical Scope:
            ◦ [For each major API feature, provide a detailed description of its functionality, technical sub-components (e.g., specific controllers, service layers), and how it will operate, emphasizing reusability and clean data processing.]
            ◦ Example:
                ▪ 2.1.1. Robust User Authentication & Authorization System (API):
                    • 2.1.1.1. Multi-Factor Registration & Login (DRY Component: AuthService):
                        ◦ Email/Password authentication with secure hashing (e.g., BCrypt) and JWT-based token issuance for stateless API authentication.
                        ◦ Social Logins (Google, Apple, GitHub) integration for seamless user registration/login. Reusable Module: SocialAuthAdapter to abstract provider specifics.
                        ◦ Email Verification Flow: Backend-driven token generation, verification, and user status update.
                    • 2.1.1.2. Secure Password Management: Hashing (e.g., BCrypt), salting, rate-limiting on password reset/login attempts.
                    • 2.1.1.3. Role-Based Access Control (RBAC) Module: Fine-grained permissions (e.g., user:read, product:create). Reusable Middleware/Guard: PermissionGuard for protecting API routes.
                ▪ 2.1.2. [API Feature Name]: [Detailed technical functionality, focusing on optimized data flow, state changes, and internal service logic for this API feature.]
        • 2.2. Critical API User Journeys (Technical Flow):
            ◦ [Illustrate key API consumer journeys with a focus on the underlying technical steps, API calls, and internal service interactions. This helps developers visualize the sequence of operations.]
            ◦ Example: User Registers & Creates First Item (via API):
                ▪ API Client: Sends POST /api/v1/auth/register with user data.
                ▪ Backend (AuthService): Validates input, hashes password, stores user in DB, sends verification email (via NotificationService).
                ▪ API Client: Receives success response, user clicks verification link.
                ▪ Backend (AuthService): Validates token, updates user status in DB.
                ▪ API Client: Sends POST /api/v1/items with item data (after obtaining auth token via AuthService).
                ▪ Backend (ItemService): Validates request, processes, stores data in DB, potentially triggers internal events (e.g., ItemCreatedEvent).
    3. Deep Technical Design & Architecture
        • 3.1. System Architecture (Component-Level Detail):
            ◦ [Provide a detailed architectural diagram (conceptual description) outlining backend services, databases, message queues, and their interconnections. Justify chosen technologies based on scalability, performance, and maintainability. Defaults will be used if not specified.]
            ◦ Backend Services: [Default: Node.js with Express.js] [Specific languages, frameworks, runtime, e.g., Python/Django/Flask, Java/Spring Boot, Go/Gin, C#/ASP.NET Core.]
            ◦ Database Strategy: [Default: PostgreSQL for relational data; MongoDB for flexible/document data.]
                ▪ Primary DB: [e.g., PostgreSQL for relational data (users, items, transactions). Justify choice (ACID, complex queries, strong consistency).]
                ▪ Caching Layer (if applicable): [e.g., Redis, Memcached] for session management, frequently accessed read-heavy data.
                ▪ Search Engine (if applicable): [e.g., Elasticsearch, Apache Solr] for full-text search capabilities.
                ▪ Message Broker (if applicable): [e.g., RabbitMQ, Kafka, AWS SQS/SNS] for asynchronous communication, event processing, decoupling services.
                ▪ File Storage (if applicable): [e.g., AWS S3, Azure Blob Storage, Google Cloud Storage] for user-uploaded content (images, documents) or static assets.
                ▪ API Gateway (if applicable): [e.g., AWS API Gateway, NGINX, Kong, Azure API Management] for request routing, authentication, rate limiting, traffic management.
                ▪ Cloud Infrastructure (if applicable): [e.g., AWS, Azure, Google Cloud Platform. Will make a reasonable default inference if not specified.]
                ▪ CI/CD Pipeline (High-Level): [Brief mention of intended CI/CD tools and strategy, e.g., GitHub Actions, GitLab CI, Jenkins, Azure DevOps, Bitbucket Pipelines.]
        • 3.2. External Libraries & Dependencies (Latest Stable Versions - as of June 16, 2025):
            ◦ [This section is mandatory. List all significant external libraries/packages/SDKs required for the backend API/service implementation, along with their latest stable versions. Group them by category (e.g., web framework, ORM/ODM, authentication, logging). The AI will simulate a check for latest versions.]
            ◦ Example (will be genuinely populated by AI):
                ▪ Backend (Node.js/Express.js):
                    • express: ~4.19.2
                    • mongoose: ~8.4.3 (if MongoDB) / sequelize: ~6.37.3 (if PostgreSQL)
                    • pg: ~8.12.0 (PostgreSQL driver)
                    • jsonwebtoken: ~9.0.2
                    • bcryptjs: ~2.4.3
                    • dotenv: ~16.4.5
                    • winston: ~3.13.0 (for logging)
                    • joi: ~17.13.1 (for validation)
                    • cors: ~2.8.5
                    • helmet: ~7.1.0 (for security headers)
                ▪ Common/Utilities:
                    • uuid: ~9.0.1
                    • lodash: ~4.17.21
        • 3.3. Core API Design (Concise Endpoints):
            ◦ [List the main API endpoints with their HTTP methods, a brief description and a detailed JSON request/response bodies or error responses will be included in this high-level overview.]
            ◦ Example:
                ▪ POST /api/v1/auth/login: Authenticates a user and issues an access token.
                ▪ POST /api/v1/auth/register: Registers a new user account.
                ▪ GET /api/v1/users/{userId}: Retrieves details for a specific user.
                ▪ PUT /api/v1/users/{userId}: Updates details for a specific user.
                ▪ GET /api/v1/items: Retrieves a list of items with optional filtering and pagination.
                ▪ POST /api/v1/items: Creates a new item.
        • 3.4. Data Model & Schema (Relational/NoSQL Design):
            ◦ [Detailed entity-relationship diagrams (conceptual, with attributes and types) for relational databases or schema definitions for NoSQL databases. Emphasize indexing strategies, relationships, and data integrity constraints.]
            ◦ Example (Conceptual for users and products):
                ▪ Table: users
                    • user_id (UUID, PK) - Primary key, indexed.
                    • email (VARCHAR(255), UNIQUE, NOT NULL) - Indexed for lookups.
                    • password_hash (TEXT, NOT NULL)
                    • first_name (VARCHAR(100), NOT NULL)
                    • last_name (VARCHAR(100), NOT NULL)
                    • profile_picture_url (TEXT, NULL)
                    • account_status (ENUM('active', 'pending_verification', 'suspended'), DEFAULT 'pending_verification')
                    • created_at (TIMESTAMPTZ, DEFAULT NOW(), Indexed)
                    • updated_at (TIMESTAMPTZ, DEFAULT NOW(), Indexed)
                ▪ Table: products
                    • product_id (UUID, PK)
                    • owner_user_id (UUID, FK -> users.user_id, Indexed)
                    • name (VARCHAR(255), NOT NULL, Indexed for search)
                    • description (TEXT, NULL)
                    • price (NUMERIC(10,2), NOT NULL)
                    • currency (VARCHAR(3), NOT NULL, DEFAULT 'NGN')
                    • status (ENUM('available', 'sold', 'draft'), NOT NULL, DEFAULT 'draft')
                    • created_at (TIMESTAMPTZ, DEFAULT NOW())
                    • updated_at (TIMESTAMPTZ, DEFAULT NOW())
        • 3.5. Reusable Modules, Libraries & Design Patterns:
            ◦ [This is a critical section for DRY and best practices. Explicitly outline every potential reusable service, module, or design pattern that should be implemented within the backend architecture.]
            ◦ Backend (Common Patterns):
                ▪ AuthService: Encapsulates all authentication/authorization logic.
                ▪ NotificationService: Generic interface for email, SMS, Push notifications.
                ▪ ValidationUtils: Centralized schema validation.
                ▪ ErrorHandlingMiddleware/Interceptor: Standardized error responses and logging.
                ▪ DatabaseClient/ORM Wrapper: Consistent database interaction layer.
                ▪ EventBus/MessagePublisher: For asynchronous communication, event processing (if event-driven architecture).
                ▪ RateLimiter: For protecting API endpoints from abuse.
                ▪ Logger: Consistent logging utility.
                ▪ ConfigurationManager: Environment-agnostic config loading.
        • 3.6. Backend Data Flow & State Management (Detailed):
            ◦ [Specific strategy for managing data flow within the backend services and persistent storage. Detail how data is processed, transformed, and exchanged between different backend components and the database layer.]
        • 3.7. Error Handling, Logging & Monitoring Strategy:
            ◦ Standardized Error Responses: Consistent HTTP status codes and JSON error payloads from APIs.
            ◦ Centralized Logging: Aggregate logs from all services (e.g., using Winston for Node.js, Logback/Log4j for Java, logging module for Python). Specify log levels and data to capture.
            ◦ Monitoring & Alerting: Tools for system health, performance metrics, and alerts (e.g., Prometheus, Grafana, AWS CloudWatch, Azure Monitor) specific to backend operations.
            ◦ Tracing: Distributed tracing for microservices (e.g., OpenTelemetry, Jaeger) for understanding request flows across services.
        • 3.8. Caching & Performance Optimizations (Backend Focus):
            ◦ [Identify critical paths for backend performance. Detail caching strategies (e.g., Redis for API response caching, database query caching, in-memory caching).]
            ◦ [Other backend optimizations: connection pooling, efficient database queries, load balancing, asynchronous processing.]
        • 3.9. Security Implementation Details (In-Depth Backend Focus):
            ◦ Authentication & Authorization: JWT structure, token refresh mechanisms, secure storage/validation of tokens.
            ◦ Data Protection: Encryption at rest and in transit (TLS/SSL).
            ◦ Input Validation: Strict server-side validation on all API inputs.
            ◦ Vulnerability Mitigation: Prevention of SQL Injection, Command Injection, broken access control, XSS (if backend renders HTML), CSRF, Server-Side Request Forgery (SSRF). Rate limiting on sensitive endpoints.
            ◦ API Security: API key management, OAuth scopes, secure API versioning.
            ◦ Principle of Least Privilege: Minimal access for services, databases, and user accounts.
            ◦ Secure Configuration: Environment variable management, secrets management solutions.
    4. Non-Functional Requirements (Actionable & Testable)
        • 4.1. Performance Metrics:
            ◦ API Response Times: Specific targets (e.g., 90% of critical API calls under 200ms, p99 latency targets).
            ◦ Concurrency: Support [X] concurrent active connections/requests with acceptable performance.
            ◦ Throughput: Handle [Y] requests per second/minute.
        • 4.2. Scalability Targets:
            ◦ User Base Growth: Backend infrastructure able to scale to [X] times current expected user base within [Y] months/years with minimal architectural changes (e.g., horizontal scaling, database sharding strategies).
            ◦ Data Volume: Handle [X] GB/TB of data per month/year.
        • 4.3. Reliability & High Availability:
            ◦ Uptime SLA: [e.g., 99.99% (four nines)].
            ◦ Disaster Recovery Objective: RTO (Recovery Time Objective) and RPO (Recovery Point Objective) targets for data and service availability.
        • 4.4. Maintainability & Testability:
            ◦ Code Coverage: Minimum [X]% unit test coverage, [Y]% integration test coverage for backend logic and APIs.
            ◦ Code Quality: Adherence to established linting rules, static analysis, and code review processes.
            ◦ Documentation: Comprehensive inline documentation (e.g., JSDoc, Swagger/OpenAPI for APIs), clear READMEs, updated architectural diagrams, and API documentation.
        • 4.5. Deployment & Operations:
            ◦ CI/CD: Automated build, test, and deployment pipelines for backend services.
            ◦ Monitoring: Comprehensive observability (metrics, logs, traces) for production backend systems.
            ◦ Rollback Strategy: Defined process for safe rollbacks of backend deployments.
        • 4.6. Compatibility (API Consumers):
            ◦ API Versioning Strategy: [e.g., semantic versioning, header versioning] to ensure backward compatibility for API consumers.
            ◦ Client Compatibility: Ensure API can be consumed by various clients (e.g., mobile platforms, web browsers, IoT devices) as needed.
    5. Implementation Roadmap & Milestones (Technical Perspective)
        • [Suggest a high-level phasing of backend technical development.]
        • [Identify critical backend technical dependencies.]
    6. Technical Risks, Open Questions & Assumptions
        • [List any identified technical risks specific to the backend (e.g., database performance bottlenecks, complex third-party API integration challenges, security vulnerabilities). Suggest mitigation strategies.]
        • [Clearly state any remaining open technical questions or assumptions made during the backend design process that require further clarification or validation. Includes stating when default stacks were assumed.]

Instructions for the AI (Internal Software Designer Mindset):
    1. Deep Analysis & Inference: Go beyond surface-level answers from the 'Blueprint Questions & Answers'. Infer the underlying technical requirements and design implications from the user's responses, specifically for backend API/service development.
    2. Architectural Vision & Defaults: Form a high-level architectural vision for the backend. If the user explicitly states tech preferences, use them. Otherwise, intelligently apply the default backend stacks (Node.js with Express.js, PostgreSQL/MongoDB for databases) and clearly state in "Open Questions & Assumptions" that defaults were used. Justify architectural choices based on performance, scalability, security, and maintainability for backend services.
    3. DRY & Modularity First: Actively identify and propose reusable services, modules, and API design patterns before detailing specific API feature implementations. Structure the PRD to highlight these reusable building blocks.
    4. Genuine Technical Design: For every feature and backend component, think about how it would genuinely be built with the chosen/default backend stack. Consider database schema implications, API contracts, error handling, security flows, and data processing synchronization.
    5. Best Practices Integration: Weave in established software design principles (SOLID, loose coupling, separation of concerns, defensive programming, RESTful/GraphQL API design, microservices principles if applicable) into the proposed solutions and explanations.
    6. Real-World Examples: Use concrete, realistic examples for API endpoints, data schema, and technical flows, consistent with the chosen/default backend stack.
    7. Actionable for Task Creation: The level of detail should enable a development team to break down the backend PRD into specific, measurable, achievable, relevant, and time-bound (SMART) tasks for individual backend developers.
    8. Proactive Problem Solving: Anticipate potential backend technical challenges (e.g., database scalability bottlenecks, complex third-party API integration challenges, latency issues, security vulnerabilities) and suggest high-level mitigation strategies.
    9. Clarity and Precision: Use precise technical language. Employ conceptual diagrams, tables, and bullet points for maximum clarity. Avoid ambiguity.
    10. Balance Detail with Conciseness: Provide sufficient detail without overwhelming the reader. Focus on information useful to backend developers.
    11. Iterative Thinking: While a "final" PRD, it should implicitly allow for further refinement during the development process (e.g., via "Open Questions & Assumptions").
    12. Latest Libraries Lookup: When populating "3.2. External Libraries & Dependencies," simulate a real-time check for the latest stable versions of relevant backend libraries for the chosen/default stack. Acknowledge the current date (June 16, 2025) for version context.
    13. Concise Endpoints: Ensure "3.3. Core API Design" lists the endpoint path, HTTP method, and a brief description, detailed JSON bodies or error responses.

`   

}

export const generate_cli_structure = (content="",additional_note="")=>{

return `
AI Prompt: Architect-Driven, DRY & Best-Principles Technical PRD Generator with Default Stacks & Latest External Libraries (Concise Commands)

Goal: To generate an architect-driven, comprehensive, and highly actionable Technical Product Requirements Document (PRD) focused exclusively on Command-Line Interface (CLI) Tool development. This PRD will internalize the principles of a seasoned software designer, envisioning every required command, argument, module, and implementation detail. It will strictly adhere to the DRY (Don't Repeat Yourself) principle and other best software design principles (e.g., SOLID, separation of concerns, modularity, performance, security by design, Unix philosophy of composability), ensuring genuinely real, creative, and optimized implementations, along with the strategic arrangement of all CLI components. The output will serve as a definitive blueprint for developers to create granular tasks.

Crucially, if specific technology stacks are not mentioned in the 'Blueprint Questions & Answers', the AI will default to the following, where applicable, intelligently choosing based on the application's complexity and requirements:
    • Primary CLI Language: Python (primary choice, utilizing libraries like Click or Typer for robust CLI scaffolding)
    • Alternative CLI Languages (if inferred appropriate): Go (for single-binary distribution, high performance), Shell Scripting (for simple automation), C/C++ (for system-level tools, maximum performance).
    • Database (for local data persistence, if required): SQLite (for embedded, simple data storage).
    • Configuration Management: YAML, JSON, or INI files for local configurations.

Furthermore, the PRD must explicitly list all external libraries (dependencies) that would be used in the implementation, along with their latest stable versions (as of the current date, June 16, 2025). The AI should simulate a quick check for common, robust libraries relevant to the chosen/default stack and features.

Input:
    1. App Idea (A Brief Description): A concise, one-paragraph summary of the CLI tool's core purpose and value proposition: """${content}""".
    2. Blueprint Questions & Answers: A series of detailed and comprehensive answers to blueprint questions. Emphasize that the quality of these answers directly influences the depth and accuracy of the generated PRD. The AI will extrapolate and infer based on these answers, applying design best practices. (Note: you can customize these answers based on your needs): """${additional_note}""".

Output: A comprehensive Technical PRD document structured as follows, embodying the best principles of software design and including detailed library information:

Technical Product Requirements Document (PRD)
    1. Strategic Overview & Architectural Vision
        • 1.1. Executive Summary: A high-level technical overview of the proposed CLI tool, its core problem solved, and the architectural philosophy underpinning its design (e.g., "single-purpose tool," "orchestration engine," "interactive wizard").
        • 1.2. Core Principles & Non-Negotiables:
            ◦ DRY (Don't Repeat Yourself): Explicit commitment to abstracting common logic (e.g., argument parsing, error handling, output formatting).
            ◦ Modularity & Composability: Design for independent, interchangeable command modules that can be chained (Unix philosophy).
            ◦ Performance: Strategies for fast execution time and efficient resource utilization, crucial for CLI tools.
            ◦ Security by Design: Secure handling of credentials, prevention of command injection.
            ◦ Cross-Platform Compatibility: Solutions for Windows, Linux, and macOS.
            ◦ User-Friendliness (CLI UX): Clear command structure, helpful messages, sensible defaults, robust error reporting.
            ◦ Maintainability & Extensibility: Code readability, testability, and ease of adding new commands or features.
            ◦ [Add other relevant principles based on the tool idea, e.g., Idempotency, Offline-first (if applicable)]
        • 1.3. Technical Vision & Goals: Beyond business goals, what are the technical aspirations for the CLI tool? (e.g., minimal dependencies, fast startup, small binary size, robust exit codes).
        • 1.4. Target Users & Critical CLI Use Cases (Technical Lens): Identify key CLI user segments (e.g., developers, system administrators, end-users) and their most critical technical interactions (e.g., tool deploy, tool setup, tool monitor).
    2. Functional Requirements & Optimized Tool Flows
        • 2.1. Feature Decomposition & Detailed Technical Scope:
            ◦ [For each major CLI feature/command, provide a detailed description of its functionality, technical sub-components (e.g., specific command handlers, argument parsers, validation logic), and how it will operate, emphasizing reusability and clean data processing.]
            ◦ Example:
                ▪ 2.1.1. Secure Configuration & Authentication Management:
                    • 2.1.1.1. tool login Command (DRY Component: AuthService):
                        ◦ Handles user authentication (e.g., via OAuth flow opening browser, or direct API key input).
                        ◦ Securely stores authentication tokens/credentials (e.g., using platform-specific credential manager, encrypted config file).
                        ◦ Reusable Module: CredentialStore for secure storage/retrieval.
                    • 2.1.1.2. tool config set/get Commands:
                        ◦ Manages local configuration settings (e.g., API endpoints, default project paths).
                        ◦ Secure handling of sensitive configuration values.
                    • 2.1.1.3. tool logout Command: Clears local authentication tokens/credentials.
                ▪ 2.1.2. [CLI Feature/Command Name]: [Detailed technical functionality, focusing on input parsing, internal logic, interactions with local data/files, and any external API calls.]
        • 2.2. Critical CLI User Journeys (Technical Flow):
            ◦ [Illustrate key CLI user journeys with a focus on the command sequences, arguments, expected output, exit codes, and internal logic flow. This helps developers visualize the sequence of operations.]
            ◦ Example: User Initializes Project & Deploys (via CLI):
                ▪ User: Runs tool init --project-name my-app.
                ▪ CLI (InitService): Validates arguments, creates project directory structure, generates default config files locally.
                ▪ User: Runs tool deploy --env production --region us-east-1.
                ▪ CLI (DeployService): Reads local config, authenticates with remote API (via AuthService), validates deployment parameters, sends deployment request to backend API.
                ▪ Backend API: Processes deployment.
                ▪ CLI: Displays real-time deployment status updates (e.g., polling /status endpoint) and final success/failure message with appropriate exit code.
        • 2.3. Comprehensive Command & Argument Inventory:
            ◦ [List every single command, subcommand, argument, and flag required. For each, describe its primary purpose, expected input, and typical output. Highlight any commands that share common logic or argument parsing patterns.]
            ◦ Example:
                ▪ 2.3.1. Core Commands:
                    • tool version: Displays the current tool version.
                    • tool help [command]: Provides help for the tool or a specific command.
                ▪ 2.3.2. Project Management Commands:
                    • tool init [project-name]: Initializes a new project in the current directory.
                        ◦ --template <name>: Optional, specify a project template.
                        ◦ -f, --force: Optional, overwrite existing directory.
                    • tool build [target]: Builds the project.
                        ◦ --clean: Optional, perform a clean build.
                    • tool deploy [--env <env>]: Deploys the project to a specified environment.
                        ◦ --region <region>: Optional, target a specific region.
                    • tool logs [--follow]: Streams or displays project logs.
                        ◦ --since <duration>: Filter logs since a specific time.
                ▪ 2.3.3. User & Auth Commands:
                    • tool login: Authenticates the user.
                    • tool logout: Clears authentication tokens.
    3. Deep Technical Design & Architecture
        • 3.1. System Architecture (Component-Level Detail):
            ◦ [Provide a detailed architectural diagram (conceptual description) outlining CLI application structure (e.g., command parser, core logic modules, data access layers), local data storage, and external API integrations. Justify chosen technologies based on performance, cross-platform compatibility, and maintainability.]
            ◦ Primary CLI Language/Framework: [Default: Python with Click/Typer] [Specific framework, runtime.]
            ◦ Backend Services (if CLI interacts with a backend): [Default: Node.js with Express.js] [Specific languages, frameworks, runtime.]
            ◦ Local Data Storage Strategy (if required): [Default: SQLite for embedded DB; or local config files (YAML/JSON) for simpler data.]
                ▪ Configuration Store: [e.g., encrypted config file, platform-specific secure storage (keychain, credential manager)].
                ▪ Local Cache: [e.g., SQLite, simple file-based caching] for frequently accessed remote data.
            ◦ File System Interaction Strategy: [e.g., Node.js fs module, Python os/pathlib] for creating/reading/writing local files.
            ◦ API Client (if applicable): [e.g., requests for Python, axios for Node.js] for interacting with external APIs.
            ◦ Cloud Infrastructure (if applicable): [e.g., AWS, Azure, Google Cloud Platform] for any backend services the CLI tool consumes.
            ◦ CI/CD Pipeline (High-Level): [Brief mention of intended CI/CD tools and strategy for building and distributing CLI executables/packages.]
        • 3.2. External Libraries & Dependencies (Latest Stable Versions - as of June 16, 2025):
            ◦ [This section is mandatory. List all significant external libraries/packages/SDKs required for the CLI tool's implementation, along with their latest stable versions. Group them by category (e.g., CLI framework, data serialization, HTTP client, authentication). The AI will simulate a check for latest versions.]
            ◦ Example (will be genuinely populated by AI for Python CLI):
                ▪ CLI Framework:
                    • click: ~8.1.7 (for command-line interfaces)
                    • typer: ~0.12.3 (for building great CLIs)
                ▪ HTTP Client (if interacting with APIs):
                    • requests: ~2.32.3
                ▪ Data Serialization:
                    • PyYAML: ~6.0.1
                ▪ Local Storage/DB (if applicable):
                    • SQLAlchemy: ~2.0.30 (for SQLite ORM)
                ▪ Security/Credentials:
                    • keyring: ~25.2.1 (for OS native credential storage)
                    • cryptography: ~42.0.8 (for encryption)
                ▪ Utilities:
                    • rich: ~13.7.1 (for rich terminal output)
                    • python-dotenv: ~1.0.1 (for environment variables)
        • 3.3. Core Command Interface Design (Concise Commands):
            ◦ [List the main commands/subcommands with their arguments, flags, and a brief description. Focus on the public interface of the CLI tool. No detailed input/output examples.]
            ◦ Example:
                ▪ init <project-name> [--template <name>] [--force]: Initializes a new project.
                ▪ login: Authenticates the CLI session.
                ▪ config set <key> <value>: Sets a configuration value.
                ▪ deploy [--env <env>] [--region <region>]: Deploys the current project.
                ▪ logs [--follow] [--since <duration>]: Displays project logs.
        • 3.4. Data Model & Schema (Local/Remote Data):
            ◦ [Define conceptual data models for any data the CLI tool stores locally (e.g., configuration schemas for YAML/JSON files, SQLite database schemas) or consumes from external APIs. Emphasize data structure, types, and any local indexing strategies.]
            ◦ Example (Conceptual for local config and remote item data):
                ▪ Local Configuration Schema (YAML):
                    • api_key (String, encrypted) - API authentication key.
                    • default_project_id (UUID) - Default project to operate on.
                    • notifications_enabled (Boolean, default: true)
                ▪ Remote Item Data Model (as received from API):
                    • item_id (UUID)
                    • name (String)
                    • status (Enum: 'pending', 'completed')
                    • due_date (Date/Time)
                    • assigned_to (String, user ID)
        • 3.5. Reusable Modules, Libraries & Design Patterns:
            ◦ [This is a critical section for DRY and best practices. Explicitly outline every potential reusable function, module, or design pattern that should be implemented within the CLI tool's internal architecture.]
            ◦ CLI (Common Patterns):
                ▪ CommandParser: Handles parsing of arguments and flags.
                ▪ ConfigManager: Reads, writes, and encrypts/decrypts local configuration.
                ▪ AuthClient: Manages CLI authentication state and token refresh.
                ▪ OutputFormatter: Formats command output (e.g., JSON, table, plain text).
                ▪ ErrorReporter: Standardized way to handle and display errors to the user.
                ▪ APIService: Encapsulates all interactions with external APIs.
                ▪ Logger: Consistent logging utility for internal operations and user-facing messages.
                ▪ FileSystemUtils: Common utilities for file and directory operations.
        • 3.6. CLI Data Flow & Internal State Management (Detailed):
            ◦ [Specific strategy for managing data flow within the CLI tool's execution. Detail how arguments are processed, passed to internal modules, and how results (from local logic or API calls) are managed before output.]
        • 3.7. Error Handling, Logging & Monitoring Strategy (CLI Focus):
            ◦ Standardized Error Messages: Clear, concise, actionable error messages for users.
            ◦ Exit Codes: Consistent use of non-zero exit codes for failures.
            ◦ Internal Logging: Aggregate internal logs for debugging (e.g., to file, syslog). Specify log levels and data to capture.
            ◦ Monitoring (if applicable): For SaaS CLI tools, backend monitoring of API usage patterns.
        • 3.8. Caching & Performance Optimizations (CLI Focus):
            ◦ [Identify critical paths for CLI performance. Detail caching strategies (e.g., local caching of frequently accessed remote data, command output caching).]
            ◦ [Other CLI optimizations: fast startup time, efficient memory usage, lazy loading of modules, optimized file I/O.]
        • 3.9. Security Implementation Details (In-Depth CLI Focus):
            ◦ Credential Storage: Secure, platform-native credential storage (e.g., OS keyring) or strong encryption for local config files.
            ◦ Input Sanitization: Strict validation of all user-provided arguments and inputs to prevent command injection or other attacks.
            ◦ API Key Management: Secure handling of API keys for backend interactions.
            ◦ Least Privilege: Ensure the CLI tool only requests and uses necessary file system or network permissions.
            ◦ Software Supply Chain Security: Consideration for secure distribution and update mechanisms.
    4. Non-Functional Requirements (Actionable & Testable)
        • 4.1. Performance Metrics:
            ◦ Execution Time: Specific targets for critical commands (e.g., tool init under 1 second, tool deploy under 5 seconds initial response).
            ◦ Memory Footprint: Target maximum memory usage during execution.
            ◦ Startup Latency: Time from command invocation to first output.
        • 4.2. Scalability Targets:
            ◦ Data Handling: Able to process [X] number of files or [Y] MB/GB of data locally.
            ◦ API Interaction: Ability to handle typical API rate limits and data volumes.
        • 4.3. Reliability & High Availability:
            ◦ Robustness: Tool should not crash on invalid input; provide clear error messages.
            ◦ Graceful Degradation: How it behaves without network access (if applicable).
            ◦ Self-Healing/Recovery: For long-running CLI processes, how they recover from intermittent failures.
        • 4.4. Maintainability & Testability:
            ◦ Code Coverage: Minimum [X]% unit test coverage, [Y]% integration test coverage for commands and core logic.
            ◦ Code Quality: Adherence to established linting rules, static analysis, and code review processes.
            ◦ Documentation: Comprehensive inline documentation (e.g., Python docstrings), clear README, man pages (if applicable), and command-line help (--help).
        • 4.5. Deployment & Operations:
            ◦ Distribution Methods: How the CLI tool will be packaged and distributed (e.g., PyPI, Homebrew, direct executable, npm).
            ◦ Installation Process: Simple, clear installation steps for target operating systems.
            ◦ Update Mechanism: How users will update the tool (e.g., pip install --upgrade, brew upgrade).
        • 4.6. Compatibility:
            ◦ Operating Systems: Windows (specific versions), Linux distributions (e.g., Ubuntu, CentOS), macOS (specific versions).
            ◦ Shell Compatibility: Bash, Zsh, PowerShell, CMD.
            ◦ Runtime Compatibility: Specific Python versions, Go versions, etc.
    5. Implementation Roadmap & Milestones (Technical Perspective)
        • [Suggest a high-level phasing of CLI tool technical development.]
        • [Identify critical CLI technical dependencies.]
    6. Technical Risks, Open Questions & Assumptions
        • [List any identified technical risks specific to CLI tools (e.g., cross-platform build complexities, complex argument parsing edge cases, performance bottlenecks with large local data). Suggest mitigation strategies.]
        • [Clearly state any remaining open technical questions or assumptions made during the CLI design process that require further clarification or validation. Includes stating when default stacks were assumed.]

Instructions for the AI (Internal Software Designer Mindset):
    1. Deep Analysis & Inference: Go beyond surface-level answers from the 'Blueprint Questions & Answers'. Infer the underlying technical requirements and design implications from the user's responses, specifically for Command-Line Interface (CLI) tool development.
    2. Architectural Vision & Defaults: Form a high-level architectural vision for the CLI tool. If the user explicitly states tech preferences, use them. Otherwise, intelligently apply the default CLI stacks (Python with Click/Typer, SQLite for local data) and clearly state in "Open Questions & Assumptions" that defaults were used. Justify architectural choices based on performance, cross-platform compatibility, security, and maintainability for CLI tools.
    3. DRY & Modularity First: Actively identify and propose reusable functions, command modules, utility services, and common CLI design patterns before detailing specific command implementations. Structure the PRD to highlight these reusable building blocks.
    4. Genuine Technical Design: For every feature and CLI component, think about how it would genuinely be built with the chosen/default CLI stack. Consider argument parsing implications, local data storage, configuration management, error handling, security flows, and interaction with the operating system.
    5. Best Practices Integration: Weave in established software design principles (SOLID, loose coupling, separation of concerns, defensive programming, robust error handling, Unix philosophy) into the proposed solutions and explanations.
    6. Real-World Examples: Use concrete, realistic examples for commands, arguments, data schema (local config), and technical flows, consistent with the chosen/default CLI stack.
    7. Actionable for Task Creation: The level of detail should enable a development team to break down the CLI PRD into specific, measurable, achievable, relevant, and time-bound (SMART) tasks for individual developers.
    8. Proactive Problem Solving: Anticipate potential CLI technical challenges (e.g., cross-platform build/packaging complexities, argument parsing edge cases, performance bottlenecks with large local data processing, secure credential management) and suggest high-level mitigation strategies.
    9. Clarity and Precision: Use precise technical language. Employ conceptual diagrams, tables, and bullet points for maximum clarity. Avoid ambiguity.
    10. Balance Detail with Conciseness: Provide sufficient detail without overwhelming the reader. Focus on information useful to CLI developers.
    11. Iterative Thinking: While a "final" PRD, it should implicitly allow for further refinement during the development process (e.g., via "Open Questions & Assumptions").
    12. Latest Libraries Lookup: When populating "3.2. External Libraries & Dependencies," simulate a real-time check for the latest stable versions of relevant CLI libraries for the chosen/default stack. Acknowledge the current date (June 16, 2025) for version context.
    13. Concise Commands: Ensure "3.3. Core Command Interface Design" only lists the command/subcommand, arguments/flags, and a brief description, without detailed input examples or expected full output.

`   

}



export const generate_extension_structure = (content="",additional_note="")=>{

return `
AI Prompt: Architect-Driven, DRY & Best-Principles Technical PRD Generator with Default Stacks & Latest External Libraries (Concise Behaviors)

Goal: To generate an architect-driven, comprehensive, and highly actionable Technical Product Requirements Document (PRD) focused exclusively on Browser Extension development (e.g., for Chrome, Firefox, Edge). This PRD will internalize the principles of a seasoned software designer, envisioning every required UI component, background service, content script, and implementation detail. It will strictly adhere to the DRY (Don't Repeat Yourself) principle and other best software design principles (e.g., separation of concerns, modularity, performance within browser context, privacy by design, security), ensuring genuinely real, creative, and optimized implementations, along with the strategic arrangement of all extension components. The output will serve as a definitive blueprint for developers to create granular tasks.

Crucially, if specific technology stacks are not mentioned in the 'Blueprint Questions & Answers', the AI will default to the following, where applicable, intelligently choosing based on the extension's complexity and requirements:
    • Primary Extension Language/Framework: JavaScript/TypeScript with React (for rich UI in popup/options pages)
    • Alternative UI Frameworks (if inferred appropriate): Vue.js, Svelte, or vanilla JavaScript for simpler UIs.
    • Local Data Persistence: Browser's chrome.storage.local / browser.storage.local (for simple key-value) or IndexedDB (for structured, larger data).
    • Manifest Version: Manifest V3 (default for modern extensions).

Furthermore, the PRD must explicitly list all external libraries (dependencies) that would be used in the implementation, along with their latest stable versions (as of the current date, June 16, 2025). The AI should simulate a quick check for common, robust libraries relevant to the chosen/default stack and features.

Input:
    1. App Idea (A Brief Description): A concise, one-paragraph summary of the browser extension's core purpose and value proposition: """${content}""".
    2. Blueprint Questions & Answers: A series of detailed and comprehensive answers to blueprint questions. Emphasize that the quality of these answers directly influences the depth and accuracy of the generated PRD. The AI will extrapolate and infer based on these answers, applying design best practices. (Note: you can customize these answers based on your needs): """${additional_note}""".

Output: A comprehensive Technical PRD document structured as follows, embodying the best principles of software design and including detailed library information:

Technical Product Requirements Document (PRD)
    1. Strategic Overview & Architectural Vision
        • 1.1. Executive Summary: A high-level technical overview of the proposed browser extension, its core problem solved, and the architectural philosophy underpinning its design (e.g., "lightweight content modifier," "powerful utility tool," "data synchronizer").
        • 1.2. Core Principles & Non-Negotiables:
            ◦ DRY (Don't Repeat Yourself): Explicit commitment to abstracting common logic (e.g., cross-component communication, storage interactions, DOM manipulation utilities).
            ◦ Modularity & Loose Coupling: Design for independent background scripts, content scripts, and UI components.
            ◦ Performance within Browser Context: Strategies for minimal memory/CPU footprint, fast startup, and non-blocking operations to ensure a smooth browser experience.
            ◦ Privacy by Design: Minimal required permissions, secure handling of sensitive user data, and transparent data practices.
            ◦ Security by Design: Prevention of XSS, secure communication channels, Content Security Policy (CSP) enforcement.
            ◦ User-Friendliness (Extension UX): Intuitive interaction via browser action, context menus, or page injection; clear feedback.
            ◦ Maintainability & Extensibility: Code readability, testability, and ease of adding new features or adapting to browser API changes.
            ◦ Cross-Browser Compatibility: Solutions for Chrome, Firefox, Edge (and others if specified).
            ◦ [Add other relevant principles based on the extension idea, e.g., Offline-first (if applicable), Event-Driven]
        • 1.3. Technical Vision & Goals: Beyond business goals, what are the technical aspirations for the browser extension? (e.g., minimal permissions, fast page load impact, seamless background operation, high reliability).
        • 1.4. Target Users & Critical Extension Use Cases (Technical Lens): Identify key extension user segments (e.g., general users, specific professionals) and their most critical technical interactions (e.g., click browser action to activate, content script modifies page on load, right-click context menu).
    2. Functional Requirements & Optimized Extension Flows
        • 2.1. Feature Decomposition & Detailed Technical Scope:
            ◦ [For each major extension feature/capability, provide a detailed description of its functionality, technical sub-components (e.g., specific message handlers, DOM manipulation logic, UI state management), and how it will operate, emphasizing reusability and clean data processing.]
            ◦ Example:
                ▪ 2.1.1. Secure User Configuration & State Management:
                    • 2.1.1.1. User Settings Interface (DRY Component: OptionsPage / PopupUI):
                        ◦ Allows users to configure extension settings (e.g., preferences, API keys, content filtering rules).
                        ◦ Securely stores sensitive data (e.g., API tokens encrypted in chrome.storage.local).
                        ◦ Reusable Module: StorageService for abstracting browser storage APIs.
                    • 2.1.1.2. Cross-Component Communication (MessagePassingService):
                        ◦ Defines structured message passing between background script, content scripts, popup, and options pages.
                        ◦ Handles serialization/deserialization of data for communication.
                ▪ 2.1.2. [Extension Feature Name]: [Detailed technical functionality, focusing on browser API interactions, content script injections, background processing, and any external API calls.]
        • 2.2. Critical Extension User Journeys (Technical Flow):
            ◦ [Illustrate key extension user journeys with a focus on the sequence of browser actions, message passing, API calls, and UI changes. This helps developers visualize the flow of operations within the browser context.]
            ◦ Example: User Activates Feature on Current Page:
                ▪ User: Clicks the browser action icon (or uses a keyboard shortcut).
                ▪ Popup UI (if applicable): Displays quick actions or status.
                ▪ Popup/Background Script: Sends a message to the active tab's content script (MessagePassingService).
                ▪ Content Script: Receives message, identifies target DOM elements.
                ▪ Content Script: Modifies page content/behavior (e.g., highlights text, injects UI elements).
                ▪ Content Script: Sends a response message back to the popup/background script with results.
                ▪ Background Script: (Optional) If needed, makes an API call to a backend service based on the content script's data.
                ▪ Background Script: (Optional) Stores updated state in chrome.storage.local.
        • 2.3. Comprehensive UI & Interaction Inventory:
            ◦ [List every single UI element, interaction point, and script type required. For each, describe its primary purpose, expected input, and typical behavior. Highlight any elements that share common UI components or patterns.]
            ◦ Example:
                ▪ 2.3.1. Browser Actions:
                    • Browser Action Icon: Clicking opens Popup.html. Displays badge text for unread notifications.
                    • Context Menu Item: "Analyze Page Content" - appears on right-click, sends current URL to background script.
                ▪ 2.3.2. User Interface Pages/Panels:
                    • Popup.html: (UI Components: ActionButton, StatusDisplay, SettingsLink) - Quick access panel.
                    • Options.html: (Reusable UI Components: InputField, ToggleSwitch, SaveButton) - Comprehensive settings page.
                    • Onboarding.html: (Layout: FullPageModal) - Initial setup wizard for new users.
                ▪ 2.3.3. Scripts & Injections:
                    • Background Script: (Handles: onInstalled, onMessage, webRequest APIs, API calls to backend). Always running.
                    • Content Script (main-page-script.js): (Injected into: example.com/*) - Modifies page DOM, captures user input on page.
                    • Content Script (selection-script.js): (Injected on demand) - Handles text selection, sends to background.
                    • DevTools Panel: (UI for debugging/inspecting extension-specific data on a page).
    3. Deep Technical Design & Architecture
        • 3.1. System Architecture (Component-Level Detail):
            ◦ [Provide a detailed architectural overview outlining the extension's components (background script, content scripts, popup, options page), their communication channels, local data storage, and external API integrations. Justify chosen technologies based on performance within the browser, security, and maintainability.]
            ◦ Primary Extension Language/Framework: [Default: JavaScript/TypeScript with React] [Specific framework, runtime (e.g., Vue.js, Svelte, vanilla JS).]
            ◦ Extension Architecture: Manifest V3 (Service Worker for background, Content Scripts, Popup UI, Options UI).
            ◦ Local Data Storage Strategy: [Default: chrome.storage.local for settings, IndexedDB for larger structured data.]
                ▪ chrome.storage.local / browser.storage.local: For preferences, small amounts of data.
                ▪ IndexedDB: For larger, structured, client-side data requiring querying.
                ▪ sessionStorage/localStorage: Used sparingly for transient/non-sensitive data.
            ◦ Cross-Component Communication: Message passing (chrome.runtime.sendMessage, chrome.tabs.sendMessage).
            ◦ API Client (if applicable): [e.g., Axios, native Fetch API] for interacting with external APIs from background script or content scripts.
            ◦ Backend Services (if extension interacts with one): [e.g., Node.js with Express.js] (as per blueprint, or inferred).
            ◦ Cloud Infrastructure (if applicable): [e.g., AWS, Azure, Google Cloud Platform] for any backend services the extension consumes.
            ◦ CI/CD Pipeline (High-Level): [Brief mention of intended CI/CD tools and strategy for building and publishing extension packages.]
        • 3.2. External Libraries & Dependencies (Latest Stable Versions - as of June 16, 2025):
            ◦ [This section is mandatory. List all significant external libraries/packages/SDKs required for the extension's implementation, along with their latest stable versions. Group them by category (e.g., UI framework, state management, HTTP client, utility). The AI will simulate a check for latest versions.]
            ◦ Example (will be genuinely populated by AI for React/TypeScript Extension):
                ▪ UI Framework:
                    • react: ~18.3.1
                    • react-dom: ~18.3.1
                ▪ Build Tools:
                    • parcel: ~2.12.0 (or webpack, rollup)
                    • typescript: ~5.4.5
                ▪ State Management:
                    • zustand: ~4.5.2 (or reduxjs/toolkit: ~2.2.5)
                ▪ HTTP Client (if interacting with APIs):
                    • axios: ~1.7.2 (or node-fetch for service worker if not using native fetch)
                ▪ Messaging/Communication:
                    • webextension-polyfill: ~0.10.0 (for cross-browser API compatibility)
                ▪ Utilities:
                    • lodash: ~4.17.21
                    • uuid: ~9.0.1
        • 3.3. Core Extension API / Interaction Design (Concise Behaviors):
            ◦ [List the main extension interaction points, their triggers, and a brief description of their behavior. Focus on the public-facing interaction of the extension.]
            ◦ Example:
                ▪ Browser Action Click: Toggles popup UI visibility, sends message to content script to activate features.
                ▪ Context Menu Item "Capture Element": Triggered by right-click, sends selected DOM element info to background script for processing.
                ▪ Content Script Injection (on document_end): Modifies target web page DOM elements based on user settings.
                ▪ Message Listener (from Content Script): Background script listens for messages from content scripts (e.g., "page content collected").
                ▪ Options Page Save: Persists user settings to chrome.storage.local.
        • 3.4. Data Model & Schema (Local Extension & Remote Data):
            ◦ [Define conceptual data models for any data the extension stores locally (e.g., settings schemas for chrome.storage, IndexedDB schemas) or consumes from external APIs. Emphasize data structure, types, and any local indexing strategies.]
            ◦ Example (Conceptual for local settings and remote user profile):
                ▪ chrome.storage.local Schema:
                    • isEnabled (Boolean, default: true)
                    • apiKey (String, encrypted) - For backend API authentication.
                    • blockedSites (Array) - List of URLs to disable extension on.
                    • defaultMode (Enum: 'light', 'dark')
                ▪ IndexedDB Schema (captured_elements store):
                    • id (UUID, PK)
                    • url (String, Indexed) - Page URL where element was captured.
                    • selector (String) - CSS selector of captured element.
                    • content (Text) - Inner text/HTML of element.
                    • timestamp (Number) - Unix timestamp of capture.
                ▪ Remote UserProfile Data Model (as received from backend API):
                    • user_id (UUID)
                    • username (String)
                    • email (String)
                    • preferences (Object) - User-specific backend preferences.
        • 3.5. Reusable Modules, Libraries & Design Patterns:
            ◦ [This is a critical section for DRY and best practices. Explicitly outline every potential reusable function, module, or design pattern that should be implemented within the extension's internal architecture.]
            ◦ Extension (Common Patterns):
                ▪ MessagePassingService: Centralized module for sending/receiving messages between extension contexts.
                ▪ StorageService: Abstraction layer over browser storage APIs (chrome.storage.local, IndexedDB).
                ▪ ContentScriptUtils: Common functions for DOM manipulation, injection, data extraction within content scripts.
                ▪ AuthClient: Manages authentication with external backend APIs.
                ▪ APIService: Encapsulates all interactions with external backend APIs.
                ▪ ErrorReporter: Standardized way to handle and display errors to the user or log them.
                ▪ Logger: Consistent logging utility for internal operations and debugging via browser console.
                ▪ PermissionManager: Utility for requesting/checking browser permissions.
                ▪ UIComponents (shared for popup/options): Generic buttons, inputs, toggles.
        • 3.6. Extension Data Flow & Internal State Management (Detailed):
            ◦ [Specific strategy for managing data flow within the extension's various parts. Detail how data is passed between background script, content scripts, and UI, and how internal state is managed (e.g., using Zustand/Redux for UI state, chrome.storage.local for persistent background state).]
        • 3.7. Error Handling, Logging & Monitoring Strategy (Extension Focus):
            ◦ Standardized Error Messages: Clear, concise error messages displayed in popup/options or relevant browser console.
            ◦ Background Script Error Catching: Robust try/catch for all asynchronous operations in the background.
            ◦ Logging: Use console.log/console.error for development, integrate with remote logging service (if allowed by CSP) for production monitoring.
            ◦ Monitoring: Basic monitoring via browser extension dev tools; external services for crash reporting (e.g., Sentry) if feasible within CSP.
        • 3.8. Caching & Performance Optimizations (Extension Focus):
            ◦ [Identify critical paths for extension performance. Detail caching strategies (e.g., local caching of frequently accessed remote data in IndexedDB/storage.local, efficient DOM updates, debouncing/throttling event listeners).]
            ◦ [Other optimizations: lazy loading content scripts, minimizing bundled size, efficient use of browser APIs, avoiding long-running synchronous operations.]
        • 3.9. Security Implementation Details (In-Depth Extension Focus):
            ◦ Content Security Policy (CSP): Strict enforcement of CSP to mitigate XSS and data injection.
            ◦ Permissions: Requesting only the absolute minimum necessary browser permissions (manifest.json).
            ◦ Input Sanitization: Strict validation and sanitization of any data injected into web pages via content scripts.
            ◦ Secure Storage: Encrypting sensitive data stored in chrome.storage.local or IndexedDB.
            ◦ Cross-Origin Requests: Whitelisting allowed domains for external API calls.
            ◦ Message Passing Security: Validating sender and message structure for all inter-component communication.
            ◦ API Key Management: Secure handling of API keys for backend interactions (e.g., not directly exposing in client-side code).
    4. Non-Functional Requirements (Actionable & Testable)
        • 4.1. Performance Metrics:
            ◦ Startup Time: Time from browser launch to extension ready.
            ◦ Memory Footprint: Target maximum memory usage for background script and content scripts.
            ◦ Page Load Impact: Minimal impact on host page load times.
            ◦ UI Responsiveness: Smoothness of popup/options UI interactions.
        • 4.2. Scalability Targets:
            ◦ Data Handling: Able to process [X] number of elements on a page or [Y] MB/GB of local data.
            ◦ API Interaction: Ability to handle typical API rate limits and data volumes.
        • 4.3. Reliability & High Availability:
            ◦ Robustness: Extension should not crash the browser tab; provide clear error feedback.
            ◦ Graceful Degradation: How it behaves without network access (if applicable) or on incompatible websites.
            ◦ Update Mechanism: Seamless, automatic updates without user intervention.
        • 4.4. Maintainability & Testability:
            ◦ Code Coverage: Minimum [X]% unit test coverage, [Y]% integration test coverage for background scripts, content scripts, and UI logic.
            ◦ Code Quality: Adherence to established linting rules, static analysis, and code review processes.
            ◦ Documentation: Comprehensive inline documentation (e.g., JSDoc for JS/TS), clear README, and API documentation for internal modules.
        • 4.5. Deployment & Operations:
            ◦ Distribution Methods: How the extension will be packaged and distributed (e.g., Chrome Web Store, Firefox Add-ons).
            ◦ Publishing Process: Defined steps for submitting to extension stores.
            ◦ Update Mechanism: How users will receive updates.
        • 4.6. Compatibility:
            ◦ Browsers: Chrome (min version), Firefox (min version), Edge (min version).
            ◦ Operating Systems: Windows, Linux, macOS.
            ◦ Web Technologies: Compatibility with various website structures and JS frameworks.
    5. Implementation Roadmap & Milestones (Technical Perspective)
        • [Suggest a high-level phasing of browser extension technical development.]
        • [Identify critical extension technical dependencies.]
    6. Technical Risks, Open Questions & Assumptions
        • [List any identified technical risks specific to browser extensions (e.g., browser API changes, content script conflicts with page JS, review process delays, memory leaks). Suggest mitigation strategies.]
        • [Clearly state any remaining open technical questions or assumptions made during the extension design process that require further clarification or validation. Includes stating when default stacks were assumed.]

Instructions for the AI (Internal Software Designer Mindset):
    1. Deep Analysis & Inference: Go beyond surface-level answers from the 'Blueprint Questions & Answers'. Infer the underlying technical requirements and design implications from the user's responses, specifically for browser extension development.
    2. Architectural Vision & Defaults: Form a high-level architectural vision for the browser extension. If the user explicitly states tech preferences, use them. Otherwise, intelligently apply the default extension stacks (JavaScript/TypeScript with React for UI, chrome.storage.local/IndexedDB for local data, Manifest V3) and clearly state in "Open Questions & Assumptions" that defaults were used. Justify architectural choices based on browser performance, security, and maintainability.
    3. DRY & Modularity First: Actively identify and propose reusable functions, modules, communication patterns, and UI components before detailing specific feature implementations. Structure the PRD to highlight these reusable building blocks across background scripts, content scripts, and UI.
    4. Genuine Technical Design: For every feature and extension component, think about how it would genuinely be built within the browser extension environment. Consider Manifest V3 implications, inter-component message passing, browser API usage, local data storage, and external API interactions.
    5. Best Practices Integration: Weave in established software design principles (separation of concerns for extension parts, efficient DOM manipulation, secure coding for extensions, reactive UI patterns) into the proposed solutions and explanations.
    6. Real-World Examples: Use concrete, realistic examples for UI interactions, messaging, data schema (local storage), and technical flows, consistent with the chosen/default extension stack.
    7. Actionable for Task Creation: The level of detail should enable a development team to break down the extension PRD into specific, measurable, achievable, relevant, and time-bound (SMART) tasks for individual developers.
    8. Proactive Problem Solving: Anticipate potential browser extension technical challenges (e.g., browser API compatibility, content script isolation, store review policy adherence, memory management) and suggest high-level mitigation strategies.
    9. Clarity and Precision: Use precise technical language. Employ conceptual diagrams, tables, and bullet points for maximum clarity. Avoid ambiguity.
    10. Balance Detail with Conciseness: Provide sufficient detail without overwhelming the reader. Focus on information useful to extension developers.
    11. Iterative Thinking: While a "final" PRD, it should implicitly allow for further refinement during the development process (e.g., via "Open Questions & Assumptions").
    12. Latest Libraries Lookup: When populating "3.2. External Libraries & Dependencies," simulate a real-time check for the latest stable versions of relevant browser extension libraries for the chosen/default stack. Acknowledge the current date (June 16, 2025) for version context.
    13. Concise Behaviors: Ensure "3.3. Core Extension API / Interaction Design" only lists the interaction point, its trigger, and a brief description of its behavior, without detailed input examples or expected full output.

`   

}