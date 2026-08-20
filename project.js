
/* =====================================================
   BOOKLY - BOOKING SYSTEM
   Pure Vanilla JavaScript
===================================================== */


/* =====================================================
   1. BOOKING DATA
===================================================== */

const services = {
    haircut: {
        name: "Haircut",
        duration: "30 min",
        price: 20,
        icon: "fa-scissors"
    },

    beard: {
        name: "Beard Trim",
        duration: "20 min",
        price: 15,
        icon: "fa-user"
    },

    color: {
        name: "Hair Color",
        duration: "60 min",
        price: 45,
        icon: "fa-paintbrush"
    },

    shave: {
        name: "Shave",
        duration: "20 min",
        price: 12,
        icon: "fa-razor"
    }
};


/* =====================================================
   2. AVAILABLE TIME SLOTS
===================================================== */

const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM"
];


/* =====================================================
   3. BOOKING STATE
===================================================== */

const booking = {

    service: null,

    date: null,

    time: null,

    currentMonth: new Date(2026, 4, 1)

};


/* =====================================================
   4. DOM ELEMENTS
===================================================== */

const serviceCards =
    document.querySelectorAll(".service-card");

const calendarDays =
    document.querySelector(".calendar-days");

const calendarTitle =
    document.querySelector(".calendar-header strong");

const previousMonthButton =
    document.querySelector(".calendar-arrow:first-child");

const nextMonthButton =
    document.querySelector(".calendar-arrow:last-child");

const timeGrid =
    document.querySelector(".time-grid");

const summaryService =
    document.querySelector(".summary-service");

const summaryDetails =
    document.querySelector(".summary-details");

const summaryTotal =
    document.querySelector(".summary-total strong");

const continueButton =
    document.querySelector(".continue-button");

const confirmation =
    document.querySelector(".confirmation");

const viewBookingsButton =
    document.querySelector(".view-bookings");


/* =====================================================
   5. SERVICE SELECTION
===================================================== */

serviceCards.forEach((card) => {

    card.addEventListener("click", () => {

        /*
            Get the service based on the card position.
        */

        const cards = Array.from(serviceCards);

        const index = cards.indexOf(card);

        const serviceIds = [
            "haircut",
            "beard",
            "color",
            "shave"
        ];

        const serviceId = serviceIds[index];

        selectService(serviceId);

    });

});


function selectService(serviceId) {

    const selectedService = services[serviceId];

    if (!selectedService) {
        return;
    }

    /*
        Save selected service.
    */

    booking.service = serviceId;


    /*
        Remove active class from all cards.
    */

    serviceCards.forEach((card) => {

        card.classList.remove("active");

        const check = card.querySelector(".service-check");

        if (check) {
            check.remove();
        }

    });


    /*
        Find selected card.
    */

    const serviceIds = [
        "haircut",
        "beard",
        "color",
        "shave"
    ];

    const selectedIndex =
        serviceIds.indexOf(serviceId);

    const selectedCard =
        serviceCards[selectedIndex];


    /*
        Activate selected card.
    */

    selectedCard.classList.add("active");


    /*
        Add check icon.
    */

    const check = document.createElement("span");

    check.className =
        "service-check absolute -top-[7px] -right-[7px] w-[22px] h-[22px] flex items-center justify-center bg-[#2867d7] border-2 border-white rounded-full text-white text-[10px]";

    check.innerHTML =
        `<i class="fa-solid fa-check"></i>`;

    selectedCard.appendChild(check);


    /*
        Update summary.
    */

    updateSummary();


    /*
        Update button state.
    */

    updateContinueButton();

}


/* =====================================================
   6. CALENDAR
===================================================== */

