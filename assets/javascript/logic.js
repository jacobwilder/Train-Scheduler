$(document).ready(function () {

    // Calls local time function
    displayTime();

    // Firebase initialization
    const config = {
        apiKey: "AIzaSyAIKr9qotSCVGYT7rk8cF6_MIUHzEOhDjY",
        authDomain: "bootcamp-project-c9367.firebaseapp.com",
        databaseURL: "https://bootcamp-project-c9367.firebaseio.com",
        projectId: "bootcamp-project-c9367",
        storageBucket: "",
        messagingSenderId: "583037498529",
        appId: "1:583037498529:web:e956580719b3358663ece0",
        measurementId: "G-7Q80J9NBTS"
    };
    firebase.initializeApp(config);

    // Setting firebase database variable
    var database = firebase.database();

    // Setting initial values of variables
    var train = "";
    var destination = "";
    var firstTime = "";
    var frequency = 0;

    // On click event for submit button
    $("#submit").on("click", function (event) {
        event.preventDefault();

        // Pulled values from text boxes
        train = $("#inputTrain").val().trim();
        destination = $("#inputDestination").val().trim();
        firstTime = $("#inputTrainTime").val().trim();
        frequency = $("#inputFrequency").val().trim();

        // Pushes submitted data to new child chain
        database.ref().push({
            train: train,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        })
    })

    // Function runs on each new child
    database.ref().on("child_added", function (childSnap) {

        // Captures new child data
        console.log(childSnap.val());
        console.log(childSnap.val().train);
        console.log(childSnap.val().destination);
        console.log(childSnap.val().firstTime);
        console.log(childSnap.val().frequency);

        firstTime = childSnap.val().firstTime;
        frequency = childSnap.val().frequency;

        // Converts input time to previous year, changes format
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Captures current time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Calculates difference between current time and input time
        var difference = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + difference);

        // Time apart between current time and next train
        var remainder = difference % frequency;
        console.log(remainder);

        // Calculates time until next train
        var tMinus = frequency - remainder;
        console.log("MINUTES TILL TRAIN: " + tMinus);

        // Calculates arrival time of next train
        var nextTrain = moment().add(tMinus, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Adding new table row on each new child and inputting converted data
        $("#table-body").append("<tr class='display'><td id='train-display'> " +
            childSnap.val().train +
            " </td><td id='destination-display'> " + childSnap.val().destination +
            " </td><td id='freq-display'> " + childSnap.val().frequency +
            " </td><td id='time-display'> " + moment(nextTrain).format("hh:mm") +
            " </td> +<td id='arrival'>" + tMinus + "</tr>");

    }, function (errorObject) {

        // Logs errors if any are detected
        console.log("Errors handled: " + errorObject.code);

    });

    // Function for displaying local time as jumbotron subtitle
    function displayTime() {
        var time = moment().format('HH:mm:ss');
        $(".lead").html("Local Time: " + time);
        setTimeout(displayTime, 1000);
    }
})