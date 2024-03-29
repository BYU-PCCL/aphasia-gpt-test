# aphasia-gpt-test

Simple interactive web app for testing the efficacy of different prompts for use in the [AphasiaGPT](https://github.com/BYU-PCCL/aphasia-gpt) project.

## Getting Started

The main code for the React app is in the [src](./src/) directory.

Firebase functions are defined in the [functions](./functions/) directory.

### Environment Variables

To make successfull HTTP requests to OpenAI (GPT completions) and Hugging Face (embeddings), you will need to set the following environment variables in a `.env` file in the [functions](./functions/) directory:

- `OPENAI_API_KEY`
- `HGGINGFACE_API_TOKEN`

These will also be required to be set in order to deploy the Firebase functions.

### Run the App Locally

You will need to run the React app as well as the Firebase Local Emulator Suite for the app to work locally.

#### Run the React App

Run the following from the root directory:

```shell
npm run dev
```

The React app will be running at [http://localhost:3000](http://localhost:3000).

#### Firebase Local Emulator Suite

The Firebase Local Emulator Suite acts as a local version of cloud functions and DB.

Run the following from the root directory (builds the Firebase functions and starts the Firebase emulators):

```shell
npm run fb
```

You can view the Emulator UI at [http://localhost:4000](http://localhost:4000).

#### Debug Firebase Functions

After running the Firebase Local Emulator Suite, you can attach a debugger using the configuration in `.vscode/launch.json` (press `F5` in VSCode).

### Deploying the App

#### React App

There is a Vercel project associated with this repository. Pushing to the `main` branch will trigger a deployment.

#### Firebase Functions

To deploy the Firebase functions, run the following from the root directory (note that you will need to have the [Firebase CLI ](https://firebase.google.com/docs/cli)installed, be logged in, and have the correct permissions):

```shell
firebase deploy
```

### A Basic Prompt

```markdown
You are an expert in communication disorders, specifically Broca's aphasia. Your task is to transform an utterance from a person with Broca's aphasia into a grammatically correct sentence and predict the next several words they will say. Do NOT request any additional information or context or ask any questions. Only provide the transformed predicted utterances.
Examples:

1. "Walk dog" => "I will take the dog for a walk"
2. "Book book two table" => "There are two books on the table"
3. "i want take kids" => "I want to take the kids to the park
4. "sweaty i need" => "I am sweaty and I need a hot shower"
5. "cat seems cat" => "The cat seems hungry"
6. "i i need i need some" => "I need to get some sleep"

   Please consider the following about the speaker:

   - name: {name}
   - age: {age}
   - self-description: {about_me}
   - current setting: {setting}
   - type of conversation they are having: {conversation_type}
   - tone of voice they are trying to convey: {tone}
     Please provide a single transformed/predicted sentece for the following utterance:
     {utterance}
```
