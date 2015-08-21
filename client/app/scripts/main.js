/*var React = require('react');
 var TodoApp = require('./components/HelloWorld.js');

 React.render(
 <TodoApp />,
 document.getElementById('app')
 );
 */

function changeFormat(usFormat) {
    var c = new Callendar(usFormat, '.date-table_content');
    c.buildCalendar();

    var heading = document.querySelector('.date-table_heading');
    if (usFormat) {
        var last = heading.children[heading.children.length - 1];
        heading.insertBefore(last, heading.children[0]);
    } else {
        var first = heading.children[0];
        heading.appendChild(first);

    }
}

// Functions for handling class adding/removing
var removeClass = function (el, someClass) {
    if (el.className) {
        el.className = el.className.split(' ').filter(function (i) {
            return i != someClass;
        }).join(' ');
    }

    return el;
};
var addClass = function (el, someClass) {
    if (!hasClass(el, someClass)) {
        var newClass = el.className.split(' ');
        newClass.push(someClass);
        el.className = newClass.join(" ");
    }
    return el;
};
var hasClass = function (el, someClass) {
    return (" " + el.className + " ").indexOf(" " + someClass + " ") > -1;
};
var whichTransitionEvent = function(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition':'transitionend',
        'OTransition':'oTransitionEnd',
        'MozTransition':'transitionend',
        'WebkitTransition':'webkitTransitionEnd'
    };

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
};


var Callendar = function (usBased, selector, date) {
    var prevBtn = document.querySelector(".prev-btn");
    var nextBtn = document.querySelector(".next-btn");
    var dragData, dates = [];
    var dragEl = document.createElement('div');
    dragEl.className = "select-el";

    this.usBased = usBased || false;
    this.inProgress = false;
    this.today = date ? new Date(date) : new Date();
    this.container = document.querySelector(selector);
    this.container.innerHTML = "";
    this.container.appendChild(dragEl);

    this.bindEvents = function () {
        prevBtn.addEventListener('click', this.changeMonth.bind(this));
        nextBtn.addEventListener('click', this.changeMonth.bind(this));

        this.container.addEventListener('mousedown', startDrag);
        document.body.addEventListener('mousemove', drag);
        document.body.addEventListener('mouseup', stopDrag);
    };

    this.buildCalendar = function () {
        var self = this;
        this.inProgress = true;
        this.currentDate = this.today;

        this.createMonth(this.today);

        addClass(this.container.children[0], 'animate--from-bottom');

        setTimeout(function () {
            self.inProgress = false;
            removeClass(self.container.children[0], 'animate--from-bottom');
        }, 300);

        this.bindEvents();
        this.getDatePos();
    };

    function startDrag(ev) {
        if (!dragData) {
            ev = ev || event;
            dragData = {
                x: ev.clientX,
                y: ev.clientY
            };

            dragEl.style.top = dragData.y + "px";
            dragEl.style.left = dragData.x + "px";
        }
    }

    function drag(ev) {
        if (dragData && (ev.clientX !== dragData.x && ev.clientY !== dragData.y)) {
            ev = ev || event;
            if (ev.clientX > dragData.x) {
                dragEl.style.marginLeft = 0;
            } else {
                dragEl.style.marginLeft = ev.clientX - dragData.x + "px";
            }

            if (ev.clientY > dragData.y) {
                dragEl.style.marginTop = 0;
            } else {
                dragEl.style.marginTop = ev.clientY - dragData.y + "px";
            }

            dragEl.style.zIndex = 880;
            dragEl.style.display = "block";
            dragEl.style.width = Math.abs(ev.clientX - dragData.x) + "px";
            dragEl.style.height = Math.abs(ev.clientY - dragData.y) + "px";

            var selectedPos = getElPos(dragEl);
            setActive(selectedPos);
        }
    }

    function stopDrag(ev) {
        if (dragData) {
            ev = ev || event;

            var selectedPos = getElPos(dragEl);

            dragEl.setAttribute('style', 'display:none');
            setActive(selectedPos);
            dragData = null;
        }
    }

    function setActive(elPos) {
        var setActiveEls = dates.filter(function (el) {
            removeClass(el.selector, "date--selected");
            if (elPos.top < el.position.bottom
                && elPos.bottom > el.position.top
                && elPos.left < el.position.right
                && elPos.right > el.position.left) {
                return true;
            }
        });

        setActiveEls.map(function (el) {
            addClass(el.selector, "date--selected");
        });
    }

    function getElPos(el) {
        var rect = el.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            right: rect.left + rect.width,
            bottom: rect.top + rect.height,
            width: rect.width,
            height: rect.height
        };
    }

   this.getDatePos = function(){
       var self = this;
       dates = [];

        [].forEach.call(document.querySelectorAll(".date"), function (el, index) {
            if (hasClass(el, "date--empty")) return;
            dates.push({
                selector: el,
                position: getElPos(el)
            });
        });

        console.log(dates);
   };
};

