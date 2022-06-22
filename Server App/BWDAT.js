var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var https = require('https');
var crypto = require('crypto');
var cookieParser = require('cookie-parser');

const privateKey  = fs.readFileSync(<private Key directory>, 'utf8');
const certificate = fs.readFileSync(<cretificate directory>, 'utf8');
const chain = fs.readFileSync(<chain directory>, 'utf8');

const secret = <secret>;

const port = 443; //default

var options = {key: privateKey,
                cert: certificate,
				ca: chain};

var pool  = mysql.createPool({
	connectionLimit: 10,
	host: <host server>,
	user: <user>,
	password: <password>,
	database: <database>
});

var app = express();
app.use(session({
	secret: secret,
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());


// Login Page
// Used in all of the pages when cookie expires

app.get('/', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] / ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] / ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					response.redirect('/home');
				}
				else
					response.sendFile(path.join(__dirname + '/pages/login.html'));
			});
		});
	}
	else
		response.sendFile(path.join(__dirname + '/pages/login.html'));
});

// Validate login
// Used in login.html

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var token = '';
	if(username && password){
		const hash = crypto.createHmac('sha256', secret)
						   .update(password)
						   .digest('hex');
		pool.getConnection(function(err, connection){
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /auth ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query('SELECT user_email FROM user_login WHERE user_email = ? AND user_password = ?', [username, hash], function(err2, results, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /auth ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if (results.length > 0) {
					token = Math.random().toString(36).substring(8);
					connection.query('UPDATE user_login SET token = ?, login_time = now() WHERE user_email = ?', [token, username], function(err3, results, fields) {
						if(err3){
							fs.appendFile('log.txt', '[ERROR][3] /auth ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
							response.end();
						}
						response.cookie('token', token, {maxAge: 10800000, cookie_flags: 'SameSite=None;Secure'});
						response.redirect('/home');
					});
				}
				else{
					response.redirect('/');
				}
			});
			connection.release();
		});
	}
	else{
		response.redirect('/');
	}
});

// Logout
// Used in all of the pages when the user logs out

app.post('/logout', function(request, response){
	response.clearCookie('token');
	response.redirect('/');
});

// Main page
// Used in Users.html, CreateStudy.html, EditStudy.html

app.get('/home', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection){
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /home ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
							response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /home ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				else{
					if(result.length != 0){
						response.sendFile(path.join(__dirname + '/pages/main.html'));
					}
					else
						response.redirect('/');
				}
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Retrieve user studies
// Used in main.js

app.get('/Projects', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection){
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Projects ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login where token = '" + request.cookies['token'] + "';", function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Projects ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project, p_start_time, p_finish_time, has_devices, forms FROM projects;", function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /Projects ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								 });
							}
							else{
								connection.query("SELECT a.project, p_start_time, p_finish_time, has_devices, forms FROM projects a, permissions b WHERE user_email = ? AND a.project = b.project;", [result[0].user_email], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /Projects ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								 });
							}
						}
						else{
							response.redirect('/');
						}
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Links displayed in the main page
// Used in main.js

app.get('/Links', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Links ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Links ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end('Useful links:<br>- BWDAT Chrome Extension: <a href="' + <Chrome Extension url> + '"> Link </a><br>- BWDAT Google Play Store: <a href="' + <App url> + '"> Link </a><br>- BWDAT Manual: <a href="https://docs.google.com/document/d/17L0b9XjVcoU74Xf_b0GAD_5lv3uVkkxwjUZlcmfH_8M/edit?usp=sharing"> Link </a><br>Error Logs: <a href="Logs.html">Link</a><br>Backup Data Download: <a href="#" onClick="create_zip()">Link</a><br/>');
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end('Useful links:<br>- BWDAT Chrome Extension: <a href="' + <Chrome Extension url> + '"> Link </a><br>- BWDAT Google Play Store: <a href="' + <App url> + '"> Link </a><br>- BWDAT Manual: <a href="https://docs.google.com/document/d/17L0b9XjVcoU74Xf_b0GAD_5lv3uVkkxwjUZlcmfH_8M/edit?usp=sharing"> Link </a>');
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Create study page
// Used in main.js

app.get('/CreateNewStudy', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /CreateNewStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /CreateNewStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							response.sendFile(path.join(__dirname + '/pages/CreateStudy.html'));
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Create Study
// Used in CreateStudy.js

// TODO USER PERMISSIONS VERIFICATION!

app.post('/CreateStudy', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /CreateStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /CreateStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.body.p_name && request.body.p_name.trim() != ''){
								connection.query("SELECT project FROM projects where project = ?;", [request.body.p_name.trim()], function (err3, result2, fields) {
									if (err3){
										fs.appendFile('log.txt', '[ERROR][3] /CreateStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.redirect('/CreateNewStudy?alert=An error occured in the server.');
									}
									else{
										if(result2.length == 0){
											connection.query("INSERT INTO projects (project, has_devices, p_start_time, p_finish_time, pre_study_form, pos_study_form, pre_session_form, pos_session_form, next_episode_form, netflix, youtube) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [request.body.p_name.trim(), request.body.devices == 'No' ? 'No' : 'Yes', request.body.start_date_val == '' ? null : request.body.start_date_val, request.body.finish_date_val == '' ? null : request.body.finish_date_val, request.body.pre_study_url.trim() == '' ? null : request.body.pre_study_url.trim(), request.body.post_study_url.trim() == '' ? null : request.body.post_study_url.trim(), request.body.pre_session_url.trim() == '' ? null : request.body.pre_session_url.trim(), request.body.post_session_url.trim() == '' ? null : request.body.post_session_url.trim(), request.body.next_episode_url.trim() == '' ? null : request.body.next_episode_url.trim(), 'Yes', 'No'], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][4] /CreateStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/CreateNewStudy?alert=An error occured in the server.');
												}
												else{
													connection.query("INSERT INTO permissions (project, user_email) values (?, ?)", [request.body.p_name.trim(), result[0].user_email], function (err5, result3, fields) {
														if (err5) {
															fs.appendFile('log.txt', '[ERROR][5] /CreateStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err5 + "\n", function (err6) {if (err6) throw err6;});
															response.redirect('/CreateNewStudy?alert=An error occured in the server.');
														}
														else
															response.redirect('/home');
													});
												}
											});
										}
										else
											response.redirect('/CreateNewStudy?alert=Project name \'' + request.body.p_name.trim() + '\' is already being used.');
									}
								});
							}
							else
								response.redirect('/CreateNewStudy?alert=Insert a project name.');
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get Study Infos
// Used in EditStudy.js

app.get('/GetStudyInfos/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /GetStudyInfos/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /GetStudyInfos/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT p_start_time, p_finish_time, has_devices, pre_session_form, pos_session_form, pre_study_form, pos_study_form, next_episode_form FROM projects WHERE project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /GetStudyInfos/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
											response.end(JSON.stringify(result2));
										}
										else{
											response.redirect('/home');
										}
									}
								});
							}
							else{
								connection.query("SELECT p_start_time, p_finish_time, has_devices, pre_session_form, pos_session_form, pre_study_form, pos_study_form, next_episode_form FROM projects, permissions WHERE permissions.user_email = ? AND permissions.project = projects.project AND projects.project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /GetStudyInfos/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
											response.end(JSON.stringify(result2));
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								 });
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Edit study page
// Used in main.js

