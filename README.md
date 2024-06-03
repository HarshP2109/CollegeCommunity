# [College Community Hub](https://collegecommunityhub.onrender.com/)

College Community Hub is a platform designed to bring students from different colleges together by advertising events across all colleges. It emails students about new events, displays them on a dashboard, and assists colleges in organizing events with features like AI-based work allocation, group and duo chatting, and security features like email OTP authentication and data encryption. Additionally, it reminds students on the day of the event and helps organizers with event planning by suggesting ideas.

## Features

- **Event Advertising**: Advertise events from all colleges to students via email and display them on a dashboard.
- **Event Organization**: Assist in organizing events with AI-based work allocation and idea suggestions.
- **Communication**: Group and duo chatting functionalities.
- **Security**: Email OTP authentication and data encryption.
- **Event Reminders**: Remind students about events on the event day.

## Tech Stack

- **Frontend**: EJS (Embedded JavaScript templates)
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Cloud Services**: Cloudinary for media storage

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/HarshP2109/CollegeCommunity.git
   cd CollegeCommunity
   ```

2. **Create and activate a virtual environment (optional but recommended):**

   ```bash
   python -m venv env
   source env/bin/activate  # On Windows use `env\Scripts\activate`
   ```

3. **Install dependencies:**

   ```bash
   npm run build
   ```

4. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
    Port = '3000'
    MongoDBURL1 = monogodb_connection_string_for_storing_all_data_of_account_and_everything
    MongoDBURL2 = mongodb_connection_string_for_just_storying_chats
    NewsApiKey = _news_api_key_ [Maybe Unused]
    CloudName = _cloudname_in_cloudinary
    CloudApiKey= _cloudinary_api_key
    CloudApiSecret = _cloudinary_api_secret
    NewsApi = _second_news_api [Mostly Unused]
    GeminiAPI = _Gemini_api_key_
   ```

5. **Start the server:**

   ```bash
   npm run start
   ```

6. **Access the application:**

   Open your browser and go to `http://localhost:3000`

## Usage

1. **Register and login:**

   Create an account using your email and log in.

2. **Dashboard:**

   View and browse events from various colleges on the dashboard.

3. **Event Management:**

   Organize events with AI-based work allocation, group and duo chatting, and idea suggestions.

4. **Security Features:**

   Use email OTP authentication for secure logins and ensure data is encrypted.

5. **Event Reminders:**

   Receive reminders on the day of the event to ensure you don't miss out.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
