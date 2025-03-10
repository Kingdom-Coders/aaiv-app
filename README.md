# Kingdom Coders Setup Guide

## Prerequisites

Before getting started, ensure you have the following installed:

1. **Visual Studio Code (VSCode)**\
   [Download VSCode](https://code.visualstudio.com/download)

2. **Node.js**\
   [Download Node.js](https://nodejs.org/en/download)

3. **Git**\
   [Download Git](https://git-scm.com/downloads)

## Verifying Installations

Once installed, verify everything is set up correctly by running the following commands in your terminal:

### Check Node.js and npm

```sh
npm -v
```

Example output:

```
10.7.0  # Version might be different, but it should display a number
```

### Check Git

```sh
git --version
```

Example output:

```
git version 2.47.1  # Version might be different, but it should display a version number
```

## Additional Resources

If you're struggling with any of the setup steps, refer to the following slides:

- **React Intro & Setup Slides:**\
  [React Setup Slides](https://docs.google.com/presentation/d/14A0FkH5CrtjcBCCp8BGZqY5ch1rVBJS-hoqaItjFVBo/edit?usp=sharing)

- **Git Slides:**\
  [Git Slides](https://docs.google.com/presentation/d/1L6ftgvx46WOB49Wt3B1_ZEAeGV6V6DRihqhSFJzaExI/edit?usp=sharing)

If you still need help, reach out to **David** or **Collin** for assistance.

---

## Step 0: Join Kingdom Coders Slack

Join the Kingdom Coders Slack workspace:\
[Join Slack](https://join.slack.com/t/kingdomcodershq/shared_invite/zt-31f72oz9f-7fWmIPcTsUMGVb2y6K6V2A)

You found the repository! Follow the steps below to get set up.

## Step 1: Clone the Repository

1. Click on the `<> Code` button in GitHub.
2. Select `HTTPS`.
3. Copy the repository link.
4. Open VS Code and use the `Clone Git Repository` option to paste the link and clone the project.

![Screenshot 2025-03-09 at 6 14 20 PM](https://github.com/user-attachments/assets/472216b2-1996-40ca-9ba7-a606a19a18f5)

## Step 2: Set Up Environment Variables

1. Go to the **Kingdom Coders Slack**.
2. Navigate to the `#env` channel.
3. Copy the contents provided in the channel.
4. In the root of your project (where `README.md` is), create a new file named `.env`.
5. Paste the copied contents into the `.env` file and save it.

## Step 3: Install Dependencies and Start the Project

Open your terminal and run the following commands:

```sh
npm i  # Install backend packages
cd frontend  # Go into the frontend folder
npm i  # Install frontend packages
cd ..  # Go back to the root folder
npm run dev  # Start the server and website
```

Once you run these commands, the website should open in your browser! Try registering and loggin in and browsing through the website! (There might be bugs lol)

![Screenshot 2025-03-09 at 6 15 04 PM](https://github.com/user-attachments/assets/96c8dd82-4a3a-455a-bc73-76ffe99fad98)

---

That's it! We will teach you the file/folder structure and how to start building on Monday! Contact **David** or **Collin** if you have any questions while following these steps.