app.get('/EditStudy/:study', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /EditStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /EditStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /EditStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/EditStudy.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /EditStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/EditStudy.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
									
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Save edit Study
// Used in EditStudy.js

app.post('/SaveChangesStudy', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.body.p_name){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.body.p_name], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												connection.query("UPDATE projects SET has_devices = ?, p_start_time = ?, p_finish_time = ?, pre_study_form = ?, pos_study_form = ?, pre_session_form = ?, pos_session_form = ?, next_episode_form = ? WHERE project = ?;", [request.body.devices == 'No' ? 'No' : 'Yes', request.body.start_date_val == '' ? null : request.body.start_date_val, request.body.finish_date_val == '' ? null : request.body.finish_date_val, request.body.pre_study_url.trim() == '' ? null : request.body.pre_study_url.trim(), request.body.post_study_url.trim() == '' ? null : request.body.post_study_url.trim(), request.body.pre_session_url.trim() == '' ? null : request.body.pre_session_url.trim(), request.body.post_session_url.trim() == '' ? null : request.body.post_session_url.trim(), request.body.next_episode_url.trim() == '' ? null : request.body.next_episode_url.trim(), request.body.p_name], function (err4, result3, fields) {
													if (err4) {
														fs.appendFile('log.txt', '[ERROR][4] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
														response.redirect('/EditStudy/' + request.body.p_name + '/?alert=An error occured in the server.');
													}
													else{
														response.redirect('/home');
													}
												});
											}
											else{
												response.redirect('/home?alert=Study \'' + request.body.p_name + '\' not found.');
											}
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.body.p_name], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][5] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										if(result2.length != 0){
											connection.query("UPDATE projects SET has_devices = ?, p_start_time = ?, p_finish_time = ?, pre_study_form = ?, pos_study_form = ?, pre_session_form = ?, pos_session_form = ?, next_episode_form = ? WHERE project = ?;", [request.body.devices == 'No' ? 'No' : 'Yes', request.body.start_date_val == '' ? null : request.body.start_date_val, request.body.finish_date_val == '' ? null : request.body.finish_date_val, request.body.pre_study_url.trim() == '' ? null : request.body.pre_study_url.trim(), request.body.post_study_url.trim() == '' ? null : request.body.post_study_url.trim(), request.body.pre_session_url.trim() == '' ? null : request.body.pre_session_url.trim(), request.body.post_session_url.trim() == '' ? null : request.body.post_session_url.trim(), request.body.next_episode_url.trim() == '' ? null : request.body.next_episode_url.trim(), request.body.p_name], function (err4, result3, fields){
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][6] /SaveChangesStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/EditStudy/' + request.body.p_name + '/?alert=An error occured in the server.');
												}
												else
													response.redirect('/home');
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.body.p_name + '\'.');
										}
									});
								}
							}
							else
								response.redirect('/EditStudy/' + request.body.p_name + '/?alert=Project name not received.');
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Edit users page
// Used in main.js

app.get('/Users/:study', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Users/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Users/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /Users ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/Users.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /Users ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/Users.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Get users from study
// Used in Users.js

app.get('/StudyUsers/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudyUsers/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /StudyUsers/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT user_id, u_start_time, u_finish_time, user_string, has_devices FROM users, projects WHERE projects.project = users.project AND projects.project = ? ORDER BY user_id;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /StudyUsers/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /StudyUsers ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT user_id, u_start_time, u_finish_time, user_string, has_devices FROM users, projects WHERE projects.project = users.project AND projects.project = ? ORDER BY user_id;", [request.params.study], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /StudyUsers/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});




// Download User data
// Used in User.js

app.post('/DownloadUser/:study/:user_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.params) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT e.user_id, e.session_code, device_id, e.data_diahr, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, series_title, season, eps_nr, eps_t, eps_time, action, ID FROM (SELECT DISTINCT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
												" FROM (SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND user_id = ? AND hidden = 'No' GROUP BY session_code) a" +
												" INNER JOIN devices_track b" +
												" ON a.user_id = b.user_id" +
												" AND a.project = b.project" +
												" WHERE s_start_time >= d_start_time" +
												" AND s_finish_time <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
											" INNER JOIN bwdat_app_data d" +
											" ON c.device_id = d.device_id" +
												" WHERE d.data_diahr >= s_start_time" +
												" AND d.data_diahr <= s_finish_time GROUP BY data_diahr) e" +
											" LEFT JOIN (SELECT data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) eps_time, project, user_id, session_code, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No') f" +
											" ON e.data_diahr = f.data_diahr AND e.project = f.project AND e.user_id = f.user_id UNION" +
											
											" SELECT DISTINCT f.user_id, f.session_code, device_id, f.data_diahr, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, series_title, season, eps_nr, eps_t, eps_time, action, ID FROM (SELECT DISTINCT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
												" FROM (SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND user_id = ? AND hidden = 'No' GROUP BY session_code) a" +
												" INNER JOIN devices_track b" +
												" ON a.user_id = b.user_id" +
												" AND a.project = b.project" +
												" WHERE s_start_time >= d_start_time" +
												" AND s_finish_time <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
											" INNER JOIN bwdat_app_data d" +
											" ON c.device_id = d.device_id" +
												" WHERE d.data_diahr >= s_start_time" +
												" AND d.data_diahr <= s_finish_time GROUP BY data_diahr) e" +
											" RIGHT JOIN (SELECT project, data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) as eps_time, user_id, session_code, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No') f" +
											" ON e.data_diahr = f.data_diahr AND e.project = f.project AND e.user_id = f.user_id ORDER BY user_id, session_code, data_diahr, ID;", [request.params.study, request.params.user_id, request.params.study, request.params.user_id, request.params.study, request.params.user_id, request.params.study, request.params.user_id], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][4] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/home?alert=An error occured in the server.');
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=Study \'' + request.params.study + '\' not found.');
										}
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][5] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									if(result2.length != 0){
										connection.query("SELECT e.user_id, e.session_code, device_id, e.data_diahr, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, series_title, season, eps_nr, eps_t, eps_time, action, ID FROM (SELECT DISTINCT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
												" FROM (SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND user_id = ? AND hidden = 'No' GROUP BY session_code) a" +
												" INNER JOIN devices_track b" +
												" ON a.user_id = b.user_id" +
												" AND a.project = b.project" +
												" WHERE s_start_time >= d_start_time" +
												" AND s_finish_time <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
											" INNER JOIN bwdat_app_data d" +
											" ON c.device_id = d.device_id" +
												" WHERE d.data_diahr >= s_start_time" +
												" AND d.data_diahr <= s_finish_time GROUP BY data_diahr) e" +
											" LEFT JOIN (SELECT data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) eps_time, project, user_id, session_code, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No') f" +
											" ON e.data_diahr = f.data_diahr AND e.project = f.project AND e.user_id = f.user_id UNION" +
											
											" SELECT DISTINCT f.user_id, f.session_code, device_id, f.data_diahr, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, series_title, season, eps_nr, eps_t, eps_time, action, ID FROM (SELECT DISTINCT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
												" FROM (SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND user_id = ? AND hidden = 'No' GROUP BY session_code) a" +
												" INNER JOIN devices_track b" +
												" ON a.user_id = b.user_id" +
												" AND a.project = b.project" +
												" WHERE s_start_time >= d_start_time" +
												" AND s_finish_time <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
											" INNER JOIN bwdat_app_data d" +
											" ON c.device_id = d.device_id" +
												" WHERE d.data_diahr >= s_start_time" +
												" AND d.data_diahr <= s_finish_time GROUP BY data_diahr) e" +
											" RIGHT JOIN (SELECT project, data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) as eps_time, user_id, session_code, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No') f" +
											" ON e.data_diahr = f.data_diahr AND e.project = f.project AND e.user_id = f.user_id ORDER BY user_id, session_code, data_diahr, ID;", [request.params.study, request.params.user_id, request.params.study, request.params.user_id, request.params.study, request.params.user_id, request.params.study, request.params.user_id], function (err4, result3, fields){
											if (err4) {
												fs.appendFile('log.txt', '[ERROR][6] /DownloadUser ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
												response.redirect('/home?alert=An error occured in the server.');
											}
											else{
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result3));
											}
										});
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Download User data
// Used in User.js

