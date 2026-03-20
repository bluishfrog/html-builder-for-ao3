// js/test_accounts.js
const testAccounts = [
    {
        id: "acc1",
        name: "Alice Johnson",
        handle: "@alice",
        icon: "https://i.pravatar.cc/100?img=5"
    },
    {
        id: "acc2",
        name: "Bob Smith",
        handle: "@bob",
        icon: "https://i.pravatar.cc/100?img=6"
    },
    {
        id: "acc3",
        name: "Charlie",
        handle: "@charlie",
        icon: "https://i.pravatar.cc/100?img=7"
    }
];

// Populate the dropdown on page load
function populateAccountDropdown() {
    const select = document.getElementById("accountSelect");
    testAccounts.forEach(acc => {
        const option = document.createElement("option");
        option.value = acc.id;
        option.textContent = `${acc.name} (${acc.handle})`;
        select.appendChild(option);
    });
}

// Get account by ID
function getAccountById(id) {
    return testAccounts.find(acc => acc.id === id);
}

// Initialize dropdown when DOM loads
document.addEventListener("DOMContentLoaded", populateAccountDropdown);