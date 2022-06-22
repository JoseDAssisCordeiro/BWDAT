# BWDAT

## Binge-watching Data Analysis Tool

### Chrome Extension v 1.8.1

In the file manifest.json replace <server_url> with the location of the server running BWDAT Server App.

```
line 30		"<server_url>/*"
```

In the file options.json replace <server_url> with the location of the server running BWDAT Server App.

```
line 15		var server_url = <server_url>
```

In the file BWDATStudyForms.html replace <admin_email> with the email of the person responsible for the communication with participants.

```
line 8		Do you wish to report a problem or issue? <a href="mailto:<admin email>?Subject=Netflix study" target="_top">Click here</a> to email the admin.
```

In the file BWDATStudyForms.js replace <server_url> with the location of the server running BWDAT Server App.

```
line 48 	var server_url2 = <server_url>;
```