app.post('/DownloadUserSimple/:study/:user_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.params) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT user_id, session_code, data_diahr, COALESCE(NULLIF(title, ''), COALESCE(NULLIF(series_t, ''), series_title)) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) eps_time, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.title, b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No' ORDER BY user_id, session_code, data_diahr, ID;", [request.params.study, request.params.user_id], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][4] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/home?alert=An error occured in the server.');
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=Study \'' + request.params.study + '\' not found.');
										}
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][5] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									if(result2.length != 0){
										connection.query("SELECT user_id, session_code, data_diahr, COALESCE(NULLIF(title, ''), COALESCE(NULLIF(series_t, ''), series_title)) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, COALESCE(NULLIF(eps_time_aux,''), eps_time) eps_time, action, COALESCE(NULLIF(ID_aux,''), ID) as ID FROM bwdat_chrome_data a LEFT JOIN (SELECT b.title, b.eps_code, b.series_t, b.series_s, b.series_e, eps_t FROM contents b) AS b ON a.eps_code = b.eps_code WHERE project = ? AND user_id = ? AND hidden = 'No' ORDER BY user_id, session_code, data_diahr, ID;", [request.params.study, request.params.user_id], function (err4, result3, fields){
											if (err4) {
												fs.appendFile('log.txt', '[ERROR][6] /DownloadUserSimple ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
												response.redirect('/home?alert=An error occured in the server.');
											}
											else{
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result3));
											}
										});
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Edit Contents page
// Used in main.js

app.get('/Contents/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Contents ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /Contents ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /Contents ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/Contents.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /Contents ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/Contents.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Download Content data
// Used in ContentsInfo.js

app.get('/getEpsInfo/:study/', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.params) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT DISTINCT a.eps_code, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, eps_code_new, title, regularSynopsis, availability, maturity, specificRatingReasons, releaseYear, seasonCount, mood_0, mood_1, mood_2, mood_3, mood_4, mood_5, genre_0, genre_1, genre_2, genre_3, genre_4, genre_5, creator_0, creator_1, creator_2, creator_3, creator_4, creator_0_id, creator_1_id, creator_2_id, creator_3_id, creator_4_id, writer_0, writer_1, writer_2, writer_3, writer_4, writer_5, writer_6, writer_7, writer_8, writer_9, writer_0_id, writer_1_id, writer_2_id, writer_3_id, writer_4_id, writer_5_id, writer_6_id, writer_7_id, writer_8_id, writer_9_id, director_0, director_1, director_2, director_3, director_4, director_0_id, director_1_id, director_2_id, director_3_id, director_4_id, cast_0, cast_1, cast_2, cast_3, cast_4, cast_5, cast_6, cast_7, cast_8, cast_9, cast_10, cast_11, cast_12, cast_13, cast_14, cast_15, cast_16, cast_17, cast_18, cast_19, cast_20, cast_21, cast_22, cast_23, cast_24, cast_25, cast_26, cast_27, cast_28, cast_29, cast_30, cast_31, cast_32, cast_33, cast_34, cast_35, cast_36, cast_37, cast_38, cast_39, cast_40, cast_41, cast_42, cast_43, cast_44, cast_45, cast_46, cast_47, cast_48, cast_0_id, cast_1_id, cast_2_id, cast_3_id, cast_4_id, cast_5_id, cast_6_id, cast_7_id, cast_8_id, cast_9_id, cast_10_id, cast_11_id, cast_12_id, cast_13_id, cast_14_id, cast_15_id, cast_16_id, cast_17_id, cast_18_id, cast_19_id, cast_20_id, cast_21_id, cast_22_id, cast_23_id, cast_24_id, cast_25_id, cast_26_id, cast_27_id, cast_28_id, cast_29_id, cast_30_id, cast_31_id, cast_32_id, cast_33_id, cast_34_id, cast_35_id, cast_36_id, cast_37_id, cast_38_id, cast_39_id, cast_40_id, cast_41_id, cast_42_id, cast_43_id, cast_44_id, cast_45_id, cast_46_id, cast_47_id, cast_48_id from contents a LEFT JOIN bwdat_chrome_data b ON a.eps_code = b.eps_code WHERE a.eps_code in (SELECT distinct eps_code from bwdat_chrome_data where project = ?) order by a.eps_code;", [request.params.study], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][4] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/home?alert=An error occured in the server.');
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=Study \'' + request.params.study + '\' not found.');
										}
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][5] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									if(result2.length != 0){
										connection.query("SELECT eps_code, series_t, series_s, series_e, eps_t, eps_code_new, title, regularSynopsis, availability, maturity, specificRatingReasons, releaseYear, seasonCount, mood_0, mood_1, mood_2, mood_3, mood_4, mood_5, genre_0, genre_1, genre_2, genre_3, genre_4, genre_5, creator_0, creator_1, creator_2, creator_3, creator_4, creator_5, creator_0_id, creator_1_id, creator_2_id, creator_3_id, creator_4_id, creator_5_id, writer_0, writer_1, writer_2, writer_3, writer_4, writer_5, writer_6, writer_7, writer_8, writer_9, writer_0_id, writer_1_id, writer_2_id, writer_3_id, writer_4_id, writer_5_id, writer_6_id, writer_7_id, writer_8_id, writer_9_id, director_0, director_1, director_2, director_3, director_4, director_0_id, director_1_id, director_2_id, director_3_id, director_4_id, cast_0, cast_1, cast_2, cast_3, cast_4, cast_5, cast_6, cast_7, cast_8, cast_9, cast_10, cast_11, cast_12, cast_13, cast_14, cast_15, cast_16, cast_17, cast_18, cast_19, cast_20, cast_21, cast_22, cast_23, cast_24, cast_25, cast_26, cast_27, cast_28, cast_29, cast_30, cast_31, cast_32, cast_33, cast_34, cast_35, cast_36, cast_37, cast_38, cast_39, cast_40, cast_41, cast_42, cast_43, cast_44, cast_45, cast_46, cast_47, cast_48, cast_0_id, cast_1_id, cast_2_id, cast_3_id, cast_4_id, cast_5_id, cast_6_id, cast_7_id, cast_8_id, cast_9_id, cast_10_id, cast_11_id, cast_12_id, cast_13_id, cast_14_id, cast_15_id, cast_16_id, cast_17_id, cast_18_id, cast_19_id, cast_20_id, cast_21_id, cast_22_id, cast_23_id, cast_24_id, cast_25_id, cast_26_id, cast_27_id, cast_28_id, cast_29_id, cast_30_id, cast_31_id, cast_32_id, cast_33_id, cast_34_id, cast_35_id, cast_36_id, cast_37_id, cast_38_id, cast_39_id, cast_40_id, cast_41_id, cast_42_id, cast_43_id, cast_44_id, cast_45_id, cast_46_id, cast_47_id, cast_48_id from contents where eps_code in (SELECT distinct eps_code from bwdat_chrome_data where project = ?) order by eps_code;", [request.params.study], function (err4, result3, fields){
											if (err4) {
												fs.appendFile('log.txt', '[ERROR][6] /getEpsInfo ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
												response.redirect('/home?alert=An error occured in the server.');
											}
											else{
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result3));
											}
										});
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});




