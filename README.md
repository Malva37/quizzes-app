# Quizzes-app

 - [DEMO LINK](https://malva37.github.io/quizzes-app/)

This is a simple web application for taking quizzes based on different categories. All the quiz data is retrieved from the API provided by https://opentdb.com/api_config.php. The project consists of three pages: Home (list of quizzes), Play (individual quiz), and Finish (quiz results).

Home Page: On this page, you can find a list of categories. If you have already played a quiz from a particular category, you cannot play it again. Additionally, if you have completed at least one quiz, you can see a statistics block that displays the number of quizzes played, the number of questions answered(with correct answer), and the average time taken to answer the quizzes. There is also a "I'm lucky" button that allows you to select a random quiz.

Play Page: This page is protected by a guard. If you haven't chosen any category on the Home page, you cannot access the Play page. When playing a quiz, the header is hidden. In some cases, if the API doesn't have enough questions to fulfill your request (e.g., asking for 50 questions in a category that only has 20), you will see a message indicating the lack of questions and will be prompted to choose another quiz. During the quiz, you have the option to cancel it by pressing a button, which will redirect you back to the Home page. You cannot proceed to the next question until you have chosen an answer.

Finish Page: After answering the last question, you will be navigated to the Finish page. Here, you can view statistics such as the number of points earned, the number of correct answers, and the time taken to complete the quiz.

## Steps to run the project:

1. Clone the repository to your local machine.
2. Install dependencies by running `npm install`.
3. Start the application by running `ng serve`.
4. Open your web browser and navigate to http://localhost:4200/ to access the application.

Technologies:
 - Angular
 - Angular Material UI Library
 - RxJS
 - TypeScript

