# Auto Add to Microsoft To Do (Fully Automated)

A lightweight Tampermonkey userscript that seamlessly adds the current webpage's title and URL to a specific Microsoft To Do list with a single click. 

Unlike other scripts that require manual token updates every hour, this version uses a secure **OAuth 2.0 Authorization Code Flow with Refresh Tokens** to keep you logged in completely in the background forever.

---

## Features

* **One-Click Saving:** Instantly prompts you on page load to add the site.
* **Zero Maintenance:** Automatically handles background access token refreshing. No more copying keys every hour.
* **Clean Notifications:** Displays a sleek Microsoft-green success banner upon task creation.
* **Optimized Payload:** Saves the website name as the Task Title and embeds the exact URL directly into the task description notes.

---

## Step 1: Microsoft Azure Configuration (Crucial)

To talk to the Microsoft Graph API, you must register a free application in your personal Microsoft account.

1. Go to the **[Azure Portal / Microsoft Entra ID](https://portal.azure.com/)** and sign in with your personal Microsoft account.
2. Search for and navigate to **App registrations** -> Click **+ New registration**.
3. Set the configuration details:
   * **Name:** `Auto To-Do Inserter` (or any name you like)
   * **Supported account types:** Select **"Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"**.
4. Click **Register**.

### Setting up the Redirect URI
1. Inside your newly created App page, click on **Authentication** from the left-hand sidebar.
2. Click **+ Add a platform** and select **Mobile and desktop applications** (do *not* choose Web).
3. Check the box or manually add the exact following URL:
   ```text
   [https://login.microsoftonline.com/common/oauth2/nativeclient](https://login.microsoftonline.com/common/oauth2/nativeclient)
