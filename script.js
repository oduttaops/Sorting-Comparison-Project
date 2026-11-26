/* ==========================================
   SORTLAB - DUAL SORTING VISUALIZER
   Bubble Sort and Merge Sort
========================================== */

// ==========================================
// 1. HTML ELEMENTS
// ==========================================

const arrayInput = document.getElementById("arrayInput");
const setArrayBtn = document.getElementById("setArray");
const randomBtn = document.getElementById("randomArray");
const compareBtn = document.getElementById("compareAlgorithms");

let originalArray = [45, 12, 78, 23, 56, 9, 34, 67, 18, 89];

const MAX_ANIMATION_SIZE = 40;
const ANIMATION_SPEED = 350;


// ==========================================
// 2. ANIMATION CONTROLLERS
// ==========================================

function createController(prefix) {
    return {
        prefix: prefix,
        token: 0,
        running: false,
        paused: false,
        frames: [],
        step: 0
    };
}

const bubbleController = createController("bubble");
const mergeController = createController("merge");


// ==========================================
// 3. DISPLAY BARS
// ==========================================

function displayBars(containerId, arr, active = [], sorted = []) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    if (arr.length === 0) return;

    const maxValue = Math.max(1, ...arr.map(v => Math.abs(v)));

    arr.forEach((value, index) => {

        const bar = document.createElement("div");

        bar.className = "bar";

        if (active.includes(index)) {
            bar.classList.add("comparing");
        }

        if (sorted.includes(index)) {
            bar.classList.add("sorted");
        }

        const height = Math.max(
            (Math.abs(value) / maxValue) * 180,
            8
        );

        bar.style.height = height + "px";

        const label = document.createElement("span");
        label.textContent = value;

        bar.appendChild(label);

        container.appendChild(bar);
    });
}


// ==========================================
// 4. STATUS AND STEP DISPLAY
// ==========================================

function updateStatus(prefix, message, step) {

    document.getElementById(prefix + "Status").textContent = message;

    document.getElementById(prefix + "Step").textContent =
        "Step: " + step;
}


// ==========================================
// 5. GENERATE BUBBLE SORT FRAMES
// ==========================================

function generateBubbleFrames(input) {

    const arr = input.slice();
    const frames = [];

    frames.push({
        array: arr.slice(),
        active: [],
        sorted: [],
        message: "Starting Bubble Sort"
    });

    const n = arr.length;
    const sorted = [];

    for (let i = 0; i < n - 1; i++) {

        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {

            frames.push({
                array: arr.slice(),
                active: [j, j + 1],
                sorted: sorted.slice(),
                message: "Comparing " + arr[j] + " and " + arr[j + 1]
            });

            if (arr[j] > arr[j + 1]) {

                [arr[j], arr[j + 1]] =
                [arr[j + 1], arr[j]];

                swapped = true;

                frames.push({
                    array: arr.slice(),
                    active: [j, j + 1],
                    sorted: sorted.slice(),
                    message: "Swapping elements"
                });
            }
        }

        sorted.push(n - i - 1);

        if (!swapped) break;
    }

    for (let i = 0; i < n; i++) {
        if (!sorted.includes(i)) sorted.push(i);
    }

    frames.push({
        array: arr.slice(),
        active: [],
        sorted: sorted,
        message: "Bubble Sort completed!"
    });

    return frames;
}


// ==========================================
// 6. GENERATE MERGE SORT FRAMES
// ==========================================

