# BWDAT

## Binge-watching Data Analysis Tool

Open acess: [https://bwdat.m-iti.org](https://bwdat.m-iti.org)

Closed acess: [https://bwdat.unifr.ch](https://bwdat.unifr.ch)

BWDAT Manual: [link](https://docs.google.com/document/d/1PHR8ozNpexhTlUVrrYfdac7oXf_TvnxsRuyPCpVd67M/edit?usp=sharing)

### Paper Publications

Cordeiro, J. A. & Castro, D. & Nisi, V. & Nunes, N. (2021). BWDAT: A research tool for analyzing the consumption of VOD content at home. Addictive Behaviors Reports. 100336. 10.1016/j.abrep.2020.100336. 

72nd Annual ICA Conference: The More You Watch, the More You Get? Effects of Binge-Watching on Entertainment Experiences D.S. Wirz; M. Möri; A. Ort; J. A. Cordeiro; D. Castro Marino; A. Fahr. (Mass Communication Top Paper)

### Paper Citations

Chudasama, D. (2021). Current Thinking & Temperament Scenario in the Society. Omni Science: A Multi-disciplinary Journal, 11(1), 12-15p.

Huang, Y., Lv, Z., & Sui, Z. (2021, October). Where Should Existing Video Streaming Platforms Improve: A Comparative Analysis of Netflix and IQiyi. In 2021 International Conference on Public Relations and Social Sciences (ICPRSS 2021) (pp. 585-592). Atlantis Press.

Bernebée-Say, L. (2021). All You Can Watch! Will You?: The Association of Video on Demand Watching and Feelings of Guilt Over Time-An Experience Sampling Method Post-Hoc Research (Master's thesis, University of Twente).

Flayelle, M., & Lannoy, S. (2021). Binge behaviors: Assessment, determinants, and consequences. Addictive Behaviors Reports, 14.

Patel, D., & Chudasama, D. (2021). A Comparative Study about Consumer Protection in E-commerce. E-Commerce for Future & Trends. 2021; 8 (2): 1–3p. A Comparative Study about Consumer Protection in E-commerce Patel and Chudasama STM Journals, 7-9.

## Highlights

* BWDAT is a reliable tool that facilitates the study of viewing experience on VOD platforms.

* Collects users’ physiological data and users’ interactions with Netflix interface.

* Non-intrusive and easy to use, successfully used in long-term projects with more than 200 users.

* Includes a graphical display of the viewing sessions to help researchers visualize the data.

* Includes an automatic report generator and data exporter for multiple platforms.


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