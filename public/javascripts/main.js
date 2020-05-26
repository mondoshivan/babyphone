// register service worker

if ('serviceWorker' in navigator) {

    // The scope of the service worker determines which files the service worker controls,
    // in other words, from which path the service worker will intercept requests.
    // The default scope is the location of the service worker file, and extends to all directories below.
    // So if service-worker.js is located in the root directory,
    // the service worker will control requests from all files at this domain.

    // You can also set an arbitrary scope by passing in an additional parameter when registering.

    navigator.serviceWorker.register('/javascript/app/service-worker.js', { scope: '/javascript/app/' }).then(function(reg) {

        if(reg.installing) {
            console.log('Service worker installing');
        } else if(reg.waiting) {
            console.log('Service worker installed');
        } else if(reg.active) {
            console.log('Service worker active');
        }

    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

// function for loading each image via XHR
function imgLoad(imgJSON) {
    // return a promise for an image loading
    return new Promise(function(resolve, reject) {
        var request = new XMLHttpRequest();
        request.open('GET', imgJSON.url);
        request.responseType = 'blob';

        request.onload = function() {
            if (request.status == 200) {
                var arrayResponse = [];
                arrayResponse[0] = request.response;
                arrayResponse[1] = imgJSON;
                resolve(arrayResponse);
            } else {
                reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
            }
        };

        request.onerror = function() {
            reject(Error('There was a network error.'));
        };

        // Send the request
        request.send();
    });
}

var imgSection = document.querySelector('section');

window.onload = function() {

    // load each set of image, alt text, name and caption
    for(var i = 0; i<=Gallery.images.length-1; i++) {
        imgLoad(Gallery.images[i]).then(function(arrayResponse) {

            var myImage = document.createElement('img');
            var myFigure = document.createElement('figure');
            var myCaption = document.createElement('caption');
            var imageURL = window.URL.createObjectURL(arrayResponse[0]);

            myImage.src = imageURL;
            myImage.setAttribute('alt', arrayResponse[1].alt);
            myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit;

            imgSection.appendChild(myFigure);
            myFigure.appendChild(myImage);
            myFigure.appendChild(myCaption);

        }, function(Error) {
            console.log(Error);
        });
    }
};
