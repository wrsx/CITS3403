if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun/*, thisArg*/) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

function intersect(a,b){
  var t;
  if(b.length > a.length) t =b, b=a, a=t;
  return a.filter(function(e){
    return b.indexOf(e) > -1;
  });
}


window.onload = function() {

	if (document.getElementsByTagName("body")[0].className.match("control")) { //Only for user panel page
		var subUnits = document.getElementById('unitSubmit'); //Unit submit button
		var subDays = document.getElementById('availSubmit'); //Availability submit button
		var unitEditBtn = document.getElementById("unit-edit-btn"); //Edit units button
		var expEditBtn = document.getElementById("edit-exp"); //Edit experience button
		var availabilityEditBtn = document.getElementById("availability-edit-btn"); //Edit availability buttion
		var dayBoxes = document.getElementsByClassName('day'); //All availability day checkboxes


    /**
		 * Handler for making a unit selection
      */
    $('#unit-searchbox').on('click', '.tt-suggestion', function(){
    	var unitExists = false;
      var unitName = this.innerText;
      var curUnits = $('#unitlist').children(); //current unit list
			//if units exist
			curUnits.each(function () {
				//if names match, dont add unit
				if (unitName == $("label", this).contents().get(1).nodeValue) {
          unitExists = true;
        }
			});
      if (!unitExists) {
        $('#unitlist').append('<li><label><button class="button modify removeUnit">X</button>'+ unitName + '</label></li>')
			}
      $('#unit-search').typeahead('val', ''); //clear the search bar
    });

    /**
		 * Search selecting with keyboard
     */
    $('#unit-searchbox').on('keyup', function(e) {
      if(e.which == 13) {
        var keyed = $('#unit-searchbox').find('.tt-cursor');
        if(keyed.length > 0) {
          keyed.trigger('click');
        }
        else { $(".tt-suggestion:first-child", this).trigger('click'); }
      }
    });

    /**
		 * Handler for removing a unit
     */
    $('#unitlist').on('click', '.removeUnit', function() {
    	this.closest('li').remove();
		});

    /**
		 * Typeahead searchbar backend request
     */
    $(function () {
      $('#unit-search').typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          limit: Infinity,
          async: true,
          source: function (query, processSync, processAsync) {
            return $.ajax({
              url: "/search_unit",
              type: 'GET',
              data: {query: query},
              dataType: 'json',
              success: function (json) {
                return processAsync(json);
              }
            });
          }
        });
    });

    /**
     * Display the unit selector modal
     */
    unitEditBtn.onclick = function() {
      document.getElementById('unitModal').style.display = "block";
    }

    /**
     * Display the availability selector modal
     */
    availabilityEditBtn.onclick = function() {
      document.getElementById('availabilityModal').style.display = "block";
    }

    /**
		 * Handler for "edit mode" experience entries
     */
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

    /**
		 * Remove experience entry
     */
		function syncRemoves(e) {
			var removeBtns = experience.getElementsByClassName('removeExp');
			for (var i=0; i<removeBtns.length; i++) {
				removeBtns[i].onclick = function(e) {
					var entry = e.target.parentElement.parentElement;
					entry.parentElement.removeChild(entry);
					if (experience.childNodes[0].getElementsByTagName("li").length == 0) {
						vacantText(e.target);
						vacantExp = true;
					}
				}
			}
		}
		syncRemoves();

    /**
		 * Add experience entry
     */
		var addBtn = document.getElementById('add-exp');
		addBtn.onclick = function() {
			if (vacantExp) { experience.childNodes[0].innerHTML = "" }
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
			experience.childNodes[0].appendChild(newListItem);
			vacantExp = false;
			syncRemoves();
		}

    /**
     * Change bg of selected units
     */
    var unitBoxes = document.getElementsByClassName("unit-checkbox");
    for (var i=0; i<unitBoxes.length; i++) {
      unitBoxes[i].addEventListener('change', function() {
        if (this.checked) {
          this.parentElement.parentElement.style.backgroundColor = '#eaeaea';
        } else {
          this.parentElement.parentElement.style.backgroundColor = '#fff';
        }
      });
    }

    /**
		 * Submit availability handler
     */
		subDays.onclick = function(e) {
			var finalized = 1;
			var noAdded = 0;
			clearItems(e.target);
			for (var i=0; i<dayBoxes.length; i++) {
				if (dayBoxes[i].checked) {
					var insert = {
						dayName: dayBoxes[i].parentElement.parentElement.childNodes[0].innerText,
						timeFrame: dayBoxes[i].parentElement.parentElement.childNodes[1].cloneNode(true),
						lowerTime: dayBoxes[i].parentElement.parentElement.childNodes[1].childNodes[0],
						upperTime: dayBoxes[i].parentElement.parentElement.childNodes[1].childNodes[2]
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

    /**
		 * Submit unit handler
     */
		subUnits.onclick = function(e) {
			var noAdded = 0;
			clearItems(e.target);
      for (var i=0; i<unitBoxes.length; i++) {
				if (unitBoxes[i].checked) {
					addItem(e.target, unitBoxes[i].parentElement.innerText);
					noAdded++;
				}
      }
			if (noAdded == 0) {
				vacantText(e.target);
			}
			openModal.style.display = "none";
		}

     /**
		 * Removes all items from the callers list
     */
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


		/**
		 * Adds item 'itemContent' to the callers list
		 * We handle how itemContent should be added by checking the callers ID
		 */
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

    /**
		 * Adds vacant text to the item list
     */
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
				var expList = experience.childNodes[0];
				newItemDiv.appendChild(node);
				expList.appendChild(newListItem);
			}
		}

    /**
		 * Handler to open dropdowns
     */
		var dropdowns = document.getElementsByClassName("dropdown");
		for (var i=0; i<dropdowns.length; i++) {
				dropdowns[i].addEventListener("click", function(e) {
					if (e.target && !e.target.parentElement.classList.contains("inactive")) {
						if (typeof openDropDown != "undefined") {
							openDropDown.classList.remove('show');
							e.target.parentElement.childNodes[1].classList.toggle("show");
						}
						else {
							e.target.parentElement.childNodes[1].classList.toggle("show");
						}
					}
				});
		}

    /**
		 * Handles when a specific time is selected
		 * Updates dropdown button text & activates/deactivates buttons under certain conditions
     */
		var times = document.getElementsByClassName("drop-content");
		for (var i=0; i<times.length; i++) {
			times[i].addEventListener("click", function(e) {
        if (e.target.tagName.toLowerCase() === 'a') { //if the click is valid
        	var buttonText = e.target.parentElement.parentElement.childNodes[0];
          var lowerTime = e.target.parentElement.parentElement.parentElement.childNodes[0];
          var upperTime = e.target.parentElement.parentElement.parentElement.childNodes[2];
          buttonText.innerText = e.target.innerText;
          if (buttonText.parentElement == lowerTime) {
            if (upperTime.classList.contains("inactive")) {
              upperTime.classList.toggle("inactive");
            }
            //remove elements that are not valid times
            updateTimes(e.target.innerText, upperTime);
          }
          else {
            upperTime.classList.toggle("inactive");
            lowerTime.classList.toggle("inactive");
          }
        }
			});
		}



     /**
		 * Updates a dropdown menu to only display times after chosenTime
     */
		function updateTimes(chosenTime, dropdown){
			var realTimes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
			var textTimes = ["00:00am", "1:00am","2:00am","3:00am","4:00am","5:00am","6:00am","7:00am","8:00am","9:00am","10:00am","11:00am","12:00pm","1:00pm","2:00pm","3:00pm","4:00pm","5:00pm","6:00pm","7:00pm","8:00pm","9:00pm","10:00pm","11:00pm","12:00am"];;
			var dropContent = dropdown.childNodes[1];
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

    /**
		 * Clears all children of a given element
     */
		function clearChildren(elemnt) {
			elemnt.innerHTML = '';
		}

    /**
		 * //Enables/disables avaibility buttons based on checkbox state
     */
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
						timeframe.childNodes[0].classList.toggle("inactive");
				}
				else {
					//reset to 0
					for (var i=0; i<timeframe.childNodes.length; i++) {
						if (timeframe.childNodes[i].nodeName == "DIV") {
							var dropdown = timeframe.childNodes[i];
							dropdown.childNodes[0].innerText = "0:00";
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
		var matches = matchList.getElementsByTagName('li'); //List of matches

		for (var i=0; i<matches.length; i++) {
			matches[i].addEventListener("click", function() {
				document.getElementById('sampleMatch').style.display = "block";
			})
		}

    /**
		 * Event handler for tab switching in match viewer
     */
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

    /**
		 * Gets the active tab number
     */
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

  /**
	 * Global modal setting - close button
   */
	for (var i=0; i < closes.length; i++) {
		var close = closes[i];
		close.onclick = function() {
			openModal.style.display = "none";
		}
	}

  /**
	 * Global 'click outside of anything to close' function
   */
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

  /**
	 * Returns open modal
   */
	function getOpenModal() {;
		for (var i=0; i < allModals.length; i++) {
			var curDisp = document.getElementsByClassName('modal')[i];
			if (curDisp.hasAttribute("style") && curDisp.style.display != "none") {
				return document.getElementsByClassName('modal')[i];
			}
		}
		return null;
	}

  /**
	 * Returns open dropdown
   */
	function getOpenDropdown() {
		var curDrop;
		for (var i=0; i<allDropDowns.length; i++) {
			curDrop = allDropDowns[i];
			if (curDrop.classList.contains('show')) {
				return curDrop;
			}
		}
	}

  /**
	 * Validates valid form entries
   */
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

  /**
	 * Return last modified time & date
   */
	document.getElementById("footer-lastmodified").innerHTML = "Last Modified: " + document.lastModified;

};
