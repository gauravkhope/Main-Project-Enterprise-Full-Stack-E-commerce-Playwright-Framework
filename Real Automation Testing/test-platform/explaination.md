TOPIC 1

await UIActions.fill(this.emailInput, email, 'Email Input');
await UIActions.fill(this.passwordInput, password, 'Password Input');

✅ Why they exist

They are used for:

1. 📝 Logging
2. 🐞 Debugging
3. 📊 Reporting
4. ❌ Error messages

🔥 Interview Answer

These strings act as descriptive identifiers passed to wrapper methods for logging, debugging, and reporting purposes. They improve observability by providing meaningful context in logs and error messages.

🔥 So Correct Answer Should Be:

These labels are used to provide meaningful context for logging, error handling, and reporting. They help identify exactly which UI action failed, making debugging faster and improving test observability.