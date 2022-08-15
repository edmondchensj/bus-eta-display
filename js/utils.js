var setInnerHTMLWithJS = function(div_id, html) {
    // Replaces div_id element inner HTML and run any script tags 
    const elm = document.getElementById(div_id);
    elm.innerHTML = html;
    Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes)
        .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }

const goToPage = async function (routeKey) {
  // Replaces "main" div with selected page
  const routes = {"success": "/pages/success.html"}
  const html = await fetch(routes[routeKey]).then((data) => data.text());

  setInnerHTMLWithJS("main", html);
}

function getCurrentISOTime() {
  // Return ISO-8601 time format (required for AWS Location batch update)
  const date = new Date();
  const timestamp = date.toISOString()
  return timestamp
}

function getLocalTime() {
  const date = new Date();
  const timestamp = date.toLocaleString();
  return timestamp
}

async function setScreenWakeLock() {
  // Checks whether browser has wake-lock function and triggers wakelock if available
  // Wake-lock alert messages are commented out as iOS devices do not support wake-lock

  const wakeLockDiv = document.getElementById("wake-lock-alert");
  var isSupported = false;

  // Check browser compatibility 
  if ('wakeLock' in navigator) {
    console.log("Wake lock supported");
    isSupported = true;
  } else {
    console.log("Wake lock not supported");
    // wakeLockDiv.innerHTML = `
    //   <div class="alert alert-danger text-center">This browser does not support Wake-lock and may result in the app going to sleep. <br>Please use a different browser (Recommended: Chrome).</div>
    // `;
  }
  
  if (isSupported) {
    // Enable wake-lock
    let wakeLock = null;

    // Request a wake lock
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock enabled!');
    } catch (err) {
      // The Wake Lock request has failed - usually system related, such as battery.
      console.log("Error occurred while enabling wake-lock: ", err)
      // wakeLockDiv.innerHTML = `
      //   <div class="alert alert-danger text-center">An error occurred when enabling wake-lock. Please make sure the device is charging. </div>
      // `;
    }

    // Create listener to re-activate wake-lock if visibility of page changed (inactive to active) and wake-lock was released for some reason
    document.addEventListener('visibilitychange', async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        console.log("Re-activating wakelock");
        wakeLock = await navigator.wakeLock.request('screen');
      }
    });
  }
}

function setLoaders() {
  // Set a loading spinner while API fetches data
  const loader = `
    <div class="row px-2 justify-content-center mt-2">
      <div class="spinner-border mt-2 text-black-50" role="status">
          <span class="sr-only">Loading...</span>
      </div>
    </div>
  `
  document.getElementById("terminal-1").innerHTML = loader;
  document.getElementById("terminal-3").innerHTML = loader;
  document.getElementById("terminal-4").innerHTML = loader;
}

export { goToPage, getCurrentISOTime, setScreenWakeLock, setLoaders, getLocalTime };