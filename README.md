# SynopsAIpedia

This project is a Node.js application that uses the `wtf_wikipedia` library to
scrape information from Wikipedia articles and the `OpenAI API (GPT-3.5)` to
summarize the content.

## Usage

To run the application, simply execute the following command:

```
node main.js
```

## How It Works

The application scrapes information from a specified Wikipedia article using the
wtf_wikipedia library. It then uses the OpenAI API to summarize the content and
produce a brief summary of the article.

The application filters out any unnecessary content from the article, and
processes only the main content. This results in a summary that provides an
overview of the most important information contained in the article.

## Prerequisites

Before running the application, you will need to have the following:

- A valid OpenAI API key (you can obtain one
  [here](https://beta.openai.com/signup/))
- Node.js and npm installed on your machine

## Running the Application

To run the application, first clone the repository by navigating to the
directory where you want to store the project and running the following command:

```
git clone https://github.com/dfols/wikiAI.git
```

Next, navigate to the project directory and install the necessary dependencies
by running the following command:

```
npm install
```

You will also need to set your OpenAI API key in a `.env` file in the project
directory. Simply create a file named `.env` and add the following line,
replacing `<your-api-key>` with your actual API key:

```
OPENAI_API_KEY=<your-api-key>
```

Finally, to run the application, execute the following command:

```
node main.js
```

The application will scrape information from a specified Wikipedia article using
the `wtf_wikipedia` library, summarize the content using the OpenAI API, and
produce a brief summary of the article.

## Dependencies

- `chatgpt`
- `dotenv`
- `wtf_wikipedia`

## License

This project is licensed under the MIT License. See the `LICENSE` file for
details.
