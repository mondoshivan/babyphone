// The localStorage and sessionStorage properties allow to save key/value pairs in a web browser.
// The localStorage object stores data with no expiration date.
// The data will not be deleted when the browser is closed, and will be available the next day, week, or year.
// The localStorage property is read-only.
// Tip: Also look at the sessionStorage property which stores data for one session (data is lost when the browser tab is closed).


function clickCounter() {
    if (typeof (Storage) === "undefined") {
        document.getElementById("result").innerHTML = "Your Browser does not support web storage!";
    } else {
        localStorage.clickCount = !localStorage.clickCount ? 1 : Number(localStorage.clickCount) + 1;
        document.getElementById("result").innerText = `clicked ${localStorage.clickCount} time(s).`;
    }
}


let number;
let key;
let value;

// Property
Storage.length;

// When passed a number n, this method will return the name of the nth key in the storage.
number = 0;
localStorage.key(number);

// When passed a key name, will return that's key value
key = 'some name';
localStorage.getItem(key);

// When passed a key name and value, will add that key to the storage or update that key's value if exists.
key = 'some name';
value = 'some value';
localStorage.setItem(key, value);

// When passed a key name, it will remove the key from the storage.
key = 'some name';
localStorage.removeItem(key);

localStorage.clear();