// Get user actions data without Hidden actions
// Used in User.js

app.post('/ProjectActions2/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT user_id, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, session_code, data_diahr, eps_dur, eps_dur_aux, a.eps_code, eps_time, eps_time_aux, action, action_dur, streamer, hidden, ID, ID_aux FROM bwdat_chrome_data a LEFT JOIN contents b ON a.eps_code = b.eps_code WHERE hidden = 'No' AND project = ?  ORDER BY user_id, session_code, data_diahr, COALESCE(NULLIF(ID_aux,''), ID);", [request.params.study], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][4] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/home?alert=An error occured in the server.');
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=Study \'' + request.params.study + '\' not found.');
										}
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][5] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									if(result2.length != 0){
										connection.query("SELECT user_id, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, session_code, data_diahr, eps_dur, eps_dur_aux, a.eps_code, eps_time, eps_time_aux, action, action_dur, streamer, hidden, ID, ID_aux FROM bwdat_chrome_data a LEFT JOIN contents b ON a.eps_code = b.eps_code WHERE hidden = 'No' AND project = ?  ORDER BY user_id, session_code, data_diahr, COALESCE(NULLIF(ID_aux,''), ID);", [request.params.study], function (err4, result3, fields){
											if (err4) {
												fs.appendFile('log.txt', '[ERROR][6] /ProjectActions2 ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
												response.redirect('/home?alert=An error occured in the server.');
											}
											else{
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result3));
											}
										});
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Edit permissions page
// Used in main.js

app.get('/Permissions/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Permissions ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /Permissions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /Permissions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/Permissions.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /Permissions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/Permissions.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Get permissions from study
// Used in Permissions.js

app.get('/StudyPermissions/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudyPermissions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /StudyPermissions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT user_email FROM projects, permissions WHERE projects.project = permissions.project AND projects.project = ?;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /StudyPermissions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
											response.end(JSON.stringify(result2));
										}
										else{
											response.redirect('/home');
										}
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /StudyPermissions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT user_email FROM permissions WHERE permissions.project = ?;", [request.params.study], function (err4, result3, fields) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /StudyPermissions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result3));
											 });
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								 });
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Remove permissions from study
// Used in Permissions.js

app.post('/RemoveStudyPermission/:study/:user_email', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /RemoveStudyPermission ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /RemoveStudyPermission ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("DELETE from permissions WHERE permissions.project = ? AND user_email = ?;", [request.params.study, request.params.user_email], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /RemoveStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /RemoveStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("DELETE from permissions WHERE permissions.project = ? AND user_email = ?;", [request.params.study, request.params.user_email], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /RemoveStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result3));
									 });
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						 });
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Add permissions to study
// Used in Permissions.js

app.post('/AddStudyPermission/:study/:user_email', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /AddStudyPermission ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /AddStudyPermission ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("INSERT INTO permissions (project, user_email) VALUES (?, ?);", [request.params.study, request.params.user_email], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /AddStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /AddStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("INSERT INTO permissions (project, user_email) VALUES (?, ?);", [request.params.study, request.params.user_email], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /AddStudyPermission/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result3));
									 });
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						 });
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Edit devices page
// Used in main.js

app.get('/Devices/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Devices ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /Devices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /Devices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/Devices.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /Devices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/Devices.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Edit devices page for user
// Used in Users.js

app.get('/DevicesUser/:study/:user', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /DevicesUser ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /DevicesUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /DevicesUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/DevicesUser.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /DevicesUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/DevicesUser.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Edit user end date
// Used in Users.js

app.get('/UserEdit/:study/:user', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /UserEdit ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /UserEdit ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /UserEdit ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/UserEdit.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /UserEdit ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/UserEdit.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get User dates from study
// Used in UserEdit.js

app.get('/User/:study/:user_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /User ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /User ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT u_start_time, u_finish_time FROM users WHERE project = ? AND user_id = ?;", [request.params.study, request.params.user_id], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /User ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /User ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT u_start_time, u_finish_time FROM users WHERE project = ? AND user_id = ?;", [request.params.study, request.params.user_id], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /User ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Save edit Study
// Used in EditStudy.js

app.post('/EditUserDate', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('/log.txt', '[ERROR][1] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.body.p_name){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM users WHERE users.project = ? AND users.user_id = ?;", [request.body.p_name, request.body.user_id], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												connection.query("UPDATE users SET u_finish_time = ? WHERE project = ? AND user_id = ?;", [request.body.finish_date_val, request.body.p_name, request.body.user_id], function (err4, result3, fields) {
													if (err4) {
														fs.appendFile('log.txt', '[ERROR][4] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
														response.redirect('/Users/' + request.body.p_name + '/?alert=An error occured in the server.');
													}
													else{
														response.redirect('/Users/' + request.body.p_name);
													}
												});
											}
											else{
												response.redirect('/home?alert=Study \'' + request.body.p_name + '\' not found.');
											}
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.body.p_name], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][5] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										if(result2.length != 0){
											connection.query("UPDATE users SET u_finish_time = ? WHERE project = ? AND user_id = ?;", [request.body.finish_date_val, request.body.p_name, request.body.user_id], function (err4, result3, fields){
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][6] /EditUserDate ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.redirect('/Users/' + request.body.p_name + '/?alert=An error occured in the server.');
												}
												else
													response.redirect('/Users/' + request.body.p_name);
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.body.p_name + '\'.');
										}
									});
								}
							}
							else
								response.redirect('/Users/' + request.body.p_name + '/?alert=Project name not received.');
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get devices from study
// Used in devices.js


