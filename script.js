/* =====================================
   SORTING COMPARISON PROJECT
   Bubble Sort and Merge Sort
===================================== */

// Get HTML elements
const arrayInput = document.getElementById("arrayInput");
const setArrayBtn = document.getElementById("setArray");
const randomBtn = document.getElementById("randomArray");
const startBtn = document.getElementById("startSort");

const barsContainer = document.getElementById("bars");

let originalArray = [45, 12, 78, 23, 56, 9, 34, 67, 18, 89];


// =====================================
// 1. DISPLAY ARRAY AS VISUAL BARS
// =====================================

function displayBars(arr) {
    barsContainer.innerHTML = "";

    if (arr.length === 0) {
        barsContainer.textContent = "No numbers to display.";
        return;
    }

    // Display at most 100 bars for readability
    const visibleArray = arr.slice(0, 100);
    const maxValue = Math.max(...visibleArray);

    visibleArray.forEach((value) => {
        const bar = document.createElement("div");
        bar.className = "bar";

        const height = maxValue > 0
            ? Math.max((value / maxValue) * 180, 5)
            : 5;

        bar.style.height = height + "px";

        const label = document.createElement("span");
        label.textContent = value;

        bar.appendChild(label);
        barsContainer.appendChild(bar);
    });

    if (arr.length > 100) {
        const note = document.createElement("p");
        note.textContent = "Showing first 100 of " + arr.length + " values.";
        barsContainer.appendChild(note);
    }
}


// =====================================
// 2. BUBBLE SORT
// =====================================

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

        if (!swapped) {
            break;
        }
    }

    return arr;
}


// =====================================
// 3. MERGE FUNCTION
// =====================================

function merge(left, right) {

    let result = [];

    let i = 0;
    let j = 0;

    while (i < left.length && j < right.length) {

        if (left[i] <= right[j]) {

            result.push(left[i]);
            i++;

        } else {

            result.push(right[j]);
            j++;
        }
    }

    result.push(...left.slice(i));
    result.push(...right.slice(j));

    return result;
}


// =====================================
// 4. MERGE SORT
// =====================================

function mergeSort(arr) {

    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);

    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}


// =====================================
// 5. SET MANUAL INPUT
// =====================================

setArrayBtn.addEventListener("click", function () {

    const input = arrayInput.value.trim();

    if (input === "") {
        alert("Please enter some numbers.");
        return;
    }

    const values = input.split(/[,\s]+/).map(Number);

    if (
        values.some(value => !Number.isSafeInteger(value)) ||
        values.length > 5000
    ) {
        alert("Enter valid whole numbers (maximum 5000 values).");
        return;
    }

    originalArray = values;

    displayBars(originalArray);

    resetResults();
});


// =====================================
// 6. GENERATE RANDOM NUMBERS
// =====================================

randomBtn.addEventListener("click", function () {

    const size = 30;

    originalArray = [];

    for (let i = 0; i < size; i++) {

        const randomNumber =
            Math.floor(Math.random() * 100) + 1;

        originalArray.push(randomNumber);
    }

    arrayInput.value = originalArray.join(", ");

    displayBars(originalArray);

    resetResults();
});


// =====================================
// 7. RESET PREVIOUS RESULTS
// =====================================

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


// =====================================
// 8. COMPARE BOTH SORTING ALGORITHMS
// =====================================

startBtn.addEventListener("click", function () {

    startBtn.disabled = true;
    startBtn.textContent = "Sorting...";

    try {

        // Create two identical copies
        const bubbleData = originalArray.slice();
        const mergeData = originalArray.slice();

        // Measure Bubble Sort execution time
        const bubbleStart = performance.now();

        const bubbleResult = bubbleSort(bubbleData);

        const bubbleEnd = performance.now();

        const bubbleTime = bubbleEnd - bubbleStart;


        // Measure Merge Sort execution time
        const mergeStart = performance.now();

        const mergeResult = mergeSort(mergeData);

        const mergeEnd = performance.now();

        const mergeTime = mergeEnd - mergeStart;


        // Display execution times
        document.getElementById("bubbleTime").textContent =
            "Execution time: " + bubbleTime.toFixed(6) + " ms";

        document.getElementById("mergeTime").textContent =
            "Execution time: " + mergeTime.toFixed(6) + " ms";


        // Display sorted outputs
        document.getElementById("bubbleOutput").textContent =
            "Sorted output: " + JSON.stringify(bubbleResult);

        document.getElementById("mergeOutput").textContent =
            "Sorted output: " + JSON.stringify(mergeResult);


        // Verify both results
        const isEqual =
            JSON.stringify(bubbleResult) ===
            JSON.stringify(mergeResult);

        const verification =
            document.getElementById("verification");

        if (isEqual) {

            verification.textContent =
                "Verification: SUCCESS! Both algorithms produced identical sorted outputs.";

        } else {

            verification.textContent =
                "Verification: ERROR! Outputs do not match.";
        }


        // Display sorted bars
        displayBars(mergeResult);

    } catch (error) {

        alert("An error occurred: " + error.message);

    } finally {

        startBtn.disabled = false;
        startBtn.textContent = "Compare Sorting";
    }
});


// =====================================
// 9. INITIAL WEBSITE DISPLAY
// =====================================

displayBars(originalArray);

arrayInput.value = originalArray.join(", ");
