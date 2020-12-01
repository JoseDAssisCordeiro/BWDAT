# BWDAT

## Binge-watching Data Analysis Tool

BWDAT Manual: [link](https://docs.google.com/document/d/17L0b9XjVcoU74Xf_b0GAD_5lv3uVkkxwjUZlcmfH_8M/edit?usp=sharing)

### Server App

In the file style.css at "css/" replace <subtitle> with the name of your project.

```
line 28		content:<subtitle>;
```

### Smartwatch App v 1.4.2

In the file MainActivity.java at "app/src/main/java/pt/ulisboa/tecnico/rnl/bwdat/bwdat/" replace <server_url> with the location of the server running BWDAT Server App.

```
line 67		final private String url = <server_url>;
```

### Chrome Extension v 1.6.1

In the file BWDATStudyForms.html replace <admin_email> with the email of the person responsible for the communication with participants.

```
line 8		Do you wish to report a problem or issue? <a href="mailto:<admin email>?Subject=Netflix study" target="_top">Click here</a> to email the admin.
```

In the file manifest.json replace <server_url> with the location of the server running BWDAT Server App.

```
line 28		"<server_url>/*"
```

In the file background.js replace <server_url> with the location of the server running BWDAT Server App.

```
line 8 		var server_url = <server_url>;
```