function generateMergeFrames(input) {

    const arr = input.slice();
    const frames = [];

    frames.push({
        array: arr.slice(),
        active: [],
        sorted: [],
        message: "Starting Merge Sort"
    });

    function divide(left, right) {

        if (left >= right) return;

        const mid = Math.floor((left + right) / 2);

        frames.push({
            array: arr.slice(),
            active: Array.from(
                { length: right - left + 1 },
                (_, i) => left + i
            ),
            sorted: [],
            message: "Dividing array into smaller parts"
        });

        divide(left, mid);
        divide(mid + 1, right);

        merge(left, mid, right);
    }

    function merge(left, mid, right) {

        const leftPart = arr.slice(left, mid + 1);
        const rightPart = arr.slice(mid + 1, right + 1);

        let i = 0;
        let j = 0;
        let k = left;

        while (i < leftPart.length && j < rightPart.length) {

            frames.push({
                array: arr.slice(),
                active: [left + i, mid + 1 + j],
                sorted: [],
                message: "Comparing elements before merging"
            });

            if (leftPart[i] <= rightPart[j]) {
                arr[k] = leftPart[i];
                i++;
            } else {
                arr[k] = rightPart[j];
                j++;
            }

            frames.push({
                array: arr.slice(),
                active: [k],
                sorted: [],
                message: "Merging elements"
            });

            k++;
        }

        while (i < leftPart.length) {

            arr[k] = leftPart[i];
            i++;

            frames.push({
                array: arr.slice(),
                active: [k],
                sorted: [],
                message: "Merging remaining left elements"
            });

            k++;
        }

        while (j < rightPart.length) {

            arr[k] = rightPart[j];
            j++;

            frames.push({
                array: arr.slice(),
                active: [k],
                sorted: [],
                message: "Merging remaining right elements"
            });

            k++;
        }
    }

    if (arr.length > 0) {
        divide(0, arr.length - 1);
    }

    frames.push({
        array: arr.slice(),
        active: [],
        sorted: arr.map((_, index) => index),
        message: "Merge Sort completed!"
    });

    return frames;
}


// ==========================================
// 7. DISPLAY A SINGLE FRAME
// ==========================================

function showFrame(controller, frame) {

    const prefix = controller.prefix;

    const containerId =
        prefix === "bubble" ? "bubbleBars" : "mergeBars";

    displayBars(
        containerId,
        frame.array,
        frame.active,
        frame.sorted
    );

    controller.step++;

    updateStatus(
        prefix,
        frame.message,
        controller.step
    );
}


// ==========================================
// 8. RUN ANIMATION
// ==========================================

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runAnimation(controller) {

    const currentToken = controller.token;

    controller.running = true;

    const prefix = controller.prefix;

    for (let i = 0; i < controller.frames.length; i++) {

        if (currentToken !== controller.token) return;

        while (controller.paused) {

            await sleep(80);

            if (currentToken !== controller.token) return;
        }

        showFrame(controller, controller.frames[i]);

        await sleep(ANIMATION_SPEED);
    }

    if (currentToken === controller.token) {

        controller.running = false;
        controller.paused = false;

        updateStatus(
            prefix,
            "Sorting completed successfully!",
            controller.step
        );
    }
}


// ==========================================
// 9. RESET VISUALIZER
// ==========================================

function resetVisualizer(controller) {

    controller.token++;

    controller.running = false;
    controller.paused = false;
    controller.step = 0;

    const prefix = controller.prefix;

    const containerId =
        prefix === "bubble" ? "bubbleBars" : "mergeBars";

    displayBars(containerId, originalArray);

    updateStatus(
        prefix,
        "Ready to start " +
        (prefix === "bubble" ? "Bubble Sort" : "Merge Sort"),
        0
    );
}


// ==========================================
// 10. START SORTING
// ==========================================

function startSorting(controller, algorithm) {

    if (controller.running) return;

    if (originalArray.length > MAX_ANIMATION_SIZE) {

        alert(
            "For animation, please use a maximum of " +
            MAX_ANIMATION_SIZE + " numbers."
        );

        return;
    }

    controller.token++;
    controller.paused = false;
    controller.step = 0;

    controller.frames =
        algorithm === "bubble"
            ? generateBubbleFrames(originalArray)
            : generateMergeFrames(originalArray);

    runAnimation(controller);
}


// ==========================================
// 11. PAUSE AND RESUME
// ==========================================

function pauseSorting(controller) {

    if (controller.running) {
        controller.paused = true;

        updateStatus(
            controller.prefix,
            "Animation paused",
            controller.step
        );
    }
}

function resumeSorting(controller) {

    if (controller.running && controller.paused) {
        controller.paused = false;
    }
}


// ==========================================
// 12. BUBBLE SORT BUTTONS
// ==========================================

document.getElementById("bubbleStart").addEventListener(
    "click",
    () => startSorting(bubbleController, "bubble")
);

document.getElementById("bubblePause").addEventListener(
    "click",
    () => pauseSorting(bubbleController)
);

document.getElementById("bubbleResume").addEventListener(
    "click",
    () => resumeSorting(bubbleController)
);