app.get('/StudyDevices/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudyDevices ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /StudyDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT a.device_id, model, user_id, added_time FROM (SELECT * FROM devices WHERE project = ?) a LEFT JOIN (SELECT user_id, device_id FROM devices_track WHERE CURDATE() >= d_start_time AND CURDATE() <= COALESCE(d_finish_time, CURDATE())) b ON a.device_id = b.device_id ORDER BY device_id;", [request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /StudyDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /StudyDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT a.device_id, model, user_id, added_time FROM (SELECT * FROM devices WHERE project = ?) a LEFT JOIN (SELECT user_id, device_id FROM devices_track WHERE CURDATE() >= d_start_time AND CURDATE() <= COALESCE(d_finish_time, CURDATE())) b ON a.device_id = b.device_id ORDER BY device_id;", [request.params.study], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /StudyDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get devices tracking from study
// Used in devices.js

app.get('/StudyDevicesTracking/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudyDevicesTracking ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /StudyDevicesTracking ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT ID, user_id, d_start_time, d_finish_time, device_id FROM devices_track WHERE project = ? ORDER BY device_id;", [request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /StudyDevicesTracking ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /StudyDevicesTracking ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT ID, user_id, d_start_time, d_finish_time, device_id FROM devices_track WHERE project = ? ORDER BY device_id;", [request.params.study], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /StudyDevicesTracking ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});

// Remove device from study
// Used in devices.js

app.post('/RemoveDeviceFromStudy/:study/:device_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /RemoveDeviceFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /RemoveDeviceFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("UPDATE devices SET project = NULL WHERE device_id = ? AND project = ?;", [request.params.device_id, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /RemoveDeviceFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /RemoveDeviceFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("UPDATE devices SET project = NULL WHERE device_id = ? AND project = ?;", [request.params.device_id, request.params.study], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /RemoveDeviceFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Remove device track from study
// Used in devices.js

app.post('/RemoveDeviceTrackFromStudy/:study/:track_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /RemoveDeviceTrackFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /RemoveDeviceTrackFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("DELETE from devices_track WHERE ID = ? AND project = ?;", [request.params.track_id, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /RemoveDeviceTrackFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /RemoveDeviceTrackFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("DELETE from devices_track WHERE ID = ? AND project = ?;", [request.params.track_id, request.params.study], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /RemoveDeviceTrackFromStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Add Device page
// Used in Devices.js

app.get('/AddDevice/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /AddDevice ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /AddDevice ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(request.params.study){
						if(result[0].user_permission == 1 || result[0].user_permission == 2){
							connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][3] /AddDevice ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									response.sendFile(path.join(__dirname + '/pages/AddDevice.html'));
								}
							});
						}
						else{
							connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
								if (err3) {
									fs.appendFile('log.txt', '[ERROR][4] /AddDevice ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
									response.end();
								}
								else{
									if(result2.length != 0){
										response.sendFile(path.join(__dirname + '/pages/AddDevice.html'));
									}
									else{
										response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
									}
								}
							});
						}
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get Available Devices
// Used in AddDevice.js

app.get('/ActiveDevices/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /ActiveDevices ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /ActiveDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT device_id, model, name FROM devices WHERE project IS NULL;", function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /ActiveDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /ActiveDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT device_id, model, name FROM devices WHERE project IS NULL;", function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /ActiveDevices ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Add device to study
// Used in Device.js

app.post('/AddDeviceStudy/:study/:device_id', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /AddDeviceStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /AddDeviceStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("UPDATE devices SET project = ? WHERE device_id = ? AND project IS NULL;", [request.params.study, request.params.device_id], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /AddDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /AddDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("UPDATE devices SET project = ? WHERE device_id = ? AND project IS NULL;", [request.params.study, request.params.device_id], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /AddDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result3));
									 });
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						 });
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Add device tracking to study
// Used in Device.js

app.post('/AddTrackDeviceStudy/:study/:user_id/:device_id/:d_start_time', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /AddTrackDeviceStudy ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /AddTrackDeviceStudy ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("INSERT INTO devices_track (project, user_id, device_id, d_start_time) VALUES (?, ?, ?, ?);", [request.params.study, request.params.user_id, request.params.device_id, request.params.d_start_time], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /AddTrackDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /AddTrackDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("INSERT INTO devices_track (project, user_id, device_id, d_start_time) VALUES (?, ?, ?, ?);", [request.params.study, request.params.user_id, request.params.device_id, request.params.d_start_time], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /AddTrackDeviceStudy/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result3));
									 });
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						 });
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Create user
// Used in User.js

