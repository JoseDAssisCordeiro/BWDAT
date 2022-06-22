let url = new URL(window.location.href);
let searchParams = new URLSearchParams(url.search);
if(searchParams.get('alert'))
	alert(searchParams.get('alert'));
