
import { getETA } from "./api.js"
import { getLocalTime, setLoaders } from "./utils.js"
import { dummyData } from "./constants.js"

async function runGetETA(useDummyData=false) {
    setLoaders();

    var data = null
    var statusCode = null;

    if (useDummyData) {
        data = dummyData;
        console.log("Dummy data: ", data);
    } else {
        // Call API to fetch bus ETAs
        const resp = await getETA();
        if (resp.ok) {
            console.log("API call successful");
            data = await resp.json();
            console.log("Data: ", data);
        } else {
            statusCode = resp.status;
            console.log("API call failed: ", statusCode);
        }
    }

    // Load ETAs in HTML
    const terminalIdOrder = ["terminal-1", "terminal-3", "terminal-4", "landside-t1", "landside-t3", "landside-t4-arr"]

    // Loop through each terminal
    for (let i=0; i < terminalIdOrder.length; i++) {
        const terminalId = terminalIdOrder[i];
        document.getElementById(terminalId).innerHTML = "" // clear HTML

        if (data != null) {
            const etaData = data.busETA[i].etaData;
            if (etaData.length == 0) {
                // No buses arriving
                document.getElementById(terminalId).innerHTML = `
                        <div class="font-weight-light">Sorry, no buses are arriving</div>
                    `
            } else {
                // Display bus ETAs
                for (let j=0; j < etaData.length; j++) {
                    document.getElementById(terminalId).innerHTML += `
                            <div class="row justify-content-center my-1">
                                <span class="mx-0 badge badge-secondary py-2">
                                ${etaData[j].busLicensePlate}</span>
                                <span class="ml-2 font-weight-light">${etaData[j].etaMinutes} min </span>
                            </div>
                        `
                }
            }
        } else {
            // Display error code
            document.getElementById(terminalId).innerHTML = `
                    <div class="row justify-content-center text-danger font-weight-light">An error occurred with the API call</div>
                    <div class="row justify-content-center text-muted font-weight-light">(status code ${statusCode})</div>
                `
        }        
    }

    // Set timestamp
    const timestamp = getLocalTime();
    document.getElementById("last-update-ts").innerText = "Last updated " + timestamp;

}

export { runGetETA };