app.post('/CreateUser/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT user_string FROM users;", function (err3, result2, fields2) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							while(1){
								var j = 0;
								r = Math.random().toString(36).substring(8);
								for(var i=0; i < result2.length; i++)
									if(result2[i].user_string == r)
										continue;
									else
										j = j + 1;
								if(j == result2.length)
									break;
							}
							var user_id;
							connection.query("SELECT MAX(user_id) AS maximo FROM users WHERE project = ?;", [request.params.study], function (err4, result3, fields3) {
								if (err4) {
									fs.appendFile('log.txt', '[ERROR][4] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
								}
								var myresult = result3[0];
								if(myresult != null)
									user_id = myresult.maximo + 1;
								else
									user_id = 1;
								connection.query("INSERT INTO users (user_id, project, user_string) VALUES ('" + user_id + "', ?, '" + r + "');", [request.params.study], function (err5, result4, fields4) {
									if (err5) {
										fs.appendFile('log.txt', '[ERROR][5] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err5 + "\n", function (err6) {if (err6) throw err6;});
									}
								});
								connection.query("SELECT user_id, user_string, has_devices FROM users a LEFT JOIN projects b ON a.project = b.project WHERE user_id='" + user_id + "' AND a.project = ?;", [request.params.study], function (err6, result5, fields5) {
									if (err6) {
										fs.appendFile('log.txt', '[ERROR][6] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err6 + "\n", function (err7) {if (err7) throw err7;});
									}
									response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
									response.end(JSON.stringify(result5));
								});
							});
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT user_string FROM users;", function (err4, result3, fields3) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][3] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										while(1){
											var j = 0;
											r = Math.random().toString(36).substring(8);
											for(var i=0; i < result3.length; i++)
												if(result3[i].user_string == r)
													continue;
												else
													j = j + 1;
											if(j == result3.length)
												break;
										}
										var user_id;
										connection.query("SELECT MAX(user_id) AS maximo FROM users WHERE project = ?;", [request.params.study], function (err5, result4, fields4) {
											if (err5) {
												fs.appendFile('log.txt', '[ERROR][4] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err5 + "\n", function (err6) {if (err6) throw err6;});
											}
											var myresult = result4[0];
											if(myresult != null)
												user_id = myresult.maximo + 1;
											else
												user_id = 1;
											connection.query("INSERT INTO users (user_id, project, user_string) VALUES ('" + user_id + "', ?, '" + r + "');", [request.params.study], function (err6, result5, fields5) {
												if (err6) {
													fs.appendFile('log.txt', '[ERROR][5] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err6 + "\n", function (err7) {if (err7) throw err7;});
												}
											});
											connection.query("SELECT user_id, user_string, has_devices FROM users a LEFT JOIN projects b ON a.project = b.project WHERE user_id='" + user_id + "' AND a.project = ?;", [request.params.study], function (err7, result6, fields6) {
												if (err7) {
													fs.appendFile('log.txt', '[ERROR][6] /CreateUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err7 + "\n", function (err7) {if (err7) throw err7;});
												}
												response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
												response.end(JSON.stringify(result6));
											});
										});
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Remove user
// Used in User.js


app.post('/RemoveUser/:study/:user_code', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /RemoveUser ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /RemoveUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("DELETE from users WHERE project = ? AND user_string = ?;", [request.params.study, request.params.user_code], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /RemoveUser/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /RemoveUser ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("DELETE from users WHERE project = ? AND user_string = ?;", [request.params.study, request.params.user_code], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /RemoveUser/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										else{
											response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
											response.end(JSON.stringify(result3));
										}
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Edit forms page
// Used in main.js

app.get('/Forms/:study', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Forms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Forms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /Forms ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/Forms.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /Forms ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/Forms.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get forms from study
// Used in Forms.js

app.get('/StudyForms/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudyForms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /StudyForms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT form, streamer, eps_code FROM forms, projects WHERE projects.project = forms.project AND projects.project = ? ORDER BY eps_code;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /StudyForms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
									response.end(JSON.stringify(result2));
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /StudyForms ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT form, streamer, eps_code FROM forms, projects WHERE projects.project = forms.project AND projects.project = ? ORDER BY eps_code;", [request.params.study], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /StudyForms/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Remove form
// Used in Forms.js


app.post('/RemoveForm/:study/:streamer/:eps_code', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /RemoveForm ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /RemoveForm ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("DELETE from forms WHERE project = ? AND streamer = ? AND eps_code = ?;", [request.params.study, request.params.streamer, request.params.eps_code], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /RemoveForm/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /RemoveForm ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("DELETE from forms WHERE project = ? AND streamer = ? AND eps_code = ?;", [request.params.study, request.params.streamer, request.params.eps_code], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /RemoveForm/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										else{
											response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
											response.end(JSON.stringify(result3));
										}
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Add form to study
// Used in Forms.js

app.post('/AddStudyForm/:study/:eps_code', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /AddStudyForm ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /AddStudyForm ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("INSERT INTO forms (project, eps_code, form, streamer) VALUES (?, ?, ?, 'Netflix');", [request.params.study, request.params.eps_code, request.query.url], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /AddStudyForm/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
								response.end(JSON.stringify(result2));
							}
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /AddStudyForm/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("INSERT INTO forms (project, eps_code, form, streamer) VALUES (?, ?, ?, 'netflix');", [request.params.study, request.params.eps_code, request.query.url], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /AddStudyForm/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
											response.end();
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result3));
									 });
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						 });
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Edit sessions page
// Used in main.js

app.get('/Sessions/:study', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Sessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Sessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /Sessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/Sessions.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /Sessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/Sessions.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get sessions from study
// Used in Sessions.js

app.get('/StudySessions/:study', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /StudySessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /StudySessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT project, s_start_time, s_finish_time, user_id, session_code FROM sessions WHERE project = ? GROUP BY user_id, session_code ORDER BY user_id, session_code;", [request.params.study], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /StudySessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /StudySessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT project, s_start_time, s_finish_time, user_id, session_code FROM sessions WHERE project = ? GROUP BY user_id, session_code ORDER BY user_id, session_code;", [request.params.study], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /StudySessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Visualize session page
// Used in Sessions.js

app.get('/Session/:study/User/:userID/Session/:sessionID', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /Session/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /Session/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /Session ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/Session.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /Session ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/Session.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});


// Get actions from session
// Used in Session.js

app.get('/SessionActions/:study/User/:userID/Session/:sessionID', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /SessionActions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /SessionActions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, eps_time, a.eps_code, action FROM bwdat_chrome_data a LEFT JOIN contents b ON a.eps_code = b.eps_code  WHERE project = ? AND session_code = ? AND user_id = ? AND hidden = 'No' ORDER BY data_diahr, COALESCE(NULLIF(ID_aux,''), ID);", [request.params.study, request.params.sessionID, request.params.userID], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /SessionActions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /SessionActions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT data_diahr, COALESCE(NULLIF(series_t, ''), series_title) as series_title, COALESCE(NULLIF(series_s, ''), season) as season, COALESCE(NULLIF(series_e, ''), eps_nr) as eps_nr, eps_t, eps_time, a.eps_code, action FROM bwdat_chrome_data a LEFT JOIN contents b ON a.eps_code = b.eps_code  WHERE project = ? AND session_code = ? AND user_id = ? AND hidden = 'No' ORDER BY data_diahr, COALESCE(NULLIF(ID_aux,''), ID);", [request.params.study, request.params.sessionID, request.params.userID], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /SessionActions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Get HR data from session
// Used in Session.js

app.get('/SessionHR/:study/User/:userID/Session/:sessionID', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /SessionHR/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /SessionHR/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
									" FROM ( SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND session_code = ? AND user_id = ? AND hidden = 'No' ORDER BY data_diahr) a" +
									" INNER JOIN devices_track b" +
									" ON a.user_id = b.user_id" +
									" AND a.project = b.project" +
									" WHERE s_start_time >= d_start_time" +
									" AND COALESCE(s_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR)) <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
								" INNER JOIN bwdat_app_data d" +
								" ON c.device_id = d.device_id" +
									" WHERE d.data_diahr >= s_start_time" +
									" AND d.data_diahr <= s_finish_time;", [request.params.study, request.params.sessionID, request.params.userID], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /SessionHR/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /SessionHR ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT session_code, data_diahr, project, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, user_id, c.device_id FROM (SELECT a.user_id, a.session_code, d_start_time, d_finish_time, s_start_time, s_finish_time, a.project, device_id" +
												" FROM ( SELECT project, user_id, session_code, MAX(data_diahr) as s_finish_time, MIN(data_diahr) as s_start_time FROM bwdat_chrome_data WHERE project = ? AND session_code = ? AND user_id = ? AND hidden = 'No' ORDER BY data_diahr) a" +
												" INNER JOIN devices_track b" +
												" ON a.user_id = b.user_id" +
												" AND a.project = b.project" +
												" WHERE s_start_time >= d_start_time" +
												" AND COALESCE(s_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR)) <= COALESCE(d_finish_time, DATE_ADD(LOCALTIME(), INTERVAL 1 YEAR))) c" +
											" INNER JOIN bwdat_app_data d" +
											" ON c.device_id = d.device_id" +
												" WHERE d.data_diahr >= s_start_time" +
												" AND d.data_diahr <= s_finish_time;", [request.params.study, request.params.sessionID, request.params.userID], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /SessionHR/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});



// Visualize session page
// Used in Sessions.js

app.get('/UserSessions/:study/User/:userID', function(request, response){
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(request.params.study){
								if(result[0].user_permission == 1 || result[0].user_permission == 2){
									connection.query("SELECT project FROM projects WHERE projects.project = ?;", [request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][3] /UserSessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											response.sendFile(path.join(__dirname + '/pages/UserSessions.html'));
										}
									});
								}
								else{
									connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
										if (err3) {
											fs.appendFile('log.txt', '[ERROR][4] /UserSessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
											response.end();
										}
										else{
											if(result2.length != 0){
												response.sendFile(path.join(__dirname + '/pages/UserSessions.html'));
											}
											else{
												response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
											}
										}
									});
								}
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});






// User sessions
// Used in UserSessions.js

app.post('/UserSessions/:study/:userCode', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			else{
				connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						response.end();
					}
					else{
						if(result.length != 0){
							if(result[0].user_permission == 1 || result[0].user_permission == 2){
								connection.query("SELECT session_code as session FROM bwdat_chrome_data WHERE project = ? AND user_id = ? GROUP BY session_code;", [request.params.study, request.params.userCode], function (err3, result2, fields) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][3] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
										response.end(JSON.stringify(result2));
									}
								});
							}
							else{
								connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields2) {
									if (err3) {
										fs.appendFile('log.txt', '[ERROR][4] /UserSessions ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
										response.end();
									}
									else{
										if(result2.length != 0){
											connection.query("SELECT session_code as session FROM bwdat_chrome_data WHERE project = ? AND user_id = ? GROUP BY session_code;", [request.params.study, request.params.userCode], function (err4, result3, fields3) {
												if (err4) {
													fs.appendFile('log.txt', '[ERROR][5] /UserSessions/' + request.params.study + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
													response.end();
												}
												else{
													response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
													response.end(JSON.stringify(result3));
												}
											});
										}
										else{
											response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
										}
									}
								});
							}
						}
						else
							response.redirect('/');
					}
				});
			}
			connection.release();
		});
	}
	else
		response.redirect('/');
});