Callendar.prototype.setDates = function () {
    var today = this.today.toLocaleString('en-US', {month: 'long', year: 'numeric', day: 'numeric'});
    var current = this.currentDate.toLocaleString('en-US', {month: 'long', year: 'numeric'});

    document.querySelector('.today-date').innerHTML = today;
    document.querySelector('.current-date').innerHTML = current;
};

Callendar.prototype.createMonth = function () {
    var self = this,
        month = document.createElement('div'),
        date = this.currentDate,
        currentWeek;

    addClass(month, 'dates-month animate');

    this.container.appendChild(month);

    var currentMonth = date.getMonth(),
        currentYear = date.getFullYear(),
        days = date.monthDays() - 1,
        firstMonthDayNumber = this.usBased ? date.firstDayNumber() : (date.firstDayNumber() != 0 ? date.firstDayNumber() - 1 : 6),
        lastDayNumber = this.usBased ? date.lastDayNumber() : (date.lastDayNumber() != 0 ? date.lastDayNumber() - 1 : 6);

    var numberOfDaysWithLast = days + firstMonthDayNumber,
        numberOfDays = numberOfDaysWithLast + 7 - lastDayNumber,
        dayNumber = 0;


    for (var i = 0; i < numberOfDays; i++) {
        var day = document.createElement('div');

        if (i % 7 == 0) {
            currentWeek = document.createElement('div');
            addClass(currentWeek, 'dates-week');
            month.appendChild(currentWeek);
        }

        if (i > numberOfDaysWithLast || i < firstMonthDayNumber) {
            addClass(day, 'date date--empty');
            currentWeek.appendChild(day);
            continue;
        }

        addClass(day, 'date');
        day.setAttribute('data-date', (dayNumber + 1) + "" + (currentMonth + 1) + currentYear);
        day.innerHTML = dayNumber + 1;

        if (dayNumber == this.today.getDate() - 1 && date.getMonth() == this.today.getMonth() && date.getFullYear() == this.today.getFullYear()) {
            addClass(day, 'date--current');
        }

        dayNumber++;
        currentWeek.appendChild(day);
    }

    [].forEach.call(document.querySelectorAll(".date"), function (el) {
        if (hasClass(el, "date--empty")) return;
        el.addEventListener('click', self.showModal.bind(self), false);
    });

    this.setDates();
};

Callendar.prototype.changeMonth = function (e) {
    if (this.inProgress) return false;

    var self = this;
    this.inProgress = true;
    var currentMonth, outClass, inClass;
    var increaseMonth = hasClass(e.target, "next-btn");

    if (increaseMonth) {
        currentMonth = this.currentDate.getMonth() + 1;
        outClass = "animate--right";
        inClass = "animate--from-left";
    } else {
        currentMonth = this.currentDate.getMonth() - 1;
        outClass = "animate--left";
        inClass = "animate--from-right";
    }

    this.currentDate = new Date(this.currentDate.getFullYear(), currentMonth);

    this.createMonth();

    var months = this.container.querySelectorAll('.dates-month');
    addClass(months[0], outClass);
    addClass(months[1], inClass);

    this.container.style.height = this.container.querySelectorAll('.dates-month')[1].clientHeight + "px";

    setTimeout(function () {
        months[0].remove();
        removeClass(months[1], inClass);
        self.inProgress = false;
    }, 350);

    var transitionEvent = whichTransitionEvent();
    transitionEvent && months[1].addEventListener(transitionEvent, function() {
        self.getDatePos();
    });
};

Callendar.prototype.showModal = function (e) {
    e.preventDefault();
    e.stopPropagation();

    var modalWrapper = document.querySelector('.modal-wrapper'),
        modalBody = document.querySelector('.modal-body'),
        modalOverlay = document.querySelector('.modal-overlay');

    addClass(modalWrapper, "opened");

    modalBody.focus();
    modalBody.innerHTML = "<h3>" + e.target.getAttribute("data-date") + "</h3>";

    modalOverlay.addEventListener('click', function () {
        removeClass(modalWrapper, "opened");
    });
};

var c = new Callendar(false, '.date-table_content');

Date.prototype.monthDays = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDate();
};

Date.prototype.firstDayNumber = function () {
    var d = new Date(this.getFullYear(), this.getMonth(), 1);
    return d.getDay();
};

Date.prototype.lastDayNumber = function () {
    var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
    return d.getDay();
};

window.onload = c.buildCalendar();