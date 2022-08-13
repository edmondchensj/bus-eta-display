async function getETA() {
    // Call get-ETA API to fetch bus arrival timings
    console.log("Calling getETA API");
    const response = await fetch(_config.apiUrl.getETA, {
        method: 'POST', 
        cache: 'no-cache', 
        headers: {
        },
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
            "UserName": _config.env.getETAUserName,
            "Password": _config.env.getETAPassword
        })
    });
    console.log("response: ", response);
    return response;
}

export { getETA };