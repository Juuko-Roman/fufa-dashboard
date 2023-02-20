
		var darkbtnMode=document.getElementById("dark-btn");
		darkbtnMode.onclick=function() {
			darkbtnMode.classList.toggle("btn-on");
			document.body.classList.toggle("darktheme");
			if (localStorage.getItem("theme")=="light") {
				localStorage.setItem("theme","dark");
			}
			else{
				localStorage.setItem("theme","light");
			}

		}
		if (localStorage.getItem("theme")=="light") {
		
			
			document.body.classList.remove("darktheme");
			darkbtnMode.classList.remove("btn-on");
		}
		else if (localStorage.getItem("theme")=="dark") {
			
			
			document.body.classList.add("darktheme");
			darkbtnMode.classList.add("btn-on");
		}
		else{
			localStorage.setItem("theme","light");
		}

		