function renderCalendar() {

    /*
        Clear existing days.
    */

    calendarDays.innerHTML = "";


    const year =
        booking.currentMonth.getFullYear();

    const month =
        booking.currentMonth.getMonth();


    /*
        Month name.
    */

    const monthName =
        booking.currentMonth.toLocaleString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    calendarTitle.textContent = monthName;


    /*
        First day of the month.

        0 = Sunday
        1 = Monday
        etc.
    */

    const firstDay =
        new Date(year, month, 1).getDay();


    /*
        Number of days in current month.
    */

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    /*
        Number of days in previous month.
    */

    const daysInPreviousMonth =
        new Date(year, month, 0).getDate();


    /*
        Previous month's days.
    */

    for (let i = firstDay - 1; i >= 0; i--) {

        const day =
            daysInPreviousMonth - i;

        const element =
            document.createElement("span");

        element.className =
            "muted w-[30px] h-[30px] justify-self-center flex items-center justify-center bg-transparent border-none rounded-full text-[#cbd5e1] text-[11px] cursor-default";

        element.textContent = day;

        calendarDays.appendChild(element);

    }


    /*
        Current month's days.
    */

    for (let day = 1; day <= daysInMonth; day++) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "w-[30px] h-[30px] justify-self-center flex items-center justify-center bg-transparent border-none rounded-full text-[#475569] text-[11px] cursor-pointer transition-colors duration-200 hover:bg-[#eff6ff] hover:text-[#2867d7] [&.selected]:bg-[#2867d7] [&.selected]:text-white [&.selected]:hover:bg-[#1f56bd]";

        button.textContent = day;


        /*
            Create date string.

            Example:
            2026-05-15
        */

        const dateString =
            formatDate(year, month, day);

        button.dataset.date = dateString;


        /*
            If this date is selected,
            add selected class.
        */

        if (booking.date === dateString) {

            button.classList.add("selected");

        }


        /*
            Date click.
        */

        button.addEventListener("click", () => {

            selectDate(dateString);

        });


        calendarDays.appendChild(button);

    }


    /*
        Fill remaining cells with next month's days.

        This keeps the calendar visually consistent.
    */

    const totalCells =
        calendarDays.children.length;

    const remaining =
        Math.ceil(totalCells / 7) * 7 - totalCells;


    for (let day = 1; day <= remaining; day++) {

        const element =
            document.createElement("span");

        element.className =
            "muted w-[30px] h-[30px] justify-self-center flex items-center justify-center bg-transparent border-none rounded-full text-[#cbd5e1] text-[11px] cursor-default";

        element.textContent = day;

        calendarDays.appendChild(element);

    }

}


/* =====================================================
   7. FORMAT DATE
===================================================== */

function formatDate(year, month, day) {

    const monthNumber =
        String(month + 1).padStart(2, "0");

    const dayNumber =
        String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;

}


/* =====================================================
   8. DISPLAY DATE
===================================================== */

function formatDisplayDate(dateString) {

    if (!dateString) {
        return "Not selected";
    }


    const date =
        new Date(`${dateString}T00:00:00`);


    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* =====================================================
   9. SELECT DATE
===================================================== */

function selectDate(dateString) {

    booking.date = dateString;


    /*
        Re-render calendar so the selected
        date receives the active class.
    */

    renderCalendar();


    /*
        Update summary.
    */

    updateSummary();


    /*
        Update button.
    */

    updateContinueButton();

}


/* =====================================================
   10. PREVIOUS MONTH
===================================================== */

previousMonthButton.addEventListener("click", () => {

    booking.currentMonth.setMonth(
        booking.currentMonth.getMonth() - 1
    );

    renderCalendar();

});


/* =====================================================
   11. NEXT MONTH
===================================================== */

nextMonthButton.addEventListener("click", () => {

    booking.currentMonth.setMonth(
        booking.currentMonth.getMonth() + 1
    );

    renderCalendar();

});


/* =====================================================
   12. TIME SLOTS
===================================================== */

function renderTimeSlots() {

    timeGrid.innerHTML = "";


    timeSlots.forEach((time) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "time-slot min-h-[44px] bg-white border border-[#e8edf5] rounded-[7px] text-[#475569] text-xs font-medium cursor-pointer transition-colors duration-200 hover:border-[#b9cdf5] hover:text-[#2867d7] [&.selected]:border-[#2867d7] [&.selected]:bg-[#eff6ff] [&.selected]:text-[#2867d7] [&.selected]:shadow-[0_0_0_1px_#2867d7]";

        button.textContent = time;


        /*
            Mark selected time.
        */

        if (booking.time === time) {

            button.classList.add("selected");

        }


        /*
            Select time.
        */

        button.addEventListener("click", () => {

            selectTime(time);

        });


        timeGrid.appendChild(button);

    });

}


/* =====================================================
   13. SELECT TIME
===================================================== */

function selectTime(time) {

    booking.time = time;


    /*
        Update selected button.
    */

    document
        .querySelectorAll(".time-slot")
        .forEach((button) => {

            button.classList.remove("selected");

            if (button.textContent === time) {

                button.classList.add("selected");

            }

        });


    /*
        Update summary.
    */

    updateSummary();


    /*
        Update button.
    */

    updateContinueButton();

}


/* =====================================================
   14. UPDATE SUMMARY
===================================================== */

