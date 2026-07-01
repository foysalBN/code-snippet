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

## Step 1: Get a Free Tenant/Directory (Takes 2 minutes)

If you are using a standard personal Microsoft account (like `@outlook.com` or `@hotmail.com`), Azure App Registrations sometimes restrict tenant configurations. To completely bypass this and gain a dedicated enterprise sandbox directory for free:

1. Go to the **[Microsoft 365 Developer Program](https://developer.microsoft.com/en-us/microsoft-365/dev-program)** website.
2. Click **Join now** and sign in with your personal Microsoft account.
3. Choose your region, accept the terms, and fill out the quick questionnaire (select "Personal projects" or "Internal apps").
4. Choose an **Instant Sandbox** configuration. It sets up an isolated environment pre-configured with 25 free user licenses.
5. Set up your admin username (e.g., `admin@yourdomain.onmicrosoft.com`) and create a secure password.
6. Complete the SMS registration process. 

*You now have a full, permanent enterprise Azure Active Directory tenant to register your automation tools smoothly.*

---

## Step 2: Microsoft Azure Configuration

To talk to the Microsoft Graph API, you must register your application inside the Azure portal using the account you just set up.

1. Go to the **[Azure Portal / Microsoft Entra ID](https://portal.azure.com/)** and sign in with your new Developer account.
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



## Tips
Find List id herer: https://developer.microsoft.com/en-us/graph/graph-explorer

here is the gemini conv link: https://share.gemini.google/BTiSPGFtAg3P

you need to grant parmission:
<img width="1299" height="968" alt="image" src="https://github.com/user-attachments/assets/86492787-e42b-4edd-b4a5-4b37c88e5b87" />