//TEMPLATES !
/*
GET page:
app.get('/DIRECTORY', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					response.sendFile(path.join(__dirname + '/pages/PAGE.html'));
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});

GET data:
app.get('/DIRECTORY', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						connection.query("SELECT ;", [request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][3] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
							}
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
							response.end(JSON.stringify(result2));
						});
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									connection.query("SELECT ;", [request.params.study], function (err4, result3, fields) {
										if (err4) {
											fs.appendFile('log.txt', '[ERROR][5] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err4 + "\n", function (err5) {if (err5) throw err5;});
										}
										response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*"});
										response.end(JSON.stringify(result3));
									});
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});

POST data:
app.post('/DIRECTORY', function(request, response) {
	if(typeof request.cookies['token'] !== 'undefined' && request.cookies['token']){
		pool.getConnection(function(err, connection) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + ' Impossible to get pool connection' + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
				response.end();
			}
			connection.query("SELECT user_permission, user_email FROM user_login WHERE token = ?;", [request.cookies['token']], function (err2, result, fields) {
				if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					response.end();
				}
				if(result.length != 0){
					if(result[0].user_permission == 1 || result[0].user_permission == 2){
						
					}
					else{
						connection.query("SELECT user_email FROM permissions WHERE user_email = ? AND project = ?;", [result[0].user_email, request.params.study], function (err3, result2, fields) {
							if (err3) {
								fs.appendFile('log.txt', '[ERROR][4] /DIRECTORY ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err3 + "\n", function (err4) {if (err4) throw err4;});
								response.end();
							}
							else{
								if(result2.length != 0){
									
								}
								else{
									response.redirect('/home?alert=You don\'t have permissions to edit study \'' + request.params.study + '\'.');
								}
							
							}
						});
					}
				}
				else
					response.redirect('/');
			});
			connection.release();
		});
	}
	else
		response.redirect('/');
});
*/


// Chrome Extension:

// Create Session

app.post('/CreateSession', function(request, response) {
	var session_code;
	pool.getConnection(function(err, connection) {
		connection.query("SELECT MAX(session_code) AS maximo FROM sessions WHERE user_id = ? AND project = ?;", [request.query.userID, request.query.projectID],function (err, result, fields) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /CreateSession/' + request.query + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				var myresult = result[0];
				if(myresult != null)
					session_code = myresult['maximo'] + 1;
				else
					session_code = 1;
				connection.query("INSERT INTO sessions (user_id, session_code, s_start_time, project) VALUES (?, ?, ?, ?);", [request.query.userID, session_code, request.query.time, request.query.projectID],function (err2, result2, fields2) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /CreateSession/' + request.params + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					}
				});
				connection.query("INSERT INTO bwdat_chrome_data (data_diahr, action, user_id, session_code, project, streamer, tab_id) VALUES (?, 'Opened Tab', ?, ?, ?, ?, ?);", [request.query.time, request.query.userID, session_code, request.query.projectID, request.query.streamer,  request.query.tabID == 'undefined' ? "-1" : request.query.tabID],function (err2, result2, fields2) {
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][3] /CreateSession/' + request.params + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					}
				});
				if(request.query.action == "Login" || request.query.action == "Logout"){
					connection.query("INSERT INTO bwdat_chrome_data (data_diahr, action, user_id, session_code, project, streamer, tab_id) VALUES (?, ?, ?, ?, ?, ?, ?);", [request.query.time, request.query.action, request.query.userID, session_code, request.query.projectID, request.query.streamer,  request.query.tabID == 'undefined' ? "-1" : request.query.tabID],function (err2, result2, fields3) {
						if (err2) {
						fs.appendFile('log.txt', '[ERROR][4] /CreateSession/' + JSON.stringify(request.params) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
						}
						else{
							response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
							response.end("" + session_code);
						}
					});
				}
				else{
					response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
					response.end("" + session_code);
				}
			}
		});
		connection.release();
	});
});