function updateSummary() {

    /*
        Service summary
    */

    if (booking.service) {

        const service =
            services[booking.service];


        summaryService.innerHTML = `

            <div class="summary-service-icon w-10 h-10 shrink-0 flex items-center justify-center bg-[#eff6ff] rounded-full text-[#2867d7] text-base">

                <i class="fa-solid ${service.icon}"></i>

            </div>

            <div class="flex flex-col gap-[3px]">

                <strong class="text-[#1e293b] text-sm font-bold">
                    ${service.name}
                </strong>

                <span class="text-[#94a3b8] text-xs">
                    ${service.duration}
                </span>

            </div>

        `;

    } else {

        summaryService.innerHTML = `

            <div class="summary-service-icon w-10 h-10 shrink-0 flex items-center justify-center bg-[#eff6ff] rounded-full text-[#2867d7] text-base">

                <i class="fa-solid fa-scissors"></i>

            </div>

            <div class="flex flex-col gap-[3px]">

                <strong class="text-[#1e293b] text-sm font-bold">
                    Select a service
                </strong>

                <span class="text-[#94a3b8] text-xs">
                    -
                </span>

            </div>

        `;

    }


    /*
        Date / time / price
    */

    const dateText =
        booking.date
            ? formatDisplayDate(booking.date)
            : "Not selected";


    const timeText =
        booking.time
            ? booking.time
            : "Not selected";


    const price =
        booking.service
            ? services[booking.service].price
            : 0;


    summaryDetails.innerHTML = `

        <div class="summary-row flex items-center justify-between gap-5">

            <span class="text-[#64748b] text-[13px]">
                Date
            </span>

            <strong class="text-[#475569] text-[13px] font-medium text-right">
                ${dateText}
            </strong>

        </div>


        <div class="summary-row flex items-center justify-between gap-5">

            <span class="text-[#64748b] text-[13px]">
                Time
            </span>

            <strong class="text-[#475569] text-[13px] font-medium text-right">
                ${timeText}
            </strong>

        </div>


        <div class="summary-row flex items-center justify-between gap-5">

            <span class="text-[#64748b] text-[13px]">
                Price
            </span>

            <strong class="text-[#475569] text-[13px] font-medium text-right">
                $${price.toFixed(2)}
            </strong>

        </div>

    `;


    /*
        Update total.
    */

    summaryTotal.textContent =
        `$${price.toFixed(2)}`;

}


/* =====================================================
   15. CONTINUE BUTTON STATE
===================================================== */

function updateContinueButton() {

    const ready =
        booking.service &&
        booking.date &&
        booking.time;


    continueButton.disabled = !ready;


    if (ready) {

        continueButton.style.opacity = "1";

        continueButton.style.cursor = "pointer";

    } else {

        continueButton.style.opacity = "0.5";

        continueButton.style.cursor = "not-allowed";

    }

}


/* =====================================================
   16. CONTINUE BOOKING
===================================================== */

continueButton.addEventListener("click", () => {

    /*
        Don't continue if incomplete.
    */

    if (
        !booking.service ||
        !booking.date ||
        !booking.time
    ) {

        alert(
            "Please select a service, date, and time."
        );

        return;

    }


    /*
        Get selected service.
    */

    const service =
        services[booking.service];


    /*
        Show confirmation.
    */

    confirmation.style.display = "flex";


    /*
        Update confirmation content.
    */

    const confirmationHeading =
        confirmation.querySelector("h3");

    const confirmationText =
        confirmation.querySelector("p");


    confirmationHeading.textContent =
        "Booking confirmed!";


    confirmationText.textContent =
        `${service.name} on ${formatDisplayDate(booking.date)} at ${booking.time}.`;


    /*
        Scroll confirmation into view.
    */

    confirmation.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });


    /*
        Save booking locally.

        This is NOT a database.
        It only stores it in the browser.
    */

    saveBooking();

});


/* =====================================================
   17. SAVE BOOKING TO LOCAL STORAGE
===================================================== */

function saveBooking() {

    const service =
        services[booking.service];


    const newBooking = {

        service: service.name,

        duration: service.duration,

        price: service.price,

        date: booking.date,

        time: booking.time,

        createdAt: new Date().toISOString()

    };


    /*
        Get existing bookings.
    */

    const existingBookings =
        JSON.parse(
            localStorage.getItem("booklyBookings")
        ) || [];


    /*
        Add new booking.
    */

    existingBookings.push(newBooking);


    /*
        Save again.
    */

    localStorage.setItem(
        "booklyBookings",
        JSON.stringify(existingBookings)
    );

}


/* =====================================================
   18. VIEW MY BOOKINGS
===================================================== */

viewBookingsButton.addEventListener("click", (event) => {

    event.preventDefault();


    const bookings =
        JSON.parse(
            localStorage.getItem("booklyBookings")
        ) || [];


    if (bookings.length === 0) {

        alert("You don't have any bookings yet.");

        return;

    }


    /*
        For now, show the bookings in a simple
        browser alert.

        Later we can create a proper
        "My Bookings" page.
    */

    const message =
        bookings
            .map((item, index) => {

                return `
${index + 1}. ${item.service}
${item.date} at ${item.time}
$${item.price.toFixed(2)}
                `;

            })
            .join("\n");


    alert(
        `Your Bookings:\n\n${message}`
    );

});


/* =====================================================
   19. INITIALIZE BOOKING SYSTEM
===================================================== */

function initializeBooking() {

    /*
        Hide confirmation initially.
    */

    confirmation.style.display = "none";


    /*
        Render calendar.
    */

    renderCalendar();


    /*
        Render time slots.
    */

    renderTimeSlots();


    /*
        Update summary.
    */

    updateSummary();


    /*
        Update continue button.
    */

    updateContinueButton();

}


/* =====================================================
   20. START
===================================================== */

initializeBooking();7