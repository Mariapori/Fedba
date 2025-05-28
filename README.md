# Slack Feedback Bot

A Node.js Slack bot designed to encourage positive and constructive feedback within your team by prompting teammates weekly and delivering feedback privately.

---

## Features

- **Automated weekly reminders** prompting users to share feedback  
- **Interactive modal** for selecting a teammate, feedback type, and writing a message  
- **Private feedback delivery** to the recipient and confirmation to the sender  
- Built with [Slack Bolt for JavaScript](https://slack.dev/bolt-js/)  
- Uses [`node-cron`](https://www.npmjs.com/package/node-cron) for scheduling  

---

## Getting Started

### Prerequisites

- Node.js v16 or higher  
- A Slack workspace with permission to install custom apps  
- Slack App credentials: Bot Token and Signing Secret  

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/slack-feedback-bot.git
cd slack-feedback-bot

# Install dependencies
npm install

# Create a .env file and add your Slack credentials
echo "SLACK_BOT_TOKEN=xoxb-your-bot-token" >> .env
echo "SLACK_SIGNING_SECRET=your-signing-secret" >> .env
echo "PORT=3000" >> .env

# (Optional) Expose your local server with ngrok for development
ngrok http 3000

# Start the bot
node index.js
```
## Slack App Configuration

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps) and create a new app in your workspace.

2. Add these **Bot Token Scopes** under **OAuth & Permissions**:
   - `chat:write`
   - `users:read`
   - `im:write`

3. Enable **Interactivity & Shortcuts** and set the Request URL to your server's `/slack/events` endpoint  
   (e.g., `https://your-domain.com/slack/events`).

4. Install the app to your workspace and copy the Bot Token and Signing Secret into your `.env`.

---

## How It Works

- The bot sends scheduled messages inviting users to share feedback.

- Users click **Give Feedback**, which opens a modal to select a teammate, choose feedback type (positive or constructive), and enter a message.

- Submitted feedback is sent privately to the recipient and a confirmation message is sent back to the sender.
