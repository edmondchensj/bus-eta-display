
import { getETA } from "./api.js"
import { getLocalTime, setLoaders } from "./utils.js"
import { dummyData } from "./constants.js"

async function runGetETA(useDummyData=false) {
    setLoaders();

    var data = null

    // Run API to fetch bus ETAs
    const resp = await getETA();
    if (resp.ok) {
        console.log("API call successful");
        data = await resp.json();
        console.log("Data: ", data);
    } else {
        console.log("API call failed: ", resp.status);
    }

    // Load ETAs in HTML
    if (data != null) {
        const terminalIdOrder = ["terminal-1", "terminal-3", "terminal-4"]
        
        if (useDummyData) {
            var data = dummyData;
            console.log("Dummy data: ", data);
        }

        // Loop through each terminal
        for (let i=0; i < data.busETA.length; i++) {
            const terminalId = terminalIdOrder[i];
            const etaData = data.busETA[i].etaData;
            if (etaData.length == 0) {
                document.getElementById(terminalId).innerHTML = `
                        Sorry, no buses are arriving
                    `
            } else {
                // Display each bus ETA
                document.getElementById(terminalId).innerHTML = ""
                for (let j=0; j < etaData.length; j++) {
                    document.getElementById(terminalId).innerHTML += `
                            <div class="row justify-content-center text-lg my-1">
                                <span class="mx-2 badge badge-secondary py-2">
                                ${etaData[j].busLicensePlate}</span>
                                <span class="mx-2">${etaData[j].etaMinutes} min </span>
                            </div>
                        `
                }
            }
        }

        // Set timestamp
        const timestamp = getLocalTime();
        document.getElementById("last-update-ts").innerText = "Last updated " + timestamp;
    }
}

export { runGetETA };