document.getElementById("bubbleReset").addEventListener(
    "click",
    () => resetVisualizer(bubbleController)
);


// ==========================================
// 13. MERGE SORT BUTTONS
// ==========================================

document.getElementById("mergeStart").addEventListener(
    "click",
    () => startSorting(mergeController, "merge")
);

document.getElementById("mergePause").addEventListener(
    "click",
    () => pauseSorting(mergeController)
);

document.getElementById("mergeResume").addEventListener(
    "click",
    () => resumeSorting(mergeController)
);

document.getElementById("mergeReset").addEventListener(
    "click",
    () => resetVisualizer(mergeController)
);


// ==========================================
// 14. SET MANUAL NUMBERS
// ==========================================

setArrayBtn.addEventListener("click", function () {

    const input = arrayInput.value.trim();

    if (!input) {
        alert("Please enter some numbers.");
        return;
    }

    const values = input.split(/[,\s]+/).map(Number);

    if (
        values.length > 5000 ||
        values.some(v => !Number.isSafeInteger(v))
    ) {
        alert("Enter valid whole numbers (maximum 5000).");
        return;
    }

    originalArray = values;

    resetVisualizer(bubbleController);
    resetVisualizer(mergeController);

    resetResults();
});


// ==========================================
// 15. GENERATE RANDOM ARRAY
// ==========================================

randomBtn.addEventListener("click", function () {

    originalArray = [];

    for (let i = 0; i < 20; i++) {

        originalArray.push(
            Math.floor(Math.random() * 100) + 1
        );
    }

    arrayInput.value = originalArray.join(", ");

    resetVisualizer(bubbleController);
    resetVisualizer(mergeController);

    resetResults();
});


// ==========================================
// 16. PERFORMANCE COMPARISON
// ==========================================

function bubbleSort(arr) {

    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {

        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {

            if (arr[j] > arr[j + 1]) {

                [arr[j], arr[j + 1]] =
                [arr[j + 1], arr[j]];

                swapped = true;
            }
        }

        if (!swapped) break;
    }

    return arr;
}


function mergeSort(arr) {

    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);

    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    const result = [];

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {

        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i), right.slice(j));
}


// ==========================================
// 17. COMPARE BOTH ALGORITHMS
// ==========================================

compareBtn.addEventListener("click", function () {

    if (originalArray.length > 2000) {

        alert("For comparison, please use up to 2000 numbers.");
        return;
    }

    const bubbleData = originalArray.slice();
    const mergeData = originalArray.slice();

    const bubbleStart = performance.now();
    const bubbleResult = bubbleSort(bubbleData);
    const bubbleEnd = performance.now();

    const mergeStart = performance.now();
    const mergeResult = mergeSort(mergeData);
    const mergeEnd = performance.now();

    const bubbleTime = bubbleEnd - bubbleStart;
    const mergeTime = mergeEnd - mergeStart;

    document.getElementById("bubbleTime").textContent =
        "Execution time: " + bubbleTime.toFixed(6) + " ms";

    document.getElementById("mergeTime").textContent =
        "Execution time: " + mergeTime.toFixed(6) + " ms";

    document.getElementById("bubbleOutput").textContent =
        "Sorted output: " + JSON.stringify(bubbleResult);

    document.getElementById("mergeOutput").textContent =
        "Sorted output: " + JSON.stringify(mergeResult);

    const success =
        JSON.stringify(bubbleResult) ===
        JSON.stringify(mergeResult);

    document.getElementById("verification").textContent =
        success
            ? "Verification: SUCCESS! Both algorithms produced identical sorted outputs."
            : "Verification: ERROR! Outputs do not match.";
});


// ==========================================
// 18. RESET RESULTS
// ==========================================

function resetResults() {

    document.getElementById("bubbleTime").textContent =
        "Execution time: --";

    document.getElementById("mergeTime").textContent =
        "Execution time: --";

    document.getElementById("bubbleOutput").textContent =
        "Sorted output: --";

    document.getElementById("mergeOutput").textContent =
        "Sorted output: --";

    document.getElementById("verification").textContent =
        "Verification: Waiting for comparison";
}


// ==========================================
// 19. INITIAL WEBSITE DISPLAY
// ==========================================

arrayInput.value = originalArray.join(", ");

resetVisualizer(bubbleController);
resetVisualizer(mergeController);