// Add browse action

app.post('/Browse', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO bwdat_chrome_data (data_diahr, action, user_id, session_code, project, streamer, browser, tab_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?);", [request.query.time, request.query.action, request.query.userID, request.query.sessionID, request.query.projectID, request.query.streamer, request.query.browser, request.query.tabID == 'undefined' ? "-1" : request.query.tabID], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /Browse/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end("ok");
			}
		});
		connection.release();
	});
});


// Add watch action

app.post('/Watch', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO bwdat_chrome_data (data_diahr, eps_time, eps_dur, action, user_id, session_code, project, streamer, eps_code, action_dur, browser, tab_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [request.query.time, request.query.eps_time, request.query.eps_dur, request.query.action, request.query.userID, request.query.sessionID, request.query.projectID, request.query.streamer, request.query.eps_code, request.query.action_dur, request.query.browser, request.query.tabID == 'undefined' ? "-1" : request.query.tabID], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /Watch/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end("ok");
			}
		});
		connection.release();
	});
});


// End Chrome Session

app.post('/EndSession', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("UPDATE sessions SET s_finish_time = ? WHERE user_id = ? AND session_code = ? AND project = ?;", [request.query.time, request.query.userID, request.query.sessionID, request.query.projectID], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /EndSession/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				connection.query("INSERT INTO bwdat_chrome_data (data_diahr, action, user_id, session_code, project, streamer, browser, tab_id) VALUES (?,  'Closed Tab', ?, ?, ?, ?, ?, ?);", [request.query.time, request.query.userID, request.query.sessionID, request.query.projectID, request.query.streamer, request.query.browser, request.query.tabID == 'undefined' ? "-1" : request.query.tabID], function (err2, result, fields) {
					if (err2) {
					fs.appendFile('log.txt', '[ERROR][2] /EndSession/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					}
					else{
						response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
						response.end("ok");
					}
				});
			}
		});
		connection.release();
	});
});


// Get project forms

app.post('/GetForms/:study', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT has_devices, forms, pre_study_form, pos_study_form, pre_session_form, pos_session_form, next_episode_form, p_start_time, p_finish_time FROM projects WHERE project = ?;",[request.params.study], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /GetForms/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});


// Get project forms

app.post('/GetForms/:study/:userID', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT u_finish_time, has_devices, forms, pre_study_form, pos_study_form, pre_session_form, pos_session_form, next_episode_form, p_start_time, p_finish_time FROM projects p LEFT JOIN users u ON p.project = u.project WHERE p.project = ? AND user_id = ?;",[request.params.study, request.params.userID], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /GetForms/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});


// Get episodes forms

app.post('/GetFormsEpisodes/:study', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT form, streamer, eps_code FROM forms, projects WHERE projects.project = forms.project AND projects.project = ? ORDER BY eps_code;", [request.params.study], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /GetFormsEpisodes/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});


// Validate Code

app.post('/ValidateCode/:code', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT * FROM users LEFT JOIN projects ON users.project = projects.project WHERE user_string = ?;", [request.params.code], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /ValidateCode/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				if(result.length > 0 && result[0].u_start_time == null)
					connection.query("UPDATE users SET u_start_time = ? WHERE user_string = ?;", [request.query.time, request.params.code], function (err2, result2, fields2){
					if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /ValidateCode/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					}
					});
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});

// GetEpisodes scripts

// Get study episode codes

app.get('/EpisodesCodes/:study', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT DISTINCT a.eps_code FROM (SELECT eps_code FROM bwdat_chrome_data WHERE project = ? AND eps_code IS NOT NULL AND eps_code != 'undefined') a;", [request.params.study], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /EpisodesCodes/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});

// Update episode feature

app.post('/EpsInfo/:epsCode/:feat/:name', function(request, response) {

	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO contents (eps_code, " + request.params.feat + ") VALUES (?, ?) ON DUPLICATE KEY UPDATE  " + request.params.feat + " = ?;", [request.params.epsCode, request.params.name, request.params.name], function (err, result, fields) {
			if (err) {
			fs.appendFile('log.txt', '[ERROR][1] /EpsInfo/' + JSON.stringify(request.params) + ' ' + new Date() + ' ' + JSON.stringify(request.params) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(result));
			}
		});
		connection.release();
	});
});


// Smartwatch Application:

// Add new device

app.post('/CreateNewDevice', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("SELECT MAX(device_id) AS maximo FROM devices;", function (err, result, fields) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /CreateNewDevice/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				var device_id;
				var myresult = result[0];
				if(myresult != null)
					device_id = myresult.maximo + 1;
				else
					device_id = 1;

				connection.query("INSERT INTO devices (device_id, added_time, name, model) VALUES (?, ?, ?, ?);", [device_id, request.body.date, request.body.name, request.body.model],  function (err2, result2, fields2) {
						if (err2) {
						fs.appendFile('log.txt', '[ERROR][2] /CreateNewDevice/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err2 + "\n", function (err3) {if (err3) throw err3;});
					}
				});
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end(JSON.stringify(device_id));
			}
		});
		connection.release();
	});
});


// Insert smartwatch data

app.post('/BWDATWatch', function(request, response) {
	pool.getConnection(function(err, connection) {
		connection.query("INSERT INTO bwdat_app_data (data_diahr, hr, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, session_nr, device_id, battery)" +
					" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", [request.body.date, request.body.HR, request.body.gyro_x, request.body.gyro_y, request.body.gyro_z, request.body.acc_x, request.body.acc_y, request.body.acc_z, request.body.session, request.body.watch, request.body.battery], function (err, result, fields) {
			if (err) {
				fs.appendFile('log.txt', '[ERROR][1] /BWDATWatch/' + JSON.stringify(request.query) + ' ' + new Date() + ' ' + JSON.stringify(request.body) + "\n" + err + "\n", function (err2) {if (err2) throw err2;});
			}
			else{
				response.writeHead(200, {"Content-Type": "text/html", "Access-Control-Allow-Origin": "*", "charset":"UTF-8"});
				response.end("CONNECTED!");
			}
		});
		connection.release();
	});
});


app.get('/images/:image', function(request, response) {
	response.sendFile(path.join(__dirname + '/images/' + request.params.image));
});

app.get('/favicon.ico', function(request, response) {
	response.sendFile(path.join(__dirname + '/favicon.ico'));
});

app.get('/css/:css', function(request, response) {
	response.sendFile(path.join(__dirname + '/css/' + request.params.css));
});

app.get('/auxscripts/:script', function(request, response) {
	response.sendFile(path.join(__dirname + '/auxscripts/' + request.params.script));
});

app.get('/scripts/:script', function(request, response) {
	response.sendFile(path.join(__dirname + '/scripts/' + request.params.script));
});

var server = https.createServer(options, app);

server.listen(port)