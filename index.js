require('dotenv').config();
const { App } = require('@slack/bolt');
const cron = require('node-cron');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Simple message listener
app.message('feedback', async ({ message, say }) => {
  await say(`Hi <@${message.user}>! Want to send feedback to a teammate?`);
});

// Scheduled weekly feedback prompt (every minute here for testing, change to cron for real use)
cron.schedule('* * * * *', async () => {
  try {
    const result = await app.client.users.list({
      token: process.env.SLACK_BOT_TOKEN
    });

    const users = result.members.filter(user => !user.is_bot && user.id !== 'USLACKBOT');

    for (const user of users) {
      await app.client.chat.postMessage({
        channel: user.id,
        text: "👋 Want to share feedback with a teammate this week?",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "👋 Want to share feedback with a teammate this week?"
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Give Feedback"
                },
                action_id: "open_feedback_modal"
              }
            ]
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error sending scheduled messages:', error);
  }
});

app.action('open_feedback_modal', async ({ body, ack, client }) => {
  await ack();

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'submit_feedback',
      title: {
        type: 'plain_text',
        text: 'Send Feedback'
      },
      submit: {
        type: 'plain_text',
        text: 'Send'
      },
      close: {
        type: 'plain_text',
        text: 'Cancel'
      },
      blocks: [
        {
          type: 'input',
          block_id: 'recipient',
          element: {
            type: 'users_select',
            action_id: 'user'
          },
          label: {
            type: 'plain_text',
            text: 'Choose a teammate'
          }
        },
        {
          type: 'input',
          block_id: 'type',
          element: {
            type: 'static_select',
            action_id: 'feedback_type',
            options: [
              {
                text: { type: 'plain_text', text: '💚 Positive' },
                value: 'positive'
              },
              {
                text: { type: 'plain_text', text: '🔧 Constructive' },
                value: 'constructive'
              }
            ]
          },
          label: {
            type: 'plain_text',
            text: 'Type of feedback'
          }
        },
        {
          type: 'input',
          block_id: 'message',
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'text'
          },
          label: {
            type: 'plain_text',
            text: 'Your feedback'
          }
        }
      ]
    }
  });
});

app.view('submit_feedback', async ({ ack, body, view, client }) => {
  await ack(); // Acknowledge the modal submission

  // Debugging: uncomment to see submitted values
  // console.log(JSON.stringify(view.state.values, null, 2));

  const user = body.user.id;
  const recipient = view.state.values.recipient.user.selected_user;
  const message = view.state.values.message.text.value;
  const type = view.state.values.type.feedback_type.selected_option.value;

  // Send confirmation to sender
  await client.chat.postMessage({
    channel: user,
    text: `✅ Feedback sent to <@${recipient}>:\n> ${message}`
  });

  // Deliver feedback to recipient
  await client.chat.postMessage({
    channel: recipient,
    text: `💬 You received new *${type}* feedback from <@${user}>:\n> ${message}`
  });
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ FeedbackBot is running!');
})();
