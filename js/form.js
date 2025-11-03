// ✅ Initialize Supabase
const SUPABASE_URL = "https://doajrlvjxmnkgrwrjefw.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvYWpybHZqeG1ua2dyd3JqZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODQxNzksImV4cCI6MjA3Nzc2MDE3OX0.SvS5PQ_s2wQn1lNfl7MowGzVI79xrb_PTkubQrq9Eag";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Get form elements
const form = document.getElementById("loginModule1");
const submitBtn = form.querySelector(".submit-btn");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const countryCodeSelect = document.getElementById("countryCode");
const ageInput = document.getElementById("age");
const nationalityInput = document.getElementById("nationality");

// Optional validation messages
const phoneValidMsg = document.getElementById("phoneValidMsg");
const phoneErrorMsg = document.getElementById("phoneErrorMsg");

// ✅ Form submit handler
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = fullNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const countryCode = countryCodeSelect.value;
    const age = ageInput.value.trim();
    const nationality = nationalityInput.value.trim();

    if (!fullName || !email || !phone || !age || !nationality) {
        alert("Please fill in all required fields.");
        return;
    }

    const phoneNumber = `${countryCode}${phone}`;

    // ✅ Start loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="loader"></span> Submitting...`;

    try {
        // ✅ Check if email or phone already exists
        const { data: existing, error: existingError } = await supabase
            .from("applications")
            .select("*")
            .or(`email.eq.${email},phone.eq.${phoneNumber}`);

        if (existingError) throw existingError;

        if (existing && existing.length > 0) {
            if (phoneErrorMsg) phoneErrorMsg.style.display = "block";
            alert("This email or phone number has already been used.");
            return;
        }

        // ✅ Insert data into Supabase
        const { error } = await supabase.from("applications").insert([
            {
                full_name: fullName,
                email: email,
                phone: phoneNumber,
                age: parseInt(age),
                nationality: nationality,
            },
        ]);

        if (error) throw error;

        // ✅ Success
        alert("🎉 Application submitted successfully!");
        form.reset();
        if (phoneValidMsg) phoneValidMsg.style.display = "none";
        if (phoneErrorMsg) phoneErrorMsg.style.display = "none";
    } catch (error) {
        console.error(error);
        alert("Submission failed. Please try again.");
    } finally {
        // ✅ Stop loading state
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Submit Application";
    }
});
