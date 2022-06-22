# BWDAT

## Binge-watching Data Analysis Tool

### Server App 2.0.0

In the file style.css at "css/" replace <subtitle> with the name of your project.

```
line 33		content:<subtitle>;
```

In the file BWDAT.js provide the directory for the keys and certificates of the server.

```
const privateKey  = fs.readFileSync(<private Key directory>, 'utf8');
const certificate = fs.readFileSync(<cretificate directory>, 'utf8');
const chain = fs.readFileSync(<chain directory>, 'utf8');
```

In the file BWDAT.js give a secret to encrypt the passwords.

```
const secret = <secret>;
```

In the file BWDAT.js provide the database informations.

```
var pool  = mysql.createPool({
	connectionLimit: 10,
	host: <host server>,
	user: <user>,
	password: <password>,
	database: <database>
});
```

For each file in "scripts/" replace <server_url> with the location of the server.
