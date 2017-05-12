window.onload = function() {
	
	if (document.getElementsByTagName("body")[0].className.match("control")) { //Only for user panel page
		var subUnits = document.getElementById('unitSubmit'); //Unit submit button	
		var subDays = document.getElementById('availSubmit'); //Availability submit button
		var unitEditBtn = document.getElementById("unit-edit-btn"); //Edit units button
		var expEditBtn = document.getElementById("edit-exp"); //Edit experience button
		var cancelBtn = document.getElementById("cancel-exp"); //Cancel experience edit mode button
		var availabilityEditBtn = document.getElementById("availability-edit-btn"); //Edit availability buttion
		var dayBoxes = document.getElementsByClassName('day'); //All availability day checkboxes
		
		//Number of units; fetch from LMS
		var unitNo = 4;
		
		unitEditBtn.onclick = function() {
			document.getElementById('unitModal').style.display = "block";
		}
		
		availabilityEditBtn.onclick = function() {	
			document.getElementById('availabilityModal').style.display = "block";			
		}
		
		//Handler for "edit mode" experience entries
		var editToggle = false;
		var vacantExp;	
		var experience = document.getElementById('experience');
		expEditBtn.onclick = function(e) {
			var final = true;	
			var expHeaders = experience.getElementsByClassName('module-content-header');	
			var expContents = experience.getElementsByClassName('module-content-text');		
			var addBtn = document.getElementById("add-exp");
			var removeBars = document.getElementsByClassName("module-footer experience");
			if (editToggle == false) {			
				for (var i=0; i<expHeaders.length; i++) {
					var headerName = expHeaders[i].innerText;
					var contentText = expContents[i].innerText;
					expHeaders[i].innerHTML = '<textarea class="textHeader" rows="1" cols="62" maxlength = "50"></textarea>';
					expContents[i].innerHTML = '<textarea rows="8" cols="62"></textarea>';
					expHeaders[i].childNodes[0].value = headerName;
					expContents[i].childNodes[0].value = contentText;			
				}
				//Toggle + and - buttons
				addBtn.classList.toggle("active");
				for (var i=0; i<removeBars.length; i++) {
					removeBars[i].classList.toggle("active");
				}				
				expEditBtn.innerText=("Save");
				editToggle = !editToggle;			
			}
			else {
				for (var i=0; i<expHeaders.length; i++) {
					if (expHeaders[i].childNodes[0].value == '' || expContents[i].childNodes[0].value == '') {
						window.alert("Please fill out every field!");
						final = false;
					}
				}
				if (final) {
					for (var i=0; i<expHeaders.length; i++) {
					expHeaders[i].innerHTML = expHeaders[i].childNodes[0].value;
					expContents[i].innerHTML = expContents[i].childNodes[0].value;						
					}				
					addBtn.classList.toggle("active");
					for (var i=0; i<removeBars.length; i++) {
						removeBars[i].classList.toggle("active");
					}				
					expEditBtn.innerText=("Edit") 
					editToggle = !editToggle;	
				}
			}
		}
		
		//Remove experience entry
		function syncRemoves(e) {
			var removeBtns = experience.getElementsByClassName('removeExp');
			for (var i=0; i<removeBtns.length; i++) {
				removeBtns[i].onclick = function(e) {
					var entry = e.target.parentElement.parentElement;
					entry.parentElement.removeChild(entry);
					if (experience.childNodes[1].getElementsByTagName("li").length == 0) {
						vacantText(e.target);
						vacantExp = true;
					}		
				}
			}
		}
		syncRemoves();	
		
		//Add experience entry
		var addBtn = document.getElementById('add-exp');
		addBtn.onclick = function() {
			if (vacantExp) { experience.childNodes[1].innerHTML = "" }
			var newListItem = document.createElement("li");			
			var moduleContentHeader = document.createElement("div");
			moduleContentHeader.className = "module-content-header";
			var moduleContentText = document.createElement("div");
			moduleContentText.className = "module-content-text";
			var moduleFooter = document.createElement("div");
			moduleFooter.className = "module-footer experience active";
			moduleContentHeader.innerHTML = '<textarea class="textHeader" maxlength = "50" rows="1" cols="62"></textarea>';
			moduleContentText.innerHTML = '<textarea rows="8" cols="62"></textarea>';
			moduleFooter.innerHTML = '<button class="button modify removeExp">-</button>'
			newListItem.appendChild(moduleContentHeader);
			newListItem.appendChild(moduleContentText);
			newListItem.appendChild(moduleFooter);
			experience.childNodes[1].appendChild(newListItem);
			vacantExp = false;
			syncRemoves();	
		}
		
		//Change bg of selected units
		function changeBG(i) {
			if (document.getElementById('unit-checked' + i).checked) {
				document.getElementById('unit-single' + i).style.backgroundColor = '#eaeaea';
			} else {
				document.getElementById('unit-single' + i).style.backgroundColor = '#fff';
			}
		}
		
		//Assign change BG function to units
		//Badly written
		for (var i=1; i<unitNo+1; i++) {
			!function outer(ii){
				document.getElementById('unit-checked' + i).addEventListener('change', function(){changeBG(ii);} );
			}(i)
		}
		
		
		//Submit availability handler
		subDays.onclick = function(e) {
			var finalized = 1;
			var noAdded = 0;
			clearItems(e.target);
			for (var i=0; i<dayBoxes.length; i++) {
				if (dayBoxes[i].checked) {
					var insert = {
						dayName: dayBoxes[i].parentElement.parentElement.childNodes[1].innerText,
						timeFrame: dayBoxes[i].parentElement.parentElement.childNodes[3].cloneNode(true),
						lowerTime: dayBoxes[i].parentElement.parentElement.childNodes[3].childNodes[1],
						upperTime: dayBoxes[i].parentElement.parentElement.childNodes[3].childNodes[5]
					};
					if (insert.lowerTime.classList.contains('inactive') && insert.upperTime.classList.contains('inactive')) {
						addItem(e.target, insert);
						noAdded++;			
					}
					else { finalized = 0; }
				}
			}
			if (noAdded == 0) {
				vacantText(e.target);			
			}
			if (finalized == 1) { openModal.style.display = "none"; }
			else { alert("Select specify an availability time!"); }
		}
		
		//Submit unit handler
		subUnits.onclick = function(e) {
			var noAdded = 0;		
			clearItems(e.target);
			for (var i=1; i<unitNo+1; i++) {
				if (document.getElementById('unit-checked' + i).checked){
					addItem(e.target, document.getElementById('unit-checked' + i).parentElement.innerText);
					noAdded++;
				} 
			}
			if (noAdded == 0) {
				vacantText(e.target);
			}
			openModal.style.display = "none";
		}
		
		//Removes all items from the callers item list
		function clearItems(caller) {	
			var itemList;
			if (caller.id == "unitSubmit") {
				itemList = document.getElementById("unit-list");
			}
			else if (caller.id == "availSubmit") {
				itemList = document.getElementById("day-list");
			}
			clearChildren(itemList);
		}
		
		//Adds an item to the callers list
		function addItem(caller, itemContent) {
			var node;
			var newListItem = document.createElement("li");
			var newItemDiv = document.createElement("div");
			newItemDiv.className = "module-content-header";
			newListItem.appendChild(newItemDiv);
			if (caller.id == "unitSubmit") {
				node = document.createTextNode(itemContent);
				newItemDiv.appendChild(node);			
				var unitList = document.getElementById("unit-list");
				unitList.appendChild(newListItem);
			}
			else if (caller.id == "availSubmit") {
				node = document.createTextNode(itemContent.dayName);
				newItemDiv.appendChild(node);
				newListItem.appendChild(itemContent.timeFrame);
				var dayList = document.getElementById("day-list");
				dayList.appendChild(newListItem);
			}
		}
		
		//Adds vacant text to the item list
		function vacantText(caller) {				
			var newListItem = document.createElement("li");			
			var newItemDiv = document.createElement("div");
			var node;
			newItemDiv.className = "module-content-text vacantTxt";
			newListItem.appendChild(newItemDiv);
			if (caller.id == "unitSubmit") {
				node = document.createTextNode("No units selected!");
				var unitList = document.getElementById("unit-list");
				newItemDiv.appendChild(node);
				unitList.appendChild(newListItem);				
			}
			else if (caller.id == "availSubmit") { 
				node = document.createTextNode("No days selected!") 
				var dayList = document.getElementById("day-list");	
				newItemDiv.appendChild(node);	
				dayList.appendChild(newListItem);
			}
			else if (caller.id == "edit-exp" || caller.classList.contains('removeExp')) {
				node = document.createTextNode("No experience added!");
				var expList = experience.childNodes[1];
				newItemDiv.appendChild(node);
				expList.appendChild(newListItem);
			}
		}		
		
		//Handler to open dropdowns
		var dropdowns = document.getElementsByClassName("dropdown");
		for (var i=0; i<dropdowns.length; i++) {
				dropdowns[i].addEventListener("click", function(e) {
					if (e.target && !e.target.parentElement.classList.contains("inactive")) {
						if (typeof openDropDown != "undefined") {
							openDropDown.classList.remove('show');
							e.target.parentElement.childNodes[3].classList.toggle("show");
						}
						else {
							e.target.parentElement.childNodes[3].classList.toggle("show");
						}
					}
				});
		}		
				
		//Handles when a specific time is selected
		//Updates dropdown button text & activates/deactivates buttons under certain conditions
		var times = document.getElementsByClassName("drop-content");
		for (var i=0; i<times.length; i++) {
			times[i].addEventListener("click", function(e) {
					var buttonText = e.target.parentElement.parentElement.childNodes[1];
					var lowerTime = e.target.parentElement.parentElement.parentElement.childNodes[1];
					var upperTime = e.target.parentElement.parentElement.parentElement.childNodes[5];	
					if (e.target.tagName.toLowerCase() === 'a') {
						buttonText.innerText = e.target.innerText;
					}
					if(buttonText.parentElement == lowerTime) {
						if (upperTime.classList.contains("inactive")){ 
						upperTime.classList.toggle("inactive");
						}
						//remove elements that are not valid times
						updateTimes(e.target.innerText,upperTime);
					}
					else {
						upperTime.classList.toggle("inactive");
						lowerTime.classList.toggle("inactive");	
					}				
			});
		}
		
		//Updates a dropdown menu to only display times after chosenTime
		function updateTimes(chosenTime, dropdown){
			var realTimes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			var textTimes = ["00:00am", "1:00am","2:00am","3:00am","4:00am","5:00am","6:00am","7:00am","8:00am","9:00am","10:00am","11:00am","12:00pm","1:00pm","2:00pm","3:00pm","4:00pm","5:00pm","6:00pm","7:00pm","8:00pm","9:00pm","10:00pm","11:00pm","12:00am"];;
			var dropContent = dropdown.childNodes[3];	
			//upper bound
			for (var i=0; i<realTimes.length; i++) {
				if (chosenTime == "12:00am") { chosenTime = "00:00am" };
				if (chosenTime == textTimes[i]) {
					clearChildren(dropContent);
					for (var z=i+1; z<realTimes.length; z++) {
						var validTime = document.createElement("a");
						var node = document.createTextNode(textTimes[z]);	
						validTime.appendChild(node);
						dropContent.appendChild(validTime);				
					}
				}
			}
		}
		
		//Clears all children of a given element
		function clearChildren(elemnt) {
			elemnt.innerHTML = '';
		}		
		
		//Enables/disables avaibility buttons based on checkbox state			
		for (var i=0; i<dayBoxes.length; i++) {
			dayBoxes[i].addEventListener("change", function(e) {;
				var timeframe;
				var liElements = e.target.parentElement.parentElement.childNodes;
				for (var i=0; i<liElements.length; i++) {
					if (liElements[i].nodeName == "DIV") {
						timeframe = liElements[i];
					}
				}				
				if (e.target.checked) {
						timeframe.childNodes[1].classList.toggle("inactive");						
				}
				else { 
					//reset to 0
					for (var i=0; i<timeframe.childNodes.length; i++) {
						if (timeframe.childNodes[i].nodeName == "DIV") {
							var dropdown = timeframe.childNodes[i];
							dropdown.childNodes[1].innerText = "0:00";
							if (!dropdown.classList.contains("inactive")) {
								dropdown.classList.toggle("inactive");	
							}
						}
					}				
				}
				
			});
		}				
	}
	
	else if (document.getElementsByTagName("body")[0].className.match("matches")) { // Only for matches page
		var matchTabs = document.getElementsByClassName('match-tab'); //Match tabs on modal
		var matchList = document.getElementById('single-matches'); //List of matches	
		var matches = matchList.getElementsByTagName('li');
		var matchModal = document.getElementById('sampleMatch');
		
		for (var i=0; i<matches.length; i++) {
			matches[i].addEventListener("click", function() {
				document.getElementById('sampleMatch').style.display = "block";
			})
		}
	
		//Event handler for tab switching in match viewer
		for (var i=0; i<matchTabs.length; i++) {
			matchTabs[i].addEventListener("click", function(e) {
				var openTab = getActiveTab();
				sampleMatch.getElementsByClassName('tab-content')[openTab].classList.toggle('active');
				sampleMatch.getElementsByClassName('match-tab')[openTab].classList.toggle('active');	
				if (e.target.classList.contains("exp")) {
					sampleMatch.getElementsByClassName('exp')[0].classList.toggle('active');
					sampleMatch.getElementsByClassName('exp')[1].classList.toggle('active');
				}
				else if (e.target.classList.contains("avail")) {
					sampleMatch.getElementsByClassName('avail')[0].classList.toggle('active');
					sampleMatch.getElementsByClassName('avail')[1].classList.toggle('active');
				}
				else {
					sampleMatch.getElementsByClassName('units')[0].classList.toggle('active');
					sampleMatch.getElementsByClassName('units')[1].classList.toggle('active');
				}
			})
		}
		
		//Gets the active tab number
		function getActiveTab(){
			for (var i=0; i<matchTabs.length; i++) {
				var curTab = matchTabs[i];
				if (curTab.classList.contains("active")) {
					return i;
				}
			}
		}	
	}
	
	else if (document.getElementsByTagName("body")[0].className.match("index")) { // Only for index page
		var loginBtn = document.getElementById("loginBtn"); //Login button
		loginBtn.onclick = function() {
			document.getElementById('loginModal').style.display = "block";
		}
	}
	var allModals = document.getElementsByClassName('modal'); //All modal elements
	var allDropDowns = document.getElementsByClassName('drop-content'); //All dropdown elements	
	var closes = document.getElementsByClassName("close"); //All close buttons (for modals)
	
	//Global modal setting - close button		
	for (var i=0; i < closes.length; i++) {
		var close = closes[i];
		close.onclick = function() {
			openModal.style.display = "none";
		}
	}
	//Click outside modal/dropdown 
	window.onclick = function(event) {
		openModal = getOpenModal();	
		openDropDown = getOpenDropdown();
		if (event.target == openModal) {			
			openModal.style.display = "none";
		}	
		if (!event.target.matches('.drop-btn') && typeof openDropDown != "undefined") {
			openDropDown.classList.remove('show');
		}			
	}	

	//Returns open modal
	function getOpenModal() {;	
		for (var i=0; i < allModals.length; i++) {
			var curDisp = document.getElementsByClassName('modal')[i];
			if (curDisp.hasAttribute("style") && curDisp.style.display != "none") {
				return document.getElementsByClassName('modal')[i];
			}
		}
		return null;
	}
	
	//Returns open dropdown
	function getOpenDropdown() {
		var curDrop;
		for (var i=0; i<allDropDowns.length; i++) {
			curDrop = allDropDowns[i];
			if (curDrop.classList.contains('show')) {
				return curDrop;
			}
		}
	}
	
	//Validates valid form entries
	function validateSignUp() {
		var uname = document.forms["sign-up-form"]["uname"].value;
		if (!(/^(\d|\w)+$/.test(uname))) {
			alert("Username is invalid.");
			return false;
		}

		var fname = document.forms["sign-up-form"]["fname"].value;
		if (!(/^(\w)+$/.test(fname))) {
			alert("First Name is invalid.");
			return false;
		}

		var lname = document.forms["sign-up-form"]["lname"].value;
		if (!(/^(\w)+$/.test(lname))) {
			alert("Last Name is invalid.");
			return false;
		}

		var uni = document.forms["sign-up-form"]["uni"].value;
		if (!(/^(\w)+(\s\w+)*$/.test(uni))) {
			alert("Uni is invalid.");
			return false;
		}

		var email = document.forms["sign-up-form"]["email"].value;
		if (!(/^(\d|\w)+@\w*\.edu\.au$/.test(email))) {
			alert("Email is invalid.");
			return false;
		}
	}
	
	document.getElementById("footer-lastmodified").innerHTML = "Last Modified: " + document.lastModified